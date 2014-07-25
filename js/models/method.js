var util = require('../utils/util');

module.exports = Backbone.Model.extend({
  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.id = _.uniqueId('m');
  },

  parse: function(data) {
    var profiles = data.profiles;
    if (profiles) {
      for (var i=0; i<profiles.length; i++) {
        if (profiles[i] === '()') {
          profiles[i] = '';
        }
      }
    }
    return data;
  },

  viewUrl: function(removeHash, removeSnippet) {
    var rtn = this.project.viewUrl(true, removeSnippet);
    if (!removeSnippet) {
      rtn += '/snippet';
    }
    rtn += ('/method/' + encodeURIComponent(this.parent.get('name')) + '/' + encodeURIComponent(this.get('name')));
    if (!removeHash) {
      rtn = '#' + rtn;
    }
    return rtn;
  },

  isEqual: function(obj) {
    return this.checkEquality(this, obj, 'name', 'parent.name', 'project.id');
  },

  domId: function() {
    return util.domIdify(this.parent.get('name') + '_' + this.get('name'));
  }
});
