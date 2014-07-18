var util = require('./util');

module.exports = function(section) {
  var rtn = {
    methods: {}
  };
  var headerFooter = util.firstTitle(section.content),
      summary = util.trimAndJoin(headerFooter.header);
  if (summary) {
    rtn.summary = summary;
  }

  util.contentHandlers.packages({content: headerFooter.footer}, rtn);
  return rtn;
};
