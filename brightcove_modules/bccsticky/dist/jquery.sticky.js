/**
 * jQuery sticky elements plugin
 */

(function($) {
  'use strict';

  // We'll be using these references multiple times
  var $win = $(window);
  var docElem = document.documentElement;

  // Top offset for each sticky element so they stack below each other
  var stackOffset = 0;

  // Used to generate a unique id for this instance
  var uniqueId = 0;

  /**
   * @constructor
   * @param {Element} elem - DOM element to make sticky
   * @param {Object} options - options object
   */
  function Sticky(elem, options) {
    this._id = uniqueId++;
    this.elem = elem;
    this.$elem = $(elem);
    this.options = options;
    this.stackOffset = stackOffset + this.options.stackOffset;
    this.stuck = false;
    this._init();
  }

  Sticky.prototype = {
    /**
     * Initializer
     * @private
     */
    _init: function() {
      this._prepareClone();
      this._prepareElement();
      this.enable();
      this._calculate();
      this.options.onCreate.call(this, this.$container);
    },

    /**
     * Stick the element to the top
     */
    stick: function() {
      if(this.stuck || !this.enabled) {
        return;
      }

      this._syncDimensions();
      this._setTopOffset();
      this.$clone.removeClass(this.options.cloneHiddenClass);
      this.container.className += ' ' + this.options.fixedClass;
      this.stuck = true;
      this.options.onStick.call(this, this.$container);
      this.$elem.trigger('stick');
    },

    /**
     * Unstick the element from the top
     */
    unstick: function() {
      if(!this.stuck) {
        return;
      }

      this.stuck = false;
      this.clone.className += ' ' + this.options.cloneHiddenClass;
      this.clone.removeAttribute('style');
      this.$container.removeClass(this.options.fixedClass);
      this.options.onUnStick.call(this, this.$container);
      this.$elem.trigger('unstick');
    },

    /**
     * Enable this plugin
     */
    enable: function() {
      if(this.enabled) {
        return;
      }

      var events = 'scroll.sticky' + this._id;
      events += ' resize.sticky' + this._id;
      events += ' touchmove.sticky' + this._id;
      $win.on(events, this._calculate.bind(this));
      this.enabled = true;
    },

    /**
     * Disable this plugin
     */
    disable: function() {
      if(!this.enabled) {
        return;
      }

      $win.off('.sticky' + this._id);

      if(this.stuck) {
        this.unstick();
      }

      this.enabled = false;
    },

    /**
     * Change plugin option at runtime
     * @param {String} option - option to change
     * @param {Any} value - new value for the option
     */
    setOption: function(option, value) {
      switch(option) {
        case 'stackOffset':
          this._getElemHeight();
          this.stackOffset -= this.options.stackOffset;
          this.options.stackOffset = value;
          this.stackOffset += value;
          this._setTopOffset();
          break;
      }
    },

    /**
     * Destroy instance of this plugin
     */
    destroy: function() {
      this.disable();
      this.$clone.remove();
      stackOffset -= this.stackOffset;
      // TODO: unwrap
    },

    /**
     * Clone the element to use when the real element is in sticky mode.
     * The clone will take its place in the flow so things don't jump
     * around.
     * @private
     */
    _prepareClone: function() {
      var $elem = this.$elem;
      var opts = this.options;
      var $clone = this.$clone = $elem.clone();
      this.clone = this.$clone[0];
      $clone.removeAttr('class');
      $clone.addClass(opts.cloneClass);
      $clone.addClass(opts.cloneHiddenClass);
      $clone.attr('data-sticky-clone', true);
      $clone.removeAttr('id');
      $clone.empty();
      $clone.insertBefore($elem);
    },

    /**
     * Wrap the element that should be sticky in a new container element
     * @private
     */
    _prepareElement: function() {
      this.$elem.wrap('<div class="' + this.options.containerClass + '"></div>');
      this.$container = this.$elem.parent();
      this.container = this.$container[0];

      // If this instance should stack below other instances...
      if(this.options.stacks) {
        // Add this element's height to the running total so that the
        // next sticky instance sits below this one
        stackOffset += this._elemHeight;

        this.container.className += ' ' + this.options.stacksClass;

        this.$elem.one('stick', function() {
          this._adjustZindex();
        }.bind(this));
      }
    },

    /**
     * Determine whether or not the element should stick based on its current
     * position in the document
     * @private
     */
    _calculate: function(event) {
      var opts = this.options;
      var stackOffset = opts.stacks ? this.stackOffset : 0;
      var topOffset = this.container.className.indexOf(opts.fixedClass) > -1 ?
        this._getOffsetTop(this.clone) :
        this._getOffsetTop(this.elem);

      var isVisible = this._getScrollTop() >= (topOffset - stackOffset);
      this[isVisible ? 'stick' : 'unstick']();

      // Make sure the clone's width stays in sync with the element's width
      // if the screen is resized. Element calculations are performed before
      // applying them in order to reduce reflows.
      if(isVisible && event && event.type === 'resize') {
        this._syncDimensions();
      }
    },

    /**
     * Set the top css property of the container
     * @private
     */
    _setTopOffset: function() {
      this.container.style.top = this.stackOffset + 'px';
    },

    /**
     * Get this element's height
     * @returns {number} element height
     * @private
     */
    _getElemHeight: function() {
      var height = this.elem.clientHeight;

      if(this._elemHeight) {
        stackOffset -= this._elemHeight;
        stackOffset += height;
      }

      return (this._elemHeight = height);
    },

    /**
     * Get the window's scrollTop position
     * @returns {number}
     * @private
     */
    _getScrollTop: function() {
      return ('pageYOffset' in window) ? window.pageYOffset :
        ('scrollTop' in docElem) ? docElem.scrollTop :
        $win.scrollTop();
    },

    /**
     * Get this element's offsetTop position
     * @param {Element} DOM element to get the top position of
     * @returns {number}
     * @private
     */
    _getOffsetTop: function(elem) {
      var top = typeof elem.getBoundingClientRect !== undefined ?
        elem.getBoundingClientRect().top : 0;

      return top + this._getScrollTop() - (docElem.clientTop || 0);
    },

    /**
     * Adjust the z-index of this element
     * @param {Number} value - z-index value to set on the container
     * @private
     */
    _adjustZindex: function(value) {
      if(value == null) {
        value = parseInt(this.container.style.zIndex, 10) + this._id;
      }

      this.container.style.zIndex = value;
    },

    /**
     * Keep the clone's dimensions in sync with the element's dimensions.
     * Getters are performed before the setters in order to element a reflow.
     * @private
     */
    _syncDimensions: function() {
      var width = this.elem.clientWidth;
      var height = this._getElemHeight();
      this.clone.style.width = width + 'px';
      this.clone.style.height = height + 'px';
    }
  };

  // Expose as a jQuery plugin
  $.fn.sticky = function(opts) {
    return this.each(function() {
      var options, obj;

      if(obj = $.data(this, 'sticky')) {
        return obj;
      }

      options = $.extend({}, $.fn.sticky.defaults, opts || {});
      return $.data(this, 'sticky', new Sticky(this, options));
    });
  };

  // Default options
  $.fn.sticky.defaults = {
    stacks: true, // Should each instance of this plugin stack on top of each other?
    stackOffset: 0, // Additional offset from the top until the element becomes fixed
    containerClass: 'bcc-sticky-wrapper',
    fixedClass: 'bcc-sticky-is-stuck',
    stacksClass: 'bcc-sticky-does-stack',
    cloneClass: 'bcc-sticky-clone',
    cloneHiddenClass: 'bcc-sticky-clone-hidden',
    onStick: $.noop,
    onUnStick: $.noop,
    onCreate: $.noop
  };
})(window.jQuery);
