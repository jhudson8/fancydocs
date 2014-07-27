/** @jsx React.DOM */

var navUtil = require('./nav/nav-util');
var Markdown = require('../components/markdown');

module.exports = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var method = this.getModel(),
        id = method.domId(),
        project = method.project,
        name = method.get('name') + ' ' + _.map(method.get('profiles'), function(profile) {
          return '(' + profile + ')';
        }).join(' or '),
        parameters = _.map(method.get('params'), function(description, name) {
          return <tr key={name}><td>{name}:</td><Markdown tag="td" body={description}/></tr>;
        }),
        summary = method.get('summary'),
        overview = method.get('overview');

    if (overview) {
      summary = summary + '\n\n' + overview;
    }
    if (parameters.length) {
      parameters = (
        <table key="parameters" className="ui table">
          <thead><tr><th colSpan="2">Parameters</th></tr></thead>
          <tbody>
            {parameters}
          </tbody>
        </table>
      );
    }
    var returns;
    if (method.get('returns')) {
      returns = <Markdown className="method-return" body={'return ' + method.get('returns')}/>
    }

    return (
      <div id={id} className={'ui segment'}>
        <h4>
          <i className={navUtil.icons.method}/>
          {name}
        </h4>
        {parameters}
        {returns}
        <Markdown key="summary" tag="p" body={summary}/>
      </div>
    );
  }
});