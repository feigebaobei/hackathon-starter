const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('./config/index.js')

let mongoStore = new MongoStore({
  // url: process.env.MONGODB_URI,
  // url: 'mongodb://localhost:27017/test',
  url: config.MONGODB_URI,
  autoReconnect: true
})

let getAllSession = () => {
  return new Promise((resolve, reject) => {
    mongoStore.all((err, resObj) => err ? reject(err) : resolve(resObj))
  })
}
let getSessionBySid = (sid) => {
  return new Promise((rs, rj) => {
    mongoStore.get(sid, (err, resObj) => err ? rj(err) : rs(resObj))
  })
}

// store.set(sid, session, cb)    // 更新session
let setSession = (sid, session) => {
  return new Promise((rs, rj) => {
    mongoStore.set(sid, session, (err, resObj) => err ? rj(err) : rs(resObj))
  })
}

module.exports = {
  mongoStore: mongoStore,
  getAllSession,
  getSessionBySid,
  setSession
}