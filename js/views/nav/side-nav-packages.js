/** @jsx React.DOM */
var util = require('./nav-util');

// FIXME use util to DRY up with side-nav-methods
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

    var self = this;
    var children = _.chain(apis)
        .map(function(packages, apiName) {
          var _children = self.mapChildren(packages, function(pkg) {
            return {
              key: pkg.id,
              label: pkg.get('name'),
              model: pkg,
              type: 'package',
              icon: util.icons.package
            };
          });

          return _children && {
            label: apiName,
            key: apiName,
            children: _children
          };
        })
      .compact()
      .value();

    var startingLevel = 1;
    if (children.length === 1) {
      // the api type is assumed since there is only 1
      children = children[0].children;
      startingLevel = 2;
    }
    var menu = util.projectNavMenu(children, this, this.props.viewState, {snippet: true, allowHilight: true, startingLevel: startingLevel});
    return (
      <div>
        <div className="ui nav-search form">
          <div className="field">
            <div className="ui icon input">
              <input type="text" placeholder="Search..." onChange={this.filter} onKeyUp={this.filter}/>
              <i className="fa-search icon"></i>
            </div>
          </div>
        </div>
        {menu}
      </div>
    );
  },

  filter: function(e) {
    var value = $(e.currentTarget).val();
    this.setState({search: value});
  },

  mapChildren: function(children, callback) {
    var self = this;
    var filter = this.state.search;
    filter = filter && filter.toLowerCase();
    children = children.models || children;
    children = children && _.chain(children)
        .map(function(child) {
          var name = child.get && child.get('name');
          name = name && name.toLowerCase() || '';
          if (!filter || name.indexOf(filter) >= 0) {
            return callback.call(self, child);
          }
        })
        .compact()
        .value() || [];
    return children.length > 0 && children;
  }
});
