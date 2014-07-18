module.exports = Backbone.Model.extend({
  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.id = _.uniqueId('m');
  },
  viewUrl: function() {
    return (this.project || this.collection.project).viewUrl() + '/method/' + this.id;
  }
});
