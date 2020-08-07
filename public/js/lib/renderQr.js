// console.log(QRCode)
let canvasDom = document.getElementById('canvas')
// console.log(canvasDom)
let qrstr = canvasDom.getAttribute('data-qrstr')
// console.log(qrstr)
// QRCode.toCanvas(document.getElementById('canvas'), 'sample text', function (error) {
QRCode.toCanvas(canvasDom, qrstr, function (error) {
  if (error) console.error(error)
  console.log('success!');
})