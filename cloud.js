var AV = require('leanengine');
AV.Cloud.useMasterKey(true)
/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request) {
  return 'Hello world!';
});
