/** @jsx React.DOM */
var util = require('./nav-util');

module.exports = React.createClass({
  mixins: ['modelAware', 'state'],

  render: function() {
    var project = this.getModel(),
        hilight = project.get('hilight');
    var children = project.packages.map(function(pkg) {
      return {label: pkg.get('name'), model: pkg,
        type: 'package', hilight: hilight, icon: util.icons.package};
    }, this);
    return util.menu(undefined, util.reactifyMenuItems(children));
  }
});
