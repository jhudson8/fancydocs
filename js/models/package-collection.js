var Package = require('./package');
var util = require('../utils/util');

module.exports = Backbone.Collection.extend({
  model: Package,
  comparator: 'name',

  viewUrl: function(removeHash) {
    return this.parent.viewUrl(removeHash) + '/api/' + encodeURIComponent(this.name);
  },

  domId: function() {
    return ('api_' + util.domIdify(this.name));
  }
});
