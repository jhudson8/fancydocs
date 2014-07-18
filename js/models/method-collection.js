var Method = require('./method');

module.exports = Backbone.Collection.extend({
  model: Method,
  comparator: 'name'
});
