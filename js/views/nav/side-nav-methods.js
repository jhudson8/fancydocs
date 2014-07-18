/** @jsx React.DOM */
var util = require('./nav-util');

module.exports = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var project = this.getModel(),
        hilight = project.get('hilight');
    var children = project.methods.map(function(method) {
      return {label: method.get('name'), model: method,
        type: 'method', hilight: hilight, icon: util.icons.method};
    }, this);
    return util.menu(undefined, util.reactifyMenuItems(children));
  }
});
