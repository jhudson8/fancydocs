var util = require('./util');

module.exports = function(data, max) {
  data = data.content;

  var rtn = {sections: []},
      currentLevels = {
        2: rtn,
      },
      current = [],
      currentParent = rtn,
      currentTitle,
      currentLevel = 3,
      parent = rtn,
      obj,
      line;

  function reset(level, title) {
    if (currentTitle) {
      obj = {
        body: util.trimAndJoin(current),
        title: currentTitle,
        sections: []
      };
      var parent = currentLevels[currentLevel-1];
      if (!parent) {
        throw new Error('Invalid title nesting for ' + currentTitle);
      }
      parent.sections.push(obj);
      currentLevels[currentLevel] = obj;
    }
    current = [];
    currentLevel = level;
    currentTitle = title;
  }

  for (var i=0; i<data.length; i++) {
    line = data[i];
    if (line || current.length > 0) {
      var match = line.match(/^(#+)\s+(.*)/);
      if (match) {
        // we have encountered a new title
        var level = match[1].length,
            title = match[2];
        reset(level, title);
      } else {
        current.push(line);
      }
    }
  }
  reset();

  return rtn.sections;
};
