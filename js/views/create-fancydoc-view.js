/** @jsx React.DOM */

var projectManager = require('../utils/project-manager');

module.exports = React.createClass({
  render: function() {
    var parsed = (this.state || {}).parsed;
    if (parsed) {
      // this sucks but jsx parser screws up on js reserved words
      var _public = 'public';
      parsed = (
        <div>
          <div className="centered">
            <i className="huge centered download icon"/>
          </div>
          <br/>
          <div className="field">
            <label>Here is your fancydoc file content</label>
            <textarea className="markdown-entry" ref="input" defaultValue={parsed}/>
          </div>

          <a onClick={this.preview(parsed)} href="#">Preview your project</a>

          <p>
            If you like what you see, copy the fancydoc contents to your repository <a href="https://pages.github.com">public branch</a> (<strong>gh-pages</strong>) as /fancydocs.js.

            <br/><br/>

            Then, just browse to <a href={'http://jhudson8.github.io/fancydocs/index.html#project/{organization}/{repo}'}>{'http://jhudson8.github.io/fancydocs/index.html#project/{organization}/{repo}</a> and see the magic happen.'}</a>
          </p>
        </div>
      )
    }

    return (
      <div className="pad-all restrict-width">
        <div className="ui message">
          <div className="header">fancydocs</div>
        </div>
        <div className="ui segment attached top">
          <h2 className="ui header">Fancydocify your markdown file</h2>

          <form onSubmit={this.onSubmit}>
            <div className="ui form segment">
              <div className="field">
                <label>Paste your markdown file content below</label>
                <textarea className="markdown-entry" ref="input"/>
              </div>
              {parsed}
            </div>

            <button className="ui green button" type="submit">Give me the fancydocs</button>
          </form>
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
