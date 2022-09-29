require=function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({67:[function(a,b,c){"use strict";var d=a("views/base/page"),e=d.extend({});
//WORKAROUND: DO NOT REMOVE THIS COMMENT. If this line is removed, an error is thrown in the browser
// when localhost:9010/package is loaded. This seems to be a bug in browserify.
b.exports=e},{"views/base/page":57}],63:[function(a,b,c){var d=a("views/base/page"),e=d.extend({});b.exports=e},{"views/base/page":57}],61:[function(a,b,c){"use strict";var d=a("views/base/page"),e=d.extend();b.exports=e},{"views/base/page":57}],57:[function(a,b,c){"use strict";/**
 * This is the top-level page view for this template. All other top-level
 * page views should extend from this one.
 * This view extends from the common top-level page view.
 */
var d=a("app"),e=a("views/base/view"),f=a("components/nav-hamburger/nav-hamburger"),g=a("components/user-profile/user-profile"),h=a("components/header/header"),i=a("components/logout/logout"),j=a("components/my-account/my-account"),k=a("components/search-form/search-form"),l=a("components/tooltips/tooltips"),m=a("libs/breakpoint"),n=a("libs/brokenImages"),o=a("libs/clamp");a("libs/orientationFix"),b.exports=e.extend({el:document.documentElement,initialize:function(){e.prototype.initialize.apply(this,arguments),window.console.log("base page init....");
// Watch for broken images on video-thumb components and replace them,
// both immediately and after XHR requests.
var a=function(){n.watch(this.$(".video-thumb-thumbnail-img"),function(a){a.src="/components/video-thumb/images/defaultThumb.png"})}.bind(this);
// Enable tooltips on desktop, and ensure tooltips are created
// after ajax requests
if(a(),$(document).ajaxComplete(a),m.current.equals(d.consts.breakpoints.DESKTOP)){var b=function(){new l({el:this.$(".has-tip")})}.bind(this);b(),$(document).ajaxComplete(b)}this.subviews.navigation=new f({el:this.$(".nav-hamburger"),button:this.$(".nav-hamburger-browse")}),this.subviews.search=new k({el:this.$(".search-form")}),this.subviews.userProfile=new g({el:this.$(".user-profile-toggle"),menu:this.$(".user-profile-menu"),positionEl:this.subviews.search.$el.find("input")}),this.subviews.headerView=new h,this.subviews.logoutView=new i({el:this.$(".logout-toggle"),menu:this.$(".logout-menu"),positionEl:this.$(".logout-toggle")}),this.subviews.myAccountView=new j({el:this.$(".my-account-toggle"),menu:this.$(".my-account-menu"),positionEl:this.$(".my-account-toggle")}),
// Use a JavaScript-based ellipsis solution on non-webkit browsers for
// video thumbnail titles
-1===this.el.className.indexOf("has-webkit-line-clamp")&&$(".video-thumb-title").each(function(){o(this,2)})}})},{app:"app","components/header/header":17,"components/logout/logout":19,"components/my-account/my-account":20,"components/nav-hamburger/nav-hamburger":21,"components/search-form/search-form":24,"components/tooltips/tooltips":30,"components/user-profile/user-profile":32,"libs/breakpoint":34,"libs/brokenImages":35,"libs/clamp":36,"libs/orientationFix":37,"views/base/view":58}],37:[function(a,b,c){/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT / GPLv2 License.
*/
!function(a){function b(){k.setAttribute("content",n),o=!0}function c(){k.setAttribute("content",m),o=!1}function d(d){j=d.accelerationIncludingGravity,g=Math.abs(j.x),h=Math.abs(j.y),i=Math.abs(j.z),a.orientation&&180!==a.orientation||!(g>7||(i>6&&8>h||8>i&&h>6)&&g>5)?o||b():o&&c()}
// This fix addresses an iOS bug, so return early if the UA claims it's something else.
var e=navigator.userAgent;if(/iPhone|iPad|iPod/.test(navigator.platform)&&/OS [1-5]_[0-9_]* like Mac OS X/i.test(e)&&e.indexOf("AppleWebKit")>-1){var f=a.document;if(f.querySelector){var g,h,i,j,k=f.querySelector("meta[name=viewport]"),l=k&&k.getAttribute("content"),m=l+",maximum-scale=1",n=l+",maximum-scale=10",o=!0;k&&(a.addEventListener("orientationchange",b,!1),a.addEventListener("devicemotion",d,!1))}}}(this)},{}],36:[function(a,b,c){/**
 * TextOverflowClamp.js
 *
 * Updated 2013-05-09 to remove jQuery dependancy.
 * But be careful with webfonts!
 */
"use strict";var d,e,f,g,h,i,j,k,l,m,n=document.createElement.bind(document),o=document.createTextNode.bind(document);e=n("span"),function(a){a.position="absolute",a.whiteSpace="pre",a.visibility="hidden"}(e.style),d=function(a,b){if(a.ownerDocument&&a.ownerDocument===document){for(h=j=0,i=1,m=!1,g=a.clientWidth,f=(a.textContent||a.innerText).replace(/\n/g," ");null!==a.firstChild;)a.removeChild(a.firstChild);a.appendChild(e),f.replace(/ /g,function(c,d){i!==b&&(e.appendChild(o(f.substr(h,d-h))),g<e.clientWidth?(m?(l=f.substr(h,d+1-h),h=d+1):(l=f.substr(h,j-h),h=j),k=n("span"),k.appendChild(o(l)),a.appendChild(k),m=!0,i++):m=!1,j=d+1,e.removeChild(e.firstChild))}),a.removeChild(e),k=n("span"),function(a){a.display="inline-block",a.overflow="hidden",a.textOverflow="ellipsis",a.whiteSpace="nowrap",a.width="100%"}(k.style),k.appendChild(o(f.substr(h))),a.appendChild(k)}},b.exports=d},{}],35:[function(a,b,c){/* jshint laxbreak:true */
"use strict";var d=a("jquery"),e=function(a,b){a.each(function(){setTimeout(function(){this.getAttribute("data-src")||this.complete&&("undefined"==typeof this.naturalWidth||0!==this.naturalWidth)&&"uninitialized"!==this.readyState||b(this)}.bind(this),5e3)}).on("error",function(){b(this)})};b.exports={watch:function(a,b){var c=function(){e(a,b)};"complete"===document.readyState?c():d(window).on("load",c)}}},{jquery:9}],33:[function(a,b,c){"use strict";var d=a("views/base/view"),e=a("jquery");b.exports=d.extend({vplayer:null,updateProgress:!1,endReached:!1,processingProgress:!1,videoid:"0011",
// progressInterval: 3,
// videoCompletionSlack: 5,
endSlack:5,//seconds
initialize:function(){d.prototype.initialize.apply(this,arguments),window.console.log("vplayer:init arguments=",arguments);var a=arguments[0].nologin,b=!a;window.console.log("vplayer:login=",b);var c=e("#_vt_cfg");c&&(this.progressInterval=c.data("intv"),this.videoCompletionSlack=c.data("slack")),window.console.log("Interval="+this.progressInterval+",Slack="+this.videoCompletionSlack);var f=window.bootstrap.previewTime,g=document.getElementsByClassName("preview-screen")[0],h=document.getElementsByClassName("watermark")[0],i=document.getElementById("unauthorized"),j=document.getElementsByClassName("video-player")[0],k=e("#_vt_aurz"),l=k.data("free"),m=k.data("aurz");window.console.log("vplayer:isFree=%s,isAurzed=%s",l,m),window.console.log("vplayer:previewScreen elm=",g),window.console.log("vplayer:unauthorized elm=",i),this.vplayer=videojs("preview-player");var n=this;g?(window.console.log("vplayer:has previewScreen..."),this.vplayer.ready(function(){var a=this;a.on("loadedmetadata",function(){e(h).show(),a.el().appendChild(h),a.on("timeupdate",function(){a.currentTime()>=f&&(a.el().contains(h)&&a.el().removeChild(h),a.pause(),a.controls(!1),b&&(e(g).show(),a.el().appendChild(g)))})})})):null!==i?(window.console.log("vplayer:unauthorized..."),this.vplayer.ready(function(){var a=this,b=document.getElementsByClassName("video-player-container")[0];a.on("loadedmetadata",function(){e(h).show(),a.el().appendChild(h),a.on("timeupdate",function(){a.currentTime()>=f&&(a.el().contains(h)&&a.el().removeChild(h),a.pause(),a.controls(!1),j.contains(a.el())&&j.removeChild(b),e(i).show())})})})):(window.console.log("vplayer:free or authorized..."),this.vplayer.ready(function(){// && isAurzd
n.progressInterval&&n._setTracking.apply(n)}))},_setTracking:function(){
//    window.console.log('.......set player for tracking....',this);
var a=this;this.vplayer.on("loadstart",function(){a.videoid=a.vplayer.mediainfo.id,a.endSlack=1e3*(a.vplayer.mediainfo.duration-a.videoCompletionSlack),
//      window.console.log('setTracking:videoid=%s,duration=%d,slack=%d, endSlack=%d',
//        vw.videoid,vw.vplayer.mediainfo.duration, vw.videoCompletionSlack, vw.endSlack);
e.get("/tracking/track",{vid:a.videoid},function(b){
//        window.console.log('setTracking:track from db: %d rst=',rst.length, rst);
1===b.length&&(window.console.log("setTracking:set vplayer timepoint: %d",b[0].timepoint),a.vplayer.currentTime(b[0].timepoint),e("#isFavorite").prop("checked",b[0].favorite),e("#videoTimepoint").val(b[0].timepoint))}).fail(function(){window.console.log("setTracking:failed to get tracking data.")})}),
//    var that = this;
this.vplayer.on("play",function(){a.onStart()}),this.vplayer.on("ended",function(){a.onEnd()}),this.vplayer.on("pause",function(){a.onPause()})},onStart:function(){
//    window.console.log('....onStart....',this);
//player: data-video-id,data-account:741804544001
var a=this,b=0;e("#isFavorite").prop("checked")&&(b=1);({videoid:a.videoid,timepoint:a.vplayer.currentTime(),favorite:b})},trackProgress:function(){
//    window.console.log('....trackProgress....',this);
var a=this;
//    console.log('trackProgress:endReached='+that.endReached+',updateProgress='+that.updateProgress);
if(!a.endReached&&a.updateProgress){if(a.vplayer.currentTime()>=a.endSlack)return void a.onEnd();a.updateProgress=!1,a.processingProgress=!0;// Prevent multiple update progress calls if last one stil processing.
var b=0;e("#isFavorite").prop("checked")&&(b=1);({videoid:a.videoid,timepoint:a.vplayer.currentTime(),favorite:b})}else!a.endReached&&a.processingProgress&&
// Check back in one second to see if last progress check finished.
setTimeout(function(){a.trackProgress()},1e3)},onEnd:function(){
//    window.console.log('....onEnd....');
var a=this;(new Date).getTime();a.endReached=!0},onPause:function(){
//    window.console.log('....onPause....');
this.updateProgress=!1},_show:function(){},_hide:function(){}})},{jquery:9,"views/base/view":58}],32:[function(a,b,c){"use strict";var d=a("app"),e=a("views/base/view"),f=a("libs/breakpoint"),g=a("jquery"),h=a("underscore"),i=d.consts.breakpoints,j=g(window);/**
 * User profile dropdown view
 * @param {jQuery Object} el - button to trigger open/close of the menu
 * @param {jQuery Object} menu - menu to toggle open/closed
 * @param {jQuery Object} positionEl - element to position the menu against on open
 */
b.exports=e.extend({events:{click:"_toggle"},initialize:function(a){e.prototype.initialize.apply(this,arguments),
// Stop here if the element doesn't exist (user is logged out)
this.el&&(this.isHidden=!0,this.$positionEl=a.positionEl,this.$menu=a.menu,this.$menu.on("change","select",this._setLocale),
// Hide when the search form opens (mobile view)
this.listenTo(d.emitter,"search:open",this._hide),
// Close the menu when clicking outside of it
g(document).on("click",function(a){a.target===this.el||g.contains(this.el,a.target)||g.contains(this.$menu[0],a.target)||this._hide()}.bind(this)))},_position:h.throttle(function(){if(f.current.equals(i.MOBILE)||f.current.equals(i.MOBILE_WIDE))return void this.$menu.removeAttr("style");var a=this.$positionEl.offset();a.left=a.left-this.$menu.outerWidth()+this.$positionEl.outerWidth(),a.top+=55,this.$menu.offset(a)},10),_toggle:function(a){a.preventDefault(),this[this.isHidden?"_show":"_hide"]()},_show:function(){this.isHidden&&(this.$menu.removeClass("is-hidden"),this.$el.addClass("is-active"),this.isHidden=!1,this._position(),j.on("resize.user-profile",this._position.bind(this)),d.emitter.trigger("user-profile:open"))},_hide:function(){this.isHidden||(this.$menu.addClass("is-hidden"),this.$el.removeClass("is-active"),this.isHidden=!0,j.off(".user-profile"),d.emitter.trigger("user-profile:close"))},_setLocale:function(a){window.location="/"+a.currentTarget.value}})},{app:"app",jquery:9,"libs/breakpoint":34,underscore:10,"views/base/view":58}],30:[function(a,b,c){"use strict";var d=a("views/base/view");a("tipsy"),b.exports=d.extend({initialize:function(){d.prototype.initialize.apply(this,arguments),this.$el.tipsy({gravity:"s",opacity:1})}})},{tipsy:4,"views/base/view":58}],27:[function(a,b,c){"use strict";var d=a("app"),e=a("views/base/view"),f=a("bccdropdown"),g=a("libs/breakpoint");b.exports=e.extend({initialize:function(a){e.prototype.initialize.apply(this,arguments);var b=new f($(this.$el[0])),c=d.consts.breakpoints;g.on("breakpoint:change",function(a){(a.equals(c.TABLET)||a.equals(c.DESKTOP))&&b.close()})}})},{app:"app",bccdropdown:2,"libs/breakpoint":34,"views/base/view":58}],24:[function(a,b,c){"use strict";var d=a("app"),e=a("views/base/view"),f=a("libs/breakpoint"),g=a("underscore");b.exports=e.extend({events:{"click .search-form-button":"_toggle","keyup .search-form-field":"_autocomplete"},initialize:function(){e.prototype.initialize.apply(this,arguments),this.$form=this.$(".search-form-form"),this.$input=this.$form.find("input"),this.$autocomplete=this.$(".autocomplete").appendTo(".wrapper"),this.isHidden=!0,
// Stop here if the search box doesn't exist (user is logged out)
this.$input[0]&&(/**
     * The search form has a CSS transition on it that toggles the
     * form visibile via opacity on mobile. When the page loads you
     * see the search form until the CSS kicks in and hides it, but
     * you see the hide happen with the transition. So, to work
     * around the FOUC, the search form is display:none on load, and
     * this line makes it visible to the DOM (even though it's still
     * out of view via opacity).
     */
this.$form.css("display","block"),
// Always show the form on desktop
this.listenTo(d.emitter,"breakpoint:change",function(a){this["desktop"===a?"_show":"_hide"]()}),$(window).on("resize scroll",this._position.bind(this)),document.addEventListener("click",function(){this.$autocomplete.html("")}.bind(this)),
// Close the menu when clicking outside of it
$(document).on("click",function(a){a.target===this.el||$.contains(this.el,a.target)||$.contains(this.$form,a.target)||this._hide()}.bind(this)))},_autocomplete:function(a){var b=this,c=f.current,e=d.consts.breakpoints;
// Don't show autocomplete on mobile
// Don't show autocomplete on mobile
return c.equals(e.MOBILE)||c.equals(e.MOBILE_WIDE)?void 0:(this._xhr&&this._xhr.abort(),this.$input[0].value.length<2?void this.$autocomplete.html(""):void(this._xhr=$.ajax({url:"/autocomplete?q="+encodeURIComponent(this.$input[0].value)}).done(function(a){b.$autocomplete.html(a),b._position()})))},_position:g.throttle(function(){if(this.$input[0].value.length){var a=this.$input.offset();a.top+=45,a.left-=this.$autocomplete.outerWidth()-this.$input.outerWidth(),this.$autocomplete.offset(a)}},10),_toggle:function(a){a.preventDefault(),this[this.isHidden?"_show":"_hide"]()},_show:function(){this.$form.addClass("is-visible"),this.$input.focus(),this.isHidden=!1},_hide:function(){this.$form.removeClass("is-visible"),this.isHidden=!0}})},{app:"app","libs/breakpoint":34,underscore:10,"views/base/view":58}],23:[function(a,b,c){"use strict";var d=a("components/_form/form");a("jquery.payment"),b.exports=d.extend({initialize:function(){d.prototype.initialize.apply(this,arguments),
// cache elements
this.$ccnumber=this.$('input[data-stripe="number"]'),this.$expMonth=this.$('input[data-stripe="exp-month"]'),this.$expYear=this.$('input[data-stripe="exp-year"]'),this.$cvc=this.$('input[data-stripe="cvc"]'),this.$submit=this.$('button[type="submit"]'),this.$useCardOnFile=this.$('input[name="useCardOnFile"]'),
// format the CC number field
this.$ccnumber.payment("formatCardNumber"),
// restrict all inputs to number
this.$('input[type="tel"]').payment("restrictNumeric"),
// Detect credit card type
this.$ccnumber.on("change keyup",this.detectCardType.bind(this)).trigger("change")},detectCardType:function(){var a="visa mastercard discover amex",b=$.payment.cardType(this.$ccnumber.val());this.$el.removeClass(a).addClass(b)},onSubmit:function(a){a.preventDefault(),this.hideErrTarget();var b,c=this.$useCardOnFile.prop("checked")===!0;
// Validate inputs so long as we're not using the card on file
c||($.payment.validateCardCVC(this.$cvc.val())||(b="Invalid CVV number",this.$cvc.focus()),$.payment.validateCardExpiry(this.$expMonth.val(),this.$expYear.val())||(b="Invalid expiration date",this.$expMonth.focus()),$.payment.validateCardNumber(this.$ccnumber.val())||(b="Invalid credit card number",this.$ccnumber.focus())),b?this.showError(b):c?this.el.submit():this.processCard()},processCard:function(){this.$submit.prop("disabled",!0),Stripe.card.createToken(this.$el,function(a,b){if(b.error)return this.showError(b.error.message),void this.$submit.prop("disabled",!1);var c=b.id;this.$el.append($('<input type="hidden" name="stripeToken">').val(c)),this.el.submit()}.bind(this))}})},{"components/_form/form":13,"jquery.payment":8}],21:[function(a,b,c){"use strict";var d=a("views/base/view"),e=a("libs/breakpoint"),f=(a("app"),a("jquery")),g=f(document.body),h=f(document.documentElement),i="webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd",j=d.extend({events:{click:"_click"},_click:function(){this.trigger("click")}}),k=d.extend({events:{"click > div > span":"_toggle"},initialize:function(){d.prototype.initialize.apply(this,arguments),this.hasSubmenu=this.$el.children(".nav-hamburger-sub-menu").length},_toggle:function(a){this.hasSubmenu&&(a.preventDefault(),alert(),this.$el.toggleClass("is-open"))}});/**
 * Main navigation view
 * @param {jQuery Object} el - the .nav-hamburger class
 * @param {jQuery Object} button - the button that should trigger open/close
 */
b.exports=d.extend({events:{"click .nav-hamburger-close":"_closeButtonClick","touchstart .nav-hamburger-menu":"_menuTouchStart","touchmove .nav-hamburger-menu":"_menuTouchMove"},initialize:function(a){d.prototype.initialize.apply(this,arguments),this.$button=a.button,this.$menu=this.$(".nav-hamburger-menu"),
// Create overlay view
this.overlay=new j({el:f(".nav-hamburger-overlay")}),
// Create a navigation item view for each <li>
this.items=this.$(".nav-hamburger-menu-item").map(function(){return new k({el:this})}),
// Close menu when the overlay is clicked on
this.listenTo(this.overlay,"click",this._close),
// Open the menu when the browse button is clicked on
this.$button.on("click",this._toggle.bind(this)),f(".browse-block").is(":visible")?h.removeClass("nav-open"):h.addClass("desktop-nav-closed"),
// Desktop Sidebar Toggle
// Pegues, 2017-09-02
f("html.no-touch .nav-hamburger-close").on("click",function(){f("html").hasClass("nav-open")?f("html").addClass("desktop-nav-closed"):f("html").removeClass("desktop-nav-closed")}),
// Desktop Sidebar Toggle
// Pegues, 2017-09-02
f("html.no-touch .nav-hamburger-browse").on("click",function(){
// if(
// !$('html.no-touch').hasClass('nav-open')
// $('html.no-touch').hasClass('.desktop-nav-closed')
// ){
f("html").addClass("nav-open").removeClass("desktop-nav-closed")}),this.listenTo(e,"breakpoint:change",function(a){f(".browse-block").is(":visible")?h.removeClass("nav-open"):h.addClass("nav-open")}),
// Prevent touchmove unless the menu is open and is currently being scrolled
f(document).on("touchmove.nav",function(a){this._isOpen&&(f.contains(this.$menu[0],a.target)||a.preventDefault())}.bind(this)),
// Avoid the FOUC
this.el.className+=" is-ready"},_toggle:function(a){this[this._isOpen?"_close":"_open"]()},_menuTouchStart:function(a){var b=this.$menu[0];this.allowUp=b.scrollTop>0,this.allowDown=b.scrollTop<b.scrollHeight-b.clientHeight,this.lastY=a.originalEvent.targetTouches[0].pageY},_menuTouchMove:function(a){var b=a.originalEvent.targetTouches[0],c=b.pageY>this.lastY,d=!c;this.lastY=b.pageY,c&&this.allowUp||d&&this.allowDown?a.stopPropagation():a.preventDefault()},_closeButtonClick:function(a){a.preventDefault(),this._close()},_open:function(){this._isOpen=!0,
// The nav-transition applies the CSS3 transition. It's removed
// once the transition has completed so that the nav doesn't
// animate in/out when moving across tablet/desktop breakpoints.
h.addClass("nav-transition nav-open"),
// Immediately preventing overflow on the body prevents the animation
// from occurring in Firefox (v31 at time of writing). Placing this
// in a setTimeout allows the animation to kick off before preventing
// overflow.
setTimeout(function(){document.body.style.overflowX="hidden"},10),g.one(i,function(){h.removeClass("nav-transition")})},_close:function(){this._isOpen=!1,h.addClass("nav-transition"),h.removeClass("nav-open"),g.one(i,function(){h.removeClass("nav-transition"),document.body.style.overflowX="auto"})}})},{app:"app",jquery:9,"libs/breakpoint":34,"views/base/view":58}],20:[function(a,b,c){"use strict";var d=a("app"),e=a("views/base/view"),f=a("libs/breakpoint"),g=a("jquery"),h=a("underscore"),i=d.consts.breakpoints,j=g(window);/**
 * User profile dropdown view
 * @param {jQuery Object} el - button to trigger open/close of the menu
 * @param {jQuery Object} menu - menu to toggle open/closed
 * @param {jQuery Object} positionEl - element to position the menu against on open
 */
b.exports=e.extend({events:{click:"_toggle"},initialize:function(a){e.prototype.initialize.apply(this,arguments),
// Stop here if the element doesn't exist
this.el&&(this.isHidden=!0,window.console.log("my account: init: opts=",a),this.el=a.el,this.$positionEl=a.positionEl,this.$menu=a.menu,
// Close the menu when clicking outside of it
g(document).on("click",function(a){window.console.log("my account: click: target=",a.target);var b=g(a.target);this.isHidden||b.is(this.el)||g.contains(this.el.get(0),a.target)||g.contains(this.$menu.get(0),a.target)||this._hide()}.bind(this)))},_position:h.throttle(function(){if(f.current.equals(i.MOBILE)||f.current.equals(i.MOBILE_WIDE))return void this.$menu.removeAttr("style");var a=this.$positionEl.offset();window.console.log("_position: el outerWidth=%s",g(this.el).outerWidth()),window.console.log("_position: menu outerWidth=%s",this.$menu.outerWidth()),
//    this.$menu.outerWidth($(this.el).outerWidth());
a.left=a.left-this.$menu.outerWidth()+this.$positionEl.outerWidth(),a.top+=55,this.$menu.offset(a)},10),_toggle:function(a){a.preventDefault(),this[this.isHidden?"_show":"_hide"]()},_show:function(){window.console.log(" my account:_show: isHidden=",this.isHidden),this.isHidden&&(this.$menu.removeClass("is-hidden"),this.$el.addClass("is-active"),this.isHidden=!1,this._position(),j.on("resize.my-account",this._position.bind(this)),d.emitter.trigger("my-account:open"))},_hide:function(){window.console.log(" my account:_hide: isHidden=",this.isHidden),this.isHidden||(this.$menu.addClass("is-hidden"),this.$el.removeClass("is-active"),this.isHidden=!0,j.off(".my-account"),d.emitter.trigger("my-account:close"))}})},{app:"app",jquery:9,"libs/breakpoint":34,underscore:10,"views/base/view":58}],19:[function(a,b,c){"use strict";var d=a("app"),e=a("views/base/view"),f=a("libs/breakpoint"),g=a("jquery"),h=a("underscore"),i=d.consts.breakpoints,j=g(window);/**
 * User profile dropdown view
 * @param {jQuery Object} el - button to trigger open/close of the menu
 * @param {jQuery Object} menu - menu to toggle open/closed
 * @param {jQuery Object} positionEl - element to position the menu against on open
 */
b.exports=e.extend({events:{click:"_toggle"},initialize:function(a){e.prototype.initialize.apply(this,arguments),
// Stop here if the element doesn't exist
this.el&&(this.isHidden=!0,window.console.log("logout: init: opts=",a),this.el=a.el,this.$positionEl=a.positionEl,this.$menu=a.menu,
// Close the menu when clicking outside of it
g(document).on("click",function(a){window.console.log("logout: click: target=",a.target),
// window.console.log('logout: click: el=',this.el);
// window.console.log('logout: click: isHidden=%s, $menu=',this.isHidden,this.$menu);
this.isHidden||a.target===this.el[0]||g.contains(this.el[0],a.target)||g.contains(this.$menu[0],a.target)||this._hide()}.bind(this)))},_position:h.throttle(function(){if(f.current.equals(i.MOBILE)||f.current.equals(i.MOBILE_WIDE))return void this.$menu.removeAttr("style");var a=this.$positionEl.offset();this.$menu.outerWidth(g(this.el).outerWidth()),a.left=a.left-this.$menu.outerWidth()+this.$positionEl.outerWidth(),a.top+=55,this.$menu.offset(a)},10),_toggle:function(a){a.preventDefault(),this[this.isHidden?"_show":"_hide"]()},_show:function(){window.console.log(" logout:_show: isHidden=",this.isHidden),this.isHidden&&(this.$menu.removeClass("is-hidden"),this.$el.addClass("is-active"),this.isHidden=!1,this._position(),j.on("resize.logout",this._position.bind(this)),d.emitter.trigger("logout:open"))},_hide:function(){window.console.log(" logout:_hide: isHidden=",this.isHidden),this.isHidden||(this.$menu.addClass("is-hidden"),this.$el.removeClass("is-active"),this.isHidden=!0,j.off(".logout"),d.emitter.trigger("logout:close"))}})},{app:"app",jquery:9,"libs/breakpoint":34,underscore:10,"views/base/view":58}],17:[function(a,b,c){"use strict";var d=a("app"),e=a("views/base/view"),f=(a("libs/breakpoint"),a("jquery"));a("underscore"),d.consts.breakpoints,f(window);/**
 * User profile dropdown view
 * @param {jQuery Object} el - button to trigger open/close of the menu
 * @param {jQuery Object} menu - menu to toggle open/closed
 * @param {jQuery Object} positionEl - element to position the menu against on open
 */
b.exports=e.extend({events:{click:"_toggle"},initialize:function(){e.prototype.initialize.apply(this,arguments),f(document).on("click",".ascdsiteslist > .menu-toggle",function(a){a.preventDefault(),f(this).parent().hasClass("active")?(f(this).parent().removeClass("active"),f(this).next("ul").animate({right:"-425px",opacity:0},250)):(f(this).parent().addClass("active"),f(this).next("ul").animate({right:"25px",opacity:1},250))})},_setLocale:function(a){window.location="/"+a.currentTarget.value}})},{app:"app",jquery:9,"libs/breakpoint":34,underscore:10,"views/base/view":58}],16:[function(a,b,c){"use strict";/**
 * This is the default, standard carousel component used throughout the site.
 */
var d=a("components/_carousel/carousel"),e=a("app"),f=a("underscore"),g=e.consts.breakpoints;b.exports=d.extend({defaults:f.extend({},d.prototype.defaults,{paginationStyle:"nOfn",lazyLoadImages:!0,breakpoints:[{// mobile
minWidth:g.MOBILE.minWidth,maxWidth:g.MOBILE.maxWidth,perPage:1.5,moveBy:1.5,scroll:"overflow"},{// mobile wide
minWidth:g.MOBILE_WIDE.minWidth,maxWidth:g.MOBILE_WIDE.maxWidth,perPage:2,moveBy:2},{// tablet
minWidth:g.TABLET.minWidth,maxWidth:g.TABLET.maxWidth,perPage:2,moveBy:2},{// desktop
minWidth:g.DESKTOP.minWidth,perPage:3,moveBy:3}]})})},{app:"app","components/_carousel/carousel":11,underscore:10}],13:[function(a,b,c){/**
 * Form view - create a new one of these for your form if you want
 * to take advantage of HTML5 form validation
 */
"use strict";var d=a("views/base/view");b.exports=d.extend({events:{submit:"onSubmit","click .form-editable-toggle":"toggleEdit"},initialize:function(){this.editing=!1,this.$errTarget=this.$(".form-err-target"),this.$el.hasClass("is-editing")&&this.toggleEdit(!0),
// If the form collapses hide the error target
this.listenTo(this,"form:toggle",function(a){a&&this.hideErrTarget()})},toggleEdit:function(a){var b=!this.editing;"boolean"==typeof a&&(b=a),$.isPlainObject(a)&&$(a.currentTarget).is(":checkbox")&&(b=!a.currentTarget.checked),this.editing=b,this.$el.toggleClass("is-editing",b),this.trigger("form:toggle",b)},cancelEdit:function(){this.toggleEdit(!1)},hideErrTarget:function(){this.$errTarget.addClass("is-hidden")},showError:function(a){this.$errTarget.text(a),this.$errTarget.removeClass("is-hidden")},onSubmit:function(a){if("checkValidity"in this.el){var b=this.el.checkValidity();this.$el.toggleClass("is-invalid",!b),
// Safari allows form submissions with invalid fields, so
// manually prevent the form from submitting.
b||a.preventDefault()}}})},{"views/base/view":58}],11:[function(a,b,c){/**
 * Base carousel from which all other carousels extend.
 */
var d=(a("jcarousel"),a("app"),a("underscore")),e=a("BCCCarousel"),f=a("views/base/view"),g=(a("libs/breakpoint"),a("./pagination.html"));g=d.template(g),e.prototype._applyWidth=function(a,b){var c=this.$lis.get(),d=this._itemPadding;null==this._itemPadding&&(d=this._itemPadding=parseInt(this.$lis.eq(0).css("padding-right"),10));for(var e=a+d/b.perPage,f=0,g=c.length;g>f;f++){var h=c[f];f<c.length-1?h.style.width=e+"px":(h.style.paddingRight=0,h.style.width=e-d+"px")}b&&"overflow"===b.scroll&&(this.$ul[0].style.width=c.length*e+d+"px")},b.exports=f.extend({defaults:{responsive:!0,paginationEnabled:!0,responsiveThrottle:250,paginationStyle:"default",autoInit:!0,touchScrolling:"swipe",touchScrollingSnap:"page",touchScrollingDelta:100,controls:{enabled:!0,nextBtn:".bcc-carousel-next",prevBtn:".bcc-carousel-prev"},transitions:{transforms:!0,transforms3d:!1,easing:"ease"}},initialize:function(a){f.prototype.initialize.apply(this,arguments),this.options=$.extend(!0,{},this.defaults,a.options||{}),this.options.autoInit&&this._create()},_create:function(){this.carousel=new e(this.$el,this.options),this._bindEvents(),"nOfn"===this.options.paginationStyle&&(this.$pagination=this.$(".bcc-carousel-pagination-nOfn"),this._updatePagination()),this._toggleControlsVisible()},_bindEvents:function(){this.carousel.on("breakpoint:change",function(){this.carousel._itemPadding=null,this.carousel.scrollToIndex(0,!1),this._toggleControlsVisible()}.bind(this)),"nOfn"===this.options.paginationStyle&&this.carousel.on("breakpoint:change scrollend",function(){setTimeout(this._updatePagination.bind(this),10)}.bind(this))},_updatePagination:function(){var a=this.carousel,b=a.getTotalPages();this.$pagination.html(g({currPage:a.getCurrentPage(),numPages:a.getTotalPages()})),this.$pagination.toggleClass("is-hidden",1>=b)},_toggleControlsVisible:function(){var a=this.carousel,b=a.getTotalPages();a.$nextBtn.add(a.$prevBtn).toggleClass("is-hidden",1>=b)}})},{"./pagination.html":12,BCCCarousel:1,app:"app",jcarousel:7,"libs/breakpoint":34,underscore:10,"views/base/view":58}],58:[function(a,b,c){"use strict";/**
 * This is the view from which all other views should extend.
 */
var d=a("backbone");b.exports=d.View.extend({constructor:function(){this.subviews={},d.View.apply(this,arguments)}})},{backbone:5}],12:[function(a,b,c){b.exports="<%= currPage %> of <%= numPages %>\r\n"},{}],app:[function(a,b,c){"use strict";var d={views:{}},e=a("underscore"),f=a("backbone"),g=a("libs/breakpoint");/**
 * Event emitter
 * This is a global emitter so that components within the app can talk
 * to each other without tight coupling.
 */
d.emitter=e.extend({},f.Events),/**
 * Constants
 */
d.consts={
// Configure breakpoints.
// If you change these, change _config.scss
// Changed layout change by 275 to include permanent left nav bar
breakpoints:{MOBILE:new g("mobile",{minWidth:0,maxWidth:767}),MOBILE_WIDE:new g("mobile_wide",{minWidth:400,maxWidth:1042}),TABLET:new g("tablet",{minWidth:1043,maxWidth:1299}),DESKTOP:new g("desktop",{minWidth:1300})}},
// Start listening for breakpoint changes
g.start(),b.exports=d},{backbone:5,"libs/breakpoint":34,underscore:10}],34:[function(a,b,c){"use strict";/**
 * @constructor
 * @param {string} name - readable name for this breakpoint
 * @param {object} opts - object of minWidth and maxWidth properties
 */
function d(a,b){b=b||{},a=a||"",this.name=a.toLowerCase(),this.minWidth=b.minWidth,this.maxWidth=b.maxWidth,this.cssStr=this._toMediaQuery(),d.breakpoints.push(this)}var e=a("backbone"),f=a("underscore"),g=a("jquery");d.prototype={constructor:d,equals:function(a){return a&&this.name===a.name},_toMediaQuery:function(){var a="number"==typeof this.minWidth,b="number"==typeof this.maxWidth,c=[];return a&&c.push("(min-width: #px)".replace("#",this.minWidth)),a&&b&&c.push("and"),b&&c.push("(max-width: #px)".replace("#",this.maxWidth)),c.join(" ")}},
// Enable pub/sub
f.extend(d,e.Events),
// An array of breakpoint object instances
d.breakpoints=[],
// The default breakpoint is an empty point by default
d.current=new d,
// Has listening already started?
d.listening=!1,
// Begin listening for changes
// Call this after all breakpoints are configured
d.start=function(){if(d.listening)throw new Error("Cannot call start on Breakpoint more than once.");var a=function(){for(var a,b=d.breakpoints,c=d.current,e=0;e<b.length;e++){var f=b[e];f.cssStr&&window.matchMedia(f.cssStr).matches&&(a=f)}a&&!a.equals(c)&&(d.current=a,d.trigger("breakpoint:change",a))};g(window).on("resize.breakpoint",a),a(),d.listening=!0},b.exports=d},{backbone:5,jquery:9,underscore:10}],8:[function(a,b,c){(function(c){$=c.$=a("/Users/jeff.keene/Development/StreamingYBTV/node_modules/jquery/dist/jquery.js");(function(a,b,c){
// Generated by CoffeeScript 1.7.1
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z=[].slice,A=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};a=window.jQuery||window.Zepto||window.$,a.payment={},a.payment.fn={},a.fn.payment=function(){var b,c;return c=arguments[0],b=2<=arguments.length?z.call(arguments,1):[],a.payment.fn[c].apply(this,b)},e=/(\d{1,4})/g,a.payment.cards=d=[{type:"visaelectron",pattern:/^4(026|17500|405|508|844|91[37])/,format:e,length:[16],cvcLength:[3],luhn:!0},{type:"maestro",pattern:/^(5(018|0[23]|[68])|6(39|7))/,format:e,length:[12,13,14,15,16,17,18,19],cvcLength:[3],luhn:!0},{type:"forbrugsforeningen",pattern:/^600/,format:e,length:[16],cvcLength:[3],luhn:!0},{type:"dankort",pattern:/^5019/,format:e,length:[16],cvcLength:[3],luhn:!0},{type:"visa",pattern:/^4/,format:e,length:[13,16],cvcLength:[3],luhn:!0},{type:"mastercard",pattern:/^(5[0-5]|2[2-7])/,format:e,length:[16],cvcLength:[3],luhn:!0},{type:"amex",pattern:/^3[47]/,format:/(\d{1,4})(\d{1,6})?(\d{1,5})?/,length:[15],cvcLength:[3,4],luhn:!0},{type:"dinersclub",pattern:/^3[0689]/,format:/(\d{1,4})(\d{1,6})?(\d{1,4})?/,length:[14],cvcLength:[3],luhn:!0},{type:"discover",pattern:/^6([045]|22)/,format:e,length:[16],cvcLength:[3],luhn:!0},{type:"unionpay",pattern:/^(62|88)/,format:e,length:[16,17,18,19],cvcLength:[3],luhn:!1},{type:"jcb",pattern:/^35/,format:e,length:[16],cvcLength:[3],luhn:!0}],b=function(a){var b,c,e;for(a=(a+"").replace(/\D/g,""),c=0,e=d.length;e>c;c++)if(b=d[c],b.pattern.test(a))return b},c=function(a){var b,c,e;for(c=0,e=d.length;e>c;c++)if(b=d[c],b.type===a)return b},o=function(a){var b,c,d,e,f,g;for(d=!0,e=0,c=(a+"").split("").reverse(),f=0,g=c.length;g>f;f++)b=c[f],b=parseInt(b,10),(d=!d)&&(b*=2),b>9&&(b-=9),e+=b;return e%10===0},n=function(a){var b;return null!=a.prop("selectionStart")&&a.prop("selectionStart")!==a.prop("selectionEnd")?!0:null!=("undefined"!=typeof document&&null!==document&&null!=(b=document.selection)?b.createRange:void 0)&&document.selection.createRange().text?!0:!1},x=function(a,b){var c,d,e;try{c=b.prop("selectionStart")}catch(f){d=f,c=null}return e=b.val(),b.val(a),null!==c&&b.is(":focus")?(c===e.length&&(c=a.length),b.prop("selectionStart",c),b.prop("selectionEnd",c)):void 0},s=function(b){return setTimeout(function(){var c,d;return c=a(b.currentTarget),d=c.val(),d=d.replace(/\D/g,""),x(d,c)})},q=function(b){return setTimeout(function(){var c,d;return c=a(b.currentTarget),d=c.val(),d=a.payment.formatCardNumber(d),x(d,c)})},h=function(c){var d,e,f,g,h,i,j;return f=String.fromCharCode(c.which),!/^\d+$/.test(f)||(d=a(c.currentTarget),j=d.val(),e=b(j+f),g=(j.replace(/\D/g,"")+f).length,i=16,e&&(i=e.length[e.length.length-1]),g>=i||null!=d.prop("selectionStart")&&d.prop("selectionStart")!==j.length)?void 0:(h=e&&"amex"===e.type?/^(\d{4}|\d{4}\s\d{6})$/:/(?:^|\s)(\d{4})$/,h.test(j)?(c.preventDefault(),setTimeout(function(){return d.val(j+" "+f)})):h.test(j+f)?(c.preventDefault(),setTimeout(function(){return d.val(j+f+" ")})):void 0)},f=function(b){var c,d;return c=a(b.currentTarget),d=c.val(),8!==b.which||null!=c.prop("selectionStart")&&c.prop("selectionStart")!==d.length?void 0:/\d\s$/.test(d)?(b.preventDefault(),setTimeout(function(){return c.val(d.replace(/\d\s$/,""))})):/\s\d?$/.test(d)?(b.preventDefault(),setTimeout(function(){return c.val(d.replace(/\d$/,""))})):void 0},r=function(b){return setTimeout(function(){var c,d;return c=a(b.currentTarget),d=c.val(),d=a.payment.formatExpiry(d),x(d,c)})},i=function(b){var c,d,e;return d=String.fromCharCode(b.which),/^\d+$/.test(d)?(c=a(b.currentTarget),e=c.val()+d,/^\d$/.test(e)&&"0"!==e&&"1"!==e?(b.preventDefault(),setTimeout(function(){return c.val("0"+e+" / ")})):/^\d\d$/.test(e)?(b.preventDefault(),setTimeout(function(){return c.val(""+e+" / ")})):void 0):void 0},j=function(b){var c,d,e;return d=String.fromCharCode(b.which),/^\d+$/.test(d)?(c=a(b.currentTarget),e=c.val(),/^\d\d$/.test(e)?c.val(""+e+" / "):void 0):void 0},k=function(b){var c,d,e;return e=String.fromCharCode(b.which),"/"===e||" "===e?(c=a(b.currentTarget),d=c.val(),/^\d$/.test(d)&&"0"!==d?c.val("0"+d+" / "):void 0):void 0},g=function(b){var c,d;return c=a(b.currentTarget),d=c.val(),8!==b.which||null!=c.prop("selectionStart")&&c.prop("selectionStart")!==d.length?void 0:/\d\s\/\s$/.test(d)?(b.preventDefault(),setTimeout(function(){return c.val(d.replace(/\d\s\/\s$/,""))})):void 0},p=function(b){return setTimeout(function(){var c,d;return c=a(b.currentTarget),d=c.val(),d=d.replace(/\D/g,"").slice(0,4),x(d,c)})},l=function(b){return 229===b.which?a(b.currentTarget).data("ime",!0):void 0},m=function(b){var c,d;return c=a(b.currentTarget),d=String.fromCharCode(b.which),c.data("ime")===!0?(c.data("ime",!1),c.val(c.val()+d),c.trigger("input")):void 0},w=function(a){var b;return a.metaKey||a.ctrlKey?!0:32===a.which?!1:0===a.which?!0:a.which<33?!0:(b=String.fromCharCode(a.which),!!/[\d\s]/.test(b))},u=function(c){var d,e,f,g;return d=a(c.currentTarget),f=String.fromCharCode(c.which),/^\d+$/.test(f)&&!n(d)?(g=(d.val()+f).replace(/\D/g,""),e=b(g),e?g.length<=e.length[e.length.length-1]:g.length<=16):void 0},v=function(b){var c,d,e;return c=a(b.currentTarget),d=String.fromCharCode(b.which),/^\d+$/.test(d)&&!n(c)?(e=c.val()+d,e=e.replace(/\D/g,""),e.length>6?!1:void 0):void 0},t=function(b){var c,d,e;return c=a(b.currentTarget),d=String.fromCharCode(b.which),/^\d+$/.test(d)&&!n(c)?(e=c.val()+d,e.length<=4):void 0},y=function(b){var c,e,f,g,h;return c=a(b.currentTarget),h=c.val(),g=a.payment.cardType(h)||"unknown",c.hasClass(g)?void 0:(e=function(){var a,b,c;for(c=[],a=0,b=d.length;b>a;a++)f=d[a],c.push(f.type);return c}(),c.removeClass("unknown"),c.removeClass(e.join(" ")),c.addClass(g),c.toggleClass("identified","unknown"!==g),c.trigger("payment.cardType",g))},a.payment.fn.formatCardCVC=function(){return this.on("keydown",l),this.on("keyup",m),this.on("keypress",w),this.on("keypress",t),this.on("paste",p),this.on("change",p),this.on("input",p),this},a.payment.fn.formatCardExpiry=function(){return this.on("keydown",l),this.on("keyup",m),this.on("keypress",w),this.on("keypress",v),this.on("keypress",i),this.on("keypress",k),this.on("keypress",j),this.on("keydown",g),this.on("change",r),this.on("input",r),this},a.payment.fn.formatCardNumber=function(){return this.on("keydown",l),this.on("keyup",m),this.on("keypress",w),this.on("keypress",u),this.on("keypress",h),this.on("keydown",f),this.on("keyup",y),this.on("paste",q),this.on("change",q),this.on("input",q),this.on("input",y),this},a.payment.fn.restrictNumeric=function(){return this.on("keydown",l),this.on("keyup",m),this.on("keypress",w),this.on("paste",s),this.on("change",s),this.on("input",s),this},a.payment.fn.cardExpiryVal=function(){return a.payment.cardExpiryVal(a(this).val())},a.payment.cardExpiryVal=function(a){var b,c,d,e;return e=a.split(/[\s\/]+/,2),b=e[0],d=e[1],2===(null!=d?d.length:void 0)&&/^\d+$/.test(d)&&(c=(new Date).getFullYear(),c=c.toString().slice(0,2),d=c+d),b=parseInt(b,10),d=parseInt(d,10),{month:b,year:d}},a.payment.validateCardNumber=function(a){var c,d;return a=(a+"").replace(/\s+|-/g,""),/^\d+$/.test(a)?(c=b(a),c?(d=a.length,A.call(c.length,d)>=0&&(c.luhn===!1||o(a))):!1):!1},a.payment.validateCardExpiry=function(b,c){var d,e,f;return"object"==typeof b&&"month"in b&&(f=b,b=f.month,c=f.year),b&&c?(b=a.trim(b),c=a.trim(c),/^\d+$/.test(b)&&/^\d+$/.test(c)&&b>=1&&12>=b?(2===c.length&&(c=70>c?"20"+c:"19"+c),4!==c.length?!1:(e=new Date(c,b),d=new Date,e.setMonth(e.getMonth()-1),e.setMonth(e.getMonth()+1,1),e>d)):!1):!1},a.payment.validateCardCVC=function(b,d){var e,f;return b=a.trim(b),/^\d+$/.test(b)?(e=c(d),null!=e?(f=b.length,A.call(e.cvcLength,f)>=0):b.length>=3&&b.length<=4):!1},a.payment.cardType=function(a){var c;return a?(null!=(c=b(a))?c.type:void 0)||null:null},a.payment.formatCardNumber=function(c){var d,e,f,g;return c=c.replace(/\D/g,""),(d=b(c))?(f=d.length[d.length.length-1],c=c.slice(0,f),d.format.global?null!=(g=c.match(d.format))?g.join(" "):void 0:(e=d.format.exec(c),null!=e?(e.shift(),e=a.grep(e,function(a){return a}),e.join(" ")):void 0)):c},a.payment.formatExpiry=function(a){var b,c,d,e;return(c=a.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/))?(b=c[1]||"",d=c[2]||"",e=c[3]||"",e.length>0?d=" / ":" /"===d?(b=b.substring(0,1),d=""):2===b.length||d.length>0?d=" / ":1===b.length&&"0"!==b&&"1"!==b&&(b="0"+b,d=" / "),b+d+e):""}}).call(this)}).call(c,b,void 0,void 0)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"/Users/jeff.keene/Development/StreamingYBTV/node_modules/jquery/dist/jquery.js":9}],7:[function(a,b,c){/*! jCarousel - v0.3.4 - 2015-09-23
* http://sorgalla.com/jcarousel/
* Copyright (c) 2006-2015 Jan Sorgalla; Licensed MIT */
!function(a){"use strict";var b=a.jCarousel={};b.version="0.3.4";var c=/^([+\-]=)?(.+)$/;b.parseTarget=function(a){var b=!1,d="object"!=typeof a?c.exec(a):null;return d?(a=parseInt(d[2],10)||0,d[1]&&(b=!0,"-="===d[1]&&(a*=-1))):"object"!=typeof a&&(a=parseInt(a,10)||0),{target:a,relative:b}},b.detectCarousel=function(a){for(var b;a.length>0;){if(b=a.filter("[data-jcarousel]"),b.length>0)return b;if(b=a.find("[data-jcarousel]"),b.length>0)return b;a=a.parent()}return null},b.base=function(c){return{version:b.version,_options:{},_element:null,_carousel:null,_init:a.noop,_create:a.noop,_destroy:a.noop,_reload:a.noop,create:function(){return this._element.attr("data-"+c.toLowerCase(),!0).data(c,this),!1===this._trigger("create")?this:(this._create(),this._trigger("createend"),this)},destroy:function(){return!1===this._trigger("destroy")?this:(this._destroy(),this._trigger("destroyend"),this._element.removeData(c).removeAttr("data-"+c.toLowerCase()),this)},reload:function(a){return!1===this._trigger("reload")?this:(a&&this.options(a),this._reload(),this._trigger("reloadend"),this)},element:function(){return this._element},options:function(b,c){if(0===arguments.length)return a.extend({},this._options);if("string"==typeof b){if("undefined"==typeof c)return"undefined"==typeof this._options[b]?null:this._options[b];this._options[b]=c}else this._options=a.extend({},this._options,b);return this},carousel:function(){return this._carousel||(this._carousel=b.detectCarousel(this.options("carousel")||this._element),this._carousel||a.error('Could not detect carousel for plugin "'+c+'"')),this._carousel},_trigger:function(b,d,e){var f,g=!1;return e=[this].concat(e||[]),(d||this._element).each(function(){f=a.Event((c+":"+b).toLowerCase()),a(this).trigger(f,e),f.isDefaultPrevented()&&(g=!0)}),!g}}},b.plugin=function(c,d){var e=a[c]=function(b,c){this._element=a(b),this.options(c),this._init(),this.create()};return e.fn=e.prototype=a.extend({},b.base(c),d),a.fn[c]=function(b){var d=Array.prototype.slice.call(arguments,1),f=this;return"string"==typeof b?this.each(function(){var e=a(this).data(c);if(!e)return a.error("Cannot call methods on "+c+' prior to initialization; attempted to call method "'+b+'"');if(!a.isFunction(e[b])||"_"===b.charAt(0))return a.error('No such method "'+b+'" for '+c+" instance");var g=e[b].apply(e,d);return g!==e&&"undefined"!=typeof g?(f=g,!1):void 0}):this.each(function(){var d=a(this).data(c);d instanceof e?d.reload(b):new e(this,b)}),f},e}}(jQuery),function(a,b){"use strict";var c=function(a){return parseFloat(a)||0};a.jCarousel.plugin("jcarousel",{animating:!1,tail:0,inTail:!1,resizeTimer:null,lt:null,vertical:!1,rtl:!1,circular:!1,underflow:!1,relative:!1,_options:{list:function(){return this.element().children().eq(0)},items:function(){return this.list().children()},animation:400,transitions:!1,wrap:null,vertical:null,rtl:null,center:!1},
// Protected, don't access directly
_list:null,_items:null,_target:a(),_first:a(),_last:a(),_visible:a(),_fullyvisible:a(),_init:function(){var a=this;return this.onWindowResize=function(){a.resizeTimer&&clearTimeout(a.resizeTimer),a.resizeTimer=setTimeout(function(){a.reload()},100)},this},_create:function(){this._reload(),a(b).on("resize.jcarousel",this.onWindowResize)},_destroy:function(){a(b).off("resize.jcarousel",this.onWindowResize)},_reload:function(){this.vertical=this.options("vertical"),null==this.vertical&&(this.vertical=this.list().height()>this.list().width()),this.rtl=this.options("rtl"),null==this.rtl&&(this.rtl=function(b){if("rtl"===(""+b.attr("dir")).toLowerCase())return!0;var c=!1;return b.parents("[dir]").each(function(){return/rtl/i.test(a(this).attr("dir"))?(c=!0,!1):void 0}),c}(this._element)),this.lt=this.vertical?"top":"left",
// Ensure before closest() call
this.relative="relative"===this.list().css("position"),
// Force list and items reload
this._list=null,this._items=null;var b=this.index(this._target)>=0?this._target:this.closest();
// _prepare() needs this here
this.circular="circular"===this.options("wrap"),this.underflow=!1;var c={left:0,top:0};
// Force items reload
return b.length>0&&(this._prepare(b),this.list().find("[data-jcarousel-clone]").remove(),this._items=null,this.underflow=this._fullyvisible.length>=this.items().length,this.circular=this.circular&&!this.underflow,c[this.lt]=this._position(b)+"px"),this.move(c),this},list:function(){if(null===this._list){var b=this.options("list");this._list=a.isFunction(b)?b.call(this):this._element.find(b)}return this._list},items:function(){if(null===this._items){var b=this.options("items");this._items=(a.isFunction(b)?b.call(this):this.list().find(b)).not("[data-jcarousel-clone]")}return this._items},index:function(a){return this.items().index(a)},closest:function(){var b,d=this,e=this.list().position()[this.lt],f=a(),// Ensure we're returning a jQuery instance
g=!1,h=this.vertical?"bottom":this.rtl&&!this.relative?"left":"right";return this.rtl&&this.relative&&!this.vertical&&(e+=this.list().width()-this.clipping()),this.items().each(function(){if(f=a(this),g)return!1;var i=d.dimension(f);if(e+=i,e>=0){if(b=i-c(f.css("margin-"+h)),!(Math.abs(e)-i+b/2<=0))return!1;g=!0}}),f},target:function(){return this._target},first:function(){return this._first},last:function(){return this._last},visible:function(){return this._visible},fullyvisible:function(){return this._fullyvisible},hasNext:function(){if(!1===this._trigger("hasnext"))return!0;var a=this.options("wrap"),b=this.items().length-1,c=this.options("center")?this._target:this._last;return b>=0&&!this.underflow&&(a&&"first"!==a||this.index(c)<b||this.tail&&!this.inTail)?!0:!1},hasPrev:function(){if(!1===this._trigger("hasprev"))return!0;var a=this.options("wrap");return this.items().length>0&&!this.underflow&&(a&&"last"!==a||this.index(this._first)>0||this.tail&&this.inTail)?!0:!1},clipping:function(){return this._element["inner"+(this.vertical?"Height":"Width")]()},dimension:function(a){return a["outer"+(this.vertical?"Height":"Width")](!0)},scroll:function(b,c,d){if(this.animating)return this;if(!1===this._trigger("scroll",null,[b,c]))return this;a.isFunction(c)&&(d=c,c=!0);var e=a.jCarousel.parseTarget(b);if(e.relative){var f,g,h,i,j,k,l,m,n=this.items().length-1,o=Math.abs(e.target),p=this.options("wrap");if(e.target>0){var q=this.index(this._last);if(q>=n&&this.tail)this.inTail?"both"===p||"last"===p?this._scroll(0,c,d):a.isFunction(d)&&d.call(this,!1):this._scrollTail(c,d);else if(f=this.index(this._target),this.underflow&&f===n&&("circular"===p||"both"===p||"last"===p)||!this.underflow&&q===n&&("both"===p||"last"===p))this._scroll(0,c,d);else if(h=f+o,this.circular&&h>n){for(m=n,j=this.items().get(-1);m++<h;)j=this.items().eq(0),k=this._visible.index(j)>=0,k&&j.after(j.clone(!0).attr("data-jcarousel-clone",!0)),this.list().append(j),k||(l={},l[this.lt]=this.dimension(j),this.moveBy(l)),this._items=null;this._scroll(j,c,d)}else this._scroll(Math.min(h,n),c,d)}else if(this.inTail)this._scroll(Math.max(this.index(this._first)-o+1,0),c,d);else if(g=this.index(this._first),f=this.index(this._target),i=this.underflow?f:g,h=i-o,0>=i&&(this.underflow&&"circular"===p||"both"===p||"first"===p))this._scroll(n,c,d);else if(this.circular&&0>h){for(m=h,j=this.items().get(0);m++<0;){j=this.items().eq(-1),k=this._visible.index(j)>=0,k&&j.after(j.clone(!0).attr("data-jcarousel-clone",!0)),this.list().prepend(j),
// Force items reload
this._items=null;var r=this.dimension(j);l={},l[this.lt]=-r,this.moveBy(l)}this._scroll(j,c,d)}else this._scroll(Math.max(h,0),c,d)}else this._scroll(e.target,c,d);return this._trigger("scrollend"),this},moveBy:function(a,b){var d=this.list().position(),e=1,f=0;return this.rtl&&!this.vertical&&(e=-1,this.relative&&(f=this.list().width()-this.clipping())),a.left&&(a.left=d.left+f+c(a.left)*e+"px"),a.top&&(a.top=d.top+f+c(a.top)*e+"px"),this.move(a,b)},move:function(b,c){c=c||{};var d=this.options("transitions"),e=!!d,f=!!d.transforms,g=!!d.transforms3d,h=c.duration||0,i=this.list();if(!e&&h>0)return void i.animate(b,c);var j=c.complete||a.noop,k={};if(e){var l={transitionDuration:i.css("transitionDuration"),transitionTimingFunction:i.css("transitionTimingFunction"),transitionProperty:i.css("transitionProperty")},m=j;j=function(){a(this).css(l),m.call(this)},k={transitionDuration:(h>0?h/1e3:0)+"s",transitionTimingFunction:d.easing||c.easing,transitionProperty:h>0?function(){return f||g?"all":b.left?"left":"top"}():"none",transform:"none"}}g?k.transform="translate3d("+(b.left||0)+","+(b.top||0)+",0)":f?k.transform="translate("+(b.left||0)+","+(b.top||0)+")":a.extend(k,b),e&&h>0&&i.one("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd",j),i.css(k),0>=h&&i.each(function(){j.call(this)})},_scroll:function(b,c,d){if(this.animating)return a.isFunction(d)&&d.call(this,!1),this;if("object"!=typeof b?b=this.items().eq(b):"undefined"==typeof b.jquery&&(b=a(b)),0===b.length)return a.isFunction(d)&&d.call(this,!1),this;this.inTail=!1,this._prepare(b);var e=this._position(b),f=this.list().position()[this.lt];if(e===f)return a.isFunction(d)&&d.call(this,!1),this;var g={};return g[this.lt]=e+"px",this._animate(g,c,d),this},_scrollTail:function(b,c){if(this.animating||!this.tail)return a.isFunction(c)&&c.call(this,!1),this;var d=this.list().position()[this.lt];this.rtl&&this.relative&&!this.vertical&&(d+=this.list().width()-this.clipping()),this.rtl&&!this.vertical?d+=this.tail:d-=this.tail,this.inTail=!0;var e={};return e[this.lt]=d+"px",this._update({target:this._target.next(),fullyvisible:this._fullyvisible.slice(1).add(this._visible.last())}),this._animate(e,b,c),this},_animate:function(b,c,d){if(d=d||a.noop,!1===this._trigger("animate"))return d.call(this,!1),this;this.animating=!0;var e=this.options("animation"),f=a.proxy(function(){this.animating=!1;var a=this.list().find("[data-jcarousel-clone]");a.length>0&&(a.remove(),this._reload()),this._trigger("animateend"),d.call(this,!0)},this),g="object"==typeof e?a.extend({},e):{duration:e},h=g.complete||a.noop;return c===!1?g.duration=0:"undefined"!=typeof a.fx.speeds[g.duration]&&(g.duration=a.fx.speeds[g.duration]),g.complete=function(){f(),h.call(this)},this.move(b,g),this},_prepare:function(b){var d,e,f,g,h=this.index(b),i=h,j=this.dimension(b),k=this.clipping(),l=this.vertical?"bottom":this.rtl?"left":"right",m=this.options("center"),n={target:b,first:b,last:b,visible:b,fullyvisible:k>=j?b:a()};if(m&&(j/=2,k/=2),k>j)for(;;){if(d=this.items().eq(++i),0===d.length){if(!this.circular)break;if(d=this.items().eq(0),b.get(0)===d.get(0))break;if(e=this._visible.index(d)>=0,e&&d.after(d.clone(!0).attr("data-jcarousel-clone",!0)),this.list().append(d),!e){var o={};o[this.lt]=this.dimension(d),this.moveBy(o)}
// Force items reload
this._items=null}if(g=this.dimension(d),0===g)break;if(j+=g,n.last=d,n.visible=n.visible.add(d),f=c(d.css("margin-"+l)),k>=j-f&&(n.fullyvisible=n.fullyvisible.add(d)),j>=k)break}if(!this.circular&&!m&&k>j)for(i=h;;){if(--i<0)break;if(d=this.items().eq(i),0===d.length)break;if(g=this.dimension(d),0===g)break;if(j+=g,n.first=d,n.visible=n.visible.add(d),f=c(d.css("margin-"+l)),k>=j-f&&(n.fullyvisible=n.fullyvisible.add(d)),j>=k)break}
// Remove right/bottom margin from total width
return this._update(n),this.tail=0,m||"circular"===this.options("wrap")||"custom"===this.options("wrap")||this.index(n.last)!==this.items().length-1||(j-=c(n.last.css("margin-"+l)),j>k&&(this.tail=j-k)),this},_position:function(a){var b=this._first,c=b.position()[this.lt],d=this.options("center"),e=d?this.clipping()/2-this.dimension(b)/2:0;return this.rtl&&!this.vertical?(c-=this.relative?this.list().width()-this.dimension(b):this.clipping()-this.dimension(b),c+=e):c-=e,!d&&(this.index(a)>this.index(b)||this.inTail)&&this.tail?(c=this.rtl&&!this.vertical?c-this.tail:c+this.tail,this.inTail=!0):this.inTail=!1,-c},_update:function(b){var c,d=this,e={target:this._target,first:this._first,last:this._last,visible:this._visible,fullyvisible:this._fullyvisible},f=this.index(b.first||e.first)<this.index(e.first),g=function(c){var g=[],h=[];b[c].each(function(){e[c].index(this)<0&&g.push(this)}),e[c].each(function(){b[c].index(this)<0&&h.push(this)}),f?g=g.reverse():h=h.reverse(),d._trigger(c+"in",a(g)),d._trigger(c+"out",a(h)),d["_"+c]=b[c]};for(c in b)g(c);return this}})}(jQuery,window),function(a){"use strict";a.jcarousel.fn.scrollIntoView=function(b,c,d){var e,f=a.jCarousel.parseTarget(b),g=this.index(this._fullyvisible.first()),h=this.index(this._fullyvisible.last());if(e=f.relative?f.target<0?Math.max(0,g+f.target):h+f.target:"object"!=typeof f.target?f.target:this.index(f.target),g>e)return this.scroll(e,c,d);if(e>=g&&h>=e)return a.isFunction(d)&&d.call(this,!1),this;for(var i,j=this.items(),k=this.clipping(),l=this.vertical?"bottom":this.rtl?"left":"right",m=0;;){if(i=j.eq(e),0===i.length)break;if(m+=this.dimension(i),m>=k){var n=parseFloat(i.css("margin-"+l))||0;m-n!==k&&e++;break}if(0>=e)break;e--}return this.scroll(e,c,d)}}(jQuery),function(a){"use strict";a.jCarousel.plugin("jcarouselControl",{_options:{target:"+=1",event:"click",method:"scroll"},_active:null,_init:function(){this.onDestroy=a.proxy(function(){this._destroy(),this.carousel().one("jcarousel:createend",a.proxy(this._create,this))},this),this.onReload=a.proxy(this._reload,this),this.onEvent=a.proxy(function(b){b.preventDefault();var c=this.options("method");a.isFunction(c)?c.call(this):this.carousel().jcarousel(this.options("method"),this.options("target"))},this)},_create:function(){this.carousel().one("jcarousel:destroy",this.onDestroy).on("jcarousel:reloadend jcarousel:scrollend",this.onReload),this._element.on(this.options("event")+".jcarouselcontrol",this.onEvent),this._reload()},_destroy:function(){this._element.off(".jcarouselcontrol",this.onEvent),this.carousel().off("jcarousel:destroy",this.onDestroy).off("jcarousel:reloadend jcarousel:scrollend",this.onReload)},_reload:function(){var b,c=a.jCarousel.parseTarget(this.options("target")),d=this.carousel();if(c.relative)b=d.jcarousel(c.target>0?"hasNext":"hasPrev");else{var e="object"!=typeof c.target?d.jcarousel("items").eq(c.target):c.target;b=d.jcarousel("target").index(e)>=0}return this._active!==b&&(this._trigger(b?"active":"inactive"),this._active=b),this}})}(jQuery),function(a){"use strict";a.jCarousel.plugin("jcarouselPagination",{_options:{perPage:null,item:function(a){return'<a href="#'+a+'">'+a+"</a>"},event:"click",method:"scroll"},_carouselItems:null,_pages:{},_items:{},_currentPage:null,_init:function(){this.onDestroy=a.proxy(function(){this._destroy(),this.carousel().one("jcarousel:createend",a.proxy(this._create,this))},this),this.onReload=a.proxy(this._reload,this),this.onScroll=a.proxy(this._update,this)},_create:function(){this.carousel().one("jcarousel:destroy",this.onDestroy).on("jcarousel:reloadend",this.onReload).on("jcarousel:scrollend",this.onScroll),this._reload()},_destroy:function(){this._clear(),this.carousel().off("jcarousel:destroy",this.onDestroy).off("jcarousel:reloadend",this.onReload).off("jcarousel:scrollend",this.onScroll),this._carouselItems=null},_reload:function(){var b=this.options("perPage");if(this._pages={},this._items={},
// Calculate pages
a.isFunction(b)&&(b=b.call(this)),null==b)this._pages=this._calculatePages();else for(var c,d=parseInt(b,10)||0,e=this._getCarouselItems(),f=1,g=0;;){if(c=e.eq(g++),0===c.length)break;this._pages[f]?this._pages[f]=this._pages[f].add(c):this._pages[f]=c,g%d===0&&f++}this._clear();var h=this,i=this.carousel().data("jcarousel"),j=this._element,k=this.options("item"),l=this._getCarouselItems().length;a.each(this._pages,function(b,c){var d=h._items[b]=a(k.call(h,b,c));d.on(h.options("event")+".jcarouselpagination",a.proxy(function(){var a=c.eq(0);
// If circular wrapping enabled, ensure correct scrolling direction
if(i.circular){var d=i.index(i.target()),e=i.index(a);parseFloat(b)>parseFloat(h._currentPage)?d>e&&(a="+="+(l-d+e)):e>d&&(a="-="+(d+(l-e)))}i[this.options("method")](a)},h)),j.append(d)}),this._update()},_update:function(){var b,c=this.carousel().jcarousel("target");a.each(this._pages,function(a,d){return d.each(function(){return c.is(this)?(b=a,!1):void 0}),b?!1:void 0}),this._currentPage!==b&&(this._trigger("inactive",this._items[this._currentPage]),this._trigger("active",this._items[b])),this._currentPage=b},items:function(){return this._items},reloadCarouselItems:function(){return this._carouselItems=null,this},_clear:function(){this._element.empty(),this._currentPage=null},_calculatePages:function(){for(var a,b,c=this.carousel().data("jcarousel"),d=this._getCarouselItems(),e=c.clipping(),f=0,g=0,h=1,i={};;){if(a=d.eq(g++),0===a.length)break;b=c.dimension(a),f+b>e&&(h++,f=0),f+=b,i[h]?i[h]=i[h].add(a):i[h]=a}return i},_getCarouselItems:function(){return this._carouselItems||(this._carouselItems=this.carousel().jcarousel("items")),this._carouselItems}})}(jQuery),function(a,b){"use strict";var c,d,e={hidden:"visibilitychange",mozHidden:"mozvisibilitychange",msHidden:"msvisibilitychange",webkitHidden:"webkitvisibilitychange"};a.each(e,function(a,e){return"undefined"!=typeof b[a]?(c=a,d=e,!1):void 0}),a.jCarousel.plugin("jcarouselAutoscroll",{_options:{target:"+=1",interval:3e3,autostart:!0},_timer:null,_started:!1,_init:function(){this.onDestroy=a.proxy(function(){this._destroy(),this.carousel().one("jcarousel:createend",a.proxy(this._create,this))},this),this.onAnimateEnd=a.proxy(this._start,this),this.onVisibilityChange=a.proxy(function(){b[c]?this._stop():this._start()},this)},_create:function(){this.carousel().one("jcarousel:destroy",this.onDestroy),a(b).on(d,this.onVisibilityChange),this.options("autostart")&&this.start()},_destroy:function(){this._stop(),this.carousel().off("jcarousel:destroy",this.onDestroy),a(b).off(d,this.onVisibilityChange)},_start:function(){return this._stop(),this._started?(this.carousel().one("jcarousel:animateend",this.onAnimateEnd),this._timer=setTimeout(a.proxy(function(){this.carousel().jcarousel("scroll",this.options("target"))},this),this.options("interval")),this):void 0},_stop:function(){return this._timer&&(this._timer=clearTimeout(this._timer)),this.carousel().off("jcarousel:animateend",this.onAnimateEnd),this},start:function(){return this._started=!0,this._start(),this},stop:function(){return this._started=!1,this._stop(),this}})}(jQuery,document)},{}],5:[function(a,b,c){(function(b){
//     Backbone.js 1.2.1
//     (c) 2010-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org
!function(d){
// Establish the root object, `window` (`self`) in the browser, or `global` on the server.
// We use `self` instead of `window` for `WebWorker` support.
var e="object"==typeof self&&self.self==self&&self||"object"==typeof b&&b.global==b&&b;
// Set up Backbone appropriately for the environment. Start with AMD.
if("function"==typeof define&&define.amd)define(["underscore","jquery","exports"],function(a,b,c){
// Export global even in AMD case in case this script is loaded with
// others that may still expect a global Backbone.
e.Backbone=d(e,c,a,b)});else if("undefined"!=typeof c){var f,g=a("underscore");try{f=a("jquery")}catch(h){}d(e,c,g,f)}else e.Backbone=d(e,{},e._,e.jQuery||e.Zepto||e.ender||e.$)}(function(a,b,c,d){
// Initial Setup
// -------------
// Save the previous value of the `Backbone` variable, so that it can be
// restored later on, if `noConflict` is used.
var e=a.Backbone,f=[].slice;
// Current version of the library. Keep in sync with `package.json`.
b.VERSION="1.2.1",
// For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
// the `$` variable.
b.$=d,
// Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
// to its previous owner. Returns a reference to this Backbone object.
b.noConflict=function(){return a.Backbone=e,this},
// Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
// will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
// set a `X-Http-Method-Override` header.
b.emulateHTTP=!1,
// Turn on `emulateJSON` to support legacy servers that can't deal with direct
// `application/json` requests ... this will encode the body as
// `application/x-www-form-urlencoded` instead and will send the model in a
// form param named `model`.
b.emulateJSON=!1;
// Proxy Underscore methods to a Backbone class' prototype using a
// particular attribute as the data argument
var g=function(a,b,d){switch(a){case 1:return function(){return c[b](this[d])};case 2:return function(a){return c[b](this[d],a)};case 3:return function(a,e){return c[b](this[d],a,e)};case 4:return function(a,e,f){return c[b](this[d],a,e,f)};default:return function(){var a=f.call(arguments);return a.unshift(this[d]),c[b].apply(c,a)}}},h=function(a,b,d){c.each(b,function(b,e){c[e]&&(a.prototype[e]=g(b,e,d))})},i=b.Events={},j=/\s+/,k=function(a,b,d,e,f){var g,h=0;if(d&&"object"==typeof d){
// Handle event maps.
void 0!==e&&"context"in f&&void 0===f.context&&(f.context=e);for(g=c.keys(d);h<g.length;h++)b=a(b,g[h],d[g[h]],f)}else if(d&&j.test(d))
// Handle space separated event names.
for(g=d.split(j);h<g.length;h++)b=a(b,g[h],e,f);else b=a(b,d,e,f);return b};
// Bind an event to a `callback` function. Passing `"all"` will bind
// the callback to all events fired.
i.on=function(a,b,c){return l(this,a,b,c)};
// An internal use `on` function, used to guard the `listening` argument from
// the public API.
var l=function(a,b,c,d,e){if(a._events=k(m,a._events||{},b,c,{context:d,ctx:a,listening:e}),e){var f=a._listeners||(a._listeners={});f[e.id]=e}return a};
// Inversion-of-control versions of `on`. Tell *this* object to listen to
// an event in another object... keeping track of what it's listening to.
i.listenTo=function(a,b,d){if(!a)return this;var e=a._listenId||(a._listenId=c.uniqueId("l")),f=this._listeningTo||(this._listeningTo={}),g=f[e];
// This object is not listening to any other events on `obj` yet.
// Setup the necessary references to track the listening callbacks.
if(!g){var h=this._listenId||(this._listenId=c.uniqueId("l"));g=f[e]={obj:a,objId:e,id:h,listeningTo:f,count:0}}
// Bind callbacks on obj, and keep track of them on listening.
return l(a,b,d,this,g),this};
// The reducing API that adds a callback to the `events` object.
var m=function(a,b,c,d){if(c){var e=a[b]||(a[b]=[]),f=d.context,g=d.ctx,h=d.listening;h&&h.count++,e.push({callback:c,context:f,ctx:f||g,listening:h})}return a};
// Remove one or many callbacks. If `context` is null, removes all
// callbacks with that function. If `callback` is null, removes all
// callbacks for the event. If `name` is null, removes all bound
// callbacks for all events.
i.off=function(a,b,c){return this._events?(this._events=k(n,this._events,a,b,{context:c,listeners:this._listeners}),this):this},
// Tell this object to stop listening to either specific events ... or
// to every object it's currently listening to.
i.stopListening=function(a,b,d){var e=this._listeningTo;if(!e)return this;for(var f=a?[a._listenId]:c.keys(e),g=0;g<f.length;g++){var h=e[f[g]];
// If listening doesn't exist, this object is not currently
// listening to obj. Break out early.
if(!h)break;h.obj.off(b,d,this)}return c.isEmpty(e)&&(this._listeningTo=void 0),this};
// The reducing API that removes a callback from the `events` object.
var n=function(a,b,d,e){
// No events to consider.
if(a){var f,g=0,h=e.context,i=e.listeners;
// Delete all events listeners and "drop" events.
if(b||d||h){for(var j=b?[b]:c.keys(a);g<j.length;g++){b=j[g];var k=a[b];
// Bail out if there are no events stored.
if(!k)break;for(var l=[],m=0;m<k.length;m++){var n=k[m];d&&d!==n.callback&&d!==n.callback._callback||h&&h!==n.context?l.push(n):(f=n.listening,f&&0===--f.count&&(delete i[f.id],delete f.listeningTo[f.objId]))}
// Update tail event if the list has any events.  Otherwise, clean up.
l.length?a[b]=l:delete a[b]}return c.size(a)?a:void 0}for(var o=c.keys(i);g<o.length;g++)f=i[o[g]],delete i[f.id],delete f.listeningTo[f.objId]}};
// Bind an event to only be triggered a single time. After the first time
// the callback is invoked, it will be removed. When multiple events are
// passed in using the space-separated syntax, the event will fire once for every
// event you passed in, not once for a combination of all events
i.once=function(a,b,d){
// Map the event into a `{event: once}` object.
var e=k(o,{},a,b,c.bind(this.off,this));return this.on(e,void 0,d)},
// Inversion-of-control versions of `once`.
i.listenToOnce=function(a,b,d){
// Map the event into a `{event: once}` object.
var e=k(o,{},b,d,c.bind(this.stopListening,this,a));return this.listenTo(a,e)};
// Reduces the event callbacks into a map of `{event: onceWrapper}`.
// `offer` unbinds the `onceWrapper` after it has been called.
var o=function(a,b,d,e){if(d){var f=a[b]=c.once(function(){e(b,f),d.apply(this,arguments)});f._callback=d}return a};
// Trigger one or many events, firing all bound callbacks. Callbacks are
// passed the same arguments as `trigger` is, apart from the event name
// (unless you're listening on `"all"`, which will cause your callback to
// receive the true name of the event as the first argument).
i.trigger=function(a){if(!this._events)return this;for(var b=Math.max(0,arguments.length-1),c=Array(b),d=0;b>d;d++)c[d]=arguments[d+1];return k(p,this._events,a,void 0,c),this};
// Handles triggering the appropriate event callbacks.
var p=function(a,b,c,d){if(a){var e=a[b],f=a.all;e&&f&&(f=f.slice()),e&&q(e,d),f&&q(f,[b].concat(d))}return a},q=function(a,b){var c,d=-1,e=a.length,f=b[0],g=b[1],h=b[2];switch(b.length){case 0:for(;++d<e;)(c=a[d]).callback.call(c.ctx);return;case 1:for(;++d<e;)(c=a[d]).callback.call(c.ctx,f);return;case 2:for(;++d<e;)(c=a[d]).callback.call(c.ctx,f,g);return;case 3:for(;++d<e;)(c=a[d]).callback.call(c.ctx,f,g,h);return;default:for(;++d<e;)(c=a[d]).callback.apply(c.ctx,b);return}};
// Aliases for backwards compatibility.
i.bind=i.on,i.unbind=i.off,
// Allow the `Backbone` object to serve as a global event bus, for folks who
// want global "pubsub" in a convenient place.
c.extend(b,i);
// Backbone.Model
// --------------
// Backbone **Models** are the basic data object in the framework --
// frequently representing a row in a table in a database on your server.
// A discrete chunk of data and a bunch of useful, related methods for
// performing computations and transformations on that data.
// Create a new model with the specified attributes. A client id (`cid`)
// is automatically generated and assigned for you.
var r=b.Model=function(a,b){var d=a||{};b||(b={}),this.cid=c.uniqueId(this.cidPrefix),this.attributes={},b.collection&&(this.collection=b.collection),b.parse&&(d=this.parse(d,b)||{}),d=c.defaults({},d,c.result(this,"defaults")),this.set(d,b),this.changed={},this.initialize.apply(this,arguments)};
// Attach all inheritable methods to the Model prototype.
c.extend(r.prototype,i,{
// A hash of attributes whose current and previous value differ.
changed:null,
// The value returned during the last failed validation.
validationError:null,
// The default name for the JSON `id` attribute is `"id"`. MongoDB and
// CouchDB users may want to set this to `"_id"`.
idAttribute:"id",
// The prefix is used to create the client id which is used to identify models locally.
// You may want to override this if you're experiencing name clashes with model ids.
cidPrefix:"c",
// Initialize is an empty function by default. Override it with your own
// initialization logic.
initialize:function(){},
// Return a copy of the model's `attributes` object.
toJSON:function(a){return c.clone(this.attributes)},
// Proxy `Backbone.sync` by default -- but override this if you need
// custom syncing semantics for *this* particular model.
sync:function(){return b.sync.apply(this,arguments)},
// Get the value of an attribute.
get:function(a){return this.attributes[a]},
// Get the HTML-escaped value of an attribute.
escape:function(a){return c.escape(this.get(a))},
// Returns `true` if the attribute contains a value that is not null
// or undefined.
has:function(a){return null!=this.get(a)},
// Special-cased proxy to underscore's `_.matches` method.
matches:function(a){return!!c.iteratee(a,this)(this.attributes)},
// Set a hash of model attributes on the object, firing `"change"`. This is
// the core primitive operation of a model, updating the data and notifying
// anyone who needs to know about the change in state. The heart of the beast.
set:function(a,b,d){if(null==a)return this;
// Handle both `"key", value` and `{key: value}` -style arguments.
var e;
// Run validation.
if("object"==typeof a?(e=a,d=b):(e={})[a]=b,d||(d={}),!this._validate(e,d))return!1;
// Extract attributes and options.
var f=d.unset,g=d.silent,h=[],i=this._changing;this._changing=!0,i||(this._previousAttributes=c.clone(this.attributes),this.changed={});var j=this.attributes,k=this.changed,l=this._previousAttributes;
// Check for changes of `id`.
this.idAttribute in e&&(this.id=e[this.idAttribute]);
// For each `set` attribute, update or delete the current value.
for(var m in e)b=e[m],c.isEqual(j[m],b)||h.push(m),c.isEqual(l[m],b)?delete k[m]:k[m]=b,f?delete j[m]:j[m]=b;
// Trigger all relevant attribute changes.
if(!g){h.length&&(this._pending=d);for(var n=0;n<h.length;n++)this.trigger("change:"+h[n],this,j[h[n]],d)}
// You might be wondering why there's a `while` loop here. Changes can
// be recursively nested within `"change"` events.
if(i)return this;if(!g)for(;this._pending;)d=this._pending,this._pending=!1,this.trigger("change",this,d);return this._pending=!1,this._changing=!1,this},
// Remove an attribute from the model, firing `"change"`. `unset` is a noop
// if the attribute doesn't exist.
unset:function(a,b){return this.set(a,void 0,c.extend({},b,{unset:!0}))},
// Clear all attributes on the model, firing `"change"`.
clear:function(a){var b={};for(var d in this.attributes)b[d]=void 0;return this.set(b,c.extend({},a,{unset:!0}))},
// Determine if the model has changed since the last `"change"` event.
// If you specify an attribute name, determine if that attribute has changed.
hasChanged:function(a){return null==a?!c.isEmpty(this.changed):c.has(this.changed,a)},
// Return an object containing all the attributes that have changed, or
// false if there are no changed attributes. Useful for determining what
// parts of a view need to be updated and/or what attributes need to be
// persisted to the server. Unset attributes will be set to undefined.
// You can also pass an attributes object to diff against the model,
// determining if there *would be* a change.
changedAttributes:function(a){if(!a)return this.hasChanged()?c.clone(this.changed):!1;var b=this._changing?this._previousAttributes:this.attributes,d={};for(var e in a){var f=a[e];c.isEqual(b[e],f)||(d[e]=f)}return c.size(d)?d:!1},
// Get the previous value of an attribute, recorded at the time the last
// `"change"` event was fired.
previous:function(a){return null!=a&&this._previousAttributes?this._previousAttributes[a]:null},
// Get all of the attributes of the model at the time of the previous
// `"change"` event.
previousAttributes:function(){return c.clone(this._previousAttributes)},
// Fetch the model from the server, merging the response with the model's
// local attributes. Any changed attributes will trigger a "change" event.
fetch:function(a){a=c.extend({parse:!0},a);var b=this,d=a.success;return a.success=function(c){var e=a.parse?b.parse(c,a):c;return b.set(e,a)?(d&&d.call(a.context,b,c,a),void b.trigger("sync",b,c,a)):!1},N(this,a),this.sync("read",this,a)},
// Set a hash of model attributes, and sync the model to the server.
// If the server returns an attributes hash that differs, the model's
// state will be `set` again.
save:function(a,b,d){
// Handle both `"key", value` and `{key: value}` -style arguments.
var e;null==a||"object"==typeof a?(e=a,d=b):(e={})[a]=b,d=c.extend({validate:!0,parse:!0},d);var f=d.wait;
// If we're not waiting and attributes exist, save acts as
// `set(attr).save(null, opts)` with validation. Otherwise, check if
// the model will be valid when the attributes, if any, are set.
if(e&&!f){if(!this.set(e,d))return!1}else if(!this._validate(e,d))return!1;
// After a successful server-side save, the client is (optionally)
// updated with the server-side state.
var g=this,h=d.success,i=this.attributes;d.success=function(a){
// Ensure attributes are restored during synchronous saves.
g.attributes=i;var b=d.parse?g.parse(a,d):a;return f&&(b=c.extend({},e,b)),b&&!g.set(b,d)?!1:(h&&h.call(d.context,g,a,d),void g.trigger("sync",g,a,d))},N(this,d),
// Set temporary attributes if `{wait: true}` to properly find new ids.
e&&f&&(this.attributes=c.extend({},i,e));var j=this.isNew()?"create":d.patch?"patch":"update";"patch"!==j||d.attrs||(d.attrs=e);var k=this.sync(j,this,d);
// Restore attributes.
return this.attributes=i,k},
// Destroy this model on the server if it was already persisted.
// Optimistically removes the model from its collection, if it has one.
// If `wait: true` is passed, waits for the server to respond before removal.
destroy:function(a){a=a?c.clone(a):{};var b=this,d=a.success,e=a.wait,f=function(){b.stopListening(),b.trigger("destroy",b,b.collection,a)};a.success=function(c){e&&f(),d&&d.call(a.context,b,c,a),b.isNew()||b.trigger("sync",b,c,a)};var g=!1;return this.isNew()?c.defer(a.success):(N(this,a),g=this.sync("delete",this,a)),e||f(),g},
// Default URL for the model's representation on the server -- if you're
// using Backbone's restful methods, override this to change the endpoint
// that will be called.
url:function(){var a=c.result(this,"urlRoot")||c.result(this.collection,"url")||M();if(this.isNew())return a;var b=this.get(this.idAttribute);return a.replace(/[^\/]$/,"$&/")+encodeURIComponent(b)},
// **parse** converts a response into the hash of attributes to be `set` on
// the model. The default implementation is just to pass the response along.
parse:function(a,b){return a},
// Create a new model with identical attributes to this one.
clone:function(){return new this.constructor(this.attributes)},
// A model is new if it has never been saved to the server, and lacks an id.
isNew:function(){return!this.has(this.idAttribute)},
// Check if the model is currently in a valid state.
isValid:function(a){return this._validate({},c.defaults({validate:!0},a))},
// Run validation against the next complete set of model attributes,
// returning `true` if all is well. Otherwise, fire an `"invalid"` event.
_validate:function(a,b){if(!b.validate||!this.validate)return!0;a=c.extend({},this.attributes,a);var d=this.validationError=this.validate(a,b)||null;return d?(this.trigger("invalid",this,d,c.extend(b,{validationError:d})),!1):!0}});
// Underscore methods that we want to implement on the Model.
var s={keys:1,values:1,pairs:1,invert:1,pick:0,omit:0,chain:1,isEmpty:1};
// Mix in each Underscore method as a proxy to `Model#attributes`.
h(r,s,"attributes");
// Backbone.Collection
// -------------------
// If models tend to represent a single row of data, a Backbone Collection is
// more analogous to a table full of data ... or a small slice or page of that
// table, or a collection of rows that belong together for a particular reason
// -- all of the messages in this particular folder, all of the documents
// belonging to this particular author, and so on. Collections maintain
// indexes of their models, both in order, and for lookup by `id`.
// Create a new **Collection**, perhaps to contain a specific type of `model`.
// If a `comparator` is specified, the Collection will maintain
// its models in sort order, as they're added and removed.
var t=b.Collection=function(a,b){b||(b={}),b.model&&(this.model=b.model),void 0!==b.comparator&&(this.comparator=b.comparator),this._reset(),this.initialize.apply(this,arguments),a&&this.reset(a,c.extend({silent:!0},b))},u={add:!0,remove:!0,merge:!0},v={add:!0,remove:!1};
// Define the Collection's inheritable methods.
c.extend(t.prototype,i,{
// The default model for a collection is just a **Backbone.Model**.
// This should be overridden in most cases.
model:r,
// Initialize is an empty function by default. Override it with your own
// initialization logic.
initialize:function(){},
// The JSON representation of a Collection is an array of the
// models' attributes.
toJSON:function(a){return this.map(function(b){return b.toJSON(a)})},
// Proxy `Backbone.sync` by default.
sync:function(){return b.sync.apply(this,arguments)},
// Add a model, or list of models to the set.
add:function(a,b){return this.set(a,c.extend({merge:!1},b,v))},
// Remove a model, or a list of models from the set.
remove:function(a,b){b=c.extend({},b);var d=!c.isArray(a);a=d?[a]:c.clone(a);var e=this._removeModels(a,b);return!b.silent&&e&&this.trigger("update",this,b),d?e[0]:e},
// Update a collection by `set`-ing a new list of models, adding new ones,
// removing models that are no longer present, and merging models that
// already exist in the collection, as necessary. Similar to **Model#set**,
// the core operation for updating the data contained by the collection.
set:function(a,b){b=c.defaults({},b,u),b.parse&&!this._isModel(a)&&(a=this.parse(a,b));var d=!c.isArray(a);a=d?a?[a]:[]:a.slice();var e,f,g,h,i,j=b.at;null!=j&&(j=+j),0>j&&(j+=this.length+1);
// Turn bare objects into model references, and prevent invalid models
// from being added.
for(var k=this.comparator&&null==j&&b.sort!==!1,l=c.isString(this.comparator)?this.comparator:null,m=[],n=[],o={},p=b.add,q=b.merge,r=b.remove,s=!k&&p&&r?[]:!1,t=!1,v=0;v<a.length;v++){
// If a duplicate is found, prevent it from being added and
// optionally merge it into the existing model.
if(g=a[v],h=this.get(g))r&&(o[h.cid]=!0),q&&g!==h&&(g=this._isModel(g)?g.attributes:g,b.parse&&(g=h.parse(g,b)),h.set(g,b),k&&!i&&h.hasChanged(l)&&(i=!0)),a[v]=h;else if(p){if(f=a[v]=this._prepareModel(g,b),!f)continue;m.push(f),this._addReference(f,b)}
// Do not add multiple models with the same `id`.
f=h||f,f&&(e=this.modelId(f.attributes),!s||!f.isNew()&&o[e]||(s.push(f),t=t||!this.models[v]||f.cid!==this.models[v].cid),o[e]=!0)}
// Remove nonexistent models if appropriate.
if(r){for(var v=0;v<this.length;v++)o[(f=this.models[v]).cid]||n.push(f);n.length&&this._removeModels(n,b)}
// See if sorting is needed, update `length` and splice in new models.
if(m.length||t)if(k&&(i=!0),this.length+=m.length,null!=j)for(var v=0;v<m.length;v++)this.models.splice(j+v,0,m[v]);else{s&&(this.models.length=0);for(var w=s||m,v=0;v<w.length;v++)this.models.push(w[v])}
// Unless silenced, it's time to fire all appropriate add/sort events.
if(
// Silently sort the collection if appropriate.
i&&this.sort({silent:!0}),!b.silent){for(var x=null!=j?c.clone(b):b,v=0;v<m.length;v++)null!=j&&(x.index=j+v),(f=m[v]).trigger("add",f,this,x);(i||t)&&this.trigger("sort",this,b),(m.length||n.length)&&this.trigger("update",this,b)}
// Return the added (or merged) model (or models).
return d?a[0]:a},
// When you have more items than you want to add or remove individually,
// you can reset the entire set with a new list of models, without firing
// any granular `add` or `remove` events. Fires `reset` when finished.
// Useful for bulk operations and optimizations.
reset:function(a,b){b=b?c.clone(b):{};for(var d=0;d<this.models.length;d++)this._removeReference(this.models[d],b);return b.previousModels=this.models,this._reset(),a=this.add(a,c.extend({silent:!0},b)),b.silent||this.trigger("reset",this,b),a},
// Add a model to the end of the collection.
push:function(a,b){return this.add(a,c.extend({at:this.length},b))},
// Remove a model from the end of the collection.
pop:function(a){var b=this.at(this.length-1);return this.remove(b,a)},
// Add a model to the beginning of the collection.
unshift:function(a,b){return this.add(a,c.extend({at:0},b))},
// Remove a model from the beginning of the collection.
shift:function(a){var b=this.at(0);return this.remove(b,a)},
// Slice out a sub-array of models from the collection.
slice:function(){return f.apply(this.models,arguments)},
// Get a model from the set by id.
get:function(a){if(null==a)return void 0;var b=this.modelId(this._isModel(a)?a.attributes:a);return this._byId[a]||this._byId[b]||this._byId[a.cid]},
// Get the model at the given index.
at:function(a){return 0>a&&(a+=this.length),this.models[a]},
// Return models with matching attributes. Useful for simple cases of
// `filter`.
where:function(a,b){var d=c.matches(a);return this[b?"find":"filter"](function(a){return d(a.attributes)})},
// Return the first model with matching attributes. Useful for simple cases
// of `find`.
findWhere:function(a){return this.where(a,!0)},
// Force the collection to re-sort itself. You don't need to call this under
// normal circumstances, as the set will maintain sort order as each item
// is added.
sort:function(a){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");
// Run sort based on type of `comparator`.
return a||(a={}),c.isString(this.comparator)||1===this.comparator.length?this.models=this.sortBy(this.comparator,this):this.models.sort(c.bind(this.comparator,this)),a.silent||this.trigger("sort",this,a),this},
// Pluck an attribute from each model in the collection.
pluck:function(a){return c.invoke(this.models,"get",a)},
// Fetch the default set of models for this collection, resetting the
// collection when they arrive. If `reset: true` is passed, the response
// data will be passed through the `reset` method instead of `set`.
fetch:function(a){a=c.extend({parse:!0},a);var b=a.success,d=this;return a.success=function(c){var e=a.reset?"reset":"set";d[e](c,a),b&&b.call(a.context,d,c,a),d.trigger("sync",d,c,a)},N(this,a),this.sync("read",this,a)},
// Create a new instance of a model in this collection. Add the model to the
// collection immediately, unless `wait: true` is passed, in which case we
// wait for the server to agree.
create:function(a,b){b=b?c.clone(b):{};var d=b.wait;if(a=this._prepareModel(a,b),!a)return!1;d||this.add(a,b);var e=this,f=b.success;return b.success=function(a,b,c){d&&e.add(a,c),f&&f.call(c.context,a,b,c)},a.save(null,b),a},
// **parse** converts a response into a list of models to be added to the
// collection. The default implementation is just to pass it through.
parse:function(a,b){return a},
// Create a new collection with an identical list of models as this one.
clone:function(){return new this.constructor(this.models,{model:this.model,comparator:this.comparator})},
// Define how to uniquely identify models in the collection.
modelId:function(a){return a[this.model.prototype.idAttribute||"id"]},
// Private method to reset all internal state. Called when the collection
// is first initialized or reset.
_reset:function(){this.length=0,this.models=[],this._byId={}},
// Prepare a hash of attributes (or other model) to be added to this
// collection.
_prepareModel:function(a,b){if(this._isModel(a))return a.collection||(a.collection=this),a;b=b?c.clone(b):{},b.collection=this;var d=new this.model(a,b);return d.validationError?(this.trigger("invalid",this,d.validationError,b),!1):d},
// Internal method called by both remove and set.
// Returns removed models, or false if nothing is removed.
_removeModels:function(a,b){for(var c=[],d=0;d<a.length;d++){var e=this.get(a[d]);if(e){var f=this.indexOf(e);this.models.splice(f,1),this.length--,b.silent||(b.index=f,e.trigger("remove",e,this,b)),c.push(e),this._removeReference(e,b)}}return c.length?c:!1},
// Method for checking whether an object should be considered a model for
// the purposes of adding to the collection.
_isModel:function(a){return a instanceof r},
// Internal method to create a model's ties to a collection.
_addReference:function(a,b){this._byId[a.cid]=a;var c=this.modelId(a.attributes);null!=c&&(this._byId[c]=a),a.on("all",this._onModelEvent,this)},
// Internal method to sever a model's ties to a collection.
_removeReference:function(a,b){delete this._byId[a.cid];var c=this.modelId(a.attributes);null!=c&&delete this._byId[c],this===a.collection&&delete a.collection,a.off("all",this._onModelEvent,this)},
// Internal method called every time a model in the set fires an event.
// Sets need to update their indexes when models change ids. All other
// events simply proxy through. "add" and "remove" events that originate
// in other collections are ignored.
_onModelEvent:function(a,b,c,d){if("add"!==a&&"remove"!==a||c===this){if("destroy"===a&&this.remove(b,d),"change"===a){var e=this.modelId(b.previousAttributes()),f=this.modelId(b.attributes);e!==f&&(null!=e&&delete this._byId[e],null!=f&&(this._byId[f]=b))}this.trigger.apply(this,arguments)}}});
// Underscore methods that we want to implement on the Collection.
// 90% of the core usefulness of Backbone Collections is actually implemented
// right here:
var w={forEach:3,each:3,map:3,collect:3,reduce:4,foldl:4,inject:4,reduceRight:4,foldr:4,find:3,detect:3,filter:3,select:3,reject:3,every:3,all:3,some:3,any:3,include:2,contains:2,invoke:0,max:3,min:3,toArray:1,size:1,first:3,head:3,take:3,initial:3,rest:3,tail:3,drop:3,last:3,without:0,difference:0,indexOf:3,shuffle:1,lastIndexOf:3,isEmpty:1,chain:1,sample:3,partition:3};
// Mix in each Underscore method as a proxy to `Collection#models`.
h(t,w,"models");
// Underscore methods that take a property name as an argument.
var x=["groupBy","countBy","sortBy","indexBy"];
// Use attributes instead of properties.
c.each(x,function(a){c[a]&&(t.prototype[a]=function(b,d){var e=c.isFunction(b)?b:function(a){return a.get(b)};return c[a](this.models,e,d)})});
// Backbone.View
// -------------
// Backbone Views are almost more convention than they are actual code. A View
// is simply a JavaScript object that represents a logical chunk of UI in the
// DOM. This might be a single item, an entire list, a sidebar or panel, or
// even the surrounding frame which wraps your whole app. Defining a chunk of
// UI as a **View** allows you to define your DOM events declaratively, without
// having to worry about render order ... and makes it easy for the view to
// react to specific changes in the state of your models.
// Creating a Backbone.View creates its initial element outside of the DOM,
// if an existing element is not provided...
var y=b.View=function(a){this.cid=c.uniqueId("view"),c.extend(this,c.pick(a,A)),this._ensureElement(),this.initialize.apply(this,arguments)},z=/^(\S+)\s*(.*)$/,A=["model","collection","el","id","attributes","className","tagName","events"];
// Set up all inheritable **Backbone.View** properties and methods.
c.extend(y.prototype,i,{
// The default `tagName` of a View's element is `"div"`.
tagName:"div",
// jQuery delegate for element lookup, scoped to DOM elements within the
// current view. This should be preferred to global lookups where possible.
$:function(a){return this.$el.find(a)},
// Initialize is an empty function by default. Override it with your own
// initialization logic.
initialize:function(){},
// **render** is the core function that your view should override, in order
// to populate its element (`this.el`), with the appropriate HTML. The
// convention is for **render** to always return `this`.
render:function(){return this},
// Remove this view by taking the element out of the DOM, and removing any
// applicable Backbone.Events listeners.
remove:function(){return this._removeElement(),this.stopListening(),this},
// Remove this view's element from the document and all event listeners
// attached to it. Exposed for subclasses using an alternative DOM
// manipulation API.
_removeElement:function(){this.$el.remove()},
// Change the view's element (`this.el` property) and re-delegate the
// view's events on the new element.
setElement:function(a){return this.undelegateEvents(),this._setElement(a),this.delegateEvents(),this},
// Creates the `this.el` and `this.$el` references for this view using the
// given `el`. `el` can be a CSS selector or an HTML string, a jQuery
// context or an element. Subclasses can override this to utilize an
// alternative DOM manipulation API and are only required to set the
// `this.el` property.
_setElement:function(a){this.$el=a instanceof b.$?a:b.$(a),this.el=this.$el[0]},
// Set callbacks, where `this.events` is a hash of
//
// *{"event selector": "callback"}*
//
//     {
//       'mousedown .title':  'edit',
//       'click .button':     'save',
//       'click .open':       function(e) { ... }
//     }
//
// pairs. Callbacks will be bound to the view, with `this` set properly.
// Uses event delegation for efficiency.
// Omitting the selector binds the event to `this.el`.
delegateEvents:function(a){if(a||(a=c.result(this,"events")),!a)return this;this.undelegateEvents();for(var b in a){var d=a[b];if(c.isFunction(d)||(d=this[d]),d){var e=b.match(z);this.delegate(e[1],e[2],c.bind(d,this))}}return this},
// Add a single event listener to the view's element (or a child element
// using `selector`). This only works for delegate-able events: not `focus`,
// `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
delegate:function(a,b,c){return this.$el.on(a+".delegateEvents"+this.cid,b,c),this},
// Clears all callbacks previously bound to the view by `delegateEvents`.
// You usually don't need to use this, but may wish to if you have multiple
// Backbone views attached to the same DOM element.
undelegateEvents:function(){return this.$el&&this.$el.off(".delegateEvents"+this.cid),this},
// A finer-grained `undelegateEvents` for removing a single delegated event.
// `selector` and `listener` are both optional.
undelegate:function(a,b,c){return this.$el.off(a+".delegateEvents"+this.cid,b,c),this},
// Produces a DOM element to be assigned to your view. Exposed for
// subclasses using an alternative DOM manipulation API.
_createElement:function(a){return document.createElement(a)},
// Ensure that the View has a DOM element to render into.
// If `this.el` is a string, pass it through `$()`, take the first
// matching element, and re-assign it to `el`. Otherwise, create
// an element from the `id`, `className` and `tagName` properties.
_ensureElement:function(){if(this.el)this.setElement(c.result(this,"el"));else{var a=c.extend({},c.result(this,"attributes"));this.id&&(a.id=c.result(this,"id")),this.className&&(a["class"]=c.result(this,"className")),this.setElement(this._createElement(c.result(this,"tagName"))),this._setAttributes(a)}},
// Set attributes from a hash on this view's element.  Exposed for
// subclasses using an alternative DOM manipulation API.
_setAttributes:function(a){this.$el.attr(a)}}),
// Backbone.sync
// -------------
// Override this function to change the manner in which Backbone persists
// models to the server. You will be passed the type of request, and the
// model in question. By default, makes a RESTful Ajax request
// to the model's `url()`. Some possible customizations could be:
//
// * Use `setTimeout` to batch rapid-fire updates into a single request.
// * Send up the models as XML instead of JSON.
// * Persist models via WebSockets instead of Ajax.
//
// Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
// as `POST`, with a `_method` parameter containing the true HTTP method,
// as well as all requests with the body as `application/x-www-form-urlencoded`
// instead of `application/json` with the model in a param named `model`.
// Useful when interfacing with server-side languages like **PHP** that make
// it difficult to read the body of `PUT` requests.
b.sync=function(a,d,e){var f=B[a];
// Default options, unless specified.
c.defaults(e||(e={}),{emulateHTTP:b.emulateHTTP,emulateJSON:b.emulateJSON});
// Default JSON-request options.
var g={type:f,dataType:"json"};
// For older servers, emulate HTTP by mimicking the HTTP method with `_method`
// And an `X-HTTP-Method-Override` header.
if(
// Ensure that we have a URL.
e.url||(g.url=c.result(d,"url")||M()),
// Ensure that we have the appropriate request data.
null!=e.data||!d||"create"!==a&&"update"!==a&&"patch"!==a||(g.contentType="application/json",g.data=JSON.stringify(e.attrs||d.toJSON(e))),
// For older servers, emulate JSON by encoding the request into an HTML-form.
e.emulateJSON&&(g.contentType="application/x-www-form-urlencoded",g.data=g.data?{model:g.data}:{}),e.emulateHTTP&&("PUT"===f||"DELETE"===f||"PATCH"===f)){g.type="POST",e.emulateJSON&&(g.data._method=f);var h=e.beforeSend;e.beforeSend=function(a){return a.setRequestHeader("X-HTTP-Method-Override",f),h?h.apply(this,arguments):void 0}}
// Don't process data on a non-GET request.
"GET"===g.type||e.emulateJSON||(g.processData=!1);
// Pass along `textStatus` and `errorThrown` from jQuery.
var i=e.error;e.error=function(a,b,c){e.textStatus=b,e.errorThrown=c,i&&i.call(e.context,a,b,c)};
// Make the request, allowing the user to override any Ajax options.
var j=e.xhr=b.ajax(c.extend(g,e));return d.trigger("request",d,j,e),j};
// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
var B={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};
// Set the default implementation of `Backbone.ajax` to proxy through to `$`.
// Override this if you'd like to use a different library.
b.ajax=function(){return b.$.ajax.apply(b.$,arguments)};
// Backbone.Router
// ---------------
// Routers map faux-URLs to actions, and fire events when routes are
// matched. Creating a new one sets its `routes` hash, if not set statically.
var C=b.Router=function(a){a||(a={}),a.routes&&(this.routes=a.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},D=/\((.*?)\)/g,E=/(\(\?)?:\w+/g,F=/\*\w+/g,G=/[\-{}\[\]+?.,\\\^$|#\s]/g;
// Set up all inheritable **Backbone.Router** properties and methods.
c.extend(C.prototype,i,{
// Initialize is an empty function by default. Override it with your own
// initialization logic.
initialize:function(){},
// Manually bind a single named route to a callback. For example:
//
//     this.route('search/:query/p:num', 'search', function(query, num) {
//       ...
//     });
//
route:function(a,d,e){c.isRegExp(a)||(a=this._routeToRegExp(a)),c.isFunction(d)&&(e=d,d=""),e||(e=this[d]);var f=this;return b.history.route(a,function(c){var g=f._extractParameters(a,c);f.execute(e,g,d)!==!1&&(f.trigger.apply(f,["route:"+d].concat(g)),f.trigger("route",d,g),b.history.trigger("route",f,d,g))}),this},
// Execute a route handler with the provided parameters.  This is an
// excellent place to do pre-route setup or post-route cleanup.
execute:function(a,b,c){a&&a.apply(this,b)},
// Simple proxy to `Backbone.history` to save a fragment into the history.
navigate:function(a,c){return b.history.navigate(a,c),this},
// Bind all defined routes to `Backbone.history`. We have to reverse the
// order of the routes here to support behavior where the most general
// routes can be defined at the bottom of the route map.
_bindRoutes:function(){if(this.routes){this.routes=c.result(this,"routes");for(var a,b=c.keys(this.routes);null!=(a=b.pop());)this.route(a,this.routes[a])}},
// Convert a route string into a regular expression, suitable for matching
// against the current location hash.
_routeToRegExp:function(a){return a=a.replace(G,"\\$&").replace(D,"(?:$1)?").replace(E,function(a,b){return b?a:"([^/?]+)"}).replace(F,"([^?]*?)"),new RegExp("^"+a+"(?:\\?([\\s\\S]*))?$")},
// Given a route, and a URL fragment that it matches, return the array of
// extracted decoded parameters. Empty or unmatched parameters will be
// treated as `null` to normalize cross-browser behavior.
_extractParameters:function(a,b){var d=a.exec(b).slice(1);return c.map(d,function(a,b){
// Don't decode the search params.
// Don't decode the search params.
return b===d.length-1?a||null:a?decodeURIComponent(a):null})}});
// Backbone.History
// ----------------
// Handles cross-browser history management, based on either
// [pushState](http://diveintohtml5.info/history.html) and real URLs, or
// [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
// and URL fragments. If the browser supports neither (old IE, natch),
// falls back to polling.
var H=b.History=function(){this.handlers=[],c.bindAll(this,"checkUrl"),
// Ensure that `History` can be used outside of the browser.
"undefined"!=typeof window&&(this.location=window.location,this.history=window.history)},I=/^[#\/]|\s+$/g,J=/^\/+|\/+$/g,K=/#.*$/;
// Has the history handling already been started?
H.started=!1,
// Set up all inheritable **Backbone.History** properties and methods.
c.extend(H.prototype,i,{
// The default interval to poll for hash changes, if necessary, is
// twenty times a second.
interval:50,
// Are we at the app root?
atRoot:function(){var a=this.location.pathname.replace(/[^\/]$/,"$&/");return a===this.root&&!this.getSearch()},
// Does the pathname match the root?
matchRoot:function(){var a=this.decodeFragment(this.location.pathname),b=a.slice(0,this.root.length-1)+"/";return b===this.root},
// Unicode characters in `location.pathname` are percent encoded so they're
// decoded for comparison. `%25` should not be decoded since it may be part
// of an encoded parameter.
decodeFragment:function(a){return decodeURI(a.replace(/%25/g,"%2525"))},
// In IE6, the hash fragment and search params are incorrect if the
// fragment contains `?`.
getSearch:function(){var a=this.location.href.replace(/#.*/,"").match(/\?.+/);return a?a[0]:""},
// Gets the true hash value. Cannot use location.hash directly due to bug
// in Firefox where location.hash will always be decoded.
getHash:function(a){var b=(a||this).location.href.match(/#(.*)$/);return b?b[1]:""},
// Get the pathname and search params, without the root.
getPath:function(){var a=this.decodeFragment(this.location.pathname+this.getSearch()).slice(this.root.length-1);return"/"===a.charAt(0)?a.slice(1):a},
// Get the cross-browser normalized URL fragment from the path or hash.
getFragment:function(a){return null==a&&(a=this._usePushState||!this._wantsHashChange?this.getPath():this.getHash()),a.replace(I,"")},
// Start the hash change handling, returning `true` if the current URL matches
// an existing route, and `false` otherwise.
start:function(a){if(H.started)throw new Error("Backbone.history has already been started");
// Transition from hashChange to pushState or vice versa if both are
// requested.
if(H.started=!0,
// Figure out the initial configuration. Do we need an iframe?
// Is pushState desired ... is it available?
this.options=c.extend({root:"/"},this.options,a),this.root=this.options.root,this._wantsHashChange=this.options.hashChange!==!1,this._hasHashChange="onhashchange"in window,this._useHashChange=this._wantsHashChange&&this._hasHashChange,this._wantsPushState=!!this.options.pushState,this._hasPushState=!(!this.history||!this.history.pushState),this._usePushState=this._wantsPushState&&this._hasPushState,this.fragment=this.getFragment(),
// Normalize root to always include a leading and trailing slash.
this.root=("/"+this.root+"/").replace(J,"/"),this._wantsHashChange&&this._wantsPushState){
// If we've started off with a route from a `pushState`-enabled
// browser, but we're currently in a browser that doesn't support it...
if(!this._hasPushState&&!this.atRoot()){var b=this.root.slice(0,-1)||"/";
// Return immediately as browser will do redirect to new url
return this.location.replace(b+"#"+this.getPath()),!0}this._hasPushState&&this.atRoot()&&this.navigate(this.getHash(),{replace:!0})}
// Proxy an iframe to handle location events if the browser doesn't
// support the `hashchange` event, HTML5 history, or the user wants
// `hashChange` but not `pushState`.
if(!this._hasHashChange&&this._wantsHashChange&&!this._usePushState){this.iframe=document.createElement("iframe"),this.iframe.src="javascript:0",this.iframe.style.display="none",this.iframe.tabIndex=-1;var d=document.body,e=d.insertBefore(this.iframe,d.firstChild).contentWindow;e.document.open(),e.document.close(),e.location.hash="#"+this.fragment}
// Add a cross-platform `addEventListener` shim for older browsers.
var f=window.addEventListener||function(a,b){return attachEvent("on"+a,b)};
// Depending on whether we're using pushState or hashes, and whether
// 'onhashchange' is supported, determine how we check the URL state.
return this._usePushState?f("popstate",this.checkUrl,!1):this._useHashChange&&!this.iframe?f("hashchange",this.checkUrl,!1):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),this.options.silent?void 0:this.loadUrl()},
// Disable Backbone.history, perhaps temporarily. Not useful in a real app,
// but possibly useful for unit testing Routers.
stop:function(){
// Add a cross-platform `removeEventListener` shim for older browsers.
var a=window.removeEventListener||function(a,b){return detachEvent("on"+a,b)};
// Remove window listeners.
this._usePushState?a("popstate",this.checkUrl,!1):this._useHashChange&&!this.iframe&&a("hashchange",this.checkUrl,!1),
// Clean up the iframe if necessary.
this.iframe&&(document.body.removeChild(this.iframe),this.iframe=null),
// Some environments will throw when clearing an undefined interval.
this._checkUrlInterval&&clearInterval(this._checkUrlInterval),H.started=!1},
// Add a route to be tested when the fragment changes. Routes added later
// may override previous routes.
route:function(a,b){this.handlers.unshift({route:a,callback:b})},
// Checks the current URL to see if it has changed, and if it has,
// calls `loadUrl`, normalizing across the hidden iframe.
checkUrl:function(a){var b=this.getFragment();
// If the user pressed the back button, the iframe's hash will have
// changed and we should use that for comparison.
return b===this.fragment&&this.iframe&&(b=this.getHash(this.iframe.contentWindow)),b===this.fragment?!1:(this.iframe&&this.navigate(b),void this.loadUrl())},
// Attempt to load the current URL fragment. If a route succeeds with a
// match, returns `true`. If no defined routes matches the fragment,
// returns `false`.
loadUrl:function(a){
// If the root doesn't match, no routes can match either.
// If the root doesn't match, no routes can match either.
return this.matchRoot()?(a=this.fragment=this.getFragment(a),c.any(this.handlers,function(b){return b.route.test(a)?(b.callback(a),!0):void 0})):!1},
// Save a fragment into the hash history, or replace the URL state if the
// 'replace' option is passed. You are responsible for properly URL-encoding
// the fragment in advance.
//
// The options object can contain `trigger: true` if you wish to have the
// route callback be fired (not usually desirable), or `replace: true`, if
// you wish to modify the current URL without adding an entry to the history.
navigate:function(a,b){if(!H.started)return!1;b&&b!==!0||(b={trigger:!!b}),
// Normalize the fragment.
a=this.getFragment(a||"");
// Don't include a trailing slash on the root.
var c=this.root;(""===a||"?"===a.charAt(0))&&(c=c.slice(0,-1)||"/");var d=c+a;if(a=this.decodeFragment(a.replace(K,"")),this.fragment!==a){
// If pushState is available, we use it to set the fragment as a real URL.
if(this.fragment=a,this._usePushState)this.history[b.replace?"replaceState":"pushState"]({},document.title,d);else{if(!this._wantsHashChange)return this.location.assign(d);if(this._updateHash(this.location,a,b.replace),this.iframe&&a!==this.getHash(this.iframe.contentWindow)){var e=this.iframe.contentWindow;
// Opening and closing the iframe tricks IE7 and earlier to push a
// history entry on hash-tag change.  When replace is true, we don't
// want this.
b.replace||(e.document.open(),e.document.close()),this._updateHash(e.location,a,b.replace)}}return b.trigger?this.loadUrl(a):void 0}},
// Update the hash location, either replacing the current entry, or adding
// a new one to the browser history.
_updateHash:function(a,b,c){if(c){var d=a.href.replace(/(javascript:|#).*$/,"");a.replace(d+"#"+b)}else
// Some browsers require that `hash` contains a leading #.
a.hash="#"+b}}),
// Create the default Backbone.history.
b.history=new H;
// Helpers
// -------
// Helper function to correctly set up the prototype chain for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var L=function(a,b){var d,e=this;
// The constructor function for the new subclass is either defined by you
// (the "constructor" property in your `extend` definition), or defaulted
// by us to simply call the parent constructor.
d=a&&c.has(a,"constructor")?a.constructor:function(){return e.apply(this,arguments)},c.extend(d,e,b);
// Set the prototype chain to inherit from `parent`, without calling
// `parent` constructor function.
var f=function(){this.constructor=d};
// Add prototype properties (instance properties) to the subclass,
// if supplied.
// Set a convenience property in case the parent's prototype is needed
// later.
return f.prototype=e.prototype,d.prototype=new f,a&&c.extend(d.prototype,a),d.__super__=e.prototype,d};
// Set up inheritance for the model, collection, router, view and history.
r.extend=t.extend=C.extend=y.extend=H.extend=L;
// Throw an error when a URL is needed, and none is supplied.
var M=function(){throw new Error('A "url" property or function must be specified')},N=function(a,b){var c=b.error;b.error=function(d){c&&c.call(b.context,a,d,b),a.trigger("error",a,d,b)}};return b})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{jquery:9,underscore:10}],10:[function(a,b,c){(function(a){!function(a,d){"object"==typeof c&&"undefined"!=typeof b?b.exports=d():"function"==typeof define&&define.amd?define("underscore",d):(a="undefined"!=typeof globalThis?globalThis:a||self,function(){var b=a._,c=a._=d();c.noConflict=function(){return a._=b,c}}())}(this,function(){
// Some functions take a variable number of arguments, or a few expected
// arguments at the beginning and then a variable number of values to operate
// on. This helper accumulates all remaining arguments past the function’s
// argument length (or an explicit `startIndex`), into an array that becomes
// the last argument. Similar to ES6’s "rest parameter".
function b(a,b){return b=null==b?a.length-1:+b,function(){for(var c=Math.max(arguments.length-b,0),d=Array(c),e=0;c>e;e++)d[e]=arguments[e+b];switch(b){case 0:return a.call(this,d);case 1:return a.call(this,arguments[0],d);case 2:return a.call(this,arguments[0],arguments[1],d)}var f=Array(b+1);for(e=0;b>e;e++)f[e]=arguments[e];return f[b]=d,a.apply(this,f)}}
// Is a given variable an object?
function c(a){var b=typeof a;return"function"===b||"object"===b&&!!a}
// Is a given value equal to null?
function d(a){return null===a}
// Is a given variable undefined?
function e(a){return void 0===a}
// Is a given value a boolean?
function f(a){return a===!0||a===!1||"[object Boolean]"===jb.call(a)}
// Is a given value a DOM element?
function g(a){return!(!a||1!==a.nodeType)}
// Internal function for creating a `toString`-based type tester.
function h(a){var b="[object "+a+"]";return function(a){return jb.call(a)===b}}
// In IE 10 - Edge 13, we need a different heuristic
// to determine whether an object is a `DataView`.
function i(a){return null!=a&&Fb(a.getInt8)&&Cb(a.buffer)}
// Internal function to check whether `key` is an own property name of `obj`.
function j(a,b){return null!=a&&kb.call(a,b)}
// Is a given object a finite number?
function k(a){return!Bb(a)&&sb(a)&&!isNaN(parseFloat(a))}
// Is the given value `NaN`?
function l(a){return xb(a)&&rb(a)}
// Predicate-generating function. Often useful outside of Underscore.
function m(a){return function(){return a}}
// Common internal logic for `isArrayLike` and `isBufferLike`.
function n(a){return function(b){var c=a(b);return"number"==typeof c&&c>=0&&vb>=c}}
// Internal helper to generate a function to obtain property `key` from `obj`.
function o(a){return function(b){return null==b?void 0:b[a]}}function p(a){
// `ArrayBuffer.isView` is the most future-proof, so use it when available.
// Otherwise, fall back on the above regular expression.
return qb?qb(a)&&!Kb(a):Pb(a)&&Qb.test(jb.call(a))}
// Internal helper to create a simple lookup structure.
// `collectNonEnumProps` used to depend on `_.contains`, but this led to
// circular imports. `emulatedSet` is a one-off solution that only works for
// arrays of strings.
function q(a){for(var b={},c=a.length,d=0;c>d;++d)b[a[d]]=!0;return{contains:function(a){return b[a]===!0},push:function(c){return b[c]=!0,a.push(c)}}}
// Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
// be iterated by `for key in ...` and thus missed. Extends `keys` in place if
// needed.
function r(a,b){b=q(b);var c=ub.length,d=a.constructor,e=Fb(d)&&d.prototype||fb,f="constructor";for(j(a,f)&&!b.contains(f)&&b.push(f);c--;)f=ub[c],f in a&&a[f]!==e[f]&&!b.contains(f)&&b.push(f)}
// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
function s(a){if(!c(a))return[];if(ob)return ob(a);var b=[];for(var d in a)j(a,d)&&b.push(d);
// Ahem, IE < 9.
return tb&&r(a,b),b}
// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
function t(a){if(null==a)return!0;
// Skip the more expensive `toString`-based type checks if `obj` has no
// `.length`.
var b=Sb(a);return"number"==typeof b&&(Lb(a)||wb(a)||Nb(a))?0===b:0===Sb(s(a))}
// Returns whether an object has a given set of `key:value` pairs.
function u(a,b){var c=s(b),d=c.length;if(null==a)return!d;for(var e=Object(a),f=0;d>f;f++){var g=c[f];if(b[g]!==e[g]||!(g in e))return!1}return!0}
// If Underscore is called as a function, it returns a wrapped object that can
// be used OO-style. This wrapper holds altered versions of all functions added
// through `_.mixin`. Wrapped objects may be chained.
function v(a){return a instanceof v?a:this instanceof v?void(this._wrapped=a):new v(a)}
// Internal function to wrap or shallow-copy an ArrayBuffer,
// typed array or DataView to a new view, reusing the buffer.
function w(a){return new Uint8Array(a.buffer||a,a.byteOffset||0,Ob(a))}
// Internal recursive comparison function for `_.isEqual`.
function x(a,b,c,d){
// Identical objects are equal. `0 === -0`, but they aren't identical.
// See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
if(a===b)return 0!==a||1/a===1/b;
// `null` or `undefined` only equal to itself (strict comparison).
if(null==a||null==b)return!1;
// `NaN`s are equivalent, but non-reflexive.
if(a!==a)return b!==b;
// Exhaust primitive checks
var e=typeof a;return"function"!==e&&"object"!==e&&"object"!=typeof b?!1:y(a,b,c,d)}
// Internal recursive comparison function for `_.isEqual`.
function y(a,b,c,d){
// Unwrap any wrapped objects.
a instanceof v&&(a=a._wrapped),b instanceof v&&(b=b._wrapped);
// Compare `[[Class]]` names.
var e=jb.call(a);if(e!==jb.call(b))return!1;
// Work around a bug in IE 10 - Edge 13.
if(Hb&&"[object Object]"==e&&Kb(a)){if(!Kb(b))return!1;e=Tb}switch(e){
// These types are compared by value.
case"[object RegExp]":
// RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
case"[object String]":
// Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
// equivalent to `new String("5")`.
return""+a==""+b;case"[object Number]":
// `NaN`s are equivalent, but non-reflexive.
// Object(NaN) is equivalent to NaN.
// `NaN`s are equivalent, but non-reflexive.
// Object(NaN) is equivalent to NaN.
return+a!==+a?+b!==+b:0===+a?1/+a===1/b:+a===+b;case"[object Date]":case"[object Boolean]":
// Coerce dates and booleans to numeric primitive values. Dates are compared by their
// millisecond representations. Note that invalid dates with millisecond representations
// of `NaN` are not equivalent.
return+a===+b;case"[object Symbol]":return gb.valueOf.call(a)===gb.valueOf.call(b);case"[object ArrayBuffer]":case Tb:
// Coerce to typed array so we can fall through.
return y(w(a),w(b),c,d)}var f="[object Array]"===e;if(!f&&Rb(a)){var g=Ob(a);if(g!==Ob(b))return!1;if(a.buffer===b.buffer&&a.byteOffset===b.byteOffset)return!0;f=!0}if(!f){if("object"!=typeof a||"object"!=typeof b)return!1;
// Objects with different constructors are not equivalent, but `Object`s or `Array`s
// from different frames are.
var h=a.constructor,i=b.constructor;if(h!==i&&!(Fb(h)&&h instanceof h&&Fb(i)&&i instanceof i)&&"constructor"in a&&"constructor"in b)return!1}c=c||[],d=d||[];for(var k=c.length;k--;)
// Linear search. Performance is inversely proportional to the number of
// unique nested structures.
if(c[k]===a)return d[k]===b;
// Recursively compare objects and arrays.
if(
// Add the first object to the stack of traversed objects.
c.push(a),d.push(b),f){if(k=a.length,k!==b.length)return!1;
// Deep compare the contents, ignoring non-numeric properties.
for(;k--;)if(!x(a[k],b[k],c,d))return!1}else{
// Deep compare objects.
var l,m=s(a);
// Ensure that both objects contain the same number of properties before comparing deep equality.
if(k=m.length,s(b).length!==k)return!1;for(;k--;)if(l=m[k],!j(b,l)||!x(a[l],b[l],c,d))return!1}
// Remove the first object from the stack of traversed objects.
return c.pop(),d.pop(),!0}
// Perform a deep comparison to check if two objects are equal.
function z(a,b){return x(a,b)}
// Retrieve all the enumerable property names of an object.
function A(a){if(!c(a))return[];var b=[];for(var d in a)b.push(d);
// Ahem, IE < 9.
return tb&&r(a,b),b}
// Since the regular `Object.prototype.toString` type tests don't work for
// some types in IE 11, we use a fingerprinting heuristic instead, based
// on the methods. It's not great, but it's the best we got.
// The fingerprint method lists are defined below.
function B(a){var b=Sb(a);return function(c){if(null==c)return!1;
// `Map`, `WeakMap` and `Set` have no enumerable keys.
var d=A(c);if(Sb(d))return!1;for(var e=0;b>e;e++)if(!Fb(c[a[e]]))return!1;
// If we are testing against `WeakMap`, we need to ensure that
// `obj` doesn't have a `forEach` method in order to distinguish
// it from a regular `Map`.
return a!==Zb||!Fb(c[Ub])}}
// Retrieve the values of an object's properties.
function C(a){for(var b=s(a),c=b.length,d=Array(c),e=0;c>e;e++)d[e]=a[b[e]];return d}
// Convert an object into a list of `[key, value]` pairs.
// The opposite of `_.object` with one argument.
function D(a){for(var b=s(a),c=b.length,d=Array(c),e=0;c>e;e++)d[e]=[b[e],a[b[e]]];return d}
// Invert the keys and values of an object. The values must be serializable.
function E(a){for(var b={},c=s(a),d=0,e=c.length;e>d;d++)b[a[c[d]]]=c[d];return b}
// Return a sorted list of the function names available on the object.
function F(a){var b=[];for(var c in a)Fb(a[c])&&b.push(c);return b.sort()}
// An internal function for creating assigner functions.
function G(a,b){return function(c){var d=arguments.length;if(b&&(c=Object(c)),2>d||null==c)return c;for(var e=1;d>e;e++)for(var f=arguments[e],g=a(f),h=g.length,i=0;h>i;i++){var j=g[i];b&&void 0!==c[j]||(c[j]=f[j])}return c}}
// Create a naked function reference for surrogate-prototype-swapping.
function H(){return function(){}}
// An internal function for creating a new object that inherits from another.
function I(a){if(!c(a))return{};if(pb)return pb(a);var b=H();b.prototype=a;var d=new b;return b.prototype=null,d}
// Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the
// created object.
function J(a,b){var c=I(a);return b&&ec(c,b),c}
// Create a (shallow-cloned) duplicate of an object.
function K(a){return c(a)?Lb(a)?a.slice():dc({},a):a}
// Invokes `interceptor` with the `obj` and then returns `obj`.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
function L(a,b){return b(a),a}
// Normalize a (deep) property `path` to array.
// Like `_.iteratee`, this function can be customized.
function M(a){return Lb(a)?a:[a]}
// Internal wrapper for `_.toPath` to enable minification.
// Similar to `cb` for `_.iteratee`.
function N(a){return v.toPath(a)}
// Internal function to obtain a nested property in `obj` along `path`.
function O(a,b){for(var c=b.length,d=0;c>d;d++){if(null==a)return void 0;a=a[b[d]]}return c?a:void 0}
// Get the value of the (deep) property on `path` from `object`.
// If any property in `path` does not exist or if the value is
// `undefined`, return `defaultValue` instead.
// The `path` is normalized through `_.toPath`.
function P(a,b,c){var d=O(a,N(b));return e(d)?c:d}
// Shortcut function for checking if an object has a given property directly on
// itself (in other words, not on a prototype). Unlike the internal `has`
// function, this public version can also traverse nested properties.
function Q(a,b){b=N(b);for(var c=b.length,d=0;c>d;d++){var e=b[d];if(!j(a,e))return!1;a=a[e]}return!!c}
// Keep the identity function around for default iteratees.
function R(a){return a}
// Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
function S(a){return a=ec({},a),function(b){return u(b,a)}}
// Creates a function that, when passed an object, will traverse that object’s
// properties down the given `path`, specified as an array of keys or indices.
function T(a){return a=N(a),function(b){return O(b,a)}}
// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
function U(a,b,c){if(void 0===b)return a;switch(null==c?3:c){case 1:return function(c){return a.call(b,c)};
// The 2-argument case is omitted because we’re not using it.
case 3:return function(c,d,e){return a.call(b,c,d,e)};case 4:return function(c,d,e,f){return a.call(b,c,d,e,f)}}return function(){return a.apply(b,arguments)}}
// An internal function to generate callbacks that can be applied to each
// element in a collection, returning the desired result — either `_.identity`,
// an arbitrary callback, a property matcher, or a property accessor.
function V(a,b,d){return null==a?R:Fb(a)?U(a,b,d):c(a)&&!Lb(a)?S(a):T(a)}
// External wrapper for our callback generator. Users may customize
// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
// This abstraction hides the internal-only `argCount` argument.
function W(a,b){return V(a,b,1/0)}
// The function we call internally to generate a callback. It invokes
// `_.iteratee` if overridden, otherwise `baseIteratee`.
function X(a,b,c){return v.iteratee!==W?v.iteratee(a,b):V(a,b,c)}
// Returns the results of applying the `iteratee` to each element of `obj`.
// In contrast to `_.map` it returns an object.
function Y(a,b,c){b=X(b,c);for(var d=s(a),e=d.length,f={},g=0;e>g;g++){var h=d[g];f[h]=b(a[h],h,a)}return f}
// Predicate-generating function. Often useful outside of Underscore.
function Z(){}
// Generates a function for a given object that returns a given property.
function $(a){return null==a?Z:function(b){return P(a,b)}}
// Run a function **n** times.
function _(a,b,c){var d=Array(Math.max(0,a));b=U(b,c,1);for(var e=0;a>e;e++)d[e]=b(e);return d}
// Return a random integer between `min` and `max` (inclusive).
function aa(a,b){return null==b&&(b=a,a=0),a+Math.floor(Math.random()*(b-a+1))}
// Internal helper to generate functions for escaping and unescaping strings
// to/from HTML interpolation.
function ba(a){var b=function(b){return a[b]},c="(?:"+s(a).join("|")+")",d=RegExp(c),e=RegExp(c,"g");return function(a){return a=null==a?"":""+a,d.test(a)?a.replace(e,b):a}}function ca(a){return"\\"+nc[a]}
// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.
function da(a,b,c){!b&&c&&(b=c),b=fc({},b,v.templateSettings);
// Combine delimiters into one regular expression via alternation.
var d=RegExp([(b.escape||mc).source,(b.interpolate||mc).source,(b.evaluate||mc).source].join("|")+"|$","g"),e=0,f="__p+='";a.replace(d,function(b,c,d,g,h){
// Adobe VMs need the match returned to produce the correct offset.
return f+=a.slice(e,h).replace(oc,ca),e=h+b.length,c?f+="'+\n((__t=("+c+"))==null?'':_.escape(__t))+\n'":d?f+="'+\n((__t=("+d+"))==null?'':__t)+\n'":g&&(f+="';\n"+g+"\n__p+='"),b}),f+="';\n";var g=b.variable;if(g){
// Insure against third-party code injection. (CVE-2021-23358)
if(!pc.test(g))throw new Error("variable is not a bare identifier: "+g)}else f="with(obj||{}){\n"+f+"}\n",g="obj";f="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+f+"return __p;\n";var h;try{h=new Function(g,"_",f)}catch(i){throw i.source=f,i}var j=function(a){return h.call(this,a,v)};
// Provide the compiled source as a convenience for precompilation.
return j.source="function("+g+"){\n"+f+"}",j}
// Traverses the children of `obj` along `path`. If a child is a function, it
// is invoked with its parent as context. Returns the value of the final
// child, or `fallback` if any child is undefined.
function ea(a,b,c){b=N(b);var d=b.length;if(!d)return Fb(c)?c.call(a):c;for(var e=0;d>e;e++){var f=null==a?void 0:a[b[e]];void 0===f&&(f=c,e=d),a=Fb(f)?f.call(a):f}return a}function fa(a){var b=++qc+"";return a?a+b:b}
// Start chaining a wrapped Underscore object.
function ga(a){var b=v(a);return b._chain=!0,b}
// Internal function to execute `sourceFunc` bound to `context` with optional
// `args`. Determines whether to execute a function as a constructor or as a
// normal function.
function ha(a,b,d,e,f){if(!(e instanceof b))return a.apply(d,f);var g=I(a.prototype),h=a.apply(g,f);return c(h)?h:g}
// Internal implementation of a recursive `flatten` function.
function ia(a,b,c,d){if(d=d||[],b||0===b){if(0>=b)return d.concat(a)}else b=1/0;for(var e=d.length,f=0,g=Sb(a);g>f;f++){var h=a[f];if(tc(h)&&(Lb(h)||Nb(h)))
// Flatten current level of array or arguments object.
if(b>1)ia(h,b-1,c,d),e=d.length;else for(var i=0,j=h.length;j>i;)d[e++]=h[i++];else c||(d[e++]=h)}return d}
// Memoize an expensive function by storing its results.
function ja(a,b){var c=function(d){var e=c.cache,f=""+(b?b.apply(this,arguments):d);return j(e,f)||(e[f]=a.apply(this,arguments)),e[f]};return c.cache={},c}
// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function ka(a,b,c){var d,e,f,g,h=0;c||(c={});var i=function(){h=c.leading===!1?0:gc(),d=null,g=a.apply(e,f),d||(e=f=null)},j=function(){var j=gc();h||c.leading!==!1||(h=j);var k=b-(j-h);return e=this,f=arguments,0>=k||k>b?(d&&(clearTimeout(d),d=null),h=j,g=a.apply(e,f),d||(e=f=null)):d||c.trailing===!1||(d=setTimeout(i,k)),g};return j.cancel=function(){clearTimeout(d),h=0,d=e=f=null},j}
// When a sequence of calls of the returned function ends, the argument
// function is triggered. The end of a sequence is defined by the `wait`
// parameter. If `immediate` is passed, the argument function will be
// triggered at the beginning of the sequence instead of at the end.
function la(a,c,d){var e,f,g,h,i,j=function(){var b=gc()-f;c>b?e=setTimeout(j,c-b):(e=null,d||(h=a.apply(i,g)),e||(g=i=null))},k=b(function(b){return i=this,g=b,f=gc(),e||(e=setTimeout(j,c),d&&(h=a.apply(i,g))),h});return k.cancel=function(){clearTimeout(e),e=g=i=null},k}
// Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.
function ma(a,b){return rc(b,a)}
// Returns a negated version of the passed-in predicate.
function na(a){return function(){return!a.apply(this,arguments)}}
// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
function oa(){var a=arguments,b=a.length-1;return function(){for(var c=b,d=a[b].apply(this,arguments);c--;)d=a[c].call(this,d);return d}}
// Returns a function that will only be executed on and after the Nth call.
function pa(a,b){return function(){return--a<1?b.apply(this,arguments):void 0}}
// Returns a function that will only be executed up to (but not including) the
// Nth call.
function qa(a,b){var c;return function(){return--a>0&&(c=b.apply(this,arguments)),1>=a&&(b=null),c}}
// Returns the first key on an object that passes a truth test.
function ra(a,b,c){b=X(b,c);for(var d,e=s(a),f=0,g=e.length;g>f;f++)if(d=e[f],b(a[d],d,a))return d}
// Internal function to generate `_.findIndex` and `_.findLastIndex`.
function sa(a){return function(b,c,d){c=X(c,d);for(var e=Sb(b),f=a>0?0:e-1;f>=0&&e>f;f+=a)if(c(b[f],f,b))return f;return-1}}
// Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
function ta(a,b,c,d){c=X(c,d,1);for(var e=c(b),f=0,g=Sb(a);g>f;){var h=Math.floor((f+g)/2);c(a[h])<e?f=h+1:g=h}return f}
// Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
function ua(a,b,c){return function(d,e,f){var g=0,h=Sb(d);if("number"==typeof f)a>0?g=f>=0?f:Math.max(f+h,g):h=f>=0?Math.min(f+1,h):f+h+1;else if(c&&f&&h)return f=c(d,e),d[f]===e?f:-1;if(e!==e)return f=b(ib.call(d,g,h),l),f>=0?f+g:-1;for(f=a>0?g:h-1;f>=0&&h>f;f+=a)if(d[f]===e)return f;return-1}}
// Return the first value which passes a truth test.
function va(a,b,c){var d=tc(a)?yc:ra,e=d(a,b,c);return void 0!==e&&-1!==e?a[e]:void 0}
// Convenience version of a common use case of `_.find`: getting the first
// object containing specific `key:value` pairs.
function wa(a,b){return va(a,S(b))}
// The cornerstone for collection functions, an `each`
// implementation, aka `forEach`.
// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
function xa(a,b,c){b=U(b,c);var d,e;if(tc(a))for(d=0,e=a.length;e>d;d++)b(a[d],d,a);else{var f=s(a);for(d=0,e=f.length;e>d;d++)b(a[f[d]],f[d],a)}return a}
// Return the results of applying the iteratee to each element.
function ya(a,b,c){b=X(b,c);for(var d=!tc(a)&&s(a),e=(d||a).length,f=Array(e),g=0;e>g;g++){var h=d?d[g]:g;f[g]=b(a[h],h,a)}return f}
// Internal helper to create a reducing function, iterating left or right.
function za(a){
// Wrap code that reassigns argument variables in a separate function than
// the one that accesses `arguments.length` to avoid a perf hit. (#1991)
var b=function(b,c,d,e){var f=!tc(b)&&s(b),g=(f||b).length,h=a>0?0:g-1;for(e||(d=b[f?f[h]:h],h+=a);h>=0&&g>h;h+=a){var i=f?f[h]:h;d=c(d,b[i],i,b)}return d};return function(a,c,d,e){var f=arguments.length>=3;return b(a,U(c,e,4),d,f)}}
// Return all the elements that pass a truth test.
function Aa(a,b,c){var d=[];return b=X(b,c),xa(a,function(a,c,e){b(a,c,e)&&d.push(a)}),d}
// Return all the elements for which a truth test fails.
function Ba(a,b,c){return Aa(a,na(X(b)),c)}
// Determine whether all of the elements pass a truth test.
function Ca(a,b,c){b=X(b,c);for(var d=!tc(a)&&s(a),e=(d||a).length,f=0;e>f;f++){var g=d?d[f]:f;if(!b(a[g],g,a))return!1}return!0}
// Determine if at least one element in the object passes a truth test.
function Da(a,b,c){b=X(b,c);for(var d=!tc(a)&&s(a),e=(d||a).length,f=0;e>f;f++){var g=d?d[f]:f;if(b(a[g],g,a))return!0}return!1}
// Determine if the array or object contains a given item (using `===`).
function Ea(a,b,c,d){return tc(a)||(a=C(a)),("number"!=typeof c||d)&&(c=0),Ac(a,b,c)>=0}
// Convenience version of a common use case of `_.map`: fetching a property.
function Fa(a,b){return ya(a,T(b))}
// Convenience version of a common use case of `_.filter`: selecting only
// objects containing specific `key:value` pairs.
function Ga(a,b){return Aa(a,S(b))}
// Return the maximum element (or element-based computation).
function Ha(a,b,c){var d,e,f=-(1/0),g=-(1/0);if(null==b||"number"==typeof b&&"object"!=typeof a[0]&&null!=a){a=tc(a)?a:C(a);for(var h=0,i=a.length;i>h;h++)d=a[h],null!=d&&d>f&&(f=d)}else b=X(b,c),xa(a,function(a,c,d){e=b(a,c,d),(e>g||e===-(1/0)&&f===-(1/0))&&(f=a,g=e)});return f}
// Return the minimum element (or element-based computation).
function Ia(a,b,c){var d,e,f=1/0,g=1/0;if(null==b||"number"==typeof b&&"object"!=typeof a[0]&&null!=a){a=tc(a)?a:C(a);for(var h=0,i=a.length;i>h;h++)d=a[h],null!=d&&f>d&&(f=d)}else b=X(b,c),xa(a,function(a,c,d){e=b(a,c,d),(g>e||e===1/0&&f===1/0)&&(f=a,g=e)});return f}function Ja(a){return a?Lb(a)?ib.call(a):wb(a)?a.match(Fc):tc(a)?ya(a,R):C(a):[]}
// Sample **n** random values from a collection using the modern version of the
// [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `_.map`.
function Ka(a,b,c){if(null==b||c)return tc(a)||(a=C(a)),a[aa(a.length-1)];var d=Ja(a),e=Sb(d);b=Math.max(Math.min(b,e),0);for(var f=e-1,g=0;b>g;g++){var h=aa(g,f),i=d[g];d[g]=d[h],d[h]=i}return d.slice(0,b)}
// Shuffle a collection.
function La(a){return Ka(a,1/0)}
// Sort the object's values by a criterion produced by an iteratee.
function Ma(a,b,c){var d=0;return b=X(b,c),Fa(ya(a,function(a,c,e){return{value:a,index:d++,criteria:b(a,c,e)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;if(c!==d){if(c>d||void 0===c)return 1;if(d>c||void 0===d)return-1}return a.index-b.index}),"value")}
// An internal function used for aggregate "group by" operations.
function Na(a,b){return function(c,d,e){var f=b?[[],[]]:{};return d=X(d,e),xa(c,function(b,e){var g=d(b,e,c);a(f,b,g)}),f}}
// Return the number of elements in a collection.
function Oa(a){return null==a?0:tc(a)?a.length:s(a).length}
// Internal `_.pick` helper function to determine whether `key` is an enumerable
// property name of `obj`.
function Pa(a,b,c){return b in c}
// Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N.
function Qa(a,b,c){return ib.call(a,0,Math.max(0,a.length-(null==b||c?1:b)))}
// Get the first element of an array. Passing **n** will return the first N
// values in the array. The **guard** check allows it to work with `_.map`.
function Ra(a,b,c){return null==a||a.length<1?null==b||c?void 0:[]:null==b||c?a[0]:Qa(a,a.length-b)}
// Returns everything but the first entry of the `array`. Especially useful on
// the `arguments` object. Passing an **n** will return the rest N values in the
// `array`.
function Sa(a,b,c){return ib.call(a,null==b||c?1:b)}
// Get the last element of an array. Passing **n** will return the last N
// values in the array.
function Ta(a,b,c){return null==a||a.length<1?null==b||c?void 0:[]:null==b||c?a[a.length-1]:Sa(a,Math.max(0,a.length-b))}
// Trim out all falsy values from an array.
function Ua(a){return Aa(a,Boolean)}
// Flatten out an array, either recursively (by default), or up to `depth`.
// Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
function Va(a,b){return ia(a,b,!1)}
// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// The faster algorithm will not work with an iteratee if the iteratee
// is not a one-to-one function, so providing an iteratee will disable
// the faster algorithm.
function Wa(a,b,c,d){f(b)||(d=c,c=b,b=!1),null!=c&&(c=X(c,d));for(var e=[],g=[],h=0,i=Sb(a);i>h;h++){var j=a[h],k=c?c(j,h,a):j;b&&!c?(h&&g===k||e.push(j),g=k):c?Ea(g,k)||(g.push(k),e.push(j)):Ea(e,j)||e.push(j)}return e}
// Produce an array that contains every item shared between all the
// passed-in arrays.
function Xa(a){for(var b=[],c=arguments.length,d=0,e=Sb(a);e>d;d++){var f=a[d];if(!Ea(b,f)){var g;for(g=1;c>g&&Ea(arguments[g],f);g++);g===c&&b.push(f)}}return b}
// Complement of zip. Unzip accepts an array of arrays and groups
// each array's elements on shared indices.
function Ya(a){for(var b=a&&Ha(a,Sb).length||0,c=Array(b),d=0;b>d;d++)c[d]=Fa(a,d);return c}
// Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values. Passing by pairs is the reverse of `_.pairs`.
function Za(a,b){for(var c={},d=0,e=Sb(a);e>d;d++)b?c[a[d]]=b[d]:c[a[d][0]]=a[d][1];return c}
// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](https://docs.python.org/library/functions.html#range).
function $a(a,b,c){null==b&&(b=a||0,a=0),c||(c=a>b?-1:1);for(var d=Math.max(Math.ceil((b-a)/c),0),e=Array(d),f=0;d>f;f++,a+=c)e[f]=a;return e}
// Chunk a single array into multiple arrays, each containing `count` or fewer
// items.
function _a(a,b){if(null==b||1>b)return[];for(var c=[],d=0,e=a.length;e>d;)c.push(ib.call(a,d,d+=b));return c}
// Helper function to continue chaining intermediate results.
function ab(a,b){return a._chain?v(b).chain():b}
// Add your own custom functions to the Underscore object.
function bb(a){return xa(F(a),function(b){var c=v[b]=a[b];v.prototype[b]=function(){var a=[this._wrapped];return hb.apply(a,arguments),ab(this,c.apply(v,a))}}),v}
//     Underscore.js 1.13.3
//     https://underscorejs.org
//     (c) 2009-2022 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
// Current version.
var cb="1.13.3",db="object"==typeof self&&self.self===self&&self||"object"==typeof a&&a.global===a&&a||Function("return this")()||{},eb=Array.prototype,fb=Object.prototype,gb="undefined"!=typeof Symbol?Symbol.prototype:null,hb=eb.push,ib=eb.slice,jb=fb.toString,kb=fb.hasOwnProperty,lb="undefined"!=typeof ArrayBuffer,mb="undefined"!=typeof DataView,nb=Array.isArray,ob=Object.keys,pb=Object.create,qb=lb&&ArrayBuffer.isView,rb=isNaN,sb=isFinite,tb=!{toString:null}.propertyIsEnumerable("toString"),ub=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],vb=Math.pow(2,53)-1,wb=h("String"),xb=h("Number"),yb=h("Date"),zb=h("RegExp"),Ab=h("Error"),Bb=h("Symbol"),Cb=h("ArrayBuffer"),Db=h("Function"),Eb=db.document&&db.document.childNodes;"function"!=typeof/./&&"object"!=typeof Int8Array&&"function"!=typeof Eb&&(Db=function(a){return"function"==typeof a||!1});var Fb=Db,Gb=h("Object"),Hb=mb&&Gb(new DataView(new ArrayBuffer(8))),Ib="undefined"!=typeof Map&&Gb(new Map),Jb=h("DataView"),Kb=Hb?i:Jb,Lb=nb||h("Array"),Mb=h("Arguments");
// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
!function(){Mb(arguments)||(Mb=function(a){return j(a,"callee")})}();var Nb=Mb,Ob=o("byteLength"),Pb=n(Ob),Qb=/\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/,Rb=lb?p:m(!1),Sb=o("length");v.VERSION=cb,
// Extracts the result from a wrapped and chained object.
v.prototype.value=function(){return this._wrapped},
// Provide unwrapping proxies for some methods used in engine operations
// such as arithmetic and JSON stringification.
v.prototype.valueOf=v.prototype.toJSON=v.prototype.value,v.prototype.toString=function(){return String(this._wrapped)};
// We use this string twice, so give it a name for minification.
var Tb="[object DataView]",Ub="forEach",Vb="has",Wb=["clear","delete"],Xb=["get",Vb,"set"],Yb=Wb.concat(Ub,Xb),Zb=Wb.concat(Xb),$b=["add"].concat(Wb,Ub,Vb),_b=Ib?B(Yb):h("Map"),ac=Ib?B(Zb):h("WeakMap"),bc=Ib?B($b):h("Set"),cc=h("WeakSet"),dc=G(A),ec=G(s),fc=G(A,!0);v.toPath=M,v.iteratee=W;
// A (possibly faster) way to get the current timestamp as an integer.
var gc=Date.now||function(){return(new Date).getTime()},hc={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},ic=ba(hc),jc=E(hc),kc=ba(jc),lc=v.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g},mc=/(.)^/,nc={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},oc=/\\|'|\r|\n|\u2028|\u2029/g,pc=/^\s*(\w|\$)+\s*$/,qc=0,rc=b(function(a,b){var c=rc.placeholder,d=function(){for(var e=0,f=b.length,g=Array(f),h=0;f>h;h++)g[h]=b[h]===c?arguments[e++]:b[h];for(;e<arguments.length;)g.push(arguments[e++]);return ha(a,d,this,this,g)};return d});rc.placeholder=v;
// Create a function bound to a given object (assigning `this`, and arguments,
// optionally).
var sc=b(function(a,c,d){if(!Fb(a))throw new TypeError("Bind must be called on a function");var e=b(function(b){return ha(a,e,c,this,d.concat(b))});return e}),tc=n(Sb),uc=b(function(a,b){b=ia(b,!1,!1);var c=b.length;if(1>c)throw new Error("bindAll must be passed function names");for(;c--;){var d=b[c];a[d]=sc(a[d],a)}return a}),vc=b(function(a,b,c){return setTimeout(function(){return a.apply(null,c)},b)}),wc=rc(vc,v,1),xc=rc(qa,2),yc=sa(1),zc=sa(-1),Ac=ua(1,yc,ta),Bc=ua(-1,zc),Cc=za(1),Dc=za(-1),Ec=b(function(a,b,c){var d,e;return Fb(b)?e=b:(b=N(b),d=b.slice(0,-1),b=b[b.length-1]),ya(a,function(a){var f=e;if(!f){if(d&&d.length&&(a=O(a,d)),null==a)return void 0;f=a[b]}return null==f?f:f.apply(a,c)})}),Fc=/[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g,Gc=Na(function(a,b,c){j(a,c)?a[c].push(b):a[c]=[b]}),Hc=Na(function(a,b,c){a[c]=b}),Ic=Na(function(a,b,c){j(a,c)?a[c]++:a[c]=1}),Jc=Na(function(a,b,c){a[c?0:1].push(b)},!0),Kc=b(function(a,b){var c={},d=b[0];if(null==a)return c;Fb(d)?(b.length>1&&(d=U(d,b[1])),b=A(a)):(d=Pa,b=ia(b,!1,!1),a=Object(a));for(var e=0,f=b.length;f>e;e++){var g=b[e],h=a[g];d(h,g,a)&&(c[g]=h)}return c}),Lc=b(function(a,b){var c,d=b[0];return Fb(d)?(d=na(d),b.length>1&&(c=b[1])):(b=ya(ia(b,!1,!1),String),d=function(a,c){return!Ea(b,c)}),Kc(a,d,c)}),Mc=b(function(a,b){return b=ia(b,!0,!0),Aa(a,function(a){return!Ea(b,a)})}),Nc=b(function(a,b){return Mc(a,b)}),Oc=b(function(a){return Wa(ia(a,!0,!0))}),Pc=b(Ya);
// Add all mutator `Array` functions to the wrapper.
xa(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=eb[a];v.prototype[a]=function(){var c=this._wrapped;return null!=c&&(b.apply(c,arguments),"shift"!==a&&"splice"!==a||0!==c.length||delete c[0]),ab(this,c)}}),
// Add all accessor `Array` functions to the wrapper.
xa(["concat","join","slice"],function(a){var b=eb[a];v.prototype[a]=function(){var a=this._wrapped;return null!=a&&(a=b.apply(a,arguments)),ab(this,a)}});
// Named Exports
var Qc={__proto__:null,VERSION:cb,restArguments:b,isObject:c,isNull:d,isUndefined:e,isBoolean:f,isElement:g,isString:wb,isNumber:xb,isDate:yb,isRegExp:zb,isError:Ab,isSymbol:Bb,isArrayBuffer:Cb,isDataView:Kb,isArray:Lb,isFunction:Fb,isArguments:Nb,isFinite:k,isNaN:l,isTypedArray:Rb,isEmpty:t,isMatch:u,isEqual:z,isMap:_b,isWeakMap:ac,isSet:bc,isWeakSet:cc,keys:s,allKeys:A,values:C,pairs:D,invert:E,functions:F,methods:F,extend:dc,extendOwn:ec,assign:ec,defaults:fc,create:J,clone:K,tap:L,get:P,has:Q,mapObject:Y,identity:R,constant:m,noop:Z,toPath:M,property:T,propertyOf:$,matcher:S,matches:S,times:_,random:aa,now:gc,escape:ic,unescape:kc,templateSettings:lc,template:da,result:ea,uniqueId:fa,chain:ga,iteratee:W,partial:rc,bind:sc,bindAll:uc,memoize:ja,delay:vc,defer:wc,throttle:ka,debounce:la,wrap:ma,negate:na,compose:oa,after:pa,before:qa,once:xc,findKey:ra,findIndex:yc,findLastIndex:zc,sortedIndex:ta,indexOf:Ac,lastIndexOf:Bc,find:va,detect:va,findWhere:wa,each:xa,forEach:xa,map:ya,collect:ya,reduce:Cc,foldl:Cc,inject:Cc,reduceRight:Dc,foldr:Dc,filter:Aa,select:Aa,reject:Ba,every:Ca,all:Ca,some:Da,any:Da,contains:Ea,includes:Ea,include:Ea,invoke:Ec,pluck:Fa,where:Ga,max:Ha,min:Ia,shuffle:La,sample:Ka,sortBy:Ma,groupBy:Gc,indexBy:Hc,countBy:Ic,partition:Jc,toArray:Ja,size:Oa,pick:Kc,omit:Lc,first:Ra,head:Ra,take:Ra,initial:Qa,last:Ta,rest:Sa,tail:Sa,drop:Sa,compact:Ua,flatten:Va,without:Nc,uniq:Wa,unique:Wa,union:Oc,intersection:Xa,difference:Mc,unzip:Ya,transpose:Ya,zip:Pc,object:Za,range:$a,chunk:_a,mixin:bb,"default":v},Rc=bb(Qc);
// Legacy Node.js API.
return Rc._=Rc,Rc})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],4:[function(a,b,c){(function(c){$=c.$=a("/Users/jeff.keene/Development/StreamingYBTV/node_modules/jquery/dist/jquery.js");(function(a,b,c){
// tipsy, facebook style tooltips for jquery
// version 1.3.1
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license
//
// Modified by Atlassian
// https://github.com/atlassian/tipsy
!function(a){function b(a,b){return"function"==typeof a?a.call(b):a}function c(b){var c=b&&b.jquery?b.get(0):b;return a.contains(document.documentElement,c)}function d(){var a=g++;return"tipsyuid"+a}function e(b,c){this.$element=a(b),this.options=c,this.enabled=!0,this.fixTitle()}var f="To be compatible with jQuery 1.9 and higher, You must pass a selector to tipsy's live argument. For instance, `$(document).tipsy({live: 'a.live'});`",g=0;e.prototype={show:function(){function e(){i.hoverTooltip=!0}function f(){if("in"!=i.hoverState&&(i.hoverTooltip=!1,"manual"!=i.options.trigger)){var a="hover"==i.options.trigger?"mouseleave.tipsy":"blur.tipsy";i.$element.trigger(a)}}
// if element is not in the DOM then don't show the Tipsy and return early
if(c(this.$element)){var g=this.getTitle();if(g&&this.enabled){var h=this.tip();h.find(".tipsy-inner")[this.options.html?"html":"text"](g),h[0].className="tipsy",// reset classname in case of dynamic gravity
h.remove().css({top:0,left:0,visibility:"hidden",display:"block"}).appendTo(document.body);var i=this;this.options.hoverable&&h.hover(e,f),this.options.className&&h.addClass(b(this.options.className,this.$element[0]));var j=a.extend({},this.$element.offset(),{width:this.$element[0].getBoundingClientRect().width,height:this.$element[0].getBoundingClientRect().height}),k={},l=h[0].offsetWidth,m=h[0].offsetHeight,n=b(this.options.gravity,this.$element[0]);switch(2===n.length&&("w"===n.charAt(1)?k.left=j.left+j.width/2-15:k.left=j.left+j.width/2-l+15),n.charAt(0)){case"n":
// left could already be set if gravity is 'nw' or 'ne'
"undefined"==typeof k.left&&(k.left=j.left+j.width/2-l/2),k.top=j.top+j.height+this.options.offset;break;case"s":
// left could already be set if gravity is 'sw' or 'se'
"undefined"==typeof k.left&&(k.left=j.left+j.width/2-l/2,
// We need to apply the left positioning and then recalculate the tooltip height
// If the tooltip is positioned close to the right edge of the window, it could cause
// the tooltip text to overflow and change height.
h.css(k),m=h[0].offsetHeight),k.top=j.top-m-this.options.offset;break;case"e":k.left=j.left-l-this.options.offset,k.top=j.top+j.height/2-m/2;break;case"w":k.left=j.left+j.width+this.options.offset,k.top=j.top+j.height/2-m/2}if(h.css(k).addClass("tipsy-"+n),h.find(".tipsy-arrow")[0].className="tipsy-arrow tipsy-arrow-"+n.charAt(0),this.options.fade?h.stop().css({opacity:0,display:"block",visibility:"visible"}).animate({opacity:this.options.opacity}):h.css({visibility:"visible",opacity:this.options.opacity}),this.options.aria){var o=d();h.attr("id",o),this.$element.attr("aria-describedby",o)}}}},destroy:function(){this.$element.removeData("tipsy"),this.unbindHandlers(),this.hide()},unbindHandlers:function(){this.options.live?a(document).off(".tipsy",this.options.live):this.$element.off(".tipsy")},hide:function(){this.options.fade?this.tip().stop().fadeOut(function(){a(this).remove()}):this.tip().remove(),this.options.aria&&this.$element.removeAttr("aria-describedby")},fixTitle:function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("original-title"))&&a.attr("original-title",a.attr("title")||"").removeAttr("title")},getTitle:function(){var a,b=this.$element,c=this.options;this.fixTitle();var a,c=this.options;return"string"==typeof c.title?a=b.attr("title"==c.title?"original-title":c.title):"function"==typeof c.title&&(a=c.title.call(b[0])),a=(""+a).replace(/(^\s*|\s*$)/,""),a||c.fallback},tip:function(){return this.$tip||(this.$tip=a('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>').attr("role","tooltip"),this.$tip.data("tipsy-pointee",this.$element[0])),this.$tip},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled}},a.fn.tipsy=function(b){function d(c){var d=a.data(c,"tipsy");return d||(d=new e(c,a.fn.tipsy.elementOptions(c,b)),a.data(c,"tipsy",d)),d}function g(){var a=d(this);a.hoverState="in",0==b.delayIn?a.show():(a.fixTitle(),setTimeout(function(){"in"==a.hoverState&&c(a.$element)&&a.show()},b.delayIn))}function h(){var a=d(this);a.hoverState="out",0==b.delayOut?a.hide():setTimeout(function(){"out"!=a.hoverState||a.hoverTooltip||a.hide()},b.delayOut)}if(b===!0)return this.data("tipsy");if("string"==typeof b){var i=this.data("tipsy");return i&&i[b](),this}
// Check for jQuery support and patch live binding for jQuery 3 compat.
if(b=a.extend({},a.fn.tipsy.defaults,b),b.hoverable&&(b.delayOut=b.delayOut||20),b.live===!0){if(!this.selector)
// No more jQuery support!
throw new Error(f);
// Deprecated behaviour
console&&console.warn&&void 0,b.live=this.selector}if(
// create a tipsy object for every selected element,
// even when the events are delegated.
// this allows destruction to occur.
this.each(function(){d(this)}),"manual"!=b.trigger){var j="hover"==b.trigger?"mouseenter.tipsy focus.tipsy":"focus.tipsy",k="hover"==b.trigger?"mouseleave.tipsy blur.tipsy":"blur.tipsy";b.live?a(document).on(j,b.live,g).on(k,b.live,h):this.on(j,g).on(k,h)}return this},a.fn.tipsy.defaults={aria:!1,className:null,delayIn:0,delayOut:0,fade:!1,fallback:"",gravity:"n",html:!1,live:!1,hoverable:!1,offset:0,opacity:.8,title:"title",trigger:"hover"},a.fn.tipsy.revalidate=function(){a(".tipsy").each(function(){var b=a.data(this,"tipsy-pointee");b&&c(b)||a(this).remove()})},
// Overwrite this method to provide options on a per-element basis.
// For example, you could store the gravity in a 'tipsy-gravity' attribute:
// return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
// (remember - do not modify 'options' in place!)
a.fn.tipsy.elementOptions=function(b,c){return a.metadata?a.extend({},c,a(b).metadata()):c},a.fn.tipsy.autoNS=function(){return a(this).offset().top>a(document).scrollTop()+a(window).height()/2?"s":"n"},a.fn.tipsy.autoWE=function(){return a(this).offset().left>a(document).scrollLeft()+a(window).width()/2?"e":"w"},/**
     * yields a closure of the supplied parameters, producing a function that takes
     * no arguments and is suitable for use as an autogravity function like so:
     *
     * @param margin (int) - distance from the viewable region edge that an
     *        element should be before setting its tooltip's gravity to be away
     *        from that edge.
     * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
     *        if there are no viewable region edges effecting the tooltip's
     *        gravity. It will try to vary from this minimally, for example,
     *        if 'sw' is preferred and an element is near the right viewable
     *        region edge, but not the top edge, it will set the gravity for
     *        that element's tooltip to be 'se', preserving the southern
     *        component.
     */
a.fn.tipsy.autoBounds=function(b,c){return function(){var d={ns:c[0],ew:c.length>1?c[1]:!1},e=a(document).scrollTop()+b,f=a(document).scrollLeft()+b,g=a(this);return g.offset().top<e&&(d.ns="n"),g.offset().left<f&&(d.ew="w"),a(window).width()+a(document).scrollLeft()-g.offset().left<b&&(d.ew="e"),a(window).height()+a(document).scrollTop()-g.offset().top<b&&(d.ns="s"),d.ns+(d.ew?d.ew:"")}}}(jQuery)}).call(c,b,void 0,void 0)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"/Users/jeff.keene/Development/StreamingYBTV/node_modules/jquery/dist/jquery.js":9}],9:[function(a,b,c){(function(a){(function(a,b,c,d,e){/*!
 * jQuery JavaScript Library v2.1.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-04-28T16:01Z
 */
!function(b,c){"object"==typeof a&&"object"==typeof a.exports?
// For CommonJS and CommonJS-like environments where a proper `window`
// is present, execute the factory and get jQuery.
// For environments that do not have a `window` with a `document`
// (such as Node.js), expose a factory as module.exports.
// This accentuates the need for the creation of a real `window`.
// e.g. var jQuery = require("jquery")(window);
// See ticket #14549 for more info.
a.exports=b.document?c(b,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return c(a)}:c(b)}("undefined"!=typeof window?window:this,function(a,b){function c(a){
// Support: iOS 8.2 (not reproducible in simulator)
// `in` check used to prevent JIT error (gh-2145)
// hasOwn isn't used here due to false negatives
// regarding Nodelist length in IE
var b="length"in a&&a.length,c=aa.type(a);return"function"===c||aa.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}
// Implement the identical functionality for filter and not
function e(a,b,c){if(aa.isFunction(b))return aa.grep(a,function(a,d){/* jshint -W018 */
return!!b.call(a,d,a)!==c});if(b.nodeType)return aa.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(ia.test(b))return aa.filter(b,a,c);b=aa.filter(b,a)}return aa.grep(a,function(a){return V.call(b,a)>=0!==c})}function f(a,b){for(;(a=a[b])&&1!==a.nodeType;);return a}
// Convert String-formatted options into Object-formatted ones and store in cache
function g(a){var b=pa[a]={};return aa.each(a.match(oa)||[],function(a,c){b[c]=!0}),b}/**
 * The ready event handler and self cleanup method
 */
function h(){$.removeEventListener("DOMContentLoaded",h,!1),a.removeEventListener("load",h,!1),aa.ready()}function i(){
// Support: Android<4,
// Old WebKit does not have Object.preventExtensions/freeze method,
// return new empty object instead with no [[set]] accessor
Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=aa.expando+i.uid++}function j(a,b,c){var d;
// If nothing was found internally, try to fetch any
// data from the HTML5 data-* attribute
if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(va,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:ua.test(c)?aa.parseJSON(c):c}catch(e){}
// Make sure we set the data so it isn't changed later
ta.set(a,b,c)}else c=void 0;return c}function k(){return!0}function l(){return!1}function m(){try{return $.activeElement}catch(a){}}
// Support: 1.x compatibility
// Manipulating tables requires a tbody
function n(a,b){return aa.nodeName(a,"table")&&aa.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}
// Replace/restore the type attribute of script elements for safe DOM manipulation
function o(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function p(a){var b=La.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}
// Mark scripts as having already been evaluated
function q(a,b){for(var c=0,d=a.length;d>c;c++)sa.set(a[c],"globalEval",!b||sa.get(b[c],"globalEval"))}function r(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){
// 1. Copy private data: events, handlers, etc.
if(sa.hasData(a)&&(f=sa.access(a),g=sa.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)aa.event.add(b,e,j[e][c])}
// 2. Copy user data
ta.hasData(a)&&(h=ta.access(a),i=aa.extend({},h),ta.set(b,i))}}function s(a,b){var c=a.getElementsByTagName?a.getElementsByTagName(b||"*"):a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&aa.nodeName(a,b)?aa.merge([a],c):c}
// Fix IE bugs, see support tests
function t(a,b){var c=b.nodeName.toLowerCase();
// Fails to persist the checked state of a cloned checkbox or radio button.
"input"===c&&za.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function u(b,c){var d,e=aa(c.createElement(b)).appendTo(c.body),
// getDefaultComputedStyle might be reliably used only on attached element
f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?
// Use of this method is a temporary fix (more like optimization) until something better comes along,
// since it was removed from specification and supported only in FF
d.display:aa.css(e[0],"display");
// We don't have any data stored on the element,
// so use "detach" method as fast way to get rid of the element
return e.detach(),f}/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function v(a){var b=$,c=Pa[a];
// If the simple way fails, read from inside an iframe
// Use the already-created iframe if possible
// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
// Support: IE
// Store the correct default display
return c||(c=u(a,b),"none"!==c&&c||(Oa=(Oa||aa("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=Oa[0].contentDocument,b.write(),b.close(),c=u(a,b),Oa.detach()),Pa[a]=c),c}function w(a,b,c){var d,e,f,g,h=a.style;
// Support: IE9
// getPropertyValue is only needed for .css('filter') (#12537)
// Support: iOS < 6
// A tribute to the "awesome hack by Dean Edwards"
// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
// Remember the original values
// Put in the new values to get a computed value out
// Revert the changed values
// Support: IE
// IE returns zIndex value as an integer.
return c=c||Sa(a),c&&(g=c.getPropertyValue(b)||c[b]),c&&(""!==g||aa.contains(a.ownerDocument,a)||(g=aa.style(a,b)),Ra.test(g)&&Qa.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function x(a,b){
// Define the hook, we'll check on the first run if it's really needed.
return{get:function(){
// Hook not needed (or it's not possible to use it due
// to missing dependency), remove it.
return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}
// Return a css property mapped to a potentially vendor prefixed property
function y(a,b){
// Shortcut for names that are not vendor prefixed
if(b in a)return b;for(
// Check for vendor prefixed names
var c=b[0].toUpperCase()+b.slice(1),d=b,e=Ya.length;e--;)if(b=Ya[e]+c,b in a)return b;return d}function z(a,b,c){var d=Ua.exec(b);
// Guard against undefined "subtract", e.g., when used as in cssHooks
return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function A(a,b,c,d,e){for(var f=c===(d?"border":"content")?
// If we already have the right measurement, avoid augmentation
4:"width"===b?1:0,g=0;4>f;f+=2)
// Both box models exclude margin, so add it if we want it
"margin"===c&&(g+=aa.css(a,c+xa[f],!0,e)),d?(
// border-box includes padding, so remove it if we want content
"content"===c&&(g-=aa.css(a,"padding"+xa[f],!0,e)),
// At this point, extra isn't border nor margin, so remove border
"margin"!==c&&(g-=aa.css(a,"border"+xa[f]+"Width",!0,e))):(g+=aa.css(a,"padding"+xa[f],!0,e),"padding"!==c&&(g+=aa.css(a,"border"+xa[f]+"Width",!0,e)));return g}function B(a,b,c){
// Start with offset property, which is equivalent to the border-box value
var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Sa(a),g="border-box"===aa.css(a,"boxSizing",!1,f);
// Some non-html elements return undefined for offsetWidth, so check for null/undefined
// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
if(0>=e||null==e){
// Computed unit is not pixels. Stop here and return.
if(e=w(a,b,f),(0>e||null==e)&&(e=a.style[b]),Ra.test(e))return e;
// Check for style in case a browser which returns unreliable values
// for getComputedStyle silently falls back to the reliable elem.style
d=g&&(Z.boxSizingReliable()||e===a.style[b]),
// Normalize "", auto, and prepare for extra
e=parseFloat(e)||0}
// Use the active box-sizing model to add/subtract irrelevant styles
return e+A(a,b,c||(g?"border":"content"),d,f)+"px"}function C(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=sa.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&ya(d)&&(f[g]=sa.access(d,"olddisplay",v(d.nodeName)))):(e=ya(d),"none"===c&&e||sa.set(d,"olddisplay",e?c:aa.css(d,"display"))));
// Set the display of most of the elements in a second loop
// to avoid the constant reflow
for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function D(a,b,c,d,e){return new D.prototype.init(a,b,c,d,e)}
// Animations created synchronously will run synchronously
function E(){return setTimeout(function(){Za=void 0}),Za=aa.now()}
// Generate parameters to create a standard animation
function F(a,b){var c,d=0,e={height:a};for(
// If we include width, step value is 1 to do all cssExpand values,
// otherwise step value is 2 to skip over Left and Right
b=b?1:0;4>d;d+=2-b)c=xa[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function G(a,b,c){for(var d,e=(db[b]||[]).concat(db["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))
// We're done with this property
return d}function H(a,b,c){/* jshint validthis: true */
var d,e,f,g,h,i,j,k,l=this,m={},n=a.style,o=a.nodeType&&ya(a),p=sa.get(a,"fxshow");
// Handle queue: false promises
c.queue||(h=aa._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,aa.queue(a,"fx").length||h.empty.fire()})})),
// Height/width overflow pass
1===a.nodeType&&("height"in b||"width"in b)&&(
// Make sure that nothing sneaks out
// Record all 3 overflow attributes because IE9-10 do not
// change the overflow attribute when overflowX and
// overflowY are set to the same value
c.overflow=[n.overflow,n.overflowX,n.overflowY],j=aa.css(a,"display"),k="none"===j?sa.get(a,"olddisplay")||v(a.nodeName):j,"inline"===k&&"none"===aa.css(a,"float")&&(n.display="inline-block")),c.overflow&&(n.overflow="hidden",l.always(function(){n.overflow=c.overflow[0],n.overflowX=c.overflow[1],n.overflowY=c.overflow[2]}));
// show/hide pass
for(d in b)if(e=b[d],_a.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(o?"hide":"show")){
// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
if("show"!==e||!p||void 0===p[d])continue;o=!0}m[d]=p&&p[d]||aa.style(a,d)}else j=void 0;if(aa.isEmptyObject(m))"inline"===("none"===j?v(a.nodeName):j)&&(n.display=j);else{p?"hidden"in p&&(o=p.hidden):p=sa.access(a,"fxshow",{}),
// Store state if its toggle - enables .stop().toggle() to "reverse"
f&&(p.hidden=!o),o?aa(a).show():l.done(function(){aa(a).hide()}),l.done(function(){var b;sa.remove(a,"fxshow");for(b in m)aa.style(a,b,m[b])});for(d in m)g=G(o?p[d]:0,d,l),d in p||(p[d]=g.start,o&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function I(a,b){var c,d,e,f,g;
// camelCase, specialEasing and expand cssHook pass
for(c in a)if(d=aa.camelCase(c),e=b[d],f=a[c],aa.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=aa.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];
// Not quite $.extend, this won't overwrite existing keys.
// Reusing 'index' because we have the correct "name"
for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function J(a,b,c){var d,e,f=0,g=cb.length,h=aa.Deferred().always(function(){
// Don't match elem in the :animated selector
delete i.elem}),i=function(){if(e)return!1;for(var b=Za||E(),c=Math.max(0,j.startTime+j.duration-b),
// Support: Android 2.3
// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:aa.extend({},b),opts:aa.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:Za||E(),duration:c.duration,tweens:[],createTween:function(b,c){var d=aa.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,
// If we are going to the end, we want to run all the tweens
// otherwise we skip this part
d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);
// Resolve when we played the last frame; otherwise, reject
return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(I(k,j.opts.specialEasing);g>f;f++)if(d=cb[f].call(j,a,k,j.opts))return d;
// attach callbacks from options
return aa.map(k,G,j),aa.isFunction(j.opts.start)&&j.opts.start.call(a,j),aa.fx.timer(aa.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}
// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function K(a){
// dataTypeExpression is optional and defaults to "*"
return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(oa)||[];if(aa.isFunction(c))
// For each dataType in the dataTypeExpression
for(;d=f[e++];)
// Prepend if requested
"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}
// Base inspection function for prefilters and transports
function L(a,b,c,d){function e(h){var i;return f[h]=!0,aa.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||g||f[j]?g?!(i=j):void 0:(b.dataTypes.unshift(j),e(j),!1)}),i}var f={},g=a===ub;return e(b.dataTypes[0])||!f["*"]&&e("*")}
// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function M(a,b){var c,d,e=aa.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&aa.extend(!0,a,d),a}/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function N(a,b,c){
// Remove auto dataType and get content-type in the process
for(var d,e,f,g,h=a.contents,i=a.dataTypes;"*"===i[0];)i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));
// Check if we're dealing with a known content-type
if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}
// Check to see if we have a response for the expected dataType
if(i[0]in c)f=i[0];else{
// Try convertible dataTypes
for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}
// Or just use first one
f=f||g}
// If we found a dataType
// We add the dataType to the list if needed
// and return the corresponding response
// If we found a dataType
// We add the dataType to the list if needed
// and return the corresponding response
return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function O(a,b,c,d){var e,f,g,h,i,j={},
// Work with a copy of dataTypes in case we need to modify it for conversion
k=a.dataTypes.slice();
// Create converters map with lowercased keys
if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];
// Convert to each sequential dataType
for(f=k.shift();f;)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),
// Apply the dataFilter if provided
!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())
// There's only work to do if current dataType is non-auto
if("*"===f)f=i;else if("*"!==i&&i!==f){
// If none found, seek a pair
if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){
// Condense equivalence converters
g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}
// Apply converter (if not an equivalence)
if(g!==!0)
// Unless errors are allowed to bubble, catch and return them
if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}function P(a,b,c,d){var e;if(aa.isArray(b))
// Serialize array item.
aa.each(b,function(b,e){c||zb.test(a)?
// Treat each array item as a scalar.
d(a,e):
// Item is non-scalar (array or object), encode its numeric index.
P(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==aa.type(b))
// Serialize scalar item.
d(a,b);else
// Serialize object item.
for(e in b)P(a+"["+e+"]",b[e],c,d)}/**
 * Gets a window from an element
 */
function Q(a){return aa.isWindow(a)?a:9===a.nodeType&&a.defaultView}
// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//
var R=[],S=R.slice,T=R.concat,U=R.push,V=R.indexOf,W={},X=W.toString,Y=W.hasOwnProperty,Z={},
// Use the correct document accordingly with window argument (sandbox)
$=a.document,_="2.1.4",
// Define a local copy of jQuery
aa=function(a,b){
// The jQuery object is actually just the init constructor 'enhanced'
// Need init if jQuery is called (just allow error to be thrown if not included)
return new aa.fn.init(a,b)},
// Support: Android<4.1
// Make sure we trim BOM and NBSP
ba=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
// Matches dashed string for camelizing
ca=/^-ms-/,da=/-([\da-z])/gi,
// Used by jQuery.camelCase as callback to replace()
ea=function(a,b){return b.toUpperCase()};aa.fn=aa.prototype={
// The current version of jQuery being used
jquery:_,constructor:aa,
// Start with an empty selector
selector:"",
// The default length of a jQuery object is 0
length:0,toArray:function(){return S.call(this)},
// Get the Nth element in the matched element set OR
// Get the whole matched element set as a clean array
get:function(a){
// Return just the one element from the set
// Return all the elements in a clean array
return null!=a?0>a?this[a+this.length]:this[a]:S.call(this)},
// Take an array of elements and push it onto the stack
// (returning the new matched element set)
pushStack:function(a){
// Build a new jQuery matched element set
var b=aa.merge(this.constructor(),a);
// Return the newly-formed element set
// Add the old object onto the stack (as a reference)
return b.prevObject=this,b.context=this.context,b},
// Execute a callback for every element in the matched set.
// (You can seed the arguments with an array of args, but this is
// only used internally.)
each:function(a,b){return aa.each(this,a,b)},map:function(a){return this.pushStack(aa.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(S.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},
// For internal use only.
// Behaves like an Array's method, not like a jQuery method.
push:U,sort:R.sort,splice:R.splice},aa.extend=aa.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for(
// Handle a deep copy situation
"boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),
// Handle case when target is a string or something (possible in deep copy)
"object"==typeof g||aa.isFunction(g)||(g={}),
// Extend jQuery itself if only one argument is passed
h===i&&(g=this,h--);i>h;h++)
// Only deal with non-null/undefined values
if(null!=(a=arguments[h]))
// Extend the base object
for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(aa.isPlainObject(d)||(e=aa.isArray(d)))?(e?(e=!1,f=c&&aa.isArray(c)?c:[]):f=c&&aa.isPlainObject(c)?c:{},g[b]=aa.extend(j,f,d)):void 0!==d&&(g[b]=d));
// Return the modified object
return g},aa.extend({
// Unique for each copy of jQuery on the page
expando:"jQuery"+(_+Math.random()).replace(/\D/g,""),
// Assume jQuery is ready without the ready module
isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===aa.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){
// parseFloat NaNs numeric-cast false positives (null|true|false|"")
// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
// subtraction forces infinities to NaN
// adding 1 corrects loss of precision from parseFloat (#15100)
return!aa.isArray(a)&&a-parseFloat(a)+1>=0},isPlainObject:function(a){
// Not plain objects:
// - Any object or value whose internal [[Class]] property is not "[object Object]"
// - DOM nodes
// - window
// Not plain objects:
// - Any object or value whose internal [[Class]] property is not "[object Object]"
// - DOM nodes
// - window
return"object"!==aa.type(a)||a.nodeType||aa.isWindow(a)?!1:a.constructor&&!Y.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?W[X.call(a)]||"object":typeof a},
// Evaluates a script in a global context
globalEval:function(a){var b,c=eval;a=aa.trim(a),a&&(1===a.indexOf("use strict")?(b=$.createElement("script"),b.text=a,$.head.appendChild(b).parentNode.removeChild(b)):c(a))},
// Convert dashed to camelCase; used by the css and data modules
// Support: IE9-11+
// Microsoft forgot to hump their vendor prefix (#9572)
camelCase:function(a){return a.replace(ca,"ms-").replace(da,ea)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},
// args is for internal usage only
each:function(a,b,d){var e,f=0,g=a.length,h=c(a);if(d){if(h)for(;g>f&&(e=b.apply(a[f],d),e!==!1);f++);else for(f in a)if(e=b.apply(a[f],d),e===!1)break}else if(h)for(;g>f&&(e=b.call(a[f],f,a[f]),e!==!1);f++);else for(f in a)if(e=b.call(a[f],f,a[f]),e===!1)break;return a},
// Support: Android<4.1
trim:function(a){return null==a?"":(a+"").replace(ba,"")},
// results is for internal usage only
makeArray:function(a,b){var d=b||[];return null!=a&&(c(Object(a))?aa.merge(d,"string"==typeof a?[a]:a):U.call(d,a)),d},inArray:function(a,b,c){return null==b?-1:V.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){
// Go through the array, only saving the items
// that pass the validator function
for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},
// arg is for internal usage only
map:function(a,b,d){var e,f=0,g=a.length,h=c(a),i=[];
// Go through the array, translating each of the items to their new values
if(h)for(;g>f;f++)e=b(a[f],f,d),null!=e&&i.push(e);else for(f in a)e=b(a[f],f,d),null!=e&&i.push(e);
// Flatten any nested arrays
return T.apply([],i)},
// A global GUID counter for objects
guid:1,
// Bind a function to a context, optionally partially applying any
// arguments.
proxy:function(a,b){var c,d,e;
// Quick check to determine if target is callable, in the spec
// this throws a TypeError, but we will just return undefined.
// Quick check to determine if target is callable, in the spec
// this throws a TypeError, but we will just return undefined.
// Simulated bind
// Set the guid of unique handler to the same of original handler, so it can be removed
return"string"==typeof b&&(c=a[b],b=a,a=c),aa.isFunction(a)?(d=S.call(arguments,2),e=function(){return a.apply(b||this,d.concat(S.call(arguments)))},e.guid=a.guid=a.guid||aa.guid++,e):void 0},now:Date.now,
// jQuery.support is not used in Core but other projects attach their
// properties to it so it needs to exist.
support:Z}),
// Populate the class2type map
aa.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){W["[object "+b+"]"]=b.toLowerCase()});var fa=/*!
 * Sizzle CSS Selector Engine v2.2.0-pre
 * http://sizzlejs.com/
 *
 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-16
 */
function(a){function b(a,b,c,d){var e,f,g,h,
// QSA vars
i,j,l,n,o,p;if((b?b.ownerDocument||b:O)!==G&&F(b),b=b||G,c=c||[],h=b.nodeType,"string"!=typeof a||!a||1!==h&&9!==h&&11!==h)return c;if(!d&&I){
// Try to shortcut find operations when possible (e.g., not under DocumentFragment)
if(11!==h&&(e=sa.exec(a)))
// Speed-up: Sizzle("#ID")
if(g=e[1]){if(9===h){
// Check parentNode to catch when Blackberry 4.6 returns
// nodes that are no longer in the document (jQuery #6963)
if(f=b.getElementById(g),!f||!f.parentNode)return c;
// Handle the case where IE, Opera, and Webkit return items
// by name instead of ID
if(f.id===g)return c.push(f),c}else
// Context is not a document
if(b.ownerDocument&&(f=b.ownerDocument.getElementById(g))&&M(b,f)&&f.id===g)return c.push(f),c}else{if(e[2])return $.apply(c,b.getElementsByTagName(a)),c;if((g=e[3])&&v.getElementsByClassName)return $.apply(c,b.getElementsByClassName(g)),c}
// QSA path
if(v.qsa&&(!J||!J.test(a))){
// qSA works strangely on Element-rooted queries
// We can work around this by specifying an extra ID on the root
// and working up from there (Thanks to Andrew Dupont for the technique)
// IE 8 doesn't work on object elements
if(n=l=N,o=b,p=1!==h&&a,1===h&&"object"!==b.nodeName.toLowerCase()){for(j=z(a),(l=b.getAttribute("id"))?n=l.replace(ua,"\\$&"):b.setAttribute("id",n),n="[id='"+n+"'] ",i=j.length;i--;)j[i]=n+m(j[i]);o=ta.test(a)&&k(b.parentNode)||b,p=j.join(",")}if(p)try{return $.apply(c,o.querySelectorAll(p)),c}catch(q){}finally{l||b.removeAttribute("id")}}}
// All others
return B(a.replace(ia,"$1"),b,c,d)}/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function c(){function a(c,d){
// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
// Only keep the most recent entries
return b.push(c+" ")>w.cacheLength&&delete a[b.shift()],a[c+" "]=d}var b=[];return a}/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function d(a){return a[N]=!0,a}/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function e(a){var b=G.createElement("div");try{return!!a(b)}catch(c){return!1}finally{
// Remove from its parent by default
b.parentNode&&b.parentNode.removeChild(b),
// release memory in IE
b=null}}/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function f(a,b){for(var c=a.split("|"),d=a.length;d--;)w.attrHandle[c[d]]=b}/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function g(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||V)-(~a.sourceIndex||V);
// Use IE sourceIndex if available on both nodes
if(d)return d;
// Check if b follows a
if(c)for(;c=c.nextSibling;)if(c===b)return-1;return a?1:-1}/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function h(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function i(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function j(a){return d(function(b){return b=+b,d(function(c,d){for(var e,f=a([],c.length,b),g=f.length;g--;)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function k(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}
// Easy API for creating new setFilters
function l(){}function m(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function n(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=Q++;
// Check against closest ancestor/preceding element
// Check against all ancestor/preceding elements
return b.first?function(b,c,f){for(;b=b[d];)if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[P,f];
// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
if(g){for(;b=b[d];)if((1===b.nodeType||e)&&a(b,c,g))return!0}else for(;b=b[d];)if(1===b.nodeType||e){if(i=b[N]||(b[N]={}),(h=i[d])&&h[0]===P&&h[1]===f)
// Assign to newCache so results back-propagate to previous elements
return j[2]=h[2];
// A match means we're done; a fail means we have to keep checking
if(
// Reuse newcache so results back-propagate to previous elements
i[d]=j,j[2]=a(b,c,g))return!0}}}function o(a){return a.length>1?function(b,c,d){for(var e=a.length;e--;)if(!a[e](b,c,d))return!1;return!0}:a[0]}function p(a,c,d){for(var e=0,f=c.length;f>e;e++)b(a,c[e],d);return d}function q(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function r(a,b,c,e,f,g){return e&&!e[N]&&(e=r(e)),f&&!f[N]&&(f=r(f,g)),d(function(d,g,h,i){var j,k,l,m=[],n=[],o=g.length,
// Get initial elements from seed or context
r=d||p(b||"*",h.nodeType?[h]:h,[]),
// Prefilter to get matcher input, preserving a map for seed-results synchronization
s=!a||!d&&b?r:q(r,m,a,h,i),t=c?f||(d?a:o||e)?
// ...intermediate processing is necessary
[]:g:s;
// Apply postFilter
if(
// Find primary matches
c&&c(s,t,h,i),e)for(j=q(t,n),e(j,[],h,i),
// Un-match failing elements by moving them back to matcherIn
k=j.length;k--;)(l=j[k])&&(t[n[k]]=!(s[n[k]]=l));if(d){if(f||a){if(f){for(
// Get the final matcherOut by condensing this intermediate into postFinder contexts
j=[],k=t.length;k--;)(l=t[k])&&
// Restore matcherIn since elem is not yet a final match
j.push(s[k]=l);f(null,t=[],j,i)}for(
// Move matched elements from seed to results to keep them synchronized
k=t.length;k--;)(l=t[k])&&(j=f?aa(d,l):m[k])>-1&&(d[j]=!(g[j]=l))}}else t=q(t===g?t.splice(o,t.length):t),f?f(null,g,t,i):$.apply(g,t)})}function s(a){for(var b,c,d,e=a.length,f=w.relative[a[0].type],g=f||w.relative[" "],h=f?1:0,
// The foundational matcher ensures that elements are reachable from top-level context(s)
i=n(function(a){return a===b},g,!0),j=n(function(a){return aa(b,a)>-1},g,!0),k=[function(a,c,d){var e=!f&&(d||c!==C)||((b=c).nodeType?i(a,c,d):j(a,c,d));
// Avoid hanging onto element (issue #299)
return b=null,e}];e>h;h++)if(c=w.relative[a[h].type])k=[n(o(k),c)];else{
// Return special upon seeing a positional matcher
if(c=w.filter[a[h].type].apply(null,a[h].matches),c[N]){for(
// Find the next relative operator (if any) for proper handling
d=++h;e>d&&!w.relative[a[d].type];d++);
// If the preceding token was a descendant combinator, insert an implicit any-element `*`
return r(h>1&&o(k),h>1&&m(a.slice(0,h-1).concat({value:" "===a[h-2].type?"*":""})).replace(ia,"$1"),c,d>h&&s(a.slice(h,d)),e>d&&s(a=a.slice(d)),e>d&&m(a))}k.push(c)}return o(k)}function t(a,c){var e=c.length>0,f=a.length>0,g=function(d,g,h,i,j){var k,l,m,n=0,o="0",p=d&&[],r=[],s=C,
// We must always have either seed elements or outermost context
t=d||f&&w.find.TAG("*",j),
// Use integer dirruns iff this is the outermost matcher
u=P+=null==s?1:Math.random()||.1,v=t.length;
// Add elements passing elementMatchers directly to results
// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
// Support: IE<9, Safari
// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
for(j&&(C=g!==G&&g);o!==v&&null!=(k=t[o]);o++){if(f&&k){for(l=0;m=a[l++];)if(m(k,g,h)){i.push(k);break}j&&(P=u)}
// Track unmatched elements for set filters
e&&(
// They will have gone through all possible matchers
(k=!m&&k)&&n--,
// Lengthen the array for every element, matched or not
d&&p.push(k))}if(n+=o,e&&o!==n){for(l=0;m=c[l++];)m(p,r,g,h);if(d){
// Reintegrate element matches to eliminate the need for sorting
if(n>0)for(;o--;)p[o]||r[o]||(r[o]=Y.call(i));
// Discard index placeholder values to get only actual matches
r=q(r)}
// Add matches to results
$.apply(i,r),
// Seedless set matches succeeding multiple successful matchers stipulate sorting
j&&!d&&r.length>0&&n+c.length>1&&b.uniqueSort(i)}
// Override manipulation of globals by nested matchers
return j&&(P=u,C=s),p};return e?d(g):g}var u,v,w,x,y,z,A,B,C,D,E,
// Local document vars
F,G,H,I,J,K,L,M,
// Instance-specific data
N="sizzle"+1*new Date,O=a.document,P=0,Q=0,R=c(),S=c(),T=c(),U=function(a,b){return a===b&&(E=!0),0},
// General-purpose constants
V=1<<31,
// Instance methods
W={}.hasOwnProperty,X=[],Y=X.pop,Z=X.push,$=X.push,_=X.slice,
// Use a stripped-down indexOf as it's faster than native
// http://jsperf.com/thor-indexof-vs-for/5
aa=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},ba="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
// Regular expressions
// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
ca="[\\x20\\t\\r\\n\\f]",
// http://www.w3.org/TR/css3-syntax/#characters
da="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
// Loosely modeled on CSS identifier characters
// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
ea=da.replace("w","w#"),
// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
fa="\\["+ca+"*("+da+")(?:"+ca+
// Operator (capture 2)
"*([*^$|!~]?=)"+ca+
// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+ea+"))|)"+ca+"*\\]",ga=":("+da+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+fa+")*)|.*)\\)|)",
// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
ha=new RegExp(ca+"+","g"),ia=new RegExp("^"+ca+"+|((?:^|[^\\\\])(?:\\\\.)*)"+ca+"+$","g"),ja=new RegExp("^"+ca+"*,"+ca+"*"),ka=new RegExp("^"+ca+"*([>+~]|"+ca+")"+ca+"*"),la=new RegExp("="+ca+"*([^\\]'\"]*?)"+ca+"*\\]","g"),ma=new RegExp(ga),na=new RegExp("^"+ea+"$"),oa={ID:new RegExp("^#("+da+")"),CLASS:new RegExp("^\\.("+da+")"),TAG:new RegExp("^("+da.replace("w","w*")+")"),ATTR:new RegExp("^"+fa),PSEUDO:new RegExp("^"+ga),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+ca+"*(even|odd|(([+-]|)(\\d*)n|)"+ca+"*(?:([+-]|)"+ca+"*(\\d+)|))"+ca+"*\\)|)","i"),bool:new RegExp("^(?:"+ba+")$","i"),
// For use in libraries implementing .is()
// We use this for POS matching in `select`
needsContext:new RegExp("^"+ca+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+ca+"*((?:-\\d)?\\d*)"+ca+"*\\)|)(?=[^-]|$)","i")},pa=/^(?:input|select|textarea|button)$/i,qa=/^h\d$/i,ra=/^[^{]+\{\s*\[native \w/,
// Easily-parseable/retrievable ID or TAG or CLASS selectors
sa=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ta=/[+~]/,ua=/'|\\/g,
// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
va=new RegExp("\\\\([\\da-f]{1,6}"+ca+"?|("+ca+")|.)","ig"),wa=function(a,b,c){var d="0x"+b-65536;
// NaN means non-codepoint
// Support: Firefox<24
// Workaround erroneous numeric interpretation of +"0x"
// BMP codepoint
// Supplemental Plane codepoint (surrogate pair)
return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},
// Used for iframes
// See setDocument()
// Removing the function wrapper causes a "Permission Denied"
// error in IE
xa=function(){F()};
// Optimize for push.apply( _, NodeList )
try{$.apply(X=_.call(O.childNodes),O.childNodes),
// Support: Android<4.0
// Detect silently failing push.apply
X[O.childNodes.length].nodeType}catch(ya){$={apply:X.length?
// Leverage slice if possible
function(a,b){Z.apply(a,_.call(b))}:
// Support: IE<9
// Otherwise append directly
function(a,b){
// Can't trust NodeList.length
for(var c=a.length,d=0;a[c++]=b[d++];);a.length=c-1}}}v=b.support={},y=b.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},F=b.setDocument=function(a){var b,c,d=a?a.ownerDocument||a:O;return d!==G&&9===d.nodeType&&d.documentElement?(G=d,H=d.documentElement,c=d.defaultView,c&&c!==c.top&&(c.addEventListener?c.addEventListener("unload",xa,!1):c.attachEvent&&c.attachEvent("onunload",xa)),I=!y(d),v.attributes=e(function(a){return a.className="i",!a.getAttribute("className")}),v.getElementsByTagName=e(function(a){return a.appendChild(d.createComment("")),!a.getElementsByTagName("*").length}),v.getElementsByClassName=ra.test(d.getElementsByClassName),v.getById=e(function(a){return H.appendChild(a).id=N,!d.getElementsByName||!d.getElementsByName(N).length}),v.getById?(w.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&I){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},w.filter.ID=function(a){var b=a.replace(va,wa);return function(a){return a.getAttribute("id")===b}}):(delete w.find.ID,w.filter.ID=function(a){var b=a.replace(va,wa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),w.find.TAG=v.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):v.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){for(;c=f[e++];)1===c.nodeType&&d.push(c);return d}return f},w.find.CLASS=v.getElementsByClassName&&function(a,b){return I?b.getElementsByClassName(a):void 0},K=[],J=[],(v.qsa=ra.test(d.querySelectorAll))&&(e(function(a){H.appendChild(a).innerHTML="<a id='"+N+"'></a><select id='"+N+"-\f]' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&J.push("[*^$]="+ca+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||J.push("\\["+ca+"*(?:value|"+ba+")"),a.querySelectorAll("[id~="+N+"-]").length||J.push("~="),a.querySelectorAll(":checked").length||J.push(":checked"),a.querySelectorAll("a#"+N+"+*").length||J.push(".#.+[+~]")}),e(function(a){var b=d.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&J.push("name"+ca+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||J.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),J.push(",.*:")})),(v.matchesSelector=ra.test(L=H.matches||H.webkitMatchesSelector||H.mozMatchesSelector||H.oMatchesSelector||H.msMatchesSelector))&&e(function(a){v.disconnectedMatch=L.call(a,"div"),L.call(a,"[s!='']:x"),K.push("!=",ga)}),J=J.length&&new RegExp(J.join("|")),K=K.length&&new RegExp(K.join("|")),b=ra.test(H.compareDocumentPosition),M=b||ra.test(H.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)for(;b=b.parentNode;)if(b===a)return!0;return!1},U=b?function(a,b){if(a===b)return E=!0,0;var c=!a.compareDocumentPosition-!b.compareDocumentPosition;return c?c:(c=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&c||!v.sortDetached&&b.compareDocumentPosition(a)===c?a===d||a.ownerDocument===O&&M(O,a)?-1:b===d||b.ownerDocument===O&&M(O,b)?1:D?aa(D,a)-aa(D,b):0:4&c?-1:1)}:function(a,b){if(a===b)return E=!0,0;var c,e=0,f=a.parentNode,h=b.parentNode,i=[a],j=[b];if(!f||!h)return a===d?-1:b===d?1:f?-1:h?1:D?aa(D,a)-aa(D,b):0;if(f===h)return g(a,b);for(c=a;c=c.parentNode;)i.unshift(c);for(c=b;c=c.parentNode;)j.unshift(c);for(;i[e]===j[e];)e++;return e?g(i[e],j[e]):i[e]===O?-1:j[e]===O?1:0},d):G},b.matches=function(a,c){return b(a,null,null,c)},b.matchesSelector=function(a,c){if((a.ownerDocument||a)!==G&&F(a),c=c.replace(la,"='$1']"),v.matchesSelector&&I&&(!K||!K.test(c))&&(!J||!J.test(c)))try{var d=L.call(a,c);if(d||v.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return b(c,G,null,[a]).length>0},b.contains=function(a,b){return(a.ownerDocument||a)!==G&&F(a),M(a,b)},b.attr=function(a,b){(a.ownerDocument||a)!==G&&F(a);var c=w.attrHandle[b.toLowerCase()],d=c&&W.call(w.attrHandle,b.toLowerCase())?c(a,b,!I):void 0;return void 0!==d?d:v.attributes||!I?a.getAttribute(b):(d=a.getAttributeNode(b))&&d.specified?d.value:null},b.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},b.uniqueSort=function(a){var b,c=[],d=0,e=0;if(E=!v.detectDuplicates,D=!v.sortStable&&a.slice(0),a.sort(U),E){for(;b=a[e++];)b===a[e]&&(d=c.push(e));for(;d--;)a.splice(c[d],1)}return D=null,a},x=b.getText=function(a){var b,c="",d=0,e=a.nodeType;if(e){if(1===e||9===e||11===e){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=x(a)}else if(3===e||4===e)return a.nodeValue}else for(;b=a[d++];)c+=x(b);return c},w=b.selectors={cacheLength:50,createPseudo:d,match:oa,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(va,wa),a[3]=(a[3]||a[4]||a[5]||"").replace(va,wa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||b.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&b.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return oa.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&ma.test(c)&&(b=z(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(va,wa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=R[a+" "];return b||(b=new RegExp("(^|"+ca+")"+a+"("+ca+"|$)"))&&R(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,c,d){return function(e){var f=b.attr(e,a);return null==f?"!="===c:c?(f+="","="===c?f===d:"!="===c?f!==d:"^="===c?d&&0===f.indexOf(d):"*="===c?d&&f.indexOf(d)>-1:"$="===c?d&&f.slice(-d.length)===d:"~="===c?(" "+f.replace(ha," ")+" ").indexOf(d)>-1:"|="===c?f===d||f.slice(0,d.length+1)===d+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){for(;p;){for(l=b;l=l[p];)if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){for(k=q[N]||(q[N]={}),j=k[a]||[],n=j[0]===P&&j[1],m=j[0]===P&&j[2],l=n&&q.childNodes[n];l=++n&&l&&l[p]||(m=n=0)||o.pop();)if(1===l.nodeType&&++m&&l===b){k[a]=[P,n,m];break}}else if(s&&(j=(b[N]||(b[N]={}))[a])&&j[0]===P)m=j[1];else for(;(l=++n&&l&&l[p]||(m=n=0)||o.pop())&&((h?l.nodeName.toLowerCase()!==r:1!==l.nodeType)||!++m||(s&&((l[N]||(l[N]={}))[a]=[P,m]),l!==b)););return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,c){var e,f=w.pseudos[a]||w.setFilters[a.toLowerCase()]||b.error("unsupported pseudo: "+a);return f[N]?f(c):f.length>1?(e=[a,a,"",c],w.setFilters.hasOwnProperty(a.toLowerCase())?d(function(a,b){for(var d,e=f(a,c),g=e.length;g--;)d=aa(a,e[g]),a[d]=!(b[d]=e[g])}):function(a){return f(a,0,e)}):f}},pseudos:{not:d(function(a){var b=[],c=[],e=A(a.replace(ia,"$1"));return e[N]?d(function(a,b,c,d){for(var f,g=e(a,null,d,[]),h=a.length;h--;)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,d,f){return b[0]=a,e(b,null,f,c),b[0]=null,!c.pop()}}),has:d(function(a){return function(c){return b(a,c).length>0}}),contains:d(function(a){return a=a.replace(va,wa),function(b){return(b.textContent||b.innerText||x(b)).indexOf(a)>-1}}),lang:d(function(a){return na.test(a||"")||b.error("unsupported lang: "+a),a=a.replace(va,wa).toLowerCase(),function(b){var c;do if(c=I?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===H},focus:function(a){return a===G.activeElement&&(!G.hasFocus||G.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!w.pseudos.empty(a)},header:function(a){return qa.test(a.nodeName)},input:function(a){return pa.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:j(function(){return[0]}),last:j(function(a,b){return[b-1]}),eq:j(function(a,b,c){return[0>c?c+b:c]}),even:j(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:j(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:j(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:j(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},w.pseudos.nth=w.pseudos.eq;
// Add button/input type pseudos
for(u in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})w.pseudos[u]=h(u);for(u in{submit:!0,reset:!0})w.pseudos[u]=i(u);/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
// One-time assignments
// Sort stability
// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
// Initialize against the default document
// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
// Support: IE<9
// Use defaultValue in place of getAttribute("value")
// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
return l.prototype=w.filters=w.pseudos,w.setFilters=new l,z=b.tokenize=function(a,c){var d,e,f,g,h,i,j,k=S[a+" "];if(k)return c?0:k.slice(0);for(h=a,i=[],j=w.preFilter;h;){
// Comma and first run
(!d||(e=ja.exec(h)))&&(e&&(
// Don't consume trailing commas as valid
h=h.slice(e[0].length)||h),i.push(f=[])),d=!1,
// Combinators
(e=ka.exec(h))&&(d=e.shift(),f.push({value:d,type:e[0].replace(ia," ")}),h=h.slice(d.length));
// Filters
for(g in w.filter)!(e=oa[g].exec(h))||j[g]&&!(e=j[g](e))||(d=e.shift(),f.push({value:d,type:g,matches:e}),h=h.slice(d.length));if(!d)break}
// Return the length of the invalid excess
// if we're just parsing
// Otherwise, throw an error or return tokens
// Cache the tokens
return c?h.length:h?b.error(a):S(a,i).slice(0)},A=b.compile=function(a,b){var c,d=[],e=[],f=T[a+" "];if(!f){for(b||(b=z(a)),c=b.length;c--;)f=s(b[c]),f[N]?d.push(f):e.push(f);f=T(a,t(e,d)),f.selector=a}return f},B=b.select=function(a,b,c,d){var e,f,g,h,i,j="function"==typeof a&&a,l=!d&&z(a=j.selector||a);if(c=c||[],1===l.length){if(f=l[0]=l[0].slice(0),f.length>2&&"ID"===(g=f[0]).type&&v.getById&&9===b.nodeType&&I&&w.relative[f[1].type]){if(b=(w.find.ID(g.matches[0].replace(va,wa),b)||[])[0],!b)return c;j&&(b=b.parentNode),a=a.slice(f.shift().value.length)}for(e=oa.needsContext.test(a)?0:f.length;e--&&(g=f[e],!w.relative[h=g.type]);)if((i=w.find[h])&&(d=i(g.matches[0].replace(va,wa),ta.test(f[0].type)&&k(b.parentNode)||b))){if(f.splice(e,1),a=d.length&&m(f),!a)return $.apply(c,d),c;break}}return(j||A(a,l))(d,b,!I,c,ta.test(a)&&k(b.parentNode)||b),c},v.sortStable=N.split("").sort(U).join("")===N,v.detectDuplicates=!!E,F(),v.sortDetached=e(function(a){return 1&a.compareDocumentPosition(G.createElement("div"))}),e(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||f("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),v.attributes&&e(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||f("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),e(function(a){return null==a.getAttribute("disabled")})||f(ba,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),b}(a);aa.find=fa,aa.expr=fa.selectors,aa.expr[":"]=aa.expr.pseudos,aa.unique=fa.uniqueSort,aa.text=fa.getText,aa.isXMLDoc=fa.isXML,aa.contains=fa.contains;var ga=aa.expr.match.needsContext,ha=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,ia=/^.[^:#\[\.,]*$/;aa.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?aa.find.matchesSelector(d,a)?[d]:[]:aa.find.matches(a,aa.grep(b,function(a){return 1===a.nodeType}))},aa.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(aa(a).filter(function(){for(b=0;c>b;b++)if(aa.contains(e[b],this))return!0}));for(b=0;c>b;b++)aa.find(a,e[b],d);
// Needed because $( selector, context ) becomes $( context ).find( selector )
return d=this.pushStack(c>1?aa.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(e(this,a||[],!1))},not:function(a){return this.pushStack(e(this,a||[],!0))},is:function(a){
// If this is a positional/relative selector, check membership in the returned set
// so $("p:first").is("p:last") won't return true for a doc with two "p".
return!!e(this,"string"==typeof a&&ga.test(a)?aa(a):a||[],!1).length}});
// Initialize a jQuery object
// A central reference to the root jQuery(document)
var ja,
// A simple way to check for HTML strings
// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
// Strict HTML recognition (#11290: must start with <)
ka=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,la=aa.fn.init=function(a,b){var c,d;
// HANDLE: $(""), $(null), $(undefined), $(false)
if(!a)return this;
// Handle HTML strings
if("string"==typeof a){
// Match html or make sure no context is specified for #id
if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:ka.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||ja).find(a):this.constructor(b).find(a);
// HANDLE: $(html) -> $(array)
if(c[1]){
// HANDLE: $(html, props)
if(b=b instanceof aa?b[0]:b,aa.merge(this,aa.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:$,!0)),ha.test(c[1])&&aa.isPlainObject(b))for(c in b)
// Properties of context are called as methods if possible
aa.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}
// Support: Blackberry 4.6
// gEBID returns nodes no longer in the document (#6963)
// Inject the element directly into the jQuery object
return d=$.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=$,this.selector=a,this}
// Execute immediately if ready is not present
return a.nodeType?(this.context=this[0]=a,this.length=1,this):aa.isFunction(a)?"undefined"!=typeof ja.ready?ja.ready(a):a(aa):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),aa.makeArray(a,this))};
// Give the init function the jQuery prototype for later instantiation
la.prototype=aa.fn,
// Initialize central reference
ja=aa($);var ma=/^(?:parents|prev(?:Until|All))/,
// Methods guaranteed to produce a unique set when starting from a unique set
na={children:!0,contents:!0,next:!0,prev:!0};aa.extend({dir:function(a,b,c){for(var d=[],e=void 0!==c;(a=a[b])&&9!==a.nodeType;)if(1===a.nodeType){if(e&&aa(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),aa.fn.extend({has:function(a){var b=aa(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(aa.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=ga.test(a)||"string"!=typeof a?aa(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)
// Always skip document fragments
if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&aa.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?aa.unique(f):f)},
// Determine the position of an element within the set
index:function(a){
// No argument, return index in parent
// No argument, return index in parent
// Index in selector
// If it receives a jQuery object, the first element is used
return a?"string"==typeof a?V.call(aa(a),this[0]):V.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(aa.unique(aa.merge(this.get(),aa(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}}),aa.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return aa.dir(a,"parentNode")},parentsUntil:function(a,b,c){return aa.dir(a,"parentNode",c)},next:function(a){return f(a,"nextSibling")},prev:function(a){return f(a,"previousSibling")},nextAll:function(a){return aa.dir(a,"nextSibling")},prevAll:function(a){return aa.dir(a,"previousSibling")},nextUntil:function(a,b,c){return aa.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return aa.dir(a,"previousSibling",c)},siblings:function(a){return aa.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return aa.sibling(a.firstChild)},contents:function(a){return a.contentDocument||aa.merge([],a.childNodes)}},function(a,b){aa.fn[a]=function(c,d){var e=aa.map(this,b,c);
// Remove duplicates
// Reverse order for parents* and prev-derivatives
return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=aa.filter(d,e)),this.length>1&&(na[a]||aa.unique(e),ma.test(a)&&e.reverse()),this.pushStack(e)}});var oa=/\S+/g,pa={};/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
aa.Callbacks=function(a){
// Convert options from String-formatted to Object-formatted if needed
// (we check in cache first)
a="string"==typeof a?pa[a]||g(a):aa.extend({},a);var// Last fire value (for non-forgettable lists)
b,
// Flag to know if list was already fired
c,
// Flag to know if list is currently firing
d,
// First callback to fire (used internally by add and fireWith)
e,
// End of the loop when firing
f,
// Index of currently firing callback (modified by remove if needed)
h,
// Actual callback list
i=[],
// Stack of fire calls for repeatable lists
j=!a.once&&[],
// Fire callbacks
k=function(g){for(b=a.memory&&g,c=!0,h=e||0,e=0,f=i.length,d=!0;i&&f>h;h++)if(i[h].apply(g[0],g[1])===!1&&a.stopOnFalse){b=!1;// To prevent further calls using add
break}d=!1,i&&(j?j.length&&k(j.shift()):b?i=[]:l.disable())},
// Actual Callbacks object
l={
// Add a callback or a collection of callbacks to the list
add:function(){if(i){
// First, we save the current length
var c=i.length;!function g(b){aa.each(b,function(b,c){var d=aa.type(c);"function"===d?a.unique&&l.has(c)||i.push(c):c&&c.length&&"string"!==d&&
// Inspect recursively
g(c)})}(arguments),
// Do we need to add the callbacks to the
// current firing batch?
d?f=i.length:b&&(e=c,k(b))}return this},
// Remove a callback from the list
remove:function(){return i&&aa.each(arguments,function(a,b){for(var c;(c=aa.inArray(b,i,c))>-1;)i.splice(c,1),
// Handle firing indexes
d&&(f>=c&&f--,h>=c&&h--)}),this},
// Check if a given callback is in the list.
// If no argument is given, return whether or not list has callbacks attached.
has:function(a){return a?aa.inArray(a,i)>-1:!(!i||!i.length)},
// Remove all callbacks from the list
empty:function(){return i=[],f=0,this},
// Have the list do nothing anymore
disable:function(){return i=j=b=void 0,this},
// Is it disabled?
disabled:function(){return!i},
// Lock the list in its current state
lock:function(){return j=void 0,b||l.disable(),this},
// Is it locked?
locked:function(){return!j},
// Call all callbacks with the given context and arguments
fireWith:function(a,b){return!i||c&&!j||(b=b||[],b=[a,b.slice?b.slice():b],d?j.push(b):k(b)),this},
// Call all the callbacks with the given arguments
fire:function(){return l.fireWith(this,arguments),this},
// To know if the callbacks have already been called at least once
fired:function(){return!!c}};return l},aa.extend({Deferred:function(a){var b=[
// action, add listener, listener list, final state
["resolve","done",aa.Callbacks("once memory"),"resolved"],["reject","fail",aa.Callbacks("once memory"),"rejected"],["notify","progress",aa.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return aa.Deferred(function(c){aa.each(b,function(b,f){var g=aa.isFunction(a[b])&&a[b];
// deferred[ done | fail | progress ] for forwarding actions to newDefer
e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&aa.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},
// Get a promise for this deferred
// If obj is provided, the promise aspect is added to the object
promise:function(a){return null!=a?aa.extend(a,d):d}},e={};
// All done!
// Keep pipe for back-compat
// Add list-specific methods
// Make the deferred a promise
// Call given func if any
return d.pipe=d.then,aa.each(b,function(a,f){var g=f[2],h=f[3];
// promise[ done | fail | progress ] = list.add
d[f[1]]=g.add,
// Handle state
h&&g.add(function(){
// state = [ resolved | rejected ]
c=h},b[1^a][2].disable,b[2][2].lock),
// deferred[ resolve | reject | notify ]
e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},
// Deferred helper
when:function(a){var b,c,d,e=0,f=S.call(arguments),g=f.length,
// the count of uncompleted subordinates
h=1!==g||a&&aa.isFunction(a.promise)?g:0,
// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
i=1===h?a:aa.Deferred(),
// Update function for both resolve and progress values
j=function(a,c,d){return function(e){c[a]=this,d[a]=arguments.length>1?S.call(arguments):e,d===b?i.notifyWith(c,d):--h||i.resolveWith(c,d)}};
// Add listeners to Deferred subordinates; treat others as resolved
if(g>1)for(b=new Array(g),c=new Array(g),d=new Array(g);g>e;e++)f[e]&&aa.isFunction(f[e].promise)?f[e].promise().done(j(e,d,f)).fail(i.reject).progress(j(e,c,b)):--h;
// If we're not waiting on anything, resolve the master
return h||i.resolveWith(d,f),i.promise()}});
// The deferred used on DOM ready
var qa;aa.fn.ready=function(a){
// Add the callback
return aa.ready.promise().done(a),this},aa.extend({
// Is the DOM ready to be used? Set to true once it occurs.
isReady:!1,
// A counter to track how many items to wait for before
// the ready event fires. See #6781
readyWait:1,
// Hold (or release) the ready event
holdReady:function(a){a?aa.readyWait++:aa.ready(!0)},
// Handle when the DOM is ready
ready:function(a){
// Abort if there are pending holds or we're already ready
(a===!0?--aa.readyWait:aa.isReady)||(
// Remember that the DOM is ready
aa.isReady=!0,
// If a normal DOM Ready event fired, decrement, and wait if need be
a!==!0&&--aa.readyWait>0||(
// If there are functions bound, to execute
qa.resolveWith($,[aa]),
// Trigger any bound ready events
aa.fn.triggerHandler&&(aa($).triggerHandler("ready"),aa($).off("ready"))))}}),aa.ready.promise=function(b){
// Catch cases where $(document).ready() is called after the browser event has already occurred.
// We once tried to use readyState "interactive" here, but it caused issues like the one
// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
// Handle it asynchronously to allow scripts the opportunity to delay ready
// Use the handy event callback
// A fallback to window.onload, that will always work
return qa||(qa=aa.Deferred(),"complete"===$.readyState?setTimeout(aa.ready):($.addEventListener("DOMContentLoaded",h,!1),a.addEventListener("load",h,!1))),qa.promise(b)},
// Kick off the DOM ready check even if the user does not
aa.ready.promise();
// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var ra=aa.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;
// Sets many values
if("object"===aa.type(c)){e=!0;for(h in c)aa.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,aa.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(aa(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));
// Gets
return e?a:j?b.call(a):i?b(a[0],c):f};/**
 * Determines whether an object can have data
 */
aa.acceptData=function(a){
// Accepts only:
//  - Node
//    - Node.ELEMENT_NODE
//    - Node.DOCUMENT_NODE
//  - Object
//    - Any
/* jshint -W018 */
return 1===a.nodeType||9===a.nodeType||!+a.nodeType},i.uid=1,i.accepts=aa.acceptData,i.prototype={key:function(a){
// We can accept data for non-element nodes in modern browsers,
// but we should not, see #8335.
// Always return the key for a frozen object.
if(!i.accepts(a))return 0;var b={},
// Check if the owner object already has a cache key
c=a[this.expando];
// If not, create one
if(!c){c=i.uid++;
// Secure it in a non-enumerable, non-writable property
try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,aa.extend(a,b)}}
// Ensure the cache object
return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,
// There may be an unlock assigned to this node,
// if there is no entry for this "owner", create one inline
// and set the unlock as though an owner entry had always existed
e=this.key(a),f=this.cache[e];
// Handle: [ owner, key, value ] args
if("string"==typeof b)f[b]=c;else
// Fresh assignments by object are shallow copied
if(aa.isEmptyObject(f))aa.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){
// Either a valid cache is found, or will be created.
// New caches will be created and the unlock returned,
// allowing direct access to the newly created
// empty data object. A valid owner object must be provided.
var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;
// In cases where either:
//
//   1. No key was specified
//   2. A string key was specified, but no value provided
//
// Take the "read" path and allow the get method to determine
// which value to return, respectively either:
//
//   1. The entire cache object
//   2. The data stored at the key
//
// In cases where either:
//
//   1. No key was specified
//   2. A string key was specified, but no value provided
//
// Take the "read" path and allow the get method to determine
// which value to return, respectively either:
//
//   1. The entire cache object
//   2. The data stored at the key
//
// [*]When the key is not a string, or both a key and value
// are specified, set or extend (existing objects) with either:
//
//   1. An object of properties
//   2. A key and value
//
return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,aa.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{
// Support array or space separated string of keys
aa.isArray(b)?
// If "name" is an array of keys...
// When data is initially created, via ("key", "val") signature,
// keys will be converted to camelCase.
// Since there is no way to tell _how_ a key was added, remove
// both plain key and camelCase key. #12786
// This will only penalize the array argument path.
d=b.concat(b.map(aa.camelCase)):(e=aa.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(oa)||[])),c=d.length;for(;c--;)delete g[d[c]]}},hasData:function(a){return!aa.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var sa=new i,ta=new i,ua=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,va=/([A-Z])/g;aa.extend({hasData:function(a){return ta.hasData(a)||sa.hasData(a)},data:function(a,b,c){return ta.access(a,b,c)},removeData:function(a,b){ta.remove(a,b)},
// TODO: Now that all calls to _data and _removeData have been replaced
// with direct calls to data_priv methods, these can be deprecated.
_data:function(a,b,c){return sa.access(a,b,c)},_removeData:function(a,b){sa.remove(a,b)}}),aa.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;
// Gets all values
if(void 0===a){if(this.length&&(e=ta.get(f),1===f.nodeType&&!sa.get(f,"hasDataAttrs"))){for(c=g.length;c--;)
// Support: IE11+
// The attrs elements can be null (#14894)
g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=aa.camelCase(d.slice(5)),j(f,d,e[d])));sa.set(f,"hasDataAttrs",!0)}return e}
// Sets multiple values
// Sets multiple values
return"object"==typeof a?this.each(function(){ta.set(this,a)}):ra(this,function(b){var c,d=aa.camelCase(a);
// The calling jQuery object (element matches) is not empty
// (and therefore has an element appears at this[ 0 ]) and the
// `value` parameter was not undefined. An empty jQuery object
// will result in `undefined` for elem = this[ 0 ] which will
// throw an exception if an attempt to read a data cache is made.
if(f&&void 0===b){if(c=ta.get(f,a),void 0!==c)return c;if(c=ta.get(f,d),void 0!==c)return c;if(c=j(f,d,void 0),void 0!==c)return c}else
// Set the data...
this.each(function(){
// First, attempt to store a copy or reference of any
// data that might've been store with a camelCased key.
var c=ta.get(this,d);
// For HTML5 data-* attribute interop, we have to
// store property names with dashes in a camelCase form.
// This might not apply to all properties...*
ta.set(this,d,b),
// *... In the case of properties that might _actually_
// have dashes, we need to also store a copy of that
// unchanged property.
-1!==a.indexOf("-")&&void 0!==c&&ta.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){ta.remove(this,a)})}}),aa.extend({queue:function(a,b,c){var d;
// Speed up dequeue by getting out quickly if this is just a lookup
return a?(b=(b||"fx")+"queue",d=sa.get(a,b),c&&(!d||aa.isArray(c)?d=sa.access(a,b,aa.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=aa.queue(a,b),d=c.length,e=c.shift(),f=aa._queueHooks(a,b),g=function(){aa.dequeue(a,b)};
// If the fx queue is dequeued, always remove the progress sentinel
"inprogress"===e&&(e=c.shift(),d--),e&&(
// Add a progress sentinel to prevent the fx queue from being
// automatically dequeued
"fx"===b&&c.unshift("inprogress"),
// Clear up the last queue stop function
delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},
// Not public - generate a queueHooks object, or return the current one
_queueHooks:function(a,b){var c=b+"queueHooks";return sa.get(a,c)||sa.access(a,c,{empty:aa.Callbacks("once memory").add(function(){sa.remove(a,[b+"queue",c])})})}}),aa.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?aa.queue(this[0],a):void 0===b?this:this.each(function(){var c=aa.queue(this,a,b);
// Ensure a hooks for this queue
aa._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&aa.dequeue(this,a)})},dequeue:function(a){return this.each(function(){aa.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},
// Get a promise resolved when queues of a certain type
// are emptied (fx is the type by default)
promise:function(a,b){var c,d=1,e=aa.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};for("string"!=typeof a&&(b=a,a=void 0),a=a||"fx";g--;)c=sa.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var wa=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,xa=["Top","Right","Bottom","Left"],ya=function(a,b){
// isHidden might be called from jQuery#filter function;
// in that case, element will be second argument
return a=b||a,"none"===aa.css(a,"display")||!aa.contains(a.ownerDocument,a)},za=/^(?:checkbox|radio)$/i;!function(){var a=$.createDocumentFragment(),b=a.appendChild($.createElement("div")),c=$.createElement("input");
// Support: Safari<=5.1
// Check state lost if the name is set (#11217)
// Support: Windows Web Apps (WWA)
// `name` and `type` must use .setAttribute for WWA (#14901)
c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),
// Support: Safari<=5.1, Android<4.2
// Older WebKit doesn't clone checked state correctly in fragments
Z.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,
// Support: IE<=11+
// Make sure textarea (and checkbox) defaultValue is properly cloned
b.innerHTML="<textarea>x</textarea>",Z.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var Aa="undefined";Z.focusinBubbles="onfocusin"in a;var Ba=/^key/,Ca=/^(?:mouse|pointer|contextmenu)|click/,Da=/^(?:focusinfocus|focusoutblur)$/,Ea=/^([^.]*)(?:\.(.+)|)$/;/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
aa.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=sa.get(a);
// Don't attach events to noData or text/comment nodes (but allow plain objects)
if(q)for(
// Caller can pass in an object of custom data in lieu of the handler
c.handler&&(f=c,c=f.handler,e=f.selector),
// Make sure that the handler has a unique ID, used to find/remove it later
c.guid||(c.guid=aa.guid++),
// Init the element's event structure and main handler, if this is the first
(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){
// Discard the second event of a jQuery.event.trigger() and
// when an event is called after a page has unloaded
return typeof aa!==Aa&&aa.event.triggered!==b.type?aa.event.dispatch.apply(a,arguments):void 0}),
// Handle multiple events separated by a space
b=(b||"").match(oa)||[""],j=b.length;j--;)h=Ea.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=aa.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=aa.event.special[n]||{},k=aa.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&aa.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),aa.event.global[n]=!0)},
// Detach an event or set of events from an element
remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=sa.hasData(a)&&sa.get(a);if(q&&(i=q.events)){for(
// Once for each type.namespace in types; type may be omitted
b=(b||"").match(oa)||[""],j=b.length;j--;)
// Unbind all events (on this namespace, if provided) for the element
if(h=Ea.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){for(l=aa.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),
// Remove matching events
g=f=m.length;f--;)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));
// Remove generic event handler if we removed something and no more handlers exist
// (avoids potential for endless recursion during removal of special event handlers)
g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||aa.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)aa.event.remove(a,n+b[j],c,d,!0);
// Remove the expando if it's no longer used
aa.isEmptyObject(i)&&(delete q.handle,sa.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,j,k,l,m=[d||$],n=Y.call(b,"type")?b.type:b,o=Y.call(b,"namespace")?b.namespace.split("."):[];
// Don't do events on text and comment nodes
if(g=h=d=d||$,3!==d.nodeType&&8!==d.nodeType&&!Da.test(n+aa.event.triggered)&&(n.indexOf(".")>=0&&(o=n.split("."),n=o.shift(),o.sort()),j=n.indexOf(":")<0&&"on"+n,b=b[aa.expando]?b:new aa.Event(n,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=o.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:aa.makeArray(c,[b]),l=aa.event.special[n]||{},e||!l.trigger||l.trigger.apply(d,c)!==!1)){
// Determine event propagation path in advance, per W3C events spec (#9951)
// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
if(!e&&!l.noBubble&&!aa.isWindow(d)){for(i=l.delegateType||n,Da.test(i+n)||(g=g.parentNode);g;g=g.parentNode)m.push(g),h=g;
// Only add window if we got to document (e.g., not plain obj or detached DOM)
h===(d.ownerDocument||$)&&m.push(h.defaultView||h.parentWindow||a)}for(
// Fire handlers on the event path
f=0;(g=m[f++])&&!b.isPropagationStopped();)b.type=f>1?i:l.bindType||n,k=(sa.get(g,"events")||{})[b.type]&&sa.get(g,"handle"),k&&k.apply(g,c),k=j&&g[j],k&&k.apply&&aa.acceptData(g)&&(b.result=k.apply(g,c),b.result===!1&&b.preventDefault());
// If nobody prevented the default action, do it now
// Call a native DOM method on the target with the same name name as the event.
// Don't do default actions on window, that's where global variables be (#6170)
// Don't re-trigger an onFOO event when we call its FOO() method
// Prevent re-triggering of the same event, since we already bubbled it above
return b.type=n,e||b.isDefaultPrevented()||l._default&&l._default.apply(m.pop(),c)!==!1||!aa.acceptData(d)||j&&aa.isFunction(d[n])&&!aa.isWindow(d)&&(h=d[j],h&&(d[j]=null),aa.event.triggered=n,d[n](),aa.event.triggered=void 0,h&&(d[j]=h)),b.result}},dispatch:function(a){
// Make a writable jQuery.Event from the native event object
a=aa.event.fix(a);var b,c,d,e,f,g=[],h=S.call(arguments),i=(sa.get(this,"events")||{})[a.type]||[],j=aa.event.special[a.type]||{};
// Call the preDispatch hook for the mapped type, and let it bail if desired
if(
// Use the fix-ed jQuery.Event rather than the (read-only) native event
h[0]=a,a.delegateTarget=this,!j.preDispatch||j.preDispatch.call(this,a)!==!1){for(
// Determine handlers
g=aa.event.handlers.call(this,a,i),
// Run delegates first; they may want to stop propagation beneath us
b=0;(e=g[b++])&&!a.isPropagationStopped();)for(a.currentTarget=e.elem,c=0;(f=e.handlers[c++])&&!a.isImmediatePropagationStopped();)
// Triggered event must either 1) have no namespace, or 2) have namespace(s)
// a subset or equal to those in the bound event (both can have no namespace).
(!a.namespace_re||a.namespace_re.test(f.namespace))&&(a.handleObj=f,a.data=f.data,d=((aa.event.special[f.origType]||{}).handle||f.handler).apply(e.elem,h),void 0!==d&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()));
// Call the postDispatch hook for the mapped type
return j.postDispatch&&j.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;
// Find delegate handlers
// Black-hole SVG <use> instance trees (#13180)
// Avoid non-left-click bubbling in Firefox (#3861)
if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)
// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?aa(e,this).index(i)>=0:aa.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}
// Add the remaining (directly-bound) handlers
return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},
// Includes some event props shared by KeyEvent and MouseEvent
props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){
// Add which for key events
return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;
// Calculate pageX/Y if missing and clientX/Y available
// Add which for click: 1 === left; 2 === middle; 3 === right
// Note: button is not normalized, so don't use it
return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||$,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[aa.expando])return a;
// Create a writable copy of the event object and normalize some properties
var b,c,d,e=a.type,f=a,g=this.fixHooks[e];for(g||(this.fixHooks[e]=g=Ca.test(e)?this.mouseHooks:Ba.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new aa.Event(f),b=d.length;b--;)c=d[b],a[c]=f[c];
// Support: Cordova 2.5 (WebKit) (#13255)
// All events should have a target; Cordova deviceready doesn't
// Support: Safari 6.0+, Chrome<28
// Target should not be a text node (#504, #13143)
return a.target||(a.target=$),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{
// Prevent triggered image.load events from bubbling to window.load
noBubble:!0},focus:{
// Fire native event if possible so blur/focus sequence is correct
trigger:function(){return this!==m()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===m()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{
// For checkbox, fire native event so checked state will be right
trigger:function(){return"checkbox"===this.type&&this.click&&aa.nodeName(this,"input")?(this.click(),!1):void 0},
// For cross-browser consistency, don't fire native .click() on links
_default:function(a){return aa.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){
// Support: Firefox 20+
// Firefox doesn't alert if the returnValue field is not set.
void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){
// Piggyback on a donor event to simulate a different one.
// Fake originalEvent to avoid donor's stopPropagation, but if the
// simulated event prevents default then we do the same on the donor.
var e=aa.extend(new aa.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?aa.event.trigger(e,null,b):aa.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},aa.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},aa.Event=function(a,b){
// Allow instantiation without the 'new' keyword
// Allow instantiation without the 'new' keyword
// Event object
// Events bubbling up the document may have been marked as prevented
// by a handler lower down the tree; reflect the correct value.
// Support: Android<4.0
// Put explicitly provided properties onto the event object
// Create a timestamp if incoming event doesn't have one
// Mark it as fixed
return this instanceof aa.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?k:l):this.type=a,b&&aa.extend(this,b),this.timeStamp=a&&a.timeStamp||aa.now(),void(this[aa.expando]=!0)):new aa.Event(a,b)},
// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
aa.Event.prototype={isDefaultPrevented:l,isPropagationStopped:l,isImmediatePropagationStopped:l,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=k,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=k,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=k,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},
// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
aa.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){aa.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;
// For mousenter/leave call the handler if related is outside the target.
// NB: No relatedTarget if the mouse left/entered the browser window
return(!e||e!==d&&!aa.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),
// Support: Firefox, Chrome, Safari
// Create "bubbling" focus and blur events
Z.focusinBubbles||aa.each({focus:"focusin",blur:"focusout"},function(a,b){
// Attach a single capturing handler on the document while someone wants focusin/focusout
var c=function(a){aa.event.simulate(b,a.target,aa.event.fix(a),!0)};aa.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=sa.access(d,b);e||d.addEventListener(a,c,!0),sa.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=sa.access(d,b)-1;e?sa.access(d,b,e):(d.removeEventListener(a,c,!0),sa.remove(d,b))}}}),aa.fn.extend({on:function(a,b,c,d,/*INTERNAL*/e){var f,g;
// Types can be a map of types/handlers
if("object"==typeof a){
// ( types-Object, selector, data )
"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=l;else if(!d)return this;
// Use same guid so caller can remove using origFn
return 1===e&&(f=d,d=function(a){return aa().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=aa.guid++)),this.each(function(){aa.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)
// ( event )  dispatched jQuery.Event
return d=a.handleObj,aa(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){
// ( types-object [, selector] )
for(e in a)this.off(e,b,a[e]);return this}
// ( types [, fn] )
return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=l),this.each(function(){aa.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){aa.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?aa.event.trigger(a,b,c,!0):void 0}});var Fa=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,Ga=/<([\w:]+)/,Ha=/<|&#?\w+;/,Ia=/<(?:script|style|link)/i,
// checked="checked" or checked
Ja=/checked\s*(?:[^=]|=\s*.checked.)/i,Ka=/^$|\/(?:java|ecma)script/i,La=/^true\/(.*)/,Ma=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
// We have to close these tags to support XHTML (#13200)
Na={
// Support: IE9
option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};
// Support: IE9
Na.optgroup=Na.option,Na.tbody=Na.tfoot=Na.colgroup=Na.caption=Na.thead,Na.th=Na.td,aa.extend({clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=aa.contains(a.ownerDocument,a);
// Fix IE cloning issues
if(!(Z.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||aa.isXMLDoc(a)))for(g=s(h),f=s(a),d=0,e=f.length;e>d;d++)t(f[d],g[d]);
// Copy the events from the original to the clone
if(b)if(c)for(f=f||s(a),g=g||s(h),d=0,e=f.length;e>d;d++)r(f[d],g[d]);else r(a,h);
// Return the cloned set
// Preserve script evaluation history
return g=s(h,"script"),g.length>0&&q(g,!i&&s(a,"script")),h},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k=b.createDocumentFragment(),l=[],m=0,n=a.length;n>m;m++)if(e=a[m],e||0===e)
// Add nodes directly
if("object"===aa.type(e))
// Support: QtWebKit, PhantomJS
// push.apply(_, arraylike) throws on ancient WebKit
aa.merge(l,e.nodeType?[e]:e);else if(Ha.test(e)){for(f=f||k.appendChild(b.createElement("div")),
// Deserialize a standard representation
g=(Ga.exec(e)||["",""])[1].toLowerCase(),h=Na[g]||Na._default,f.innerHTML=h[1]+e.replace(Fa,"<$1></$2>")+h[2],
// Descend through wrappers to the right content
j=h[0];j--;)f=f.lastChild;
// Support: QtWebKit, PhantomJS
// push.apply(_, arraylike) throws on ancient WebKit
aa.merge(l,f.childNodes),
// Remember the top-level container
f=k.firstChild,
// Ensure the created nodes are orphaned (#12392)
f.textContent=""}else l.push(b.createTextNode(e));for(
// Remove wrapper from fragment
k.textContent="",m=0;e=l[m++];)
// #4087 - If origin and destination elements are the same, and this is
// that element, do not do anything
if((!d||-1===aa.inArray(e,d))&&(i=aa.contains(e.ownerDocument,e),f=s(k.appendChild(e),"script"),i&&q(f),c))for(j=0;e=f[j++];)Ka.test(e.type||"")&&c.push(e);return k},cleanData:function(a){for(var b,c,d,e,f=aa.event.special,g=0;void 0!==(c=a[g]);g++){if(aa.acceptData(c)&&(e=c[sa.expando],e&&(b=sa.cache[e]))){if(b.events)for(d in b.events)f[d]?aa.event.remove(c,d):aa.removeEvent(c,d,b.handle);sa.cache[e]&&
// Discard any remaining `private` data
delete sa.cache[e]}
// Discard any remaining `user` data
delete ta.cache[c[ta.expando]]}}}),aa.fn.extend({text:function(a){return ra(this,function(a){return void 0===a?aa.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=n(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=n(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?aa.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||aa.cleanData(s(c)),c.parentNode&&(b&&aa.contains(c.ownerDocument,c)&&q(s(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(
// Prevent memory leaks
aa.cleanData(s(a,!1)),
// Remove any remaining nodes
a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return aa.clone(this,a,b)})},html:function(a){return ra(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;
// See if we can take a shortcut and just use innerHTML
if("string"==typeof a&&!Ia.test(a)&&!Na[(Ga.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Fa,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(aa.cleanData(s(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];
// Force removal if there was no new content (e.g., from empty arguments)
// Make the changes, replacing each context element with the new content
return this.domManip(arguments,function(b){a=this.parentNode,aa.cleanData(s(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){
// Flatten any nested arrays
a=T.apply([],a);var c,d,e,f,g,h,i=0,j=this.length,k=this,l=j-1,m=a[0],n=aa.isFunction(m);
// We can't cloneNode fragments that contain checked, in WebKit
if(n||j>1&&"string"==typeof m&&!Z.checkClone&&Ja.test(m))return this.each(function(c){var d=k.eq(c);n&&(a[0]=m.call(this,c,d.html())),d.domManip(a,b)});if(j&&(c=aa.buildFragment(a,this[0].ownerDocument,!1,this),d=c.firstChild,1===c.childNodes.length&&(c=d),d)){
// Use the original fragment for the last item instead of the first because it can end up
// being emptied incorrectly in certain situations (#8070).
for(e=aa.map(s(c,"script"),o),f=e.length;j>i;i++)g=c,i!==l&&(g=aa.clone(g,!0,!0),f&&aa.merge(e,s(g,"script"))),b.call(this[i],g,i);if(f)
// Evaluate executable scripts on first document insertion
for(h=e[e.length-1].ownerDocument,aa.map(e,p),i=0;f>i;i++)g=e[i],Ka.test(g.type||"")&&!sa.access(g,"globalEval")&&aa.contains(h,g)&&(g.src?aa._evalUrl&&aa._evalUrl(g.src):aa.globalEval(g.textContent.replace(Ma,"")))}return this}}),aa.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){aa.fn[a]=function(a){for(var c,d=[],e=aa(a),f=e.length-1,g=0;f>=g;g++)c=g===f?this:this.clone(!0),aa(e[g])[b](c),U.apply(d,c.get());return this.pushStack(d)}});var Oa,Pa={},Qa=/^margin/,Ra=new RegExp("^("+wa+")(?!px)[a-z%]+$","i"),Sa=function(b){
// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
// IE throws on elements created in popups
// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
// IE throws on elements created in popups
// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
return b.ownerDocument.defaultView.opener?b.ownerDocument.defaultView.getComputedStyle(b,null):a.getComputedStyle(b,null)};!function(){
// Executing both pixelPosition & boxSizingReliable tests require only one layout
// so they're executed at the same time to save the second computation.
function b(){g.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",g.innerHTML="",e.appendChild(f);var b=a.getComputedStyle(g,null);c="1%"!==b.top,d="4px"===b.width,e.removeChild(f)}var c,d,e=$.documentElement,f=$.createElement("div"),g=$.createElement("div");g.style&&(
// Support: IE9-11+
// Style of cloned element affects source element cloned (#8908)
g.style.backgroundClip="content-box",g.cloneNode(!0).style.backgroundClip="",Z.clearCloneStyle="content-box"===g.style.backgroundClip,f.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",f.appendChild(g),
// Support: node.js jsdom
// Don't assume that getComputedStyle is a property of the global object
a.getComputedStyle&&aa.extend(Z,{pixelPosition:function(){
// This test is executed only once but we still do memoizing
// since we can use the boxSizingReliable pre-computing.
// No need to check if the test was already performed, though.
return b(),c},boxSizingReliable:function(){return null==d&&b(),d},reliableMarginRight:function(){
// Support: Android 2.3
// Check if div with explicit width and no margin-right incorrectly
// gets computed margin-right based on width of container. (#3333)
// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
// This support function is only executed once so no memoizing is needed.
var b,c=g.appendChild($.createElement("div"));
// Reset CSS: box-sizing; display; margin; border; padding
// Support: Firefox<29, Android 2.3
// Vendor-prefix box-sizing
return c.style.cssText=g.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",g.style.width="1px",e.appendChild(f),b=!parseFloat(a.getComputedStyle(c,null).marginRight),e.removeChild(f),g.removeChild(c),b}}))}(),
// A method for quickly swapping in/out CSS properties to get correct calculations.
aa.swap=function(a,b,c,d){var e,f,g={};
// Remember the old values, and insert the new ones
for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);
// Revert the old values
for(f in b)a.style[f]=g[f];return e};var
// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
Ta=/^(none|table(?!-c[ea]).+)/,Ua=new RegExp("^("+wa+")(.*)$","i"),Va=new RegExp("^([+-])=("+wa+")","i"),Wa={position:"absolute",visibility:"hidden",display:"block"},Xa={letterSpacing:"0",fontWeight:"400"},Ya=["Webkit","O","Moz","ms"];aa.extend({
// Add in style property hooks for overriding the default
// behavior of getting and setting a style property
cssHooks:{opacity:{get:function(a,b){if(b){
// We should always get a number back from opacity
var c=w(a,"opacity");return""===c?"1":c}}}},
// Don't automatically add "px" to these possibly-unitless properties
cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},
// Add in properties whose names you wish to fix before
// setting or getting the value
cssProps:{"float":"cssFloat"},
// Get and set the style property on a DOM Node
style:function(a,b,c,d){
// Don't set styles on text and comment nodes
if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){
// Make sure that we're working with the right name
var e,f,g,h=aa.camelCase(b),i=a.style;
// Check if we're setting a value
// Gets hook for the prefixed version, then unprefixed version
// Check if we're setting a value
// If a hook was provided get the non-computed value from there
// Convert "+=" or "-=" to relative numbers (#7345)
// Fixes bug #9237
// Make sure that null and NaN values aren't set (#7116)
// If a number, add 'px' to the (except for certain CSS properties)
// Support: IE9-11+
// background-* props affect original clone's values
// If a hook was provided, use that value, otherwise just set the specified value
return b=aa.cssProps[h]||(aa.cssProps[h]=y(i,h)),g=aa.cssHooks[b]||aa.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=Va.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(aa.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||aa.cssNumber[h]||(c+="px"),Z.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=aa.camelCase(b);return b=aa.cssProps[h]||(aa.cssProps[h]=y(a.style,h)),g=aa.cssHooks[b]||aa.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=w(a,b,d)),"normal"===e&&b in Xa&&(e=Xa[b]),""===c||c?(f=parseFloat(e),c===!0||aa.isNumeric(f)?f||0:e):e}}),aa.each(["height","width"],function(a,b){aa.cssHooks[b]={get:function(a,c,d){return c?Ta.test(aa.css(a,"display"))&&0===a.offsetWidth?aa.swap(a,Wa,function(){return B(a,b,d)}):B(a,b,d):void 0},set:function(a,c,d){var e=d&&Sa(a);return z(a,c,d?A(a,b,d,"border-box"===aa.css(a,"boxSizing",!1,e),e):0)}}}),
// Support: Android 2.3
aa.cssHooks.marginRight=x(Z.reliableMarginRight,function(a,b){return b?aa.swap(a,{display:"inline-block"},w,[a,"marginRight"]):void 0}),
// These hooks are used by animate to expand properties
aa.each({margin:"",padding:"",border:"Width"},function(a,b){aa.cssHooks[a+b]={expand:function(c){for(var d=0,e={},
// Assumes a single number if not a string
f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+xa[d]+b]=f[d]||f[d-2]||f[0];return e}},Qa.test(a)||(aa.cssHooks[a+b].set=z)}),aa.fn.extend({css:function(a,b){return ra(this,function(a,b,c){var d,e,f={},g=0;if(aa.isArray(b)){for(d=Sa(a),e=b.length;e>g;g++)f[b[g]]=aa.css(a,b[g],!1,d);return f}return void 0!==c?aa.style(a,b,c):aa.css(a,b)},a,b,arguments.length>1)},show:function(){return C(this,!0)},hide:function(){return C(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){ya(this)?aa(this).show():aa(this).hide()})}}),aa.Tween=D,D.prototype={constructor:D,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(aa.cssNumber[c]?"":"px")},cur:function(){var a=D.propHooks[this.prop];return a&&a.get?a.get(this):D.propHooks._default.get(this)},run:function(a){var b,c=D.propHooks[this.prop];return this.options.duration?this.pos=b=aa.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):D.propHooks._default.set(this),this}},D.prototype.init.prototype=D.prototype,D.propHooks={_default:{get:function(a){var b;
// Passing an empty string as a 3rd parameter to .css will automatically
// attempt a parseFloat and fallback to a string if the parse fails.
// Simple values such as "10px" are parsed to Float;
// complex values such as "rotate(1rad)" are returned as-is.
return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=aa.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){
// Use step hook for back compat.
// Use cssHook if its there.
// Use .style if available and use plain properties where available.
aa.fx.step[a.prop]?aa.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[aa.cssProps[a.prop]]||aa.cssHooks[a.prop])?aa.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},
// Support: IE9
// Panic based approach to setting things on disconnected nodes
D.propHooks.scrollTop=D.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},aa.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},aa.fx=D.prototype.init,
// Back Compat <1.8 extension point
aa.fx.step={};var Za,$a,_a=/^(?:toggle|show|hide)$/,ab=new RegExp("^(?:([+-])=|)("+wa+")([a-z%]*)$","i"),bb=/queueHooks$/,cb=[H],db={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=ab.exec(b),f=e&&e[3]||(aa.cssNumber[a]?"":"px"),
// Starting value computation is required for potential unit mismatches
g=(aa.cssNumber[a]||"px"!==f&&+d)&&ab.exec(aa.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){
// Trust units reported by jQuery.css
f=f||g[3],
// Make sure we update the tween properties later on
e=e||[],
// Iteratively approximate from a nonzero starting point
g=+d||1;do h=h||".5",g/=h,aa.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}
// Update tween properties
// If a +=/-= token was provided, we're doing a relative animation
return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};aa.Animation=aa.extend(J,{tweener:function(a,b){aa.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],db[c]=db[c]||[],db[c].unshift(b)},prefilter:function(a,b){b?cb.unshift(a):cb.push(a)}}),aa.speed=function(a,b,c){var d=a&&"object"==typeof a?aa.extend({},a):{complete:c||!c&&b||aa.isFunction(a)&&a,duration:a,easing:c&&b||b&&!aa.isFunction(b)&&b};
// Normalize opt.queue - true/undefined/null -> "fx"
// Queueing
return d.duration=aa.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in aa.fx.speeds?aa.fx.speeds[d.duration]:aa.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){aa.isFunction(d.old)&&d.old.call(this),d.queue&&aa.dequeue(this,d.queue)},d},aa.fn.extend({fadeTo:function(a,b,c,d){
// Show any hidden elements after setting opacity to 0
return this.filter(ya).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=aa.isEmptyObject(a),f=aa.speed(b,c,d),g=function(){
// Operate on a copy of prop so per-property easing won't be lost
var b=J(this,aa.extend({},a),f);
// Empty animations, or finishing resolves immediately
(e||sa.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=aa.timers,g=sa.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&bb.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));
// Start the next in the queue if the last step wasn't forced.
// Timers currently will call their complete callbacks, which
// will dequeue but only if they were gotoEnd.
(b||!c)&&aa.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=sa.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=aa.timers,g=d?d.length:0;
// Look for any active animations, and finish them
for(
// Enable finishing flag on private data
c.finish=!0,
// Empty the queue first
aa.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));
// Look for any animations in the old queue and finish them
for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);
// Turn off finishing flag
delete c.finish})}}),aa.each(["toggle","show","hide"],function(a,b){var c=aa.fn[b];aa.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(F(b,!0),a,d,e)}}),
// Generate shortcuts for custom animations
aa.each({slideDown:F("show"),slideUp:F("hide"),slideToggle:F("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){aa.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),aa.timers=[],aa.fx.tick=function(){var a,b=0,c=aa.timers;for(Za=aa.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||aa.fx.stop(),Za=void 0},aa.fx.timer=function(a){aa.timers.push(a),a()?aa.fx.start():aa.timers.pop()},aa.fx.interval=13,aa.fx.start=function(){$a||($a=setInterval(aa.fx.tick,aa.fx.interval))},aa.fx.stop=function(){clearInterval($a),$a=null},aa.fx.speeds={slow:600,fast:200,
// Default speed
_default:400},
// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
aa.fn.delay=function(a,b){return a=aa.fx?aa.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a=$.createElement("input"),b=$.createElement("select"),c=b.appendChild($.createElement("option"));a.type="checkbox",
// Support: iOS<=5.1, Android<=4.2+
// Default value for a checkbox should be "on"
Z.checkOn=""!==a.value,
// Support: IE<=11+
// Must access selectedIndex to make default options select
Z.optSelected=c.selected,
// Support: Android<=2.3
// Options inside disabled selects are incorrectly marked as disabled
b.disabled=!0,Z.optDisabled=!c.disabled,a=$.createElement("input"),a.value="t",a.type="radio",Z.radioValue="t"===a.value}();var eb,fb,gb=aa.expr.attrHandle;aa.fn.extend({attr:function(a,b){return ra(this,aa.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){aa.removeAttr(this,a)})}}),aa.extend({attr:function(a,b,c){var d,e,f=a.nodeType;
// don't get/set attributes on text, comment and attribute nodes
if(a&&3!==f&&8!==f&&2!==f)
// Fallback to prop when attributes are not supported
// Fallback to prop when attributes are not supported
// All attributes are lowercase
// Grab necessary hook if one is defined
return typeof a.getAttribute===Aa?aa.prop(a,b,c):(1===f&&aa.isXMLDoc(a)||(b=b.toLowerCase(),d=aa.attrHooks[b]||(aa.expr.match.bool.test(b)?fb:eb)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=aa.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void aa.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(oa);if(f&&1===a.nodeType)for(;c=f[e++];)d=aa.propFix[c]||c,aa.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)},attrHooks:{type:{set:function(a,b){if(!Z.radioValue&&"radio"===b&&aa.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),fb={set:function(a,b,c){
// Remove boolean attributes when set to false
return b===!1?aa.removeAttr(a,c):a.setAttribute(c,c),c}},aa.each(aa.expr.match.bool.source.match(/\w+/g),function(a,b){var c=gb[b]||aa.find.attr;gb[b]=function(a,b,d){var e,f;return d||(f=gb[b],gb[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,gb[b]=f),e}});var hb=/^(?:input|select|textarea|button)$/i;aa.fn.extend({prop:function(a,b){return ra(this,aa.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[aa.propFix[a]||a]})}}),aa.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;
// Don't get/set properties on text, comment and attribute nodes
if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!aa.isXMLDoc(a),f&&(b=aa.propFix[b]||b,e=aa.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||hb.test(a.nodeName)||a.href?a.tabIndex:-1}}}}),Z.optSelected||(aa.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),aa.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){aa.propFix[this.toLowerCase()]=this});var ib=/[\t\r\n\f]/g;aa.fn.extend({addClass:function(a){var b,c,d,e,f,g,h="string"==typeof a&&a,i=0,j=this.length;if(aa.isFunction(a))return this.each(function(b){aa(this).addClass(a.call(this,b,this.className))});if(h)for(
// The disjunction here is for better compressibility (see removeClass)
b=(a||"").match(oa)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ib," "):" ")){for(f=0;e=b[f++];)d.indexOf(" "+e+" ")<0&&(d+=e+" ");
// only assign if different to avoid unneeded rendering.
g=aa.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0===arguments.length||"string"==typeof a&&a,i=0,j=this.length;if(aa.isFunction(a))return this.each(function(b){aa(this).removeClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(oa)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ib," "):"")){for(f=0;e=b[f++];)
// Remove *all* instances
for(;d.indexOf(" "+e+" ")>=0;)d=d.replace(" "+e+" "," ");
// Only assign if different to avoid unneeded rendering.
g=a?aa.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):aa.isFunction(a)?this.each(function(c){aa(this).toggleClass(a.call(this,c,this.className,b),b)}):this.each(function(){if("string"===c)for(var b,d=0,e=aa(this),f=a.match(oa)||[];b=f[d++];)e.hasClass(b)?e.removeClass(b):e.addClass(b);else(c===Aa||"boolean"===c)&&(this.className&&sa.set(this,"__className__",this.className),this.className=this.className||a===!1?"":sa.get(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ib," ").indexOf(b)>=0)return!0;return!1}});var jb=/\r/g;aa.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=aa.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,aa(this).val()):a,null==e?e="":"number"==typeof e?e+="":aa.isArray(e)&&(e=aa.map(e,function(a){return null==a?"":a+""})),b=aa.valHooks[this.type]||aa.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)
// Handle most common string cases
// Handle cases where value is null/undef or number
return b=aa.valHooks[e.type]||aa.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(jb,""):null==c?"":c)}}}),aa.extend({valHooks:{option:{get:function(a){var b=aa.find.attr(a,"value");
// Support: IE10-11+
// option.text throws exceptions (#14686, #14858)
return null!=b?b:aa.trim(aa.text(a))}},select:{get:function(a){
// Loop through all the selected options
for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)
// IE6-9 doesn't update selected after form reset (#2551)
if(c=d[i],(c.selected||i===e)&&(Z.optDisabled?!c.disabled:null===c.getAttribute("disabled"))&&(!c.parentNode.disabled||!aa.nodeName(c.parentNode,"optgroup"))){
// We don't need an array for one selects
if(b=aa(c).val(),f)return b;
// Multi-Selects return an array
g.push(b)}return g},set:function(a,b){for(var c,d,e=a.options,f=aa.makeArray(b),g=e.length;g--;)d=e[g],(d.selected=aa.inArray(d.value,f)>=0)&&(c=!0);
// Force browsers to behave consistently when non-matching value is set
return c||(a.selectedIndex=-1),f}}}}),
// Radios and checkboxes getter/setter
aa.each(["radio","checkbox"],function(){aa.valHooks[this]={set:function(a,b){return aa.isArray(b)?a.checked=aa.inArray(aa(a).val(),b)>=0:void 0}},Z.checkOn||(aa.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})}),
// Return jQuery for attributes-only inclusion
aa.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){
// Handle event binding
aa.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),aa.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){
// ( namespace ) or ( selector, types [, fn] )
return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var kb=aa.now(),lb=/\?/;
// Support: Android 2.3
// Workaround failure to string-cast null input
aa.parseJSON=function(a){return JSON.parse(a+"")},
// Cross-browser xml parsing
aa.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;
// Support: IE9
try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&aa.error("Invalid XML: "+a),b};var mb=/#.*$/,nb=/([?&])_=[^&]*/,ob=/^(.*?):[ \t]*([^\r\n]*)$/gm,
// #7653, #8125, #8152: local protocol detection
pb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,qb=/^(?:GET|HEAD)$/,rb=/^\/\//,sb=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
tb={},/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
ub={},
// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
vb="*/".concat("*"),
// Document location
wb=a.location.href,
// Segment location into parts
xb=sb.exec(wb.toLowerCase())||[];aa.extend({
// Counter for holding the number of active queries
active:0,
// Last-Modified header cache for next request
lastModified:{},etag:{},ajaxSettings:{url:wb,type:"GET",isLocal:pb.test(xb[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/
accepts:{"*":vb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},
// Data converters
// Keys separate source (or catchall "*") and destination types with a single space
converters:{
// Convert anything to text
"* text":String,
// Text to html (true = no transformation)
"text html":!0,
// Evaluate text as a json expression
"text json":aa.parseJSON,
// Parse text as xml
"text xml":aa.parseXML},
// For options that shouldn't be deep extended:
// you can add your own custom options here if
// and when you create one that shouldn't be
// deep extended (see ajaxExtend)
flatOptions:{url:!0,context:!0}},
// Creates a full fledged settings object into target
// with both ajaxSettings and settings fields.
// If target is omitted, writes into ajaxSettings.
ajaxSetup:function(a,b){
// Building a settings object
// Extending ajaxSettings
return b?M(M(a,aa.ajaxSettings),b):M(aa.ajaxSettings,a)},ajaxPrefilter:K(tb),ajaxTransport:K(ub),
// Main method
ajax:function(a,b){
// Callback for when everything is done
function c(a,b,c,g){var i,k,r,s,u,w=b;
// Called once
2!==t&&(t=2,h&&clearTimeout(h),d=void 0,f=g||"",v.readyState=a>0?4:0,i=a>=200&&300>a||304===a,c&&(s=N(l,v,c)),s=O(l,s,v,i),i?(l.ifModified&&(u=v.getResponseHeader("Last-Modified"),u&&(aa.lastModified[e]=u),u=v.getResponseHeader("etag"),u&&(aa.etag[e]=u)),204===a||"HEAD"===l.type?w="nocontent":304===a?w="notmodified":(w=s.state,k=s.data,r=s.error,i=!r)):(r=w,(a||!w)&&(w="error",0>a&&(a=0))),v.status=a,v.statusText=(b||w)+"",i?o.resolveWith(m,[k,w,v]):o.rejectWith(m,[v,w,r]),v.statusCode(q),q=void 0,j&&n.trigger(i?"ajaxSuccess":"ajaxError",[v,l,i?k:r]),p.fireWith(m,[v,w]),j&&(n.trigger("ajaxComplete",[v,l]),--aa.active||aa.event.trigger("ajaxStop")))}
// If url is an object, simulate pre-1.5 signature
"object"==typeof a&&(b=a,a=void 0),
// Force options to be an object
b=b||{};var d,
// URL without anti-cache param
e,
// Response headers
f,g,
// timeout handle
h,
// Cross-domain detection vars
i,
// To know if global events are to be dispatched
j,
// Loop variable
k,
// Create the final options object
l=aa.ajaxSetup({},b),
// Callbacks context
m=l.context||l,
// Context for global events is callbackContext if it is a DOM node or jQuery collection
n=l.context&&(m.nodeType||m.jquery)?aa(m):aa.event,
// Deferreds
o=aa.Deferred(),p=aa.Callbacks("once memory"),
// Status-dependent callbacks
q=l.statusCode||{},
// Headers (they are sent all at once)
r={},s={},
// The jqXHR state
t=0,
// Default abort message
u="canceled",
// Fake xhr
v={readyState:0,
// Builds headers hashtable if needed
getResponseHeader:function(a){var b;if(2===t){if(!g)for(g={};b=ob.exec(f);)g[b[1].toLowerCase()]=b[2];b=g[a.toLowerCase()]}return null==b?null:b},
// Raw string
getAllResponseHeaders:function(){return 2===t?f:null},
// Caches the header
setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},
// Overrides response content-type header
overrideMimeType:function(a){return t||(l.mimeType=a),this},
// Status-dependent callbacks
statusCode:function(a){var b;if(a)if(2>t)for(b in a)
// Lazy-add the new callback in a way that preserves old ones
q[b]=[q[b],a[b]];else
// Execute the appropriate callbacks
v.always(a[v.status]);return this},
// Cancel the request
abort:function(a){var b=a||u;return d&&d.abort(b),c(0,b),this}};
// If request was aborted inside a prefilter, stop there
if(
// Attach deferreds
o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,
// Remove hash character (#7531: and string promotion)
// Add protocol if not provided (prefilters might expect it)
// Handle falsy url in the settings object (#10093: consistency with old signature)
// We also use the url parameter if available
l.url=((a||l.url||wb)+"").replace(mb,"").replace(rb,xb[1]+"//"),
// Alias method option to type as per ticket #12004
l.type=b.method||b.type||l.method||l.type,
// Extract dataTypes list
l.dataTypes=aa.trim(l.dataType||"*").toLowerCase().match(oa)||[""],null==l.crossDomain&&(i=sb.exec(l.url.toLowerCase()),l.crossDomain=!(!i||i[1]===xb[1]&&i[2]===xb[2]&&(i[3]||("http:"===i[1]?"80":"443"))===(xb[3]||("http:"===xb[1]?"80":"443")))),
// Convert data if not already a string
l.data&&l.processData&&"string"!=typeof l.data&&(l.data=aa.param(l.data,l.traditional)),
// Apply prefilters
L(tb,l,b,v),2===t)return v;j=aa.event&&l.global,j&&0===aa.active++&&aa.event.trigger("ajaxStart"),l.type=l.type.toUpperCase(),l.hasContent=!qb.test(l.type),e=l.url,l.hasContent||(l.data&&(e=l.url+=(lb.test(e)?"&":"?")+l.data,delete l.data),l.cache===!1&&(l.url=nb.test(e)?e.replace(nb,"$1_="+kb++):e+(lb.test(e)?"&":"?")+"_="+kb++)),l.ifModified&&(aa.lastModified[e]&&v.setRequestHeader("If-Modified-Since",aa.lastModified[e]),aa.etag[e]&&v.setRequestHeader("If-None-Match",aa.etag[e])),(l.data&&l.hasContent&&l.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",l.contentType),v.setRequestHeader("Accept",l.dataTypes[0]&&l.accepts[l.dataTypes[0]]?l.accepts[l.dataTypes[0]]+("*"!==l.dataTypes[0]?", "+vb+"; q=0.01":""):l.accepts["*"]);
// Check for headers option
for(k in l.headers)v.setRequestHeader(k,l.headers[k]);
// Allow custom headers/mimetypes and early abort
if(l.beforeSend&&(l.beforeSend.call(m,v,l)===!1||2===t))
// Abort if not done already and return
return v.abort();
// Aborting is no longer a cancellation
u="abort";
// Install callbacks on deferreds
for(k in{success:1,error:1,complete:1})v[k](l[k]);
// If no transport, we auto-abort
if(d=L(ub,l,b,v)){v.readyState=1,
// Send global event
j&&n.trigger("ajaxSend",[v,l]),
// Timeout
l.async&&l.timeout>0&&(h=setTimeout(function(){v.abort("timeout")},l.timeout));try{t=1,d.send(r,c)}catch(w){
// Propagate exception as error if not done
if(!(2>t))throw w;c(-1,w)}}else c(-1,"No Transport");return v},getJSON:function(a,b,c){return aa.get(a,b,c,"json")},getScript:function(a,b){return aa.get(a,void 0,b,"script")}}),aa.each(["get","post"],function(a,b){aa[b]=function(a,c,d,e){
// Shift arguments if data argument was omitted
return aa.isFunction(c)&&(e=e||d,d=c,c=void 0),aa.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),aa._evalUrl=function(a){return aa.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},aa.fn.extend({wrapAll:function(a){var b;
// The elements to wrap the target around
return aa.isFunction(a)?this.each(function(b){aa(this).wrapAll(a.call(this,b))}):(this[0]&&(b=aa(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){for(var a=this;a.firstElementChild;)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return aa.isFunction(a)?this.each(function(b){aa(this).wrapInner(a.call(this,b))}):this.each(function(){var b=aa(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=aa.isFunction(a);return this.each(function(c){aa(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){aa.nodeName(this,"body")||aa(this).replaceWith(this.childNodes)}).end()}}),aa.expr.filters.hidden=function(a){
// Support: Opera <= 12.12
// Opera reports offsetWidths and offsetHeights less than zero on some elements
return a.offsetWidth<=0&&a.offsetHeight<=0},aa.expr.filters.visible=function(a){return!aa.expr.filters.hidden(a)};var yb=/%20/g,zb=/\[\]$/,Ab=/\r?\n/g,Bb=/^(?:submit|button|image|reset|file)$/i,Cb=/^(?:input|select|textarea|keygen)/i;
// Serialize an array of form elements or a set of
// key/values into a query string
aa.param=function(a,b){var c,d=[],e=function(a,b){b=aa.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};
// If an array was passed in, assume that it is an array of form elements.
if(
// Set traditional to true for jQuery <= 1.3.2 behavior.
void 0===b&&(b=aa.ajaxSettings&&aa.ajaxSettings.traditional),aa.isArray(a)||a.jquery&&!aa.isPlainObject(a))
// Serialize the form elements
aa.each(a,function(){e(this.name,this.value)});else
// If traditional, encode the "old" way (the way 1.3.2 or older
// did it), otherwise encode params recursively.
for(c in a)P(c,a[c],b,e);
// Return the resulting serialization
return d.join("&").replace(yb,"+")},aa.fn.extend({serialize:function(){return aa.param(this.serializeArray())},serializeArray:function(){return this.map(function(){
// Can add propHook for "elements" to filter or add form elements
var a=aa.prop(this,"elements");return a?aa.makeArray(a):this}).filter(function(){var a=this.type;
// Use .is( ":disabled" ) so that fieldset[disabled] works
return this.name&&!aa(this).is(":disabled")&&Cb.test(this.nodeName)&&!Bb.test(a)&&(this.checked||!za.test(a))}).map(function(a,b){var c=aa(this).val();return null==c?null:aa.isArray(c)?aa.map(c,function(a){return{name:b.name,value:a.replace(Ab,"\r\n")}}):{name:b.name,value:c.replace(Ab,"\r\n")}}).get()}}),aa.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var Db=0,Eb={},Fb={
// file protocol always yields status code 0, assume 200
0:200,
// Support: IE9
// #1450: sometimes IE returns 1223 when it should be 204
1223:204},Gb=aa.ajaxSettings.xhr();
// Support: IE9
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
a.attachEvent&&a.attachEvent("onunload",function(){for(var a in Eb)Eb[a]()}),Z.cors=!!Gb&&"withCredentials"in Gb,Z.ajax=Gb=!!Gb,aa.ajaxTransport(function(a){var b;
// Cross domain only allowed if supported through XMLHttpRequest
// Cross domain only allowed if supported through XMLHttpRequest
return Z.cors||Gb&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++Db;
// Apply custom fields if provided
if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];
// Override mime type if needed
a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),
// X-Requested-With header
// For cross-domain requests, seeing as conditions for a preflight are
// akin to a jigsaw puzzle, we simply never set it to be sure.
// (it can always be set on a per-request basis or even using ajaxSetup)
// For same-domain requests, won't change header if already provided.
a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");
// Set headers
for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete Eb[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Fb[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=Eb[g]=b("abort");try{
// Do send the request (this may raise an exception)
f.send(a.hasContent&&a.data||null)}catch(h){
// #14683: Only rethrow if this hasn't been notified as an error yet
if(b)throw h}},abort:function(){b&&b()}}:void 0}),
// Install script dataType
aa.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return aa.globalEval(a),a}}}),
// Handle cache's special case and crossDomain
aa.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),
// Bind script tag hack transport
aa.ajaxTransport("script",function(a){
// This transport only deals with cross domain requests
if(a.crossDomain){var b,c;return{send:function(d,e){b=aa("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),$.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Hb=[],Ib=/(=)\?(?=&|$)|\?\?/;
// Default jsonp settings
aa.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Hb.pop()||aa.expando+"_"+kb++;return this[a]=!0,a}}),
// Detect, normalize options and install callbacks for jsonp requests
aa.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Ib.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ib.test(b.data)&&"data");
// Handle iff the expected data type is "jsonp" or we have a parameter to set
// Handle iff the expected data type is "jsonp" or we have a parameter to set
// Get callback name, remembering preexisting value associated with it
// Insert callback into url or form data
// Use data converter to retrieve json after script execution
// force json dataType
// Install callback
// Clean-up function (fires after converters)
return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=aa.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Ib,"$1"+e):b.jsonp!==!1&&(b.url+=(lb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||aa.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Hb.push(e)),g&&aa.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),
// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
aa.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||$;var d=ha.exec(a),e=!c&&[];
// Single tag
// Single tag
return d?[b.createElement(d[1])]:(d=aa.buildFragment([a],b,e),e&&e.length&&aa(e).remove(),aa.merge([],d.childNodes))};
// Keep a copy of the old load method
var Jb=aa.fn.load;/**
 * Load a url into a page
 */
aa.fn.load=function(a,b,c){if("string"!=typeof a&&Jb)return Jb.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");
// If it's a function
// We assume that it's the callback
// If we have elements to modify, make the request
return h>=0&&(d=aa.trim(a.slice(h)),a=a.slice(0,h)),aa.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&aa.ajax({url:a,
// if "type" variable is undefined, then "GET" method will be used
type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?aa("<div>").append(aa.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},
// Attach a bunch of functions for handling common AJAX events
aa.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){aa.fn[b]=function(a){return this.on(b,a)}}),aa.expr.filters.animated=function(a){return aa.grep(aa.timers,function(b){return a===b.elem}).length};var Kb=a.document.documentElement;aa.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=aa.css(a,"position"),l=aa(a),m={};
// Set position first, in-case top/left are set even on static elem
"static"===k&&(a.style.position="relative"),h=l.offset(),f=aa.css(a,"top"),i=aa.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),aa.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},aa.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){aa.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)
// Make sure it's not a disconnected DOM node
// Make sure it's not a disconnected DOM node
// Support: BlackBerry 5, iOS 3 (original iPhone)
// If we don't have gBCR, just use 0,0 rather than error
return b=f.documentElement,aa.contains(b,d)?(typeof d.getBoundingClientRect!==Aa&&(e=d.getBoundingClientRect()),c=Q(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};
// Subtract parent offsets and element margins
// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
// Assume getBoundingClientRect is there when computed position is fixed
// Get *real* offsetParent
// Get correct offsets
// Add offsetParent borders
return"fixed"===aa.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),aa.nodeName(a[0],"html")||(d=a.offset()),d.top+=aa.css(a[0],"borderTopWidth",!0),d.left+=aa.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-aa.css(c,"marginTop",!0),left:b.left-d.left-aa.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var a=this.offsetParent||Kb;a&&!aa.nodeName(a,"html")&&"static"===aa.css(a,"position");)a=a.offsetParent;return a||Kb})}}),
// Create scrollLeft and scrollTop methods
aa.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(b,c){var d="pageYOffset"===c;aa.fn[b]=function(e){return ra(this,function(b,e,f){var g=Q(b);return void 0===f?g?g[c]:b[e]:void(g?g.scrollTo(d?a.pageXOffset:f,d?f:a.pageYOffset):b[e]=f)},b,e,arguments.length,null)}}),
// Support: Safari<7+, Chrome<37+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
aa.each(["top","left"],function(a,b){aa.cssHooks[b]=x(Z.pixelPosition,function(a,c){return c?(c=w(a,b),Ra.test(c)?aa(a).position()[b]+"px":c):void 0})}),
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
aa.each({Height:"height",Width:"width"},function(a,b){aa.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){
// Margin is only for outerHeight, outerWidth
aa.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return ra(this,function(b,c,d){var e;
// Get document width or height
// Get width or height on the element, requesting but not forcing parseFloat
// Set width or height on the element
return aa.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?aa.css(b,c,g):aa.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),
// The number of elements contained in the matched element set
aa.fn.size=function(){return this.length},aa.fn.andSelf=aa.fn.addBack,
// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.
// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
"function"==typeof d&&d.amd&&d("jquery",[],function(){return aa});var
// Map over jQuery in case of overwrite
Lb=a.jQuery,
// Map over the $ in case of overwrite
Mb=a.$;
// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
return aa.noConflict=function(b){return a.$===aa&&(a.$=Mb),b&&a.jQuery===aa&&(a.jQuery=Lb),aa},typeof b===Aa&&(a.jQuery=a.$=aa),aa}),e("undefined"!=typeof $?$:window.$)}).call(a,void 0,void 0,void 0,void 0,function(a){b.exports=a})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(a,b,c){window.app||(window.app={}),window.app.components||(window.app.components={}),window.app.components.Dropdown=function(a){"use strict";function c(a){this.$el=a,this.$menu=a.find(".dropdown-menu"),this._initEvents()}
// Expose as an AMD module
return c.prototype={_initEvents:function(){this.$el.on("click",".dropdown-button",function(a){a.stopPropagation(),this.toggle()}.bind(this)),a(document).click(this.close.bind(this))},toggle:function(){this[this.isOpen?"close":"open"]()},open:function(){this.$el.addClass("is-active"),this.isOpen=!0},close:function(){this.$el.removeClass("is-active"),this.isOpen=!1}},"function"==typeof define&&define.amd?define("bccdropdown",[],function(){return c}):"undefined"!=typeof b&&(b.exports=c),c}(window.jQuery)},{}],1:[function(a,b,c){window.app||(window.app={}),window.app.components||(window.app.components={}),window.app.components.Carousel=function(a){"use strict";/**
   * @constructor
   * @param {jQuery Object} $el - carousel container element
   * @param {object} options - carousel options
   */
function c(b,d){return this.options=a.extend({},this.defaults,d||{}),this.$el=b,c.prototype.init.apply(this,arguments)}if(!(a&&"jcarousel"in a.fn))throw new Error("BCC Carousel Component: unable to find jQuery or jCarousel");/**
   * Enable extremely simple inheritance as a way to add plugins
   * @param {object} properties to extend onto the prototype
   */
/**
   * Add pub/sub methods
   */
// Expose as an AMD module
return c.extend=function(b){var d,e,f=c.prototype;for(d in b)e=b[d],"function"==typeof e&&d in f&&(b[d]=function(a,b,c){return function(){return this._super=b,c.apply(this,arguments)}}(d,f[d],e));a.extend(!0,c.prototype,b)},c.prototype=a.extend({/**
     * Default options
     * jCarousel options can be passed to this as well:
     * http://sorgalla.com/jcarousel/docs/reference/configuration.html
     */
defaults:{/**
       * Number of items to display per page. This can be a fraction if using
       * responsive carousels.
       */
perPage:4,/**
       * Number of items to move through when next/prev arrows are clicked on.
       */
moveBy:4,/**
       * The index of the slide to start on.
       */
startIndex:0,/**
       * Set to 'circular' to wrap
       */
wrap:null,/**
       * Class added to the first item on a page.
       */
activeClass:"is-active",/**
       * Class added to disabled elements
       */
disabledClass:"is-disabled",/**
       * Add extra placeholder items at the end of the carousel? This forces
       * a specific number of items per page when the total number of items
       * is odd an odd number.
       */
addPlaceholderItems:!1},init:function(){var b=this.options,c=this;this._currentPage=0,this._namespace=".bcc-carousel"+(new Date).getTime(),this._cacheElems(),this._bindEvents(),
// Add placeholder items to the end of the carousel in order
// to force the correct number of pages?
b.addPlaceholderItems&&this._addPlaceholderItems(),/**
       * Proxy jCarousel events onto this object
       * Reference: http://sorgalla.com/jcarousel/docs/reference/events.html
       *
       * This allows us to write:
       *    var carousel = new BCCCarousel('.foo');
       *    carousel.on('scroll', fn);
       *
       * Instead of:
       *    var carousel = new BCCCarousel('.foo);
       *    carousel.$carousel.on('jcarousel:scroll', fn);
       */
a.each("create createend scroll scrollend animate animateend reload reloadend".split(" "),function(a,b){c.$carousel.on("jcarousel:"+b,function(){c.trigger.apply(c,[b].concat([].slice.call(arguments)))})}),
// Specified start index?
b.startIndex>0?this.one("createend",function(){c.scrollToIndex(b.startIndex,!1)}):this.$lis.eq(0).addClass(b.activeClass),
// Create the carousel instance
this.$carousel.jcarousel(b)},/**
     * A deferred that resolves when the carousel has finished being created.
     */
created:a.Deferred(),/**
     * Destroy the carousel
     */
destroy:function(){this.$carousel.off(),this.$carousel.jcarousel("destroy"),this.$ul.removeAttr("style"),this.off(),a(window).off(this._namespace)},/**
     * Move the carousel forwards by one page.
     * If the carousel has pagination then the pagination plugin overrides
     * this method with different logic.
     */
next:function(){this.$carousel.jcarousel("scroll","+="+this.options.moveBy)},/**
     * Move the carousel backwards by one page
     * If the carousel has pagination then the pagination plugin overrides
     * this method with different logic.
     */
prev:function(){this.$carousel.jcarousel("scroll","-="+this.options.moveBy)},/**
     * Scroll to a specific element
     * @param {jQuery object} $li - the <li> to scroll to
     * @param {Boolean} animate - whether or not to animate to the element
     */
scrollToElem:function(a,b){this.$carousel.jcarousel("scroll",a,b)},/**
     * Scroll to a specific element by index
     * @param {Number} index - index of the item
     * @param {Boolean} animate - whether or not to animate to the element
     */
scrollToIndex:function(a,b){var c=this.$lis.eq(a);this.scrollToElem(c,b)},/**
     * Reload the carousel
     */
reload:function(){this.$carousel.jcarousel("reload")},/**
     * Determine whether or not a list item is currently within
     * the visible page.
     * @param {jQuery object} $li - carousel item
     */
isItemVisible:function(a){return this.$carousel.jcarousel("fullyvisible").filter(a).length},/**
     * Determine whether or not the carousel is currently animating
     * @returns {Boolean}
     */
isAnimating:function(){return!!this.$carousel.data("jcarousel").animating},/**
     * Return the currently active item
     */
getTarget:function(){return this.$carousel.jcarousel("target")},/**
     * Register event listeners
     * @private
     */
_bindEvents:function(){
// Fire create callback once the carousel has finished initializing
this.one("createend",function(){this.created.resolve(this)}.bind(this))},/**
     * Cache re-used elements
     * @private
     */
_cacheElems:function(){this.$carousel=this.$el.find(".bcc-carousel-hook"),this.$ul=this.$carousel.find("ul"),this.$lis=this.$ul.children()},/**
     * Adds placeholder items to the end of the carousel in order to
     * force the correct number of pages. Only relevant if the addPlaceholderItems
     * option is set to true.
     * @private
     */
_addPlaceholderItems:function(){var a,b=this.options.perPage,c=b-this.$lis.length%b;for(a=0;c>a;a++)this.$ul.append('<li class="bcc-carousel-placeholder"></li>');this.$lis=this.$ul.children()}}),c.extend({init:function(){/**
       * jQuery object that'll act as a pub/sub bus
       * @private
       */
this._$eventBus=a({}),this._super()},/**
     * Register an event listener
     */
on:function(){return this._$eventBus.on.apply(this._$eventBus,arguments),this},/**
     * Register an event listener, once
     */
one:function(){return this._$eventBus.one.apply(this._$eventBus,arguments),this},/**
     * Remove an event listener
     */
off:function(){return this._$eventBus.off.apply(this._$eventBus,arguments),this},/**
     * Trigger an event
     */
trigger:function(){return this._$eventBus.trigger.apply(this._$eventBus,arguments),this}}),"function"==typeof define&&define.amd?define("bcccarousel",[],function(){return c}):"undefined"!=typeof b&&(b.exports=c),c}(window.jQuery),/**
  * Pagination
  */
function(){"use strict";window.app.components.Carousel.extend({defaults:{paginationEnabled:"auto",// true, false, or auto
paginationElement:function(){return this.$el.find(".bcc-carousel-pagination")},paginationTemplate:function(a,b){return'<li><a href="#'+a+'">&bull;</a></li>'}},init:function(){this._super(),
// Create the pagination
this._hasPagination()&&(this.$el.addClass("has-pagination"),this.$pagination.jcarouselPagination({item:this.options.paginationTemplate,perPage:this.options.perPage}))},destroy:function(){this._hasPagination()&&(this.$pagination.off(),this.$pagination.jcarouselPagination("destroy")),this._super()},/**
     * Move the carousel forwards by one page
     * Triggering next on the pagination circle here because of this bug:
     * https://github.com/jsor/jcarousel/issues/585
     * https://github.com/jsor/jcarousel/issues/603
     */
next:function(){
// Delegate to the super method if this carousel doesn't have pagination
// or if the carousel is set to wrap. If wrap is enabled then moving next
// via pagination circles will screw up the animation.
// Delegate to the super method if this carousel doesn't have pagination
// or if the carousel is set to wrap. If wrap is enabled then moving next
// via pagination circles will screw up the animation.
return this._hasPagination()&&"circular"!==this.options.wrap?void(this.isAnimating()||this.$pagination.find("."+this.options.activeClass).next().trigger("click")):void this._super()},/**
     * Move the carousel backwards by one page
     * Triggering next on the pagination circle here because of this bug:
     * https://github.com/jsor/jcarousel/issues/585
     */
prev:function(){
// Delegate to the super method if this carousel doesn't have pagination
// or if the carousel is set to wrap. If wrap is enabled then moving prev
// via pagination circles will screw up the animation.
// Delegate to the super method if this carousel doesn't have pagination
// or if the carousel is set to wrap. If wrap is enabled then moving prev
// via pagination circles will screw up the animation.
return this._hasPagination()&&"circular"!==this.options.wrap?void(this.isAnimating()||this.$pagination.find("."+this.options.activeClass).prev().trigger("click")):void this._super()},/**
     * Scroll to a specific page
     * @param {Number} pageNum - page number to scroll to
     */
scrollToPage:function(a){this.isAnimating()||this.$pagination.find("li").eq(a).trigger("click")},/**
     * Scroll to the page that contains an element by index
     * @param {Number} index - index of the item, 0-based
     */
scrollToPageByIndex:function(a){for(var b=this.$lis.get(),c=0,d=[],e=0;b.length;)d.push(b.splice(0,this.options.perPage));
// Find which page the index is in
for(var f=0,g=d.length;g>f;f++){var h=d[f];if(c)break;for(var i=0,j=h.length;j>i;i++){var k=h[i];if($(k).index()===a){c=f;break}e++}}this.scrollToPage(c)},/**
     * Return the jCarousel pagination instance
     * @return {Object} - jCarousel pagination plugin instance
     */
getPaginationObject:function(){return this.$pagination.data("jcarouselPagination")},/**
     * Get the current page number
     * @return {Number} - current page number
     */
getCurrentPage:function(){return parseInt(this.getPaginationObject()._currentPage,10)},/**
     * Get the total number of pages
     * @return {Number} - total number of pages
     */
getTotalPages:function(){return Object.keys(this.getPaginationObject()._pages).length},_bindEvents:function(){if(this._super(),this._hasPagination()){var a=(this.options.activeClass,this.options.disabledClass,this);
// Update the active pagination circle when a page is changed
this.$pagination.on("jcarouselpagination:active","li",function(b){a._currentPage=$(b.currentTarget).index(),a._updatePagination()}),
// When clicking directly on a pagination circle, set that circle
// as the active one.
this.$pagination.on("click","li",function(b){a._currentPage=$(b.currentTarget).index(),a._updatePagination()}),
// Reload pagination plugin when the jcarousel plugin reloads
this.on("reloadend",function(){a.$pagination.jcarouselPagination("reload",{perPage:a.options.perPage})})}},_cacheElems:function(){this._super(),this.$pagination=this.options.paginationElement.call(this)},/**
      * Are there enough videos to warrant pagination?
      * @private
      */
_hasPagination:function(){var a=this.options.paginationEnabled;return a===!0?!0:"auto"===a?this.$lis.length>this.options.perPage:!1},/**
      * Update the active pagination circle
      * @private
      */
_updatePagination:function(){var a=this.$pagination.find("li"),b=a.eq(this._currentPage),c=this.options.activeClass;b.addClass(c),b.siblings().removeClass(c)}})}(),/**
  * Controls
  */
function(){"use strict";window.app.components.Carousel.extend({defaults:{controls:{enabled:"auto",// auto, true, or false
nextBtn:".bcc-carousel-next",prevBtn:".bcc-carousel-prev"}},init:function(){if(this._super(),this._hasControls()){if(!this.$nextBtn.length||!this.$prevBtn.length)throw new Error("Controls are enabled but they could not be found in the DOM");this.$nextBtn.jcarouselControl({target:this._getTargetValueFor("next"),method:this.next.bind(this)}),this.$prevBtn.jcarouselControl({target:this._getTargetValueFor("prev"),method:this.prev.bind(this)})}},destroy:function(){this._hasControls()&&(this.$nextBtn.add(this.$prevBtn).off(),this.$nextBtn.jcarouselControl("destroy"),this.$prevBtn.jcarouselControl("destroy")),this._super()},_cacheElems:function(){this._super(),this.$nextBtn=this.$el.find(this.options.controls.nextBtn),this.$prevBtn=this.$el.find(this.options.controls.prevBtn)},_bindEvents:function(){
// Don't toggle disabled states if the carousel is set to wrap
if(this._super(),!this.options.wrap){var a=this.options.disabledClass;this.$prevBtn.add(this.$nextBtn).on("jcarouselcontrol:active",function(){$(this).removeClass(a)}),this.$prevBtn.add(this.$nextBtn).on("jcarouselcontrol:inactive",function(){$(this).addClass(a)})}
// When jCarousel's configuration changes, update the control's
// configuration as well.
this.on("reloadend",function(){this.$nextBtn.jcarouselControl("reload",{target:this._getTargetValueFor("next")}),this.$prevBtn.jcarouselControl("reload",{target:this._getTargetValueFor("prev")})}.bind(this))},/**
     * Tap into to the pagination logic to sync the controls enabled/disabled
     * state. We do this because jCarousel doesn't always calcualte whether or
     * not the prev/next arrows should be enabled or disabled correctly, so if
     * pagination is enabled, it's more accurate to piggyback on that logic.
     * @private
     */
_updatePagination:function(){if(this._super(),"circular"!==this.options.wrap&&this._hasControls()){var a=this.options.disabledClass,b=this._currentPage+1,c=this.getTotalPages(),d=1===b&&c>1||1===c,e=1===c||b>=c;this.$prevBtn.toggleClass(a,d),this.$nextBtn.toggleClass(a,e)}},/**
     * Determine if this carousel should have controls if the enabled option
     * is set to 'auto'. FIXME: this hasn't been implemented to work
     * with responsive carousels yet.
     * @private
     * @returns {Boolean} whether or not controls should exist or not.
     */
_hasControls:function(){var a=this.options.controls.enabled;return a===!0?!0:"auto"===a?this.$lis.length>this.options.perPage:!1},/**
     * Returns the next/prev page of results.
     * @private
     * @param {String} dir - direction (prev or next)
     * @returns {String} how many slides to move and in which direction./
     */
_getTargetValueFor:function(a){return("next"===a?"+":"-")+"="+this.options.moveBy}})}(),/**
 * Lazy load images
 */
function(){"use strict";window.app.components.Carousel.extend({defaults:{/**
       * Enable image lazy loading? If this is set to true, then image
       * tags inside of the carousel should have a `data-src` attribute
       * instead of `src`.
       */
lazyLoadImages:!1,/**
       * Class name that's applied to images in order to fade them in.
       */
lazyLoadClass:"bcc-carousel-fade-in"},init:function(){this._super(),this.options.lazyLoadImages&&this.$el.addClass("has-lazyloading")},_bindEvents:function(){if(this._super(),this.options.lazyLoadImages){var a=this._lazyload.bind(this);this.on("scroll",a),this.on("scrollend",a),this.on("createend",a),this.on("breakpoint:change",a),this.$carousel.on("scroll",a)}},/**
     * Return currently visible items.
     * @private
     * @return {jQuery} - Object of visible slides
     */
_getVisibleItems:function(){
// Take a different code path if using native overflow scrolling
// Take a different code path if using native overflow scrolling
return this._currentBreakpoint&&"overflow"===this._currentBreakpoint.scroll?this.$lis.filter(function(a,b){var c=b.getBoundingClientRect();return c.right<=(window.innerWidth||document.documentElement.clientWidth)+window.innerWidth}):this.$carousel.jcarousel("visible")},/**
     * Perform the actual lazy loading logic.
     * @private
     */
_lazyload:function(){var a=this._getVisibleItems(),b=this.options.lazyLoadClass;a&&a.length&&a.find("img[data-src]").each(function(a,c){var d=$(c),e=d.data("src");c.complete?d.addClass(b):(d.one("load",function(){d.addClass(b)}),
// If this image fails to load then stop trying
d.one("error",function(){d.removeAttr("data-src")})),c.src!==e&&(c.src=e)})}})}(),/**
  * Auto Scroll
  */
function(){"use strict";window.app.components.Carousel.extend({defaults:{autoscroll:{target:"+=1",interval:3e3,autostart:!1}},init:function(){this._super();var a=this.options.autoscroll;
// Create the pagination
a.autostart&&this.$carousel.jcarouselAutoscroll(a)},destroy:function(){this.options.autoscroll.autostart&&this.$carousel.jcarouselAutoscroll("destroy"),this._super()}})}(),/**
 * Touch scrolling
 * This is designed to be a very simple mobile fallback
 * TODO: update pagination/control arrows based on the current position
 * TODO: momentum scrolling
 */
function(){"use strict";window.app.components.Carousel.extend({defaults:{/**
       * Enable touch scrolling. Supported values are:
       *   false - disable touch scrolling
       *   swipe - move through the carousel using a swipe event
       *   track - the carousel will follow your finger as you move it. The
       *           performance of this is pretty terrible on mobile devices.
       */
touchScrolling:!1,/**
       * Snap enable snapping as you touch scroll. Supported values are:
       *   false - disable snapping
       *   item - snap to the closest item
       *   page - snap to the closest page
       */
touchScrollingSnap:"item",/**
       * Snap delta. If the amount moved does not exceed this value then the
       * carousel will be snapped back to where it was (touchScrolling = track)
       * or the carousel won't move at all (touchScrolling = swipe).
       */
touchScrollingDelta:100},init:function(){this._super(),this._enableTouchScrolling()},destroy:function(){this._disableTouchScrolling(),this._disableOverflowScrolling(),this._super()},_bindEvents:function(){this._super(),this.on("breakpoint:change",function(a,b){"overflow"===b.scroll?this._enableOverflowScrolling():this._enableTouchScrolling()}.bind(this))},/**
     * Enable native scrolling via overflow: scroll
     * @private
     */
_enableOverflowScrolling:function(){this._overflowScrollingEnabled||(this._disableTouchScrolling(),this.$el.addClass("has-overflow-scrolling"),this._overflowScrollingEnabled=!0)},/**
     * Disable native scrolling via overflow: scroll
     * @private
     */
_disableOverflowScrolling:function(){this._overflowScrollingEnabled&&(this.$carousel.scrollLeft(0),this.$el.removeClass("has-overflow-scrolling"),this.$ul.removeAttr("style"),this._overflowScrollingEnabled=!1)},/**
     * Enable scrolling via touchmove events
     * @private
     */
_enableTouchScrolling:function(){this._disableOverflowScrolling(),"ontouchstart"in window&&!this._touchScrollingEnabled&&this.options.touchScrolling&&(this.$carousel.on("touchstart touchend touchmove",this._handleTouchEvent.bind(this)),this._touchScrollingEnabled=!0)},/**
     * Disable scrolling via touchmove events
     * @private
     */
_disableTouchScrolling:function(){this.$carousel.off("touchstart touchend touchmove"),this._touchScrollingEnabled=!1},/**
     * Touch event handler
     * @private
     * @param {Object} event - event object
     */
_handleTouchEvent:function(a){a=a.originalEvent,"touchstart"===a.type?this._onTouchStart(a):"touchmove"===a.type?this._onTouchMove(a):this._onTouchEnd(a)},/**
     * Touch start handler
     * @private
     * @param {Object} event - event object
     */
_onTouchStart:function(a){var b=a.targetTouches[0];this._firstVisibleElem=this.$carousel.jcarousel("fullyvisible")[0],this._startCoords={x:b.pageX,y:b.pageY},this._touchMovePos=this._startCoords.x},/**
     * Touch move handler
     * @private
     * @param {Object} event - event object
     */
_onTouchMove:function(a){var b,c,d=this.$ul[0],e=this.options,f=e.transitions&&e.transitions.transforms,g=a.touches[0],h={x:g.pageX-this._startCoords.x,y:g.pageY-this._startCoords.y};
// Prevent native scrolling if we're obviously trying to pan
// through the carousel instead of scrolling vertically
Math.abs(h.x)>=Math.abs(h.y)&&a.preventDefault(),
// Separate code paths for CSS3 transitions
f?(b=d.style.transform?"transform":d.style.webkitTransform?"webkitTransform":d.style.mozTransform?"mozTransform":null,c=parseInt(d.style[b].split("(")[1].replace("px",""),10)):c=parseInt(d.style.left.replace("px",""),10);var i=a.targetTouches[0].pageX,j=this._touchMovePos-i,k=this.$lis.outerWidth(),l=this.$lis.length*k*-1+k*this.options.perPage,m=c-j;this.direction=i>this._touchMovePos?"backwards":"forwards",this._touchMovePos=i,
// keep in bounds
m>0&&(m=0),0>m&&l>m&&(m=l),m+="px","track"===this.options.touchScrolling&&(f?d.style[b]="translate("+m+", 0)":d.style.left=m)},/**
     * Touch end handler
     * @private
     * @param {Object} event - event object
     */
_onTouchEnd:function(a){var b=this.options,c=Math.abs(this._startCoords.x-this._touchMovePos),d=c<=b.touchScrollingDelta;
// Snap back to where the user was prior to moving if they didn't move far enough
if("track"===b.touchScrolling&&d)return void this.scrollToElem(this._firstVisibleElem,!0);
// If this is a swipe gesture, don't do anything if inside the delta
if("swipe"!==b.touchScrolling||!d)if("item"===b.touchScrollingSnap){var e=this.$lis.width(),f=this.$carousel.width(),g=this.$lis.filter(function(a,b){var c=b.getBoundingClientRect().left;return c+e>0&&f>c}.bind(this)).get(),h="forwards"===this.direction?g[1]:g[0];this.scrollToElem(h,!1)}else"page"===b.touchScrollingSnap&&this["forwards"===this.direction?"next":"prev"]()}})}(),/**
  * Responsive
  */
function(){"use strict";
// From http://remysharp.com/2010/07/21/throttling-function-calls/
var a=function(a,b,c){b||(b=250);var d,e;return function(){var f=c||this,g=(new Date).getTime(),h=arguments;d&&d+b>g?(clearTimeout(e),e=setTimeout(function(){d=g,a.apply(f,h)},b)):(d=g,a.apply(f,h))}};window.app.components.Carousel.extend({defaults:{/**
       * Enable responsive mode?
       */
responsive:!1,/**
       * The amount of time in ms to throttle the window.onresize event
       */
responsiveThrottle:100,/**
       * An array of breakpoints objects. Options are:
       *    minWidth (required) - minimum window size for breakpoint
       *    maxWidth (optional) - maximum window size for breakpoint
       *    scroll (optional) - breakpoint's scroll behavior. Set this to `overflow`
       *        to use the browser's native overflow:scroll logic instead of custom JS.
       *    perPage (optional) - number of items per page
       *    moveBy (optional) - number of items to move by
       *
       * Example:
       * {
       *    breakpoints: [{
       *      minWidth: 0,
       *      maxWidth: 320,
       *      scroll: 'overflow',
       *      perPage: 1,
       *      moveBy: 1
       *    }]
       * }
       */
breakpoints:[]},init:function(){this._super(),this.options.responsive&&this._calculateWidth()},destroy:function(){this.options.responsive&&this.$lis.removeAttr("style"),this._super()},_bindEvents:function(){if(this._super(),this.options.responsive){var b=a(this._calculateWidth,this.options.responsiveThrottle,this);$(window).on("resize"+this._namespace,b)}},/**
     * Activate a breakpoint. Triggers a breakpoint:change event.
     * @private
     * @param {Object} breakpoint - breakpoint to activate
     */
_applyBreakpoint:function(a){this.options.moveBy=a.moveBy,this.options.perPage=a.perPage,this.$carousel.jcarousel("reload"),this.trigger("breakpoint:change",a,this._currentBreakpoint),this._currentBreakpoint=a},/**
     * Calculate a new width for each item in the carousel using the current
     * window's width.
     */
_calculateWidth:function(){var a,b,c,d,e=this.options,f=function(a){var b=this.$carousel.innerWidth()/a.perPage;this._applyWidth(b,a)}.bind(this);
// If we're not using breakpoints, resize with the number of
// items defined in the options.
if(!e.breakpoints.length)return f({perPage:e.perPage});
// If we are using breakpoints, find the closest breakpoint that matches
// and resize using the number of items defined in that breakpoint.
var g=window.innerWidth;for(c=0,d=e.breakpoints.length;d>c;c++)if(a=e.breakpoints[c],g>=a.minWidth){if(a.maxWidth&&g>a.maxWidth)continue;b=a}
// If a breakpoint was found..
b&&(
// Calculate and apply the new width.
f(b),
// "Officially" apply the breakpoint if it changed.
this._currentBreakpoint&&this._currentBreakpoint.minWidth===b.minWidth||this._applyBreakpoint(b))},/**
     * Set the carousel and item widths.
     * @private
     * @param {Number} width - new item width in px
     * @param {Object} breakpoint - current breakpoint or null
     */
_applyWidth:function(a,b){for(var c=this.$lis,d=0,e=c.length;e>d;d++)c[d].style.width=a+"px";b&&"overflow"===b.scroll&&(this.$ul[0].style.width=c.length*a+"px")}})}()},{}]},{},[]);