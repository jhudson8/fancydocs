/** @jsx React.DOM */
var util = require('./nav-util');

module.exports = React.createClass({
  mixins: ['modelAware', 'events'],

  render: function() {
    var project = this.getModel();
    var apis = {};

    project.methods.each(function(method) {
      var apiName = method.parent.parent.name;
      apis[apiName] = apis[apiName] || [];
      apis[apiName].push(method);
    });
    var children = _.map(apis, function(methods, apiName) {
      return {
        label: apiName,
        key: apiName,
        children: methods.map(function(method) {
          return {
            key: method.id,
            label: method.get('name'),
            model: method,
            type: 'method',
            icon: util.icons.method
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
