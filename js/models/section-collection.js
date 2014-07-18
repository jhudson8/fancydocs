var Section = require('./section');

module.exports = Backbone.Collection.extend({
  model: Section,
  initialize: function() {
    Backbone.Collection.prototype.initialize.apply(this, arguments);
    this.id = _.uniqueId('s');
  },
  viewUrl: function() {
    return (this.project || this.collection.project).viewUrl() + '/section/' + this.id;
  },
});
