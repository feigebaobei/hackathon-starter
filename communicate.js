const {mongoStore, getAllSession, getSessionBySid, setSession} = require('./mongoStore.js')
const tokenSDKServer = require('token-sdk-server')
const User = require('./models/User')
// const wsc = require('ws')
// console.log(User)

// 创建消息
let createMessage = (content = '', receiver = [], method = '', messageId = '', createTime = new Date().getTime()) => {
  return JSON.stringify({
    method: method,
    content: content,
    messageId: messageId,
    createTime: createTime,
    receiver: receiver
  })
}

/**
 * 更新session
 * @param  {string} sid sessionId
 * @return {[type]}     [description]
 */
let updateSession = (sid, msgContent) => {
  // 设置session里的userInfo
  getSessionBySid(sid).then(os => {
    if (os) {
      os.bindResponse = msgContent
      setSession(sid, os)
      // console.log(os)
    }
  })
}

var opMsg = (msgObj) => {
  // console.log('msgObj', msgObj)
  let isok = tokenSDKServer.verify({sign: msgObj.content.sign})
  switch(msgObj.method) {
    case 'bind':
      // 验签
      let msgContent = msgObj.content
      let sid = msgContent.sessionId || ''
      if (isok) {
        // console.log('签名正确')
        // 数据库里若不存在该用户，则在数据库里保存该用户信息。
        User.findOne({token: msgObj.sender}).exec().then(user => {
          // console.log('user', user)
          if (user) {
            // 更新用户信息
            user = new User({
              token: msgObj.sender,
              profile: msgObj.content.userInfo
            })
            user.tokens.push({kind: 'token'})
            User.findOneAndUpdate({_id: user._id}, user, {upsert: false, returnNewDocument: true}).exec().then((response) => {
              updateSession(sid, msgContent)
            })
            // .catch(error => {
            //   console.log(error)
            // })
          } else {
            // 新建用户信息
            let ui = msgObj.content.userInfo
            user = new User({token: msgObj.sender, profile: ui})
            user.tokens.push({kind: 'token'})
            user.save(user).then(response => {
              // console.log('response save', response)
              updateSession(sid, msgContent)
            })
          }
        }).catch(error => {
          console.log('error', error)
        })
      } else {
        getSessionBySid(sid).then(os => {
          if (os) {
            os.bindResponse.status = 400
            setSession(sid, os)
          }
        })
      }
      break
    case 'auth':
    default:
      break
  }
}

let openfn = () => {
  console.log('openfn')

}
let messagefn = (msgObj) => {
  // console.log('messagefn', msg, JSON.parse(msg))
  // console.log('messagefn', JSON.parse(msg))
  // console.log('messagefn', msg)
  opMsg(msgObj)
  // getAllSession().then(response => {
  //   console.log(response)
  // })
  // (msg)
  // let sid = '8RGO011ar3TUsKlbL2vPatVaqRBFUirD'
  // getSessionBySid(sid).then(response => {
  //   console.log('getSessionBySid', response)
  // })
}
let errorfn = () => {
  console.log('errorfn')
}
let closefn = () => {
  console.log('closefn 12345')
}

// console.log(tokenSDKServer.init)
// let wsc = tokenSDKServer.init({openfn: openfn, messagefn: messagefn, errorfn: errorfn, closefn: closefn})
// console.log('wsc', wsc)
// wsc.send(tokenSDKServer.createMessage('12345', [], 'test'))

// let wsc = tokenSDKServer.init({openfn: openfn, messagefn: messagefn, errorfn: errorfn, closefn: closefn})
// console.log('wsc', wsc)

// tokenSDKServer.init({openfn: openfn, messagefn: messagefn, errorfn: errorfn, closefn: closefn, isProd: true})
// tokenSDKServer.init({messagefn: messagefn, errorfn: errorfn, closefn: closefn})

// tokenSDKServer.init({openfn: openfn, messagefn: messagefn, errorfn: errorfn, closefn: closefn}) // 正确用法

let bindfn = (msgObj) => {
  // console.log(msgObj)
  let isok = tokenSDKServer.verify({sign: msgObj.content.sign})
  // 验签
  let msgContent = msgObj.content
  // let sid = msgContent.sessionId || ''
  let sid = msgContent.sessionId
  if (isok) {
    // console.log('签名正确')
    // 数据库里若不存在该用户，则在数据库里保存该用户信息。
    User.findOne({token: msgObj.sender}).exec().then(user => {
      // console.log('user', user)
      if (user) {
        // 更新用户信息
        user = new User({
          token: msgObj.sender,
          profile: msgObj.content.userInfo
        })
        user.tokens.push({kind: 'token'})
        User.findOneAndUpdate({_id: user._id}, user, {upsert: false, returnNewDocument: true}).exec().then((response) => {
          updateSession(sid, msgContent)
        })
        // .catch(error => {
        //   console.log(error)
        // })
      } else {
        // 新建用户信息
        let ui = msgObj.content.userInfo
        user = new User({token: msgObj.sender, profile: ui})
        user.tokens.push({kind: 'token'})
        user.save(user).then(response => {
          // console.log('response save', response)
          updateSession(sid, msgContent)
        })
      }
    }).catch(error => {
      // console.log('error', error)
    })
  } else {
    getSessionBySid(sid).then(os => {
      if (os) {
        os.bindResponse.status = 400
        setSession(sid, os)
      }
    })
  }
}
// tokenSDKServer.init({authfn: authfn, bindfn: bindfn})
// tokenSDKServer.init({bindfn: bindfn, isDev: true})
tokenSDKServer.init({bindfn: bindfn})



