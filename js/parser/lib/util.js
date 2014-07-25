var exports = module.exports = {
  splitOn: function(contents, pattern) {
    var buffer = [],
      header,
      sections = [],
      currentName;

    function execute(_header) {
      if (currentName) {
        sections.push({name: currentName, content: buffer});
      } else {
        header = buffer;
      }
      if (_header) {
        currentName = _header;
        buffer = [];
      }
    }

    for (var i=0; i<contents.length; i++) {
      var match = contents[i].match(pattern);
      if (match) {
        execute(match[1].trim());
      } else {
        buffer.push(contents[i]);
      }
    }
    execute(true);
    return {header: header, sections: sections};
  },

  contentHandlers: {
    packages: function(section, data) {
      var pattern = h3Pattern;
      var packageSections = exports.splitOn(section.content, pattern),
          rtnData = {};

      packageSections.sections.forEach(function(section) {
        var headerFooter = exports.firstTitle(section.content, h4Pattern);
        rtnData[section.name] = {
          overview: exports.trimAndJoin(headerFooter.header),
          methods: exports.contentHandlers.methods(headerFooter.footer)
        };
      });
      data.packages = rtnData;
    },

    methods: function(section, data) {
      var pattern = h4Pattern;
      var methodSections = module.exports.splitOn(section, pattern),
          rtnData = {};

      methodSections.sections.forEach(function(section) {
        var parametersAndIndex = module.exports.getMethodParameters(section.content),
            description = module.exports.trimArr(section.content.slice(parametersAndIndex.index));

        var returns,
            returnsPattern = /^\*?returns?\s+([^*]*)\*]?/,
            returnsMatch = (description[0] || '').match(returnsPattern);
        if (returnsMatch) {
          returns = returnsMatch[1].trim();
          description.splice(0, 1);
          description = module.exports.trimArr(description);
        }

        var dependsOn = [],
            dependsPattern = /^\*?depends on ([^*]*)\*]?/,
            dependsMatch = (description[0] || '').match(dependsPattern);
        if (dependsMatch) {
          dependsOn = dependsMatch[1].trim().split(/\s*,\s*/);
          description.splice(0, 1);
          description = module.exports.trimArr(description);
        }

        var headerFooter = module.exports.splitFirstBlank(description);
        description = module.exports.trimAndJoin(headerFooter.header);
        var body = headerFooter.footer.join('\n').trim();

        // extract profiles from name
        var profilePattern = /^\s*([^\(\s]*)\s*(.*)/,
            name = module.exports.removeStyle(section.name), profiles = [],
            profileMatch = name.match(profilePattern);

        if (profileMatch) {
          name = profileMatch[1];
          var profileStr = profileMatch[2];
          if (profileStr) {
            profileStr = profileStr.replace(/^\s*\((.*)\)\s*/, '$1').trim()
            profiles = profileStr.split(/\)\s*;?\s*\(/).map(function(part) {
              var match = part.match(/^\s*\(?\s*([^)]*)\s*\)?\s*$/);
              return match && match[1] || part;
            });
          }
        }

        rtnData[name] = {
          profiles: profiles,
          params: parametersAndIndex.params,
          summary: description,
          dependsOn: dependsOn,
          overview: body,
          returns: returns
        };
      });
      return rtnData;
    }
  },

  firstTitle: function(content, pattern) {
    var header = [], footer = [], isHeader = true, line;
    for (var i=0; i<content.length; i++) {
      line = content[i].trim();
      if (pattern) {
        if (line.match(pattern)) {
          isHeader = false;
        }
      } else if (line.indexOf('#') === 0) {
        isHeader = false;
      }
      (isHeader?header:footer).push(content[i]);
    }
    return {
      header: module.exports.trimArr(header),
      footer: module.exports.trimArr(footer)
    };
  },

  splitFirstBlank: function(content) {
    var header = [], footer = [], isHeader = true, line;
    for (var i=0; i<content.length; i++) {
      line = content[i].trim();
      if (line.indexOf('#') === 0) {
        isHeader = false;
      }
      if (!line && isHeader) {
        if (header.length === 0) {
          continue;
        } else {
          isHeader = false;
        }
      }
      (isHeader?header:footer).push(content[i]);
    }
    return {
      header: module.exports.trimArr(header),
      footer: module.exports.trimArr(footer)
    };
  },

  trimAndJoin: function(arr) {
    return parseMarkdown(module.exports.trimArr(arr).join('\n'));
  },

  trimArr: function(arr) {
    if (!arr) return [];
    while (arr.length > 0) {
      if (arr[0].length > 0) break;
      arr.splice(0, 1);
    }
    while (arr.length > 0) {
      if (arr[arr.length-1].length > 0) break;
      arr.splice(arr.length-1, 1);
    }
    return arr;
  },

  removeStyle: function(s) {
    if (!s) return '';
    var match = s.match(/^[`\*\s]*([^`*]*)[`\*\s]*$/);
    return match && match[1] || s;
  },

  getMethodParameters: function(content) {
    var params = {},
        currentParam,
        buffer,
        index = 0;
    for (; index < content.length; index++) {
      var match = content[index].match(paramPattern);
      if (match) {
        params[module.exports.removeStyle(match[1])] = match[2].trim();
      } else {
        break;
      }
    }
    return {
      params: params,
      index: index
    };
  },

  parseMarkdown: parseMarkdown
};

function parseMarkdown(s) {
  if (!s) {
    return s;
  }

  s = s.replace(/\[([^\]]*)\]\s*\(([^\)]*)\)/g, function(match, label, url) {
    return '[' + label + '](#link/' + encodeURIComponent(url) + ')';
  });

  return s;
}