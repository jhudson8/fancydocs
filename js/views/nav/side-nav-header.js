/** @jsx React.DOM */

var util = require('./nav-util');

var data = {
  outline: {
    title: 'Outline',
    icon: 'list alt icon',
    applies: function(project) {
      return !project.bundledProjects;
    }
  },
  packages: {
    title: 'Packages',
    icon: util.icons.package,
    applies: function(project) {
      return !_.isEmpty(project.api);
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

module.exports = React.createClass({
  mixins: ['events', 'modelChangeAware'],

  render: function() {
    var self = this;
    var project = this.getModel();
    var focus = project.get('focus');

    var children = _.map(data, function(data, key) {
      function onFocusSelect() {
        self.setState({focus: key});
        self.props.onFocus(key);
      }

      var active = focus === key;
      var className = active ? 'active green item' : 'item';
      var enabled = !data.applies || data.applies(project);
      if (enabled) {
        return (
          <a key={key} className={className} onClick={onFocusSelect}>
            <i className={data.icon}></i>
          </a>
        );
      }
    });

    var focusData = data[focus];
    return (
      <div>
        <div className="ui attached message">
          <div className="header">
            {focusData.title}
          </div>
        </div>
        <div className="ui pointing menu project-nav-selector">
          {children}
        </div>
      </div>
    );
  },

  focus: function(focus) {
    this.setState({focus: focus});
  }
});
