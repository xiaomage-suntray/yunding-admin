/* eslint-disable */

var parser = new UAParser()

var uaResult = parser.getResult()

if (uaResult.device.type === 'mobile') {
  console.log(uaResult.device,'uaResult.device>>>??')
  // window.location.href = './is-mobile.html'
}
