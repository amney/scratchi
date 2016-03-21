var Scratchi = require('./ext.js');

(function (e){

  // Check for GET param 'lang'
  // Originally from https://github.com/khanning/scratch-arduino-extension/blob/da1ab317a215a8c1c5cda1b9db756b9edc14ba68/arduino_extension.js#L533-L541
  var paramString = window.location.search.replace(/^\?|\/$/g, '');
  var vars = paramString.split("&");
  var lang = 'en';
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[ i ].split('=');
    if(pair.length > 1 && pair[ 0 ] == 'lang')
      lang = pair[ 1 ];
  }

  var ext = new Scratchi()

  // register exention
  ScratchExtensions.register(ext.title, ext.descriptor, ext);
})({});
