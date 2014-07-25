/** @jsx React.DOM */

var navUtil = require('./nav/nav-util');
var MethodView = require('./method-view');
var Markdown = require('../components/markdown');


module.exports =  React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var pkg = this.getModel(),
        project = pkg.project,
        methods = pkg.methods.map(function(method) {
          return <MethodView model={method} key={method.get('name')}/>
        }, this),
        overview = pkg.get('overview');
    if (overview) {
      overview = <Markdown tag="p" body={overview}/>
    }

    var id = pkg.domId();

    return (
      <div id={id}>
        <h4>
          <i className={navUtil.icons.package}/>
          {pkg.get('name')}
        </h4>
        {overview}
        {methods}
      </div>
    );
  }
});