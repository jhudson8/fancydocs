/** @jsx React.DOM */

module.exports = React.createClass({
  render: function() {
    var parsed = (this.state || {}).parsed;
    if (parsed) {
      parsed = (
        <div>
          Here is your readme code
          <textarea defaultValue={parsed}/>
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
            <textarea ref="input"/>
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
  }
});
