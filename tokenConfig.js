const tokenSDKServer = require('token-sdk-server')
// const {receiveMessage} = require('./lib/utils.js')
// const fs = require('fs')
// let {didttm, idpwd} = require('./importConfig.js')
// tokenSDKServer.init(didttm, idpwd, receiveMessage)

const path = './importConfig.js'
tokenSDKServer.config(path)

