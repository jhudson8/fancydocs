var PackageCollection = require('./package-collection');
var MethodCollection = require('./method-collection');

module.exports = Backbone.Model.extend({
  initialize: function(options) {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this._initCollections();
    this.id = _.uniqueId('p');
  },

  parse: function(data) {
    this._initCollections();

    if (!_.isArray(data.methods)) {
      App.utils.collectify(data.methods, this.methods, this);
    } else {
      this.methods.reset(data.methods);
    }
    delete data.methods;

    return data;
  },

  _initCollections: function() {
    this.methods = this.methods || new MethodCollection();
  },

  viewUrl: function() {
    return (this.project || this.collection.project).viewUrl() + '/package/' + this.id;
  }
});
