/** @jsx React.DOM */

var SideNav = require('./nav/side-nav');
var util = require('../utils/util');

module.exports = React.createClass({
  displayName: 'SnippetLinkView',
  mixins: ['modelAware', 'events'],

  render: function() {
    var sub = this.props.factory();
    var snippet = this.props.snippet;
    var model = snippet.model;
    var modelProject = model.project;
    var viewProject = this.props.project;
    var url = model.viewUrl(false, true);

    return (
      <div className="pad-all">
        {sub}
        <br/>
        <a href={url} onClick={util.jumpTo(model, this)}>View all {modelProject.get('name')} details</a>
      </div>
    );
  }
});
