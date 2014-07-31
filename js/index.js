var Router = require('./router');
var init = require('./init');

// initialize when the document is ready
$(document).ready(function() {
  init();
  new Router();
  Backbone.history.start();
});




