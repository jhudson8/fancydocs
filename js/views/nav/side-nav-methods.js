/** @jsx React.DOM */
var util = require('./nav-util');

// FIXME use util to DRY up with side-nav-packages
module.exports = React.createClass({
  mixins: ['modelAware', 'events'],

  getInitialState: function() {
    return {};
  },

  render: function() {
    var project = this.getModel();
    var apis = {};

    project.methods.each(function(method) {
      var apiName = method.parent.parent.name;
      apis[apiName] = apis[apiName] || [];
      apis[apiName].push(method);
    });
    var children = util.filteredNavChildren(apis, 'method', 'methods', this);

    var startingLevel = 1;
    if (children.length === 1) {
      // the api type is assumed since there is only 1
      children = children[0].children;
      startingLevel = 2;
    }
    this.state.children = children;

    var menu = util.projectNavMenu(children, this, this.props.viewState, {snippet: true, allowHilight: true, startingLevel: startingLevel});
    var filter = util.filter('method', this);
    return (
      <div>
        <div className="ui nav-search form">
          <div className="field">
            <div className="ui icon input">
              <input type="text" ref="filter" placeholder="Filter..." onChange={filter} onKeyDown={filter}/>
              <i className="fa-filter icon"></i>
            </div>
          </div>
        </div>
        {menu}
      </div>
    );
  },

  componentDidMount: function() {
    $(this.refs.filter.getDOMNode()).focus();
  }
});
