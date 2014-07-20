fancydocs
=========

Convert your plain README.md file into a rich interactive documentation application

Documentation
-------------
You can read this boring old README file or you can view [fancydocs in action](http://jhudson8.github.io/fancydocs/index.html)


Sections
--------

### Try it!

1. [create your fancydoc file](http://jhudson8.github.io/fancydocs/index.html#create) using your markdown file
2. Include the fancydoc file in your [project's public branch](https://pages.github.com/) (*gh-pages*) as /fancydocs.js
3. That's it.  Now, just browse to [http://jhudson8.github.io/fancydocs/index.html#project/{organization}/{repo}](http://jhudson8.github.io/fancydocs/index.html#project/{organization}/{repo})


### Examples

[jhudson8/backbone-reaction](http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/backbone-reaction) (used to build the *fancydocs* application)

*backbone-reaction* contains both enhancements to [React](http://facebook.github.io/react/), [Backbone](http://backbonejs.org/), with additional mixins to allow React to work seamelessly with Backbone.

The following projects are bundled together with *backbone-reaction*

* [jhudson8/react-mixin-manager](http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/react-mixin-manager) to allow mixins to be defined with dependencies
* [jhudson8/react-events](http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/react-events) declarative component events similar to what you get with Backbone.View
* [jhudson8/react-backbone](http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/react-backbone) tight integration of React and Backbone using a suite of mixins
* [jhudson8/backbone-async-event](http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/backbone-async-event) add ajax activity events to your Backbone models and collections


### Markdown structure

*fancydocs* does parse your markdown files but you still need to have a bit of structure so that your content can be contextually understood.

#### Title Header

Your file must have a title header which matches the repository name and underlined with "=""

```
 my-project
 =============
```

#### Summary

The project summary includes any content under the *Title Header* and above another sub header (underlined with "-"")
```
 my-project
 ==============
 this is the summary

 this is still the summary
```

#### API

If your project has methods to document, a special sub header of "API" or "API: {api header name}" can be used to document methods and the packages in which the belong.  If the sub header is "API", the section title will be API and if it is "API: {api header name}" the section title will be {api header name}.

You may have multiple API sections as long as they do not have the same header label.

```
 API
 ------
```

##### Packages

All level 3 headers (*###*) under the API sub header will be evaluated as packages or a namespace in which the individual methods are contained.  Package can have content before any level 4 headers to provide a description.

```
 API
 -------

 ### my package
 this is the description of my package
```

##### Methods

All level 4 headers (*####*) under the *package* header will be evaluated as method definitions.  It's best to describe this using an example for reference.

```
 #### myMethod () or (param1[, param2])
 * ***param1***: (string) this is the description of param1
 * ***param1***: (array) this is the description of param2

 *returns something*

 This is the method description
```

The header label should read ```{methodName} {parameter signature}[ or {another parameter signature}]```

* The parameter signature can contain any content you want (it is not currently parsed for meaning) but must be within *(...)*.
* Any additional parameter signatures should be separated by " or " and be included on the same header line


Any method parameters that require documentation should be directly under the header label
* The parameter definition *must* be on a single line
* The definition must be in the folowing format: ```* ***{parameter name}***: the parameter description


If the method returns a value, it can be documented directly under the parameter definitions (with a single blank line)

* The return description must be on a single line
* The line must be in the format of *return {the return description}* or *returns {the return description}*


The rest of the content that is left will be evaluated as the method description


#### Structured Content

Under the sub header (underlined with "-") "Sections" You can have structured content with nesting (max of 3 levels deep).  The 3 different levels are identified by level 3 (###), level 4 (####) and level 5(#####) headers.  Any content until the next header will be identified as the section content.

The line spacing shown in the example is not actually required but included for readability.

```
 Sections
 --------

 ### Some main section

 This is the content under some main section.

 This is still content under some main section.


 #### Some sub section (under some main section)

 blah blah blah


 ##### 1 more deep under some sub section

 blah blah blah


 #### This is another sub section under some main section

 blah blah blah
```