module.exports = function() {

  global.App = _.extend({}, Backbone.Events);
  // alow for "app" declarative event bindings
  require('react-events').handle('app', {
    target: global.App
  });

  // set a global timeout for all ajax activity
  Backbone.xhrEvents.on('xhr', function(method, model, context) {
    context.options.timeout = 3000;
  });

  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

  Backbone.Model.prototype.checkEquality = function(a, b) {
    function getValue(obj, key) {
      var parts = key.split('.'), parent = obj;
      while (parent && parts.length > 1) {
        parent = parent[parts[0]];
        parts.splice(0, 1);
      }
      return parent && parent.get(parts[0]);
    }
    var attr = Array.prototype.slice.call(arguments, 2), aVal, bVal;
    if (attr.length === 0) {
      return false;
    }
    for (var i=0; i<attr.length; i++) {
      aVal = getValue(a, attr[i]);
      bVal = getValue(b, attr[i]);
      if (aVal !== bVal) return false;
    }
    return true;
  };
};

var SPECIAL_KEYS = {
  40: 'down',
  38: 'up',
  37: 'left',
  39: 'right',
  13: 'enter'
};
document.onkeydown = function(event) {
  // if it's an input field with a value, disregard
  var val = $(event.target).val();
  if (!val) {
    var value = SPECIAL_KEYS[event.keyCode];
    if (value) {
      App.trigger('special-key', value);
    }
  }
};
