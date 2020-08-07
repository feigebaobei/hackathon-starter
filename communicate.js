const tokenSDKServer = require('token-sdk-server')

let openfn = () => {
  console.log('openfn')
}
let messagefn = () => {
  console.log('messagefn')
}
let errorfn = () => {
  console.log('errorfn')
}
let closefn = () => {
  console.log('closefn 12345')
}

// tokenSDKServer.init({open: openfn, message: messagefn, error: errorfn, close: closefn})
tokenSDKServer.init({openfn: openfn, closefn: closefn})