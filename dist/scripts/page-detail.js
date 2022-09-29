require=function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({39:[function(a,b,c){"use strict";var d=a("app"),e=a("views/detail/main");d.pageView=new e},{app:"app","views/detail/main":60}],60:[function(a,b,c){"use strict";/**
 * Top-level piece of UI for the detail page
 */
var d=a("views/base/page"),e=a("components/sticky-container/sticky-container"),f=a("components/sort-dropdown/sort-dropdown"),g=a("components/carousel-related/carousel-related"),h=a("components/sharing/sharing"),i=a("components/hero-rating/rating"),j=a("components/pagination/pagination"),k=a("components/video-player/video-player");b.exports=d.extend({initialize:function(){d.prototype.initialize.apply(this,arguments);var a=this.$(".video-grid");new j({el:this.$(".pagination"),resultsTarget:a}),new k({el:this.$("#preview-player")}),this.subviews.stickyPagination=new e({el:this.$(".sticky-container")}),this.subviews.sortDropdown=new f({el:this.$(".sort-dropdown")}),this.subviews.related=new g({el:this.$(".carousel-related")}),this.subviews.sharing=new h({el:this.$(".sharing")}),this.subviews.heroRating=new i({el:this.$(".rating")}),$(".fv-video").click(function(){var a=$("#videoId").val(),b=$("#isFavorite").is(":checked")?"1":"0",c=$("#videoTimepoint").val();$.post("/tracking/favorite/toggle",{videoid:a,timepoint:c,favorite:b})})}})},{"components/carousel-related/carousel-related":15,"components/hero-rating/rating":18,"components/pagination/pagination":22,"components/sharing/sharing":26,"components/sort-dropdown/sort-dropdown":27,"components/sticky-container/sticky-container":29,"components/video-player/video-player":33,"views/base/page":57}],29:[function(a,b,c){"use strict";var d=a("jquery"),e=a("underscore"),f=(a("app"),a("views/base/view")),g=a("libs/breakpoint");a("bccsticky"),b.exports=f.extend({initialize:function(a){f.prototype.initialize.apply(this,arguments),this.$header=d(".header"),this.options=e.extend({stackOffset:this.$header.outerHeight()},a.options||{}),this._createPlugin(),
// The height of the header changes depending on the breakpoint used,
// so update the sticky plugin accordingly
this.listenTo(g,"breakpoint:change",this._updateHeights)},_createPlugin:function(){this.$el.sticky(this.options)},_updateHeights:function(){var a=this.$el.data("sticky");a&&a.setOption("stackOffset",this.$header.outerHeight())}})},{app:"app",bccsticky:3,jquery:9,"libs/breakpoint":34,underscore:10,"views/base/view":58}],26:[function(a,b,c){"use strict";var d=a("views/base/view"),e=a("components/sharing/SharingService"),f=a("underscore"),g=[new e("facebook","https://www.facebook.com/sharer/sharer.php?u="),new e("twitter","https://twitter.com/home?status="),new e("google","https://plus.google.com/share?url=")];b.exports=d.extend({events:{"click [data-service]":"_onShareClick"},_onShareClick:function(a){a.preventDefault();var b=a.currentTarget.getAttribute("data-service"),c=f.findWhere(g,{name:b}),d=window.location.protocol+"//"+window.location.hostname+"/share"+window.location.pathname;c&&c.share(d,{prependText:"twitter"===b?this.$el.data("title"):""})}})},{"components/sharing/SharingService":25,underscore:10,"views/base/view":58}],25:[function(a,b,c){"use strict";/**
  * @constructor
  * @param {string} name - name of the sharing service, like twitter
  * @param {string} baseUrl - base sharing url of the service
  * @param {object} opts - an object of default options
  */
function d(a,b,c){if(!a)throw new Error("Name param is required");if(!b)throw new Error("Base URL param is required");this.opts=e.extend({width:600,height:400},c||{}),this.name=a,this.baseUrl=b}var e=a("underscore");d.prototype={constructor:d,/**
    * Initialize sharing to this service
    * @param {string} url - the URL to share
    * @param {object} opts - optional options. Same options as in the constructor but allows you to override them for this particular share.
    */
share:function(a,b){if(!a)throw new Error("Cannot share without a url");b=e.extend({},this.opts,b||{}),"prependText"in b&&(a=encodeURIComponent(b.prependText)+" "+a),"appendText"in b&&(a=a+" "+encodeURIComponent(b.appendText));
// Logic from http://stackoverflow.com/a/16861050
var c=void 0!=window.screenLeft?window.screenLeft:screen.left,d=void 0!=window.screenTop?window.screenTop:screen.top,f=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width,g=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height,h=f/2-b.width/2+c,i=g/2-b.height/2+d;window.open(this.baseUrl+a,"Share","resizable=1,scrollbar=1,status=1,width=%w,height=%h,chrome=1,centerscreen=1,top=%t,left=%l%".replace("%w",b.width).replace("%h",b.height).replace("%t",i).replace("%l",h))}},b.exports=d},{underscore:10}],22:[function(a,b,c){/**
 * This component is can be used to turn the traditional page-turn style
 * of pagination into an ajax drive one.
 * @param {jQuery} el -  a jQuery object referencing .pagination div(s)
 * @param {jQuery} resultsTarget - a jQuery object referencing where the results should be appear
 * @fires PaginationView#change - Change event once data has been refreshed from the server. Passes in the instance object as the only argument
 *
 * Example:
 * new PaginationView({
 *  el: this.$('.pagination'),
 *  resultsTarget: $('.video-grid')
 * });
 *
 * Events example:
 * var pagination = new PaginationView({ ... });
 * pagination.on('change', function(instance) {
 *   console.log('Current page is:', instance.currentPage);
 * });
 */
"use strict";var d=a("views/base/view"),e=a("components/spinner/spinner"),f="is-active",g="is-disabled",h="is-hidden",i="button-first-visible",j="button-last-visible";b.exports=d.extend({events:{"click .pagination-pageset a":"_onPageNumClick","click .pagination-next":"_onNextClick","click .pagination-prev":"_onPrevClick","click .pagination-sort-links a":"_onSortButtonClick"},initialize:function(a){d.prototype.initialize.apply(this,arguments),this.spinner=new e({el:this.$(".spinner")});
// Find page and sort params in the query string. These will be our
// defaults if they exist.
var b=location.search.match(/page=(\d+)/),c=location.search.match(/sort=(\w+)/);this.currentPage=b?parseInt(b[1],10):1,this.sortPredicate=c=c?c[1]:"date",this.$target=a.resultsTarget,this.$pagesets=this.$(".pagination-pageset"),this.$startIndex=this.$(".pagination-start-index"),this.$endIndex=this.$(".pagination-end-index"),this.$recordcount=this.$(".pagination-recordcount"),this.$next=this.$(".pagination-next"),this.$prev=this.$(".pagination-prev"),this.$sortButtons=this.$(".pagination-sort-links a"),this._setActivePage(),this._setActiveSort()},_onPageNumClick:function(a){a.preventDefault();var b=parseInt($(a.currentTarget).text(),10);b!==this.currentPage&&this._changePage(b)},_onNextClick:function(a){a.preventDefault(),a.currentTarget.className.indexOf(g)>-1||this._changePage(this.currentPage+1)},_onPrevClick:function(a){a.preventDefault(),a.currentTarget.className.indexOf(g)>-1||this._changePage(this.currentPage-1)},_onSortButtonClick:function(a){a.preventDefault();var b=$(a.currentTarget);this.sortPredicate=b.data("predicate"),this._fetch(b.attr("href"))},_setActivePage:function(){var a=this,b=0;this.$pagesets.find("a").removeClass(f),this.$pagesets.each(function(){$(this).find("li").each(function(c,d){b=c>b?c:b,c===a.currentPage-1&&$(d).find("a").addClass(f)})}),this._centerPagination(),this._toggleArrowsDisabled(b)},_setActiveSort:function(){this.$sortButtons.removeClass(f).filter(function(a,b){return $(b).data("predicate")===this.sortPredicate}.bind(this)).addClass(f)},_changePage:function(a){this.currentPage=a,this._fetch()},_fetch:function(a){this.xhr&&"pending"===this.xhr.state()&&this.xhr.abort();var b=!1;
// If an href wasn't directly passed in, use the href for the current
// page within the first pageset
"undefined"==typeof a?a=this.$pagesets.eq(0).find("li").eq(this.currentPage-1).find("a").attr("href"):b=!0,this.spinner.spin(1),this.xhr=$.get(a).done(function(a){this.currentPage=a.pagination.currentPage,
// Must get the resp.html and put the innerHTML in the $target cuz .video-grid comes back in resp and .replaceWith() doesnt work.
this.$target.html($(a.html)[0].innerHTML),this.$startIndex.text(a.pagination.startIndex),this.$endIndex.text(a.pagination.endIndex),this.$recordcount.text(a.pagination.totalItems),this._setActivePage(),this._setActiveSort();var c=this.currentPage,d=this.sortPredicate;b&&this.$pagesets.each(function(){$(this).find("li").each(function(a,b){var c="?page="+(a+1)+"&sort="+d;$(b).find("a").attr("href",c)})}),this.$next.attr("href","?page="+(c+1)+"&sort="+d),this.$prev.attr("href","?page="+(c-1)+"&sort="+d),this.trigger("change",this)}.bind(this)).always(function(){this.spinner.spin(-1)}.bind(this))},_centerPagination:function(){var a=this._countPages(),b=this.currentPage,c=[b-2,b-1,b,b+1,b+2];
// If on page 1 or 2, show 5 pages without the active page centered
2>=b&&(c=[1,2,3,4,5]),
// If on the last/second to last page, show 5 pages w/o the active
// page centered.
(b===a||b===a-1)&&(c=[a-4,a-3,a-2,a-1,a]),
// Toggle visiblity of the pages within each pageset
this.$pagesets.each(function(){$(this).find("li").each(function(a,b){a+=1;var d=c.indexOf(a)>-1,e=$(b);e.toggleClass(h,!d),e.removeClass([i,j].join(" ")),c[0]===a&&e.addClass(i),c[c.length-1]===a&&e.addClass(j)})})},_toggleArrowsDisabled:function(){var a=!1,b=!1;1===this.currentPage?a=!0:this.currentPage===this._countPages()&&(b=!0),this.$next.toggleClass(g,b),this.$prev.toggleClass(g,a)},_countPages:function(){return this.$pagesets.eq(0).children().length}})},{"components/spinner/spinner":28,"views/base/view":58}],28:[function(a,b,c){/**
 * Spinner component
 * Emits `show` and `hide` events
 *
 * Example:
 * var spinner = new Spinner({
 *  el: $('.spinner'),
 *  minDisplayTime: 500
 * });
 *
 * spinner.spin(1);  // increment spin count
 * spinner.spin(-1); // decrement spin count
 * spinner.spin(0);  // force hide the spinner
 */
var d=a("views/base/view"),e=a("jquery");b.exports=d.extend({/**
   * @private
   * Internal counter
   */
_count:0,/**
   * @constructor
   * @param {Number} minDisplayTime - min length to appear for
   * @param {String} spinningClass - class to apply to make it spin
   */
initialize:function(a){d.prototype.initialize.apply(this,arguments),this.opts=e.extend({minDisplayTime:500,spinningClass:"is-spinning"},a||{}),this._hide(!0)},/**
   * Show/hide the spinner
   * @param {Number} counter - increment or decrement.
   *  0 - force hide
   *  1 - increment (show)
   * -1 - decrement (hides when it reaches 0)
   */
spin:function(a){0===a?(this._count=0,this._hide(!0)):(this._count+=a,this[0===this._count?"_hide":"_show"]())},/**
   * @private
   * Show the spinner
   */
_show:function(){this.$el.addClass(this.opts.spinningClass),this.trigger("show")},/**
   * @private
   * @param {Boolean} force - force hide the spinner
   * Hide the spinner
   */
_hide:function(a){var b=function(){this.$el.removeClass(this.opts.spinningClass),this.trigger("hide")}.bind(this);a?b():(clearTimeout(this.timer),this.timer=setTimeout(b,this.opts.minDisplayTime))}})},{jquery:9,"views/base/view":58}],18:[function(a,b,c){var d=a("views/base/view");b.exports=d.extend({events:{"mouseenter li":"_hoverOnRating","mouseleave ul":"_highlightRating","click li":"_rateContent"},initialize:function(){d.prototype.initialize.apply(this,arguments),this._highlightRating()},_highlightRating:function(a,b){if(a&&a.preventDefault(),b=b?$(b):this.$el,!b.hasClass("disabled")){var c=parseFloat(b.data("rating")),d=c%1!=0,e=b.find("i").hasClass("fa-lg");$(b).find("li").each(function(a,b){var f=$(b).find("i").removeClass().addClass("fa");e&&f.addClass("fa-lg"),$(b).find("a").removeClass("hover"),c>=a?f.addClass("fa-star"):d&&Math.ceil(c)===a?f.addClass("fa-star-half-o"):f.addClass("fa-star-o")})}},_hoverOnRating:function(a){a.preventDefault();var b=this.$("li"),c=b.index(a.currentTarget);b.each(function(a){$(this).find("a").addClass("hover"),c>=a?$(this).find("i").removeClass().addClass("fa fa-lg fa-star"):$(this).find("i").removeClass().addClass("fa fa-lg fa-star-o")})},_rateContent:function(a){a.preventDefault();var b=this.$el,c=$(a.currentTarget),d=b.data("id"),e="true"===b.data("userrated")?b.data("rating"):-1,f=b.find("li").index(c),g=200;b.addClass("disabled"),$.post("/user/rate",{contentId:d,rating:f,prevRating:e}).done(function(){b.data("rating",f),b.find("a").addClass("changed");var a=function(){b.find("a").removeClass("changed"),b.removeClass("disabled"),$(".video-thumb.is-active ul").data("rating",f),this._highlightRating(),this._highlightRating(void 0,".video-thumb.is-active ul")}.bind(this);setTimeout(a,g)}.bind(this))}})},{"views/base/view":58}],15:[function(a,b,c){"use strict";var d=a("components/_carousel/carousel");b.exports=d.extend({defaults:$.extend(!0,{},d.prototype.defaults,{autoInit:!1,// Carousel is lazy-loaded
paginationStyle:"nOfn",breakpoints:[{// mobile
minWidth:0,maxWidth:479,perPage:1.5,moveBy:1.5,scroll:"overflow"},{// tablet
minWidth:480,maxWidth:768,perPage:4,moveBy:4},{// desktop
minWidth:769,perPage:6,moveBy:6}]}),events:{"click .carousel-related-trigger":"_toggle"},initialize:function(){d.prototype.initialize.apply(this,arguments),this.$container=this.$(".carousel-related-container"),this.created=!1,this.open=!1,this.closing=!1},/**
   * Toggles the carousel container open or closed
   */
_toggle:function(a){a.preventDefault(),$(a.currentTarget).toggleClass("is-active"),this.$el.toggleClass("is-open"),this[this.open?"_close":"_open"]()},/**
   * Opens the carousel
   */
_open:function(a){this.closing||(
// Create the first time this thing is opened. It must be in visible
// in the DOM to do so, so make it visible real quick.
this.$container.show(),this._create(),this.$container.hide(),this.$container.slideDown(250),this.open=!0)},/**
   * Closes the carousel
   */
_close:function(){this.open=!1,this.closing=!0,this.$container.slideUp(250,function(){this.closing=!1,this.carousel.destroy(),this.carousel=null}.bind(this))}})},{"components/_carousel/carousel":11}],3:[function(a,b,c){/**
 * jQuery sticky elements plugin
 */
!function(a){"use strict";/**
   * @constructor
   * @param {Element} elem - DOM element to make sticky
   * @param {Object} options - options object
   */
function b(b,c){this._id=f++,this.elem=b,this.$elem=a(b),this.options=c,this.stackOffset=e+this.options.stackOffset,this.stuck=!1,this._init()}
// We'll be using these references multiple times
var c=a(window),d=document.documentElement,e=0,f=0;b.prototype={/**
     * Initializer
     * @private
     */
_init:function(){this._prepareClone(),this._prepareElement(),this.enable(),this._calculate(),this.options.onCreate.call(this,this.$container)},/**
     * Stick the element to the top
     */
stick:function(){!this.stuck&&this.enabled&&(this._syncDimensions(),this._setTopOffset(),this.$clone.removeClass(this.options.cloneHiddenClass),this.container.className+=" "+this.options.fixedClass,this.stuck=!0,this.options.onStick.call(this,this.$container),this.$elem.trigger("stick"))},/**
     * Unstick the element from the top
     */
unstick:function(){this.stuck&&(this.stuck=!1,this.clone.className+=" "+this.options.cloneHiddenClass,this.clone.removeAttribute("style"),this.$container.removeClass(this.options.fixedClass),this.options.onUnStick.call(this,this.$container),this.$elem.trigger("unstick"))},/**
     * Enable this plugin
     */
enable:function(){if(!this.enabled){var a="scroll.sticky"+this._id;a+=" resize.sticky"+this._id,a+=" touchmove.sticky"+this._id,c.on(a,this._calculate.bind(this)),this.enabled=!0}},/**
     * Disable this plugin
     */
disable:function(){this.enabled&&(c.off(".sticky"+this._id),this.stuck&&this.unstick(),this.enabled=!1)},/**
     * Change plugin option at runtime
     * @param {String} option - option to change
     * @param {Any} value - new value for the option
     */
setOption:function(a,b){switch(a){case"stackOffset":this._getElemHeight(),this.stackOffset-=this.options.stackOffset,this.options.stackOffset=b,this.stackOffset+=b,this._setTopOffset()}},/**
     * Destroy instance of this plugin
     */
destroy:function(){this.disable(),this.$clone.remove(),e-=this.stackOffset},/**
     * Clone the element to use when the real element is in sticky mode.
     * The clone will take its place in the flow so things don't jump
     * around.
     * @private
     */
_prepareClone:function(){var a=this.$elem,b=this.options,c=this.$clone=a.clone();this.clone=this.$clone[0],c.removeAttr("class"),c.addClass(b.cloneClass),c.addClass(b.cloneHiddenClass),c.attr("data-sticky-clone",!0),c.removeAttr("id"),c.empty(),c.insertBefore(a)},/**
     * Wrap the element that should be sticky in a new container element
     * @private
     */
_prepareElement:function(){this.$elem.wrap('<div class="'+this.options.containerClass+'"></div>'),this.$container=this.$elem.parent(),this.container=this.$container[0],
// If this instance should stack below other instances...
this.options.stacks&&(e+=this._elemHeight,this.container.className+=" "+this.options.stacksClass,this.$elem.one("stick",function(){this._adjustZindex()}.bind(this)))},/**
     * Determine whether or not the element should stick based on its current
     * position in the document
     * @private
     */
_calculate:function(a){var b=this.options,c=b.stacks?this.stackOffset:0,d=this.container.className.indexOf(b.fixedClass)>-1?this._getOffsetTop(this.clone):this._getOffsetTop(this.elem),e=this._getScrollTop()>=d-c;this[e?"stick":"unstick"](),
// Make sure the clone's width stays in sync with the element's width
// if the screen is resized. Element calculations are performed before
// applying them in order to reduce reflows.
e&&a&&"resize"===a.type&&this._syncDimensions()},/**
     * Set the top css property of the container
     * @private
     */
_setTopOffset:function(){this.container.style.top=this.stackOffset+"px"},/**
     * Get this element's height
     * @returns {number} element height
     * @private
     */
_getElemHeight:function(){var a=this.elem.clientHeight;return this._elemHeight&&(e-=this._elemHeight,e+=a),this._elemHeight=a},/**
     * Get the window's scrollTop position
     * @returns {number}
     * @private
     */
_getScrollTop:function(){return"pageYOffset"in window?window.pageYOffset:"scrollTop"in d?d.scrollTop:c.scrollTop()},/**
     * Get this element's offsetTop position
     * @param {Element} DOM element to get the top position of
     * @returns {number}
     * @private
     */
_getOffsetTop:function(a){var b=void 0!==typeof a.getBoundingClientRect?a.getBoundingClientRect().top:0;return b+this._getScrollTop()-(d.clientTop||0)},/**
     * Adjust the z-index of this element
     * @param {Number} value - z-index value to set on the container
     * @private
     */
_adjustZindex:function(a){null==a&&(a=parseInt(this.container.style.zIndex,10)+this._id),this.container.style.zIndex=a},/**
     * Keep the clone's dimensions in sync with the element's dimensions.
     * Getters are performed before the setters in order to element a reflow.
     * @private
     */
_syncDimensions:function(){var a=this.elem.clientWidth,b=this._getElemHeight();this.clone.style.width=a+"px",this.clone.style.height=b+"px"}},
// Expose as a jQuery plugin
a.fn.sticky=function(c){return this.each(function(){var d,e;return(e=a.data(this,"sticky"))?e:(d=a.extend({},a.fn.sticky.defaults,c||{}),a.data(this,"sticky",new b(this,d)))})},
// Default options
a.fn.sticky.defaults={stacks:!0,// Should each instance of this plugin stack on top of each other?
stackOffset:0,// Additional offset from the top until the element becomes fixed
containerClass:"bcc-sticky-wrapper",fixedClass:"bcc-sticky-is-stuck",stacksClass:"bcc-sticky-does-stack",cloneClass:"bcc-sticky-clone",cloneHiddenClass:"bcc-sticky-clone-hidden",onStick:a.noop,onUnStick:a.noop,onCreate:a.noop}}(window.jQuery)},{}]},{},[39]);