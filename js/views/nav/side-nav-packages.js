/** @jsx React.DOM */
var util = require('./nav-util');

module.exports = React.createClass({
  mixins: ['modelAware', 'events'],

  render: function() {
    var project = this.getModel();
    var apis = {};

    project.packages.each(function(pkg) {
      var apiName = pkg.parent.name;
      apis[apiName] = apis[apiName] || [];
      apis[apiName].push(pkg);
    });
    var children = _.map(apis, function(packages, apiName) {
      return {
        label: apiName,
        key: apiName,
        children: packages.map(function(pkg) {
          return {
            key: pkg.id,
            label: pkg.get('name'),
            model: pkg,
            type: 'package',
            icon: util.icons.package
          };
        })
      };
    });
    var startingLevel = 1;
    if (children.length === 1) {
      // the api type is assumed since there is only 1
      children = children[0].children;
      startingLevel = 2;
    }
    return util.projectNavMenu(children, this, this.props.viewState, {snippet: true, allowHilight: true, startingLevel: startingLevel});
  }
});
