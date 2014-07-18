/** @jsx React.DOM */
var util = require('./nav-util');
var projectManager = require('../../utils/project-manager');

module.exports = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var activeProject = this.getModel();
    var activeProjectId = activeProject && activeProject.id;
    var projects = activeProject.getAllBundledProjects();
    var parent = projects.parent;
    var children = projects.bundledProjects.map(function(project) {
      return {label: project.get('name'), url: project.viewUrl(), icon: util.icons.project, active: project.id === activeProjectId};
    }, this);
    if (parent.id !== activeProjectId) {
      children.splice(0, 0, {label: parent.get('name'), url: parent.viewUrl(),
          icon: util.icons.project, header: true});
    }
    return util.menu(undefined, util.reactifyMenuItems(children));
  }
});
