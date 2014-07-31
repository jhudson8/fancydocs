var util = require('../utils/util');

module.exports = Backbone.Model.extend({
  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this._initCollections();
    this.id = _.uniqueId('s');
  },
  viewUrl: function(removeHash) {
    var url = this.parent.viewUrl();
    if (this.parent === this.project) {
      url += '/section';
    }
    url += '/' + encodeURIComponent(this.get('title'));
    return url;
  },
  parse: function(data) {
    this._initCollections();
    util.collectify(data.sections, this.sections, this);
    delete data.sections;
    return data;
  },
  _initCollections: function() {
    var SectionCollection = require('./section-collection');
    this.sections = this.sections || new SectionCollection();
  },

  domId: function(noEscape) {
    var id = '';
    if (this.parent != this.project) {
      id = this.parent.domId(true) + '_';
    }
    id += this.get('title');
    if (!noEscape) {
      id = util.domIdify(id);
    }
    return id;
  }
});
