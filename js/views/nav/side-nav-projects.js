/** @jsx React.DOM */
var util = require('./nav-util');
var projectManager = require('../../utils/project-manager');

module.exports = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var project = this.getModel();
    project = project.parent || project;

    var navItems = [this.convertProject(project)];
    navItems[0].children = project.bundledProjects && project.bundledProjects.map(this.convertProject, this);

    return util.projectNavMenu(navItems, this, this.props.viewState, {allowHilight: true, model: project});
  },

  convertProject: function(project) {
    return {
      key: project.id,
      label: project.get('title'),
      model: project,
      hilight: true,
      viewState: this.props.viewState
    };
  }
});
