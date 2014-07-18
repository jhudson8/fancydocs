module.exports = Backbone.Model.extend({
  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this._initCollections();
    this.id = _.uniqueId('s');
  },
  viewUrl: function() {
    return (this.project || this.collection.project).viewUrl() + '/section/' + this.id;
  },
  parse: function(data) {
    this._initCollections();
    App.utils.collectify(data.sections, this.sections, this);
    delete data.sections;
    return data;
  },
  _initCollections: function() {
    var SectionCollection = require('./section-collection');
    this.sections = this.sections || new SectionCollection();
  },
});