const exporess = require('express')
const router = exporess.Router()
const bodyParser = require('body-parser')
const cors = require('./cors')
const {mongoStore, getAllSession, getSessionBySid, setSession} = require('../mongoStore.js')

router.use(bodyParser.json())

router.route('/loginStatus')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.corsWithOptions, (req, res, next) => {
    res.send('get')
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    let {sessionId: sid} = req.body
    if (!sid) {
      return res.status(500).json({
        result: false,
        message: 'sid is invalid',
        error: new Error('sid is invalid')
      })
    }
    getSessionBySid(sid).then(response => {
      // console.log(response)
      // let status = response.bindResponse.status || false
      // let status = response.bindResponse.status ? response.bindResponse.status : false
      // let status = response.bindResponse.status === undefined ? false : response.bindResponse.status
      let status = null
      if (response.bindResponse) {
        status = response.bindResponse.status
      }
      // console.log('status', status)
      if (status == 200) {
        res.status(200).json({
          result: true,
          message: '已登录',
          data: ''
        })
      } else {
        res.status(200).json({
          result: false,
          message: '未登录',
          data: ''
        })
      }
    })
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    res.send('put')
  })
  .delete(cors.corsWithOptions, (req, res, next) => {
    res.send('delete')
  })

module.exports = router