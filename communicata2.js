// var express = require('express');
// var utils = require('./lib/utils.js')
// var tokenSDKServer = require('token-sdk-server')
// var config = require('./lib/config')
// const redisClient = require('./redisClient.js')
// const http = require('http')
const WebSocket = require('ws')
// const fs = require('fs')

let {didttm} = require('./tokenSDKData/privateConfig.js')

// let url = 'ws://localhost:9875'
let url = 'ws://http://lixiaodan.org:9875'
let did = didttm.did // eg 'did:ttm:o04d88758f182adbf2e936a4be7b8129ef13fc0f1de9800998ecf8427e54ee'
url += `?did=${did}`
console.log(did)

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

let clientLocal = null

let reConnect = (ws) => {
  if (ws.readyState >= 2) {
    setTimeout(() => {
      clientLocal = null
      clientLocal = initWS(url)
    }, config.webSocket.reConnectGap)
  }
}

let initWS = (url) =>{
  ws = new WebSocket(url)
  ws.on('open', () => {
    console.log('open')
    // ws.send(createMessage('hello', [], 'test'))
  })
  ws.on('message', (msg) => {
    console.log(msg)
    // console.log(utils)
    // console.log(test)
    // console.log(config)
    // utils.opMsg(msg)
  })
  ws.on('error', (e) => {
    console.log(e)
    // reConnect(ws)
    // ws.close()
  })
  ws.on('close', (e) => {
    console.log(e)
    reConnect(ws)
  })
  return ws
}

clientLocal = initWS(url)

module.exports = {
  websocketClient: clientLocal,
  createMessage
}
