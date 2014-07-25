/** @jsx React.DOM */

var util = require('../../utils/util');

module.exports = {
  icons: {
    package: 'fa-th icon',
    method: 'fa-code icon',
    project: 'fa-github icon',
    search: 'fa-search icon',
  },

  /**
   * [{key, model, label, url, children}]
   */
  projectNavMenu: function(navItems, self, viewState, options) {
    options = options || {};
    var children = [];
    addMenuChildren(navItems, options.startingLevel || 1, children, self, viewState, options);

    return (
      <div className="vertical ui menu project-nav">
        {children}
      </div>
    );
  }
};

function addMenuChildren (navItems, level, children, self, viewState, options) {
  if (!navItems) {
    return;
  }

  _.each(navItems, function(navItem) {
    var model = navItem.model;
    var hilightModel = options.model || viewState.snippet && viewState.snippet.model || viewState.model;
    var hilighted = options.allowHilight && hilightModel && hilightModel.isEqual(model);
    var className = hilighted ? ' active green' : '';
    var url = navItem.url || model && model.viewUrl(false, !options.snippet);
    var onClick = model && (options.snippet ? util.snippetTo(navItem.type, navItem.model, self) : options.jumpTo && util.jumpTo(model, self));
    var icon = navItem.icon && <i className={navItem.icon + ' icon'}/>;
    var label = navItem.label;
    var key = navItem.key;
    var clazz = url ? React.DOM.a : React.DOM.div;
    var props = {key: key, className: 'item' + className, href: url, onClick: onClick}

    if (level === 1) {
      props.className = 'item header' + className;
      children.push(clazz(props, icon, label));
      addMenuChildren(navItem.children, level+1, children, self, viewState, options);

    } else if (level === 2) {
      var _children;
      if (navItem.children && navItem.children.length) {
        _children = [];
        addMenuChildren(navItem.children, level+1, _children, self, viewState, options);
        _children = (
          <div className="menu">
            {_children}
          </div>
        );
      }

      if (_children) {
        var child = label;
        if (url) {
          props.className = '';
          child = clazz(props, label);
        }
        children.push(
          <div key={key} className={'item' + className}>
            {icon}
            {child}
            {_children}
          </div>
        );
      } else {
        children.push(clazz(props, icon, label));
      }


    } else if (level === 3) {
      children.push(clazz(props, icon, label));
    }

  });
}
