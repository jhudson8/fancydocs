/** @jsx React.DOM */

var projectManager = require('../utils/project-manager');

module.exports = React.createClass({
  render: function() {
    var parsed = (this.state || {}).parsed;
    if (parsed) {
      parsed = (
        <div>
          <br/>
          Here is your readme code
          <br/>
          <textarea className="ui fluid input" defaultValue={parsed}/>
          <br/><br/>
          <a onClick={this.preview(parsed)} href="#">Preview your project</a> but be sure to copy the code first.
        </div>
      )
    }

    return (
      <div className="pad-all">
        this page under development
        <div className="ui segment">
          <h2 className="ui header">Welcome</h2>

          Add your readme file below
          <form onSubmit={this.onSubmit}>
            <textarea className="ui fluid input" ref="input"/>
            <br/>
            <button type="submit">Submit</button>
          </form>
          <br/><br/>
          {parsed}
        </div>
      </div>
    );
  },

  onSubmit: function(e) {
    e.preventDefault();
    var text = this.refs.input.getDOMNode().value;
    var parsed = require('../parser/parser')(text);
    this.setState({parsed: parsed});
  },

  preview: function(data) {
    return function(event) {
      event.preventDefault();
      var org = prompt('What is your github user/organization name?') || 'none';
      projectManager.viewTempProject(org, data);
    }
  }
});
