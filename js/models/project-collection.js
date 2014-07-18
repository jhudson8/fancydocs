var Project = require('./project');

module.exports = Backbone.Collection.extend({
  model: Project,
  comparator: 'name',

  initialize: function(models, options) {
    _.extend(this, options);
    Backbone.Collection.prototype.initialize.apply(this, arguments);
  }
});
