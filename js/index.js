$ = require('jquery');
React = require('react');
_ = require('underscore');
Backbone = require('backbone');
$script = require('scriptjs');

Backbone.$ = $;
// require('backbone-query-parameters');
require('react-backbone');


var Router = require('./router');
var init = require('./init');

global.$ = require('jquery');

// initialize when the document is ready
$(document).ready(function() {
  init();
  new Router();
  Backbone.history.start({});
});

window.loadTimestamp = new Date().getTime();
