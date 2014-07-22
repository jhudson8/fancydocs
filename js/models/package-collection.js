var Package = require('./package');

module.exports = Backbone.Collection.extend({
  model: Package,
  comparator: 'name',

  viewUrl: function() {
    return this.parent.viewUrl() + '/api/' + encodeURIComponent(this.name);
  }
});
