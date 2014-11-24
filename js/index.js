$ = require('jquery');
React = require('react/addons');
_ = require('underscore');
Backbone = require('backbone');
$script = require('scriptjs');

Backbone.$ = $;
require('backbone-query-parameters');

var libs = [
  [require('backbone-xhr-events'), Backbone],
  [require('react-mixin-manager'), React],
  [require('react-events'), React],
  [require('react-backbone'), React, Backbone],
];
_.each(libs, function(data) {
  var lib = data[0];
  if (_.isFunction(lib)) {
    var args = data.slice(1);
    lib.apply(lib, args);
  }
});


var Router = require('./router');
var init = require('./init');

global.$ = require('jquery');
global.$ = require('jquery');

// initialize when the document is ready
$(document).ready(function() {
  init();
  new Router();
  Backbone.history.start();
});




