/** @jsx React.DOM */

var util = require('../../utils/util');

var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_ENTER = 13;

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
      <div className="vertical ui menu project-nav" key={options.key}>
        {children}
      </div>
    );
  },

  filter: function(type, self) {
    return function(e) {
      if ([38, 40, 13].indexOf(e.keyCode) >= 0) {
        onSpecialKey.call(self, e.keyCode, type);
        e.stopPropagation();
        e.preventDefault();
      } else {
        var value = $(e.currentTarget).val();
        self.setState({search: value});
      }
    }
  },

  filteredNavChildren: function(apis, type, iconType, self) {
    var children = _.chain(apis)
        .map(function(collection, apiName) {
          var _children = mapChildren(collection, function(model) {
            return {
              key: model.id,
              label: model.get('name'),
              model: model,
              type: type,
              icon: module.exports.icons[iconType],
              id: 'nav-' + model.domId()
            };
          }, self);

          return _children && {
            label: apiName,
            key: apiName,
            children: _children
          };
        })
      .compact()
      .value();
    return children;
  }
};


function addMenuChildren (navItems, level, children, self, viewState, options) {
  if (!navItems) {
    return;
  }

  var hilightModel = options.model || viewState.snippet && viewState.snippet.model || viewState.model;
  var toggleState = self.state && self.state.toggleState || {};

  _.each(navItems, function(navItem) {
    var model = navItem.model;  
    var hilighted = options.allowHilight && hilightModel && ((hilightModel.isEqual && hilightModel.isEqual(model)) || hilightModel === model);
    var className = (hilighted ? ' active green ' : '') + (navItem.className || '');
    var url = navItem.url || model && model.viewUrl && model.viewUrl(false, !options.snippet);
    var onClick = model && (options.snippet ? util.snippetTo(navItem.type, navItem.model, self) : options.jumpTo && util.jumpTo(model, self));
    var icon = navItem.icon && <i className={navItem.icon + ' icon'}/>;
    var label = navItem.label;
    var key = navItem.key;
    var clazz = url ? React.DOM.a : React.DOM.div;
    var props = {id: navItem.id, key: key, className: 'item' + className, href: url, onClick: onClick}
    var navItemChildren = navItem.children;

    if (level === 1 && navItemChildren && navItemChildren.length > 0 && navItems.length > 1) {
      var toggleId = model && (model.id || model.name) || url || (level + '-' + label);
      if (toggleState[toggleId]) {
        // closed
        icon = <i className={'fa-caret-square-o-up' + ' icon'} onClick={toggle(toggleId, model, self)}/>;
        navItemChildren = undefined;
      } else {
        // open
        icon = <i className={'fa-caret-square-o-down' + ' icon'} onClick={toggle(toggleId, model, self)}/>;
      }
    }

    if (level === 1) {
      props.className = 'item header' + className;
      children.push(clazz(props, icon, label));
      addMenuChildren(navItemChildren, level+1, children, self, viewState, options);

    } else if (level === 2) {
      var _children;
      if (navItem.children && navItem.children.length) {
        _children = [];
        addMenuChildren(navItemChildren, level+1, _children, self, viewState, options);
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

function toggle(toggleId, model, self) {
  return function(e) {
    e.preventDefault();
    e.stopPropagation();
    var state = self.state;
    var toggleState = state.toggleState;
    if (!toggleState) {
      state.toggleState = {};
    }
    state.toggleState[toggleId] = !state.toggleState[toggleId];
    self.forceUpdate();
  }
}


function onSpecialKey(keyCode, type) {
  var keySelected = this.state.keySelected;
  var children = this.state.children;
  var previous, current, next, first;
  function iterate(children, wasCurrent) {
    if (!children) return;
    var child;
    for (var i=0; i<children.length && !next; i++) {
      child = children[i];
      if (!first && child.model) {
        first = child;
      }
      if (child.model && current) {
        next = child;
        return;
      }
      if (child.model && child.model === keySelected) {
        current = child;
      } else {
        if (child.model) {
          previous = child;
        }
        if (child.children) {
          iterate(child.children);
        }
      }
    }
  }
  iterate(this.state.children);

  var el = $(this.getDOMNode());
  if (keyCode === KEY_UP) {
    keySelected = previous && previous.model;
  } else if (keyCode === KEY_DOWN) {
    if (!current) {
      keySelected = first && first.model;
    } else {
      keySelected = next && next.model;
    }
  } else if (keyCode === KEY_ENTER) {
    el.find('.keycode-hilight').removeClass('keycode-hilight');
    if (current) {
      Backbone.history.navigate(current.model.viewUrl(true), {replace: false, trigger: false});
      this.props.onSnippetTo(type, current.model);
    }
  }

  el.find('.keycode-hilight').removeClass('keycode-hilight');
  if (keySelected) {
    var domId = keySelected.domId();
    el.find('#' + 'nav-' + domId).addClass('keycode-hilight');
  }
  this.state.keySelected = keySelected;
}


function mapChildren(children, callback, self) {
  var filter = self.state.search;
  filter = filter && filter.toLowerCase();
  children = children.models || children;
  children = children && _.chain(children)
      .map(function(child) {
        var name = child.get && child.get('name');
        name = name && name.toLowerCase() || '';
        if (!filter || name.indexOf(filter) >= 0) {
          return callback.call(self, child);
        }
      })
      .compact()
      .value() || [];
  return children.length > 0 && children;
}
