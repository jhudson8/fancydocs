module.exports = function(contents) {

  headerPattern = /^={3,50}\s*/,
  subHeaderPattern = /^-{3,50}\s*/,
  h3Pattern = /^#{3}([^#]*)#*\s*$/,
  h4Pattern = /^#{4}([^#]*)#*\s*$/,
  h5Pattern = /^#{5}([^#]*)#*\s*$/,
  paramPattern = /^\s*\*\s*([^:]*):(.*)/;

  var handlers = {
    overview: function(section, data) {
      data.overview = section.content.join('\n');
    },
    sections: function(section, data) {
      data.sections = require('./lib/section-parser')(section, 3);
    },
    'bundled projects': function(section, data) {
      data.bundledProjects = require('./lib/bundle-parser')(section);
    },
    'api(: .+)?': function(section, data) {
      var api = require('./lib/api-parser')(section);
      if (!data.api) data.api = {};
      data.api[section.name.match(/[Aa][Pp][Ii]:?\s*(.*)/)[1].trim() || 'API'] = api;
    }
  };

  var processedHandlers = [];
  for (var key in handlers) {
    processedHandlers.push({
      pattern: new RegExp(key),
      handler: handlers[key]
    });
  }

  var tmp = parseBody(contents);
  var data = {title: tmp.title, summary: tmp.summary};
  var handler;
  for (var i=0; i<tmp.sections.length; i++, handler=null) {
    var section = tmp.sections[i];
    for (var j=0; j<processedHandlers.length && !handler; j++) {
      if (processedHandlers[j].pattern.test(section.name.toLowerCase())) {
        handler = processedHandlers[j].handler;
        break;
      }
    }

    if (handler) {
      handler(section, data);
    } else {
      console.log('section "' + section.name + '" ignored');
    }
  }

  return 'registerMixin(' + JSON.stringify(data) + ');';
};

function parseBody (contents) {
  var lines = contents.split(/\r?\n/),
    buffer = [],
    sections = [],
    header,
    summary,
    currentName;

  function execute(end) {
    if (currentName) {
      var body = buffer.slice(0, buffer.length-(end?1:2));
        name = currentName;
      sections.push({name: name, content: body});
    } else {
      summary = buffer.slice(0, buffer.length-2).join('\n').trim();
    }
    if (!end) {
      currentName = buffer[buffer.length-1].trim();     buffer = [];
    }
  }

  for (var i=0; i<lines.length; i++) {
    var line = lines[i];
    if (line.match(headerPattern)) {
      if (currentName) {
        throw "there can only be 1 title (using ==========)";
      }
      // header
      header = buffer.join(' ').trim();
      buffer = [];
    } else if (line.match(subHeaderPattern)) {
      execute();

    } else {
      buffer.push(line);
    }
  }
  execute(true);
  return {title: header, summary: summary, sections: sections};
}
