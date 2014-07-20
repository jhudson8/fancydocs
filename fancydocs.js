registerProject({"title":"fancydocs","summary":"Convert your plain README.md file into a rich interactive documentation application","sections":[{"body":"1. [create your fancydoc file](http://jhudson8.github.io/fancydocs/index.html#create) using your markdown file\n2. Include the fancydoc file in your [project's public branch](https://pages.github.com/) (*gh-pages*) as /fancydocs.js\n3. That's it.  Now, just browse to [http://jhudson8.github.io/fancydocs/index.html#project/{organization}/{repo}](http://jhudson8.github.io/fancydocs/index.html#project/{organization}/{repo})","title":"Try it!","sections":[]},{"body":"[jhudson8/backbone-reaction](http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/backbone-reaction) (used to build the *fancydocs* application)\n\n*backbone-reaction* contains both enhancements to [React](http://facebook.github.io/react/), [Backbone](http://backbonejs.org/), with additional mixins to allow React to work seamelessly with Backbone.\n\nThe following projects are bundled together with *backbone-reaction*\n\n* [jhudson8/react-mixin-manager](http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/react-mixin-manager) to allow mixins to be defined with dependencies\n* [jhudson8/react-events](http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/react-events) declarative component events similar to what you get with Backbone.View\n* [jhudson8/react-backbone](http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/react-backbone) tight integration of React and Backbone using a suite of mixins\n* [jhudson8/backbone-async-event](http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/backbone-async-event) add ajax activity events to your Backbone models and collections","title":"Examples","sections":[]},{"body":"*fancydocs* does parse your markdown files but you still need to have a bit of structure so that your content can be contextually understood.","title":"Markdown structure","sections":[{"body":"Your file must have a title header which matches the repository name and underlined with \"=\"\"\n\n```\n my-project\n =============\n```","title":"Title Header","sections":[]},{"body":"The project summary includes any content under the *Title Header* and above another sub header (underlined with \"-\"\")\n```\n my-project\n ==============\n this is the summary\n\n this is still the summary\n```","title":"Summary","sections":[]},{"body":"If your project has methods to document, a special sub header of \"API\" or \"API: {api header name}\" can be used to document methods and the packages in which the belong.  If the sub header is \"API\", the section title will be API and if it is \"API: {api header name}\" the section title will be {api header name}.\n\nYou may have multiple API sections as long as they do not have the same header label.\n\n```\n API\n ------\n```","title":"API","sections":[{"body":"All level 3 headers (*###*) under the API sub header will be evaluated as packages or a namespace in which the individual methods are contained.  Package can have content before any level 4 headers to provide a description.\n\n```\n API\n -------\n\n ### my package\n this is the description of my package\n```","title":"Packages","sections":[]},{"body":"All level 4 headers (*####*) under the *package* header will be evaluated as method definitions.  It's best to describe this using an example for reference.\n\n```\n #### myMethod () or (param1[, param2])\n * ***param1***: (string) this is the description of param1\n * ***param1***: (array) this is the description of param2\n\n *returns something*\n\n This is the method description\n```\n\nThe header label should read ```{methodName} {parameter signature}[ or {another parameter signature}]```\n\n* The parameter signature can contain any content you want (it is not currently parsed for meaning) but must be within *(...)*.\n* Any additional parameter signatures should be separated by \" or \" and be included on the same header line\n\n\nAny method parameters that require documentation should be directly under the header label\n* The parameter definition *must* be on a single line\n* The definition must be in the folowing format: ```* ***{parameter name}***: the parameter description\n\n\nIf the method returns a value, it can be documented directly under the parameter definitions (with a single blank line)\n\n* The return description must be on a single line\n* The line must be in the format of *return {the return description}* or *returns {the return description}*\n\n\nThe rest of the content that is left will be evaluated as the method description","title":"Methods","sections":[]}]},{"body":"Under the sub header (underlined with \"-\") \"Sections\" You can have structured content with nesting (max of 3 levels deep).  The 3 different levels are identified by level 3 (###), level 4 (####) and level 5(#####) headers.  Any content until the next header will be identified as the section content.\n\nThe line spacing shown in the example is not actually required but included for readability.\n\n```\n Sections\n --------\n\n ### Some main section\n\n This is the content under some main section.\n\n This is still content under some main section.\n\n\n #### Some sub section (under some main section)\n\n blah blah blah\n\n\n ##### 1 more deep under some sub section\n\n blah blah blah\n\n\n #### This is another sub section under some main section\n\n blah blah blah\n```","title":"Structured Content","sections":[]}]}]});
