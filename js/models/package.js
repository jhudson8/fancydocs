var PackageCollection = require('./package-collection');
var MethodCollection = require('./method-collection');
var util = require('../utils/util');

module.exports = Backbone.Model.extend({
  initialize: function(options) {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this._initCollections();
    this.id = _.uniqueId('p');
  },

  parse: function(data) {
    this._initCollections();

    if (!_.isArray(data.methods)) {
      util.collectify(data.methods, this.methods, this);
    } else {
      this.methods.reset(data.methods);
    }
    delete data.methods;

    return data;
  },

  _initCollections: function() {
    this.methods = this.methods || new MethodCollection();
  },

  viewUrl: function(removeHash, removeSnippet) {
    var rtn = (this.project || this.collection.project).viewUrl(true);
    if (!removeSnippet) {
      rtn += '/snippet';
    }
    rtn += ('/package/' + encodeURIComponent(this.get('name')));
    if (!removeHash) {
      rtn = '#' + rtn;
    }
    return rtn;
  },

  isEqual: function(obj) {
    return this.checkEquality(this, obj, 'name', 'project.id');
  },

  domId: function() {
    return util.domIdify(this.get('name'));
  }
});
