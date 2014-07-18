/** @jsx React.DOM */
var util = require('./nav-util');

module.exports = React.createClass({
  mixins: ['modelChangeAware', 'state'],

  render: function() {
    var self = this,
        project = this.getModel(),
        hilight = project.get('hilight');

    var children = [
      <a key="overview" className="header item" href={project.viewUrl() + '/overview'} onClick={util.hilight(project, {overview: true})}>Overview</a>
    ];

    _.each(project.api, function(apiModel, name) {
      children.push(<div key={name} className="header item">{name}</div>);
      children.push.apply(children, _.flatten(apiModel.map(function(pkg) {
        var rtn = [],
            pkgName = pkg.get('name'),
            className = "item mixin-nav-item " + ((!hilight.package === pkg.id) ? ' active green' : '');


        var methodChildren = pkg.methods.map(function(method) {
          var methodName = method.get('name'),
            className = "item method-nav-item " + ((hilight.method === method.id) ? ' active green' : '');

          return (
            <a className={className} href={method.viewUrl()} onClick={util.hilight(project, {method: method.id})}>
              <i className={util.icons.method}/>
              {methodName}
            </a>
          );
        })
        if (methodChildren.length) {
          rtn.push(
            <div className={className}>
              <i className={util.icons.package}/>
              {pkgName}
              <div className="menu">
                {methodChildren}
              </div>
            </div>
          );
        } else {
          rtn.push(
            <a className={className} href={pkg.viewUrl()}>
              <i className={util.icons.package}/>
              {pkgName}
            </a>
          );
        }

        return rtn;
      })));
    });

    var sections = project.sections;
    if (sections) {
      sections.each(function(section) {
        addSection(section, children, project, 1, hilight);
      });
    }

    return new util.menu(undefined, children);
  }
});

function addSection(section, children, project, level, hilight) {
  if (level > 3) {
    return;
  }

  var _children = [];
  if (section.sections && section.sections.length) {
    section.sections.each(function(section) {
      addSection(section, _children, project, level+1, hilight);
    });
  }
  var href = section.viewUrl(),
      title = section.get('title');
  if (level === 1) {
    // single header elements
    var className = "header item " + ((hilight.section === section.id) ? ' active green' : '');
    children.push(<a key={section.id} className={className} href={href} onClick={util.hilight(project, {section: section.id})}>{title}</a>);
    if (_children.length > 0) {
      children.push.apply(children, _children);
    }
  } else if (level === 2 && _children.length > 0) {
    children.push(
      <div key={section.id} className="item">
        {title}
        <div className="menu">
          {_children}
        </div>
      </div>
    );
  } else {
    var className = "item " + ((hilight.section === section.id) ? ' active green' : '');
    // non-nested children
    children.push(
      <a key={section.id} className={className} href={href} onClick={util.hilight(project, {section: section.id})}>{title}</a>
    );
  }
}
