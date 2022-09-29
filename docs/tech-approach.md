# YBTV2 Front-End Technical Approach
The front-end of YBTV2 is a standalone project and is decoupled from the server. This design allows it to be integrated into any back-end YBTV system regardless of the server-side language used.

## Architecture Diagrams
* HTML: https://www.draw.io/#G0B_VhbqnKvCvGaXVQaGdnRkNZM3c
* CSS: https://www.draw.io/#G0B_VhbqnKvCvGTWFMWFZxRHpNanc
* JavaScript: https://www.draw.io/#G0B_VhbqnKvCvGdDRxRUN2a3VfSGM
* Components: https://www.draw.io/#G0B_VhbqnKvCvGNGJDRHNCUHVIbzA

## Technology Stack

All libraries and frameworks chosen meet these basic requirements:

* Complete feature set
* Active Git repository
* Excellent documentation
* Popular, unit tested, and battle-hardened

### Templating

#### Mustache
Mustache is used as the template engine because it integrates with the vast majority of server-side languages. This means that the back-end could be re-written using Java, Ruby, etc. while using the same front-end.

### CSS

##### Sass
A CSS pre-processer. Reasons for choosing Sass:

* Speeds up CSS development time; aids in maintainability and keeping things DRY
* Better mixin libraries compared to LESS or Stylus
* More advanced feature set: guarded mixins, placeholders
* `@extend` functionality does not duplicate selectors
* Ability to generate sourcemaps for development
* Easy integration with Grunt
* Most commonly used CSS pre-processor

##### Bourbon
A mixin library for Sass. Reasons for choosing Bourbon:

* Simple & lightweight
* Provides a number of useful helper methods that speeds up development
* Works well with existing technology choices (Sass)

##### Neat
A responsive grid framework for Bourbon + Sass. Reasons for choosing Neat:

* Simple & lightweight
* Works well with existing technology choices (Sass + Bourbon)
* Semantic: presentation logic stays in the CSS instead of polluting the HTML, and it does not rely on superfluous HTML tags

### JavaScript

##### Backbone.js
JavaScript framework. Reasons for choosing Backbone:

* Simple & lightweight framework
* Provides a basic structure for JavaScript without being intrusive
* Flexible enough to support fully fledged single-page apps (which parts of this project could someday require), or simple server-rendered pages.
* Provides the basic building blocks we'll need now and in the future: views, URL routing, models.
* Works well with existing technology choices (Require.js and jQuery)
* Includes an inheritance model
* Used internally by BC engineering

##### jQuery

A DOM and Ajax library. Reasons for choosing jQuery:

* Simple API
* jQuery is used by >90% of websites and there is a high likelihood that our customers will already be familiar with it. All customers to date have selected jQuery when asked which libraries they prefer to use.
* Used internally by BC engineering
* Works well with existing technology choices (Require.js and jQuery)

##### Require.js
A module loader/depedency system. Reasons for choosing Require.js:

* Introduces dependency management which facilitates code modularity, reusability, ease of maintenance, and scalability
* Ships with an optimization tool that integrates well with Grunt
* Used internally by BC engineering
* Compatible with existing technology choices: jQuery, Backbone (both are AMD compatible)
* Works well with non-AMD scripts


## Components
A component is any reusable piece of the application and may contain Mustache templates, HTML templates (for rendering by JavaScript), JavaScript, and CSS. The system should be broken down into components where ever possible in order to facilitate reusability, scalability, and ease of maintenance. Ideally, a single page of YBTV is nothing more than a bunch of components glued together.

Components are stored in the `components` directory. Example directory structure:

```
components
├── footer
│   ├── _footer.mustache
│   └── _footer.scss
├── header
│   ├── _header.mustache
│   └── _header.scss
├── hero-carousel
│   ├── _hero-carousel.scss
│   └── hero-carousel.js
│   └── hero-carousel.mustache
```

**Never place page or location-specific logic into a component**. If you find the need to do this then it's a good indication that the component should be "subclassed".

Alternatively, one-off changes to a component could be placed in the top-level CSS file for that page, if the change is small enough not to warrant a new component.

Examples:

This is bad:
```css
.my-component {
  width: 600px;
}

.sidebar .my-component {
  width: 300px;
}
```

This is good. Now, the `.my-component-narrow` subclass can be used anywhere in the website instead of just `.my-component` components that are descendants of `.sidebar`.

```css
.my-component-narrow {
  @extends .my-component;
  width: 300px;
}
```

---

This is bad:

```js
var MyComponentView = BaseView.extend({
  render: function() {
    if(this.$el.closest('.sidebar').length) {
      this.addClass('is-in-sidebar');
    }
  }
});
```

This is good. Now, the `MyComponentNarrowView` can be used anywhere, is not tied to existing inside a `.sidebar` element, eliminates the need for superfluous classes (`is-in-sidebar`), and eliminates extra JavaScript.

```js
// The extra `is-in-sidebar` class goes away entirely
// since it is assumed that this component now has its
// own .scss file that makes the component narrow.
var MyComponentNarrowView = MyComponentView.extend();
```

---

This is bad:

```js
var CarouselComponentView = BaseView.extend({
  initialize: function() {
    this._createPagination();

    if(this.$el.closest('header').length) {
      this._makeSticky();
    }
  }
});
```

This is good. Now, we have a subclass of the carousel component that implements functionality specific to this type of carousel.

```js
var CarouselComponentView = BaseView.extend({
  initialize: function() {
    this._createPagination();
  }
});

var HeroCarouselComponentView = CarouselComponentView.extend({
  initialize: function() {
    CarouselComponentView.prototype.initialize.call(this);
    this._makeSticky();
  }
});
```

### Exceptions to the rule
The examples above are conventions and best practices, but there are always some exceptions to the rule:

* For JavaScript components, it might make more sense for a component to accept an options object that adds behavior rather than subclassing a component for each new feature. If you're changing existing component behavior then you should absolutely subclass.
* For CSS components, if you need to change one property for a component on a single page then maybe it makes more sense to overwrite the property on the page's `main.scss` file. Just make sure the override doesn't happen inside of the component itself.

Use your best judgement.

## JavaScript
[Architecture diagram](https://www.draw.io/#G0B_VhbqnKvCvGdDRxRUN2a3VfSGM)

JavaScript components (or "modules" as they are commonly referred to) start with a `define()` call to register them as an AMD module with Require.js, and return an object which can be consumed by another module. This return object is *usually* a Backbone View, Collection, or Model object but don't necessarily have to be.

Modules should require their dependencies using the `var dep = require('dependency');` syntax rather than declaring dependencies using the `define([ dependencies], fn)` signature.

An example module that returns a View object:

```js
define(function(require) {
  var BaseView = require('views/base');
  return BaseView.extend();
});
```

### Directory Structure
```
src/scripts
├── common.js                        # Require.js config and common modules
├── page-{PAGE_NAME}.js              # Loads common file and the page's boot file
├── src
│   ├── app.js                       # Shared component
│   ├── boot-{PAGE_NAME}.js          # Boots up the page. Starts router, top-piece of UI, etc.
│   ├── routers
│   │   ├── base.js                  # Base router from which all others inherit
│   │   └── {PAGE_NAME}.js           # Routes specific to a page
│   └── views
│   |    ├── base
│   |    │   ├── page.js             # Base top-level page view from which other top-level views inherit from
│   |    │   └── view.js             # Base view from which all other views inherit from
│   |    └── {PAGE_NAME}             # Directory for page-specific files
│   |        └── main.js             # Main top-level page view. This view glues the page together.
│   └── collections
│   |    └── base
│   |        └── collection.js       # Base collection from which all other collections inherit from
│   └── models
│        └── base
│            └── models.js           # Base model from which all other models inherit from
└── text.js                          # Require.js text plugin
```

### Gluing Components Together
Each page of YBTV has a top-level "main" file that pulls in all the JavaScript components that it needs in order to construct the page. The main file then creates a new instance of each component.

[See this architecture diagram](https://www.draw.io/#G0B_VhbqnKvCvGNGJDRHNCUHVIbzA).

### Templating
Underscore.js's `_.template` method is the templating framework of choice for modules that need to render HTML dynamically. The HTML to render should exist in its own .html file and the module should define the template as a dependency. During the build process the template will be inlined into the build artifact.

```html
<p>Hello <%= name %>!</p>
```

```js
define(function(require) {
  var template = require('text!tempate.html');
  var BaseView = require('views/base');

  return BaseView.extend({
    template: _.template(template),

    render: function() {
      var context = { name: 'Eric' };
      this.$el.html(this.template(context));
      return this;
    }
  });
});
```

### Inheritance
Inheritance is provided by Backbone.js. Components are typically comprised of views, collections, and models, all of which are inheritable through the `extend()` method.

```js
// HeroCarouselView.js
define(function(require) {
  var CarouselView = require('components/carousel');

  var HeroCarouselView = CarouselView.extend({
    initialize: function() {
      // 'super' method call
      CarouselView.prototype.initialize.call(this);
    }
  });

  return HeroCarouselView;
});
```

### Communication
Generally, two modules should not hold strong references to each other in order to promote decoupling and reusability. There are two exceptions to this:

1. The `app` is designed to be an optional dependency for all other module in the system. Inter-code communication should be performed through the event bus available in the `app` module; modules should emit an event broadcasting an intent or request, and other modules should listen to the event and perform an action.

 ```js
 define(function(require) {
    var app = require('app');

   app.on('navigation:open', function() {
     // Do something when the navigation opens
   });
 });
 ```

2. If a module leverages functionality from another module. ComponentC = componentA + custom logic

Sibling instances should **never** be tightly coupled.

This is bad:

```js
var NavigationView = BaseView.extend({
  open: function() {
    this.dialog.close();
  }
});

var DialogView = BaseView.extend({
  close: function() {
    this.$el.addClass('is-hidden');
  }
});

var nav = new NavigationView({ el: $('.nav') });
var dialog = new DialogView({ el: $('.dialog') });
nav.dialog = dialog;
nav.open();
```

This is good:

```js
var NavigationView = BaseView.extend({
  open: function() {
    app.trigger('navigation:open');
  }
});

var DialogView = BaseView.extend({
  initialize: function() {
    this.listenTo(app, 'navigation:open', this.close);
  },
  close: function() {
    this.$el.addClass('is-hidden');
  }
});

var nav = new NavigationView({ el: $('.nav') });
var dialog = new DialogView({ el: $('.dialog') });
nav.open();
```

This is OK too:

```js
// GridView.js
define(function(require) {
  var BaseView = require('base/view');
  var GridItemView = require('views/grid-item');

  return BaseView.extend({
    initialize: function() {
      this.items = [];

      this.$('li').each(function(index, li) {
        this.items[this.items.length] = new GridItemView({
          el: li
        });
      }.bind(this));
    }
  });
});

new GridView({
  el: $('ul')
});
```


### Best Practices
* If a view renders its own template, the template should be a property of the view so that the view can be swapped out programmatically if need be. This will make components more reusable.
* Always use HTML templates + `_.template` to render dynamic HTML instead of composing a string of HTML programmatically.
* Components can take configuration options to make them malleable, but don't be afraid to subclass where it makes sense as well.
* Each page of the app should have a `main-{pageName}.js` view as the entry point into the page. This view extends from `BasePageView.js`
* All views ultimately extend from `BaseView.js`
* Use `require('module')` instead of defining dependencies in the `define([deps])` signature
* Common `app` module is the only tightly-coupled module and can be used to hold app-wide settings, constants, the inter-module communication event bus, etc.
















## Templating
[Architecture document](https://www.draw.io/#G0B_VhbqnKvCvGaXVQaGdnRkNZM3c)

### Best Practices
* Each page of the app should have a `main.mustache` template as the entry point to the page. This template imports the templates for the modules it wants to use.
* Only use ID attributes as a hook for JavaScript if necessary. Class names are highly preferred for reusability.


## CSS
[Architecture document](https://www.draw.io/#G0B_VhbqnKvCvGTWFMWFZxRHpNanc)

### Best Practices
* Prefer em or percent units over pixels. em and % are relative, px are not.
* Everything should be designed and developed with reusability in mind. Where possible:
  * Make it a component
  * Declare the component using a class name (as opposed to id or element selectors)
  * Inherit from similar components where it makes sense
  * Do not change a change with a parent selector. Subclass it instead.
    * Example: instead of `#sidebar .widget` create a new widget component `.widget-constrained` that is designed to fit within the constraints of the sidebar.
    * This widget can be re-used elsewhere and avoids specificity issues
    * If you do modify a component this way, do not do it inside of the component file - do it inside of the
* Inheritance is accomplished inside of the `.scss` files:
  * Example: instead of `<a class=”button button-red”></a>` the `.button-red` component should `@extend` from `.button`
  * Use placeholders to reuse values, use mixins to reuse rules with different
  values
  * Avoid mixins for inheritance because SASS will duplicate all the declarations
* Minimize `.scss` file nesting (maximum of 3 lines)
  * Use 1st-level  `.carousel-header`, `.carousel-body`, etc. classes instead of `.carousel h1` or `.carousel .body`
  * Maximizes performance
* Components should not be named after where they are used or how they look. For example, prefer `.button-alert` over `.button-red` or `.widget-narrow` over `.widget-sidebar`.

## Build Tool
Builds are generated with [Grunt](http://gruntjs.com). There are two tasks:

`grunt server` (for development):
* Compiles SASS to CSS, generates sourcemaps
* Starts the development server
* Starts livereload
* Watches .scss for changes and automatically runs the SASS task

`grunt release` (for releasing to production):
* Runs the Require.js build tool
* Optimizes JavaScript files (concatination, minification, etc.)
* Inlines Almond.js
* Removes console logging and `debugger` statements
* Minifies CSS


## Development Server
The command `grunt server` boots up a simple Express.js server that can be used in place of the real YBTV back-end during development. The advantages of this setup are:

* The front-end can be iterated on without depending on the back-end system being ready
* The dev server can be hooked up to any Video Cloud account and pull in real data
* The dev server can emulate any functionality that will be available in the real server
* The dev server renders the Mustache templates during development, so we do not need an extra Grunt task to convert them into HTML before previewing them in the browser
* The dev server can be configured to point to the production static assets (assets that are generated via `grunt release`) for easier dev QA

## Dependency Management
This project uses [Bower](http://bower.io) to manage web dependencies, and [npm](http://npm.org) to manage dependencies for the development server and build process.

## General Requirements
* Extensible, decoupled architecture
* Follows SEO best practices
* Mobile-first
* Ability to re-skin quickly without digging deep into the source code
* Ability to develop and iterate on the front-end quickly without relying on a back-end integration
* Fast development process. Build processes during development should be minimal and whatever processes there are (sass for example) should be quick.
* Fast page load times
  * Lean JavaScript
    * only modules that are used should built into the distribution artifacts
    * minify/concat JS
  * Lean CSS (reduce browser layout/paint times)
    * minimize nesting
    * performant selectors
    * minify CSS
  * Lean HTML
      * avoid superfluous HTML elements
      * minify HTML
  * Scripts should come before the closing `</body>` tag
  * Pre-compiled templates on the server?
  * Minification of HTML on the server?
  * Minimize usage of images; prefer CSS3
    * Optimize images when they are used

