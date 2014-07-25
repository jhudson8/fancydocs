/** @jsx React.DOM */

var Markdown = require('../components/markdown');

module.exports = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var project = this.getModel();

    return (
      <div className="sub header project-summary">
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