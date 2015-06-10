/** @jsx React.DOM */

var navUtil = require('./nav/nav-util');
var Markdown = require('../components/markdown');

module.exports = React.createClass({
  displayName: 'PackageWrapperView',
  mixins: ['modelAware'],

  render: function() {
    var pkg = this.getModel();
    var children = [];

      children.push(
        <h2 key="project-title" className="ui header">
          <a href={'https://github.com/' + pkg.project.get('repo') + '/' + pkg.project.get('name')} className="ui label">
            <i className="large github alternate icon"></i>
          </a>
          <span className="hide-mobile">{pkg.project.get('repo')} / </span> {pkg.project.get('title')}
        </h2>
      );

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