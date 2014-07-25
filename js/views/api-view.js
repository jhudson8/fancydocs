/** @jsx React.DOM */

var Markdown = require('../components/markdown');
var PackageView = require('./package-view');

module.exports = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var api = this.getModel();
    var apiId = api.domId();

    var packages = api.map(function(pkg, name) {
      return <PackageView model={pkg}/>
    }, this);

    return (
      <div className="main-section">
        <h3 className="ui header" id={apiId}>{api.name}</h3>
        <div className="ui divider"/>
        <Markdown body={api.description}/>
        {packages}
      </div>
    );
  }
});
