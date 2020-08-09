const {mongoStore, getAllSession, getSessionBySid, setSession} = require('./mongoStore.js')
const tokenSDKServer = require('token-sdk-server')
// const wsc = require('ws')

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

var opMsg = (msg) => {
  let msgObj = JSON.parse(msg)
  // console.log(msgObj)
  // console.log(JSON.parse(msgObj.content))
  switch(msgObj.method) {
    case 'bind':
      let msgContent = JSON.parse(msgObj.content)
      // console.log(msgContent)
      let sid = msgContent.sessionId || ''
      // let session = getSessionBySid(sid)
      // console.log('session', session)
      getSessionBySid(sid).then(os => {
        // console.log(response)
        os.bindResponse = msgContent
        setSession(sid, os)
        // .then(response => { // response 是 undefined
        //   // console.log('setSession', response)
        // })
      })
      .catch(error => {
        // console.log(error)
      })
      break
    case 'auth':
    default:
      break
  }
}

let openfn = () => {
  console.log('openfn')

}
let messagefn = (msg) => {
  // console.log('messagefn', msg, JSON.parse(msg))
  // console.log('messagefn', JSON.parse(msg))
  // console.log('messagefn', msg)
  opMsg(msg)
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

tokenSDKServer.init({openfn: openfn, messagefn: messagefn, errorfn: errorfn, closefn: closefn})
// tokenSDKServer.init({messagefn: messagefn, errorfn: errorfn, closefn: closefn})






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