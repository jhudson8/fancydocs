/** @jsx React.DOM */

var navUtil = require('./nav/nav-util');
var Markdown = require('../components/markdown');

module.exports = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var pkg = this.getModel();
    var children = [];

    if (!this.props.project.isEqual(pkg.project)) {
      // it's a parent project - show the child project name
      children.push(<h2 key="project-title" className="ui header">{pkg.project.get('title')}</h2>);
    }

    children.push.apply(children, [
      <h3 key="api" className="ui header">{pkg.get('api')}</h3>,
      <div key="divider" className="ui divider"/>
    ]);

    if (this.props.showPackageDetails) {
      children.push(
        <h4 key="package">
          <i className={navUtil.icons.package}/>
          {pkg.get('name')}
        </h4>
      );
    }
    children.push(this.props.children);

    return (
      <div>
        {children}
      </div>
    );
  }
});