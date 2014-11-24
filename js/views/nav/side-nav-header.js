/** @jsx React.DOM */

var util = require('./nav-util');

var data = {
  outline: {
    title: 'Outline',
    icon: 'list alt icon'
  },
  packages: {
    title: 'Packages',
    icon: util.icons.package,
    applies: function(project) {
      return !project.packages.isEmpty();
    }
  },
  methods: {
    title: 'Methods',
    icon: util.icons.method,
    applies: function(project) {
      return !project.methods.isEmpty();
    }
  },
  projects: {
    title: 'Bundled Projects',
    icon: util.icons.project,
    applies: function(project) {
      return !!project.getAllBundledProjects();
    }
  }
};
var defaultFocusOrder = ['outline', 'projects', 'packages', 'methods'];

module.exports = React.createClass({
  mixins: ['modelChangeAware', 'events'],
  events: {
    'app:special-key': 'onSpecialKey'
  },

  getInitialState: function() {
    return {};
  },

  render: function() {
    var self = this;
    var project = this.getModel();
    var viewState = this.props.viewState;
    var focus = viewState.focus;
    var activeData = [];

    var children = _.compact(_.map(data, function(data, key) {
      var active = focus === key;
      var className = active ? 'active green item' : 'item';
      var enabled = !data.applies || data.applies(project);
      if (enabled) {
        activeData.push({key: key, active: active});
        return (
          <a key={key} className={className} onClick={this.triggerWith('focus', key)}>
            <i className={data.icon}></i>
          </a>
        );
      }
    }, this));
    if (children.length > 1) {
      children = (
        <div className="ui pointing menu project-nav-selector">
          {children}
        </div>
      );
    } else {
      children = undefined;
    }

    this.state.active = activeData;

    var focusData = data[focus];
    var title = _.isFunction(focusData.title) ? focusData.title(project) : focusData.title;
    return (
      <div key="header">
        {children}
        <div>
          <h4 className="nav-header">{title}</h4>
        </div>
      </div>
    );
  },

  onSpecialKey: function(key) {
    var modifier;
    if (key === 'left') {
      modifier = -1;
    } else if (key === 'right') {
      modifier = 1;
    }
    if (modifier) {
      var current = -1;
      var activeData = this.state.active;
      for (var i=0; i<activeData.length; i++) {
        if (activeData[i].active) {
          current = i;
          break;
        }
      }
      if (current > -1) {
        current = activeData[current + modifier];
        if (current) {
          this.trigger('focus', current.key);
        }
      }
    }
  }
});

module.exports.defaultFocus = function(project) {
  var _data;
  for (var i=0; i<defaultFocusOrder.length; i++) {
    _data = data[defaultFocusOrder[i]];
    if (!_data.applies || _data.applies(project)) {
      return defaultFocusOrder[i];
    }
  }
}
