/** @jsx React.DOM */

var Markdown = require('../components/markdown');

module.exports = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var project = this.getModel();

    return (
      <div className="sub header project-summary">
        <h2 key="project-title" className="ui header">
          <a href={'https://github.com/' + project.get('repo') + '/' + project.get('name')} className="ui label">
            <i className="large github alternate icon"></i>
          </a>
          <span className="hide-mobile">{project.get('repo')} / </span> {project.get('title')}
        </h2>

        <Markdown tag="p" body={project.get('summary')}/>
        <BundledProjectsList model={project}/>
      </div>
    );
  }
});

var BundledProjectsList = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var project = this.getModel(),
        bundledProjects = project.get('bundledProjects');
    if (!project.bundledProjects || _.isEmpty(bundledProjects)) {
      return <div/>;
    } else {
      var children = _.map(bundledProjects, function(projectInfo) {
        var id = projectInfo.id, name = projectInfo.id;
        if (id.indexOf('/') < 0) {
          id = project.get('repo') + '/' + id;
        }
        return (
          <tr>
            <td><a href={'#project/' + id}>{name}</a></td>
            <Markdown tag='td' body={projectInfo.description}/>
          </tr>
        );
      });
    }
    return (
      <div className="main-section">
        <h3 className="ui header">Bundled Projects</h3>
        <div className="ui divider"/>
        <table className="ui basic table">
          {children}
        </table>
      </div>
    );
  }
});