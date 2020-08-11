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
}
// tokenSDKServer.init({authfn: authfn, bindfn: bindfn})
tokenSDKServer.init({bindfn: bindfn})






// {
//   "_id": "8RGO011ar3TUsKlbL2vPatVaqRBFUirD",
//   "expires": ISODate("2020-08-22T00:22:44.173Z"),
//   "session": {
//     "cookie": {
//       "originalMaxAge": 1209600000, "expires": "2020-08-22T00:22:44.173Z", "httpOnly": true, "path": "/"
//     },
//     "flash": {},
//     "returnTo": "/user/loginStatus",
//     "bindResponse": {
//       "type": "bindResponse",
//       "sessionId": "8RGO011ar3TUsKlbL2vPatVaqRBFUirD",
//       "templateId": "0x34567545abf466dfba45654",
//       "certificateId": "0x34567545abf466dfba45654",
//       "status": "200", // 200 表示正常绑定。403表示拒绝授权出用户信息
//       "userInfo": {
//         "name": "张三",
//         "gender": "男",
//         "nation": "汉"
//       },
//       "sign": "sign(hash($type$sessionId$templateId$certificateId$status$userInfo))"
//     }
//   }
// }

// {
//   "content": {
//     "certificateId": "0x16f0ce919808ccccc61144303b154fa58f12e66fbfb1a2d8b96651c84076dedd",
//     "sessionId": "DBVBHjt4QB9HGN_4B1vn6qavfUHppJKp",
//     "sign": "0x1e6239d23c6c3563194c3aeefa8e15664a77c8d05bd5a4c9b6b5bcf6f62235b62bf2612aef22350b8c53bd39343e74b6b0874adaa64c0793ead016589192ae9e00",
//     "status": 200,
//     "type": "bindResponse",
//     "userInfo": {
//       "name": "李庆雪",
//       "gender": "男"
//      }
//   },
//   "createTime": "1596955098192",
//   "messageId": "9544f1b8-564c-4346-8fb5-e09568e6ac11",
//   "method": "bind",
//   "sender": "did:ttm:u0f5ef1181cb1b1a5ef48239db8abd8351a6d1a5902b84938f26f024cf1147"
// }




// {
//   "type": "bindResponse",
//   "sessionId": "AiA171TbhYcFJFPP6toDN-9solO_HSkT",
//   "status": 200,
//   "userInfo": {
//     "name": "张三",
//     "gender": "男",
//     "nation": "汉"
//   },
//   "sign": "sign(hash($type$sessionId$templateId$certificateId$status$userInfo))"
// }

// {"method":"bind","content":{"type":"bindRequest","title":"","sessionId":"AiA171TbhYcFJFPP6toDN-9solO_HSkT","reqUserLevel":"N","reqUserInfoKeys":["name","gender"]},"sender":"did:ttm:a0e09fb5c4f53eee7f8f4fff4429d072381b1b2c23e9800998ecf8427ebc1e"}