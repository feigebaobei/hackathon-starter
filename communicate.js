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

var opMsg = (msgObj) => {
  // console.log(msgObj)
  let isok = tokenSDKServer.verify({sign: msgObj.content.sign})
  if (isok) {
    switch(msgObj.method) {
      case 'bind':
        let msgContent = msgObj.content
        let sid = msgContent.sessionId || ''
        getSessionBySid(sid).then(os => {
          os.bindResponse = msgContent
          setSession(sid, os)
        })
        // .catch(error => {
        //   // console.log(error)
        // })
        break
      case 'auth':
      default:
        break
    }
  } else {
    console.log('验签失败')
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