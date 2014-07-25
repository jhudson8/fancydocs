/** @jsx React.DOM */

var Markdown = require('../components/markdown');
var navUtil = require('./nav/nav-util');
var SnippetView = require('./snippet-link-view');
var APIView = require('./api-view');
var SectionView = require('./section-view');
var SummaryView = require('./project-summary-view');
var util = require('../utils/util');

module.exports = React.createClass({
  mixins: ['modelAware'],

  render: function() {

    var project = this.getModel();
    var children = [];
    var viewState = this.props.viewState;

    _.each(project.api, function(api, name) {
      children.push(new APIView({model: api}));
    }, this);

    return (
      <div>
        <SummaryView model={project}/>
        {children}
        <ProjectSectionList model={project}/>
      </div>
    );
  }
});

var ProjectSectionList = React.createClass({
  mixins: ['modelAware'],
  render: function() {
    var project = this.getModel();
    var children = project.sections && project.sections.map(function(section) {
      return new SectionView({model: section, topLevel: true, level: 3, key: section.id});
    });
    return <div className="main-section">{children}</div>
  }
});