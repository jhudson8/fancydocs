/** @jsx React.DOM */

var navUtil = require('./nav/nav-util');
var Markdown = require('../components/markdown');
var APIView = require('./api-view');

module.exports = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var api = this.getModel();

    return (
      <div>
        <h2 key="title" className="ui header">{this.props.title}</h2>
        {this.props.children}
      </div>
    );
  }
});