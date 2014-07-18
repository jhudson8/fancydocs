var Package = require('./package');

module.exports = Backbone.Collection.extend({
  model: Package,
  comparator: 'name'
});
