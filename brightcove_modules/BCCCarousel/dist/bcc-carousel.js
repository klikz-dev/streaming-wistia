window.app || (window.app = {});
window.app.components || (window.app.components = {});
window.app.components.Carousel = (function($) {
  'use strict';

  if(!$ || !('jcarousel' in $.fn)) {
    throw new Error('BCC Carousel Component: unable to find jQuery or jCarousel');
  }

  /**
   * @constructor
   * @param {jQuery Object} $el - carousel container element
   * @param {object} options - carousel options
   */
  function Carousel($el, options) {
    this.options = $.extend({}, this.defaults, options || {});
    this.$el = $el;
    return Carousel.prototype.init.apply(this, arguments);
  }

  /**
   * Enable extremely simple inheritance as a way to add plugins
   * @param {object} properties to extend onto the prototype
   */
  Carousel.extend = function(props) {
    var superProto = Carousel.prototype;
    var name, prop;

    for(name in props) {
      prop = props[name];

      if(typeof prop === 'function' && name in superProto) {
        props[name] = (function(name, superFn, fn) {
          return function() {
            this._super = superFn;
            return fn.apply(this, arguments);
          };
        })(name, superProto[name], prop);
      }
    }

    $.extend(true, Carousel.prototype, props);
  };

  Carousel.prototype = $.extend({
    /**
     * Default options
     * jCarousel options can be passed to this as well:
     * http://sorgalla.com/jcarousel/docs/reference/configuration.html
     */
    defaults: {
      /**
       * Number of items to display per page. This can be a fraction if using
       * responsive carousels.
       */
      perPage: 4,

      /**
       * Number of items to move through when next/prev arrows are clicked on.
       */
      moveBy: 4,

      /**
       * The index of the slide to start on.
       */
      startIndex: 0,

      /**
       * Set to 'circular' to wrap
       */
      wrap: null,

      /**
       * Class added to the first item on a page.
       */
      activeClass: 'is-active',

      /**
       * Class added to disabled elements
       */
      disabledClass: 'is-disabled',

      /**
       * Add extra placeholder items at the end of the carousel? This forces
       * a specific number of items per page when the total number of items
       * is odd an odd number.
       */
      addPlaceholderItems: false
    },

    init: function() {
      var opts = this.options;
      var self = this;
      this._currentPage = 0;
      this._namespace = '.bcc-carousel' + (new Date().getTime());
      this._cacheElems();
      this._bindEvents();

      // Add placeholder items to the end of the carousel in order
      // to force the correct number of pages?
      if(opts.addPlaceholderItems) {
        this._addPlaceholderItems();
      }

      /**
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
      $.each('create createend scroll scrollend animate animateend reload reloadend'.split(' '), function(i, evt) {
        self.$carousel.on('jcarousel:' + evt, function() {
          self.trigger.apply(self, [ evt ].concat([].slice.call(arguments)));
        });
      });

      // Specified start index?
      if(opts.startIndex > 0) {
        this.one('createend', function() {
          self.scrollToIndex(opts.startIndex, false);
        });
      } else {
        this.$lis.eq(0).addClass(opts.activeClass);
      }

      // Create the carousel instance
      this.$carousel.jcarousel(opts);
    },

    /**
     * A deferred that resolves when the carousel has finished being created.
     */
    created: $.Deferred(),

    /**
     * Destroy the carousel
     */
    destroy: function() {
      this.$carousel.off();
      this.$carousel.jcarousel('destroy');
      this.$ul.removeAttr('style');
      this.off();
      $(window).off(this._namespace);
    },

    /**
     * Move the carousel forwards by one page.
     * If the carousel has pagination then the pagination plugin overrides
     * this method with different logic.
     */
    next: function() {
      this.$carousel.jcarousel('scroll', '+=' + this.options.moveBy);
    },

    /**
     * Move the carousel backwards by one page
     * If the carousel has pagination then the pagination plugin overrides
     * this method with different logic.
     */
    prev: function() {
      this.$carousel.jcarousel('scroll', '-=' + this.options.moveBy);
    },

    /**
     * Scroll to a specific element
     * @param {jQuery object} $li - the <li> to scroll to
     * @param {Boolean} animate - whether or not to animate to the element
     */
    scrollToElem: function($li, animate) {
      this.$carousel.jcarousel('scroll', $li, animate);
    },

    /**
     * Scroll to a specific element by index
     * @param {Number} index - index of the item
     * @param {Boolean} animate - whether or not to animate to the element
     */
    scrollToIndex: function(index, animate) {
      var $li = this.$lis.eq(index);
      this.scrollToElem($li, animate);
    },

    /**
     * Reload the carousel
     */
    reload: function() {
      this.$carousel.jcarousel('reload');
    },

    /**
     * Determine whether or not a list item is currently within
     * the visible page.
     * @param {jQuery object} $li - carousel item
     */
    isItemVisible: function($li) {
      return this.$carousel.jcarousel('fullyvisible').filter($li).length;
    },

    /**
     * Determine whether or not the carousel is currently animating
     * @returns {Boolean}
     */
    isAnimating: function() {
      return !!this.$carousel.data('jcarousel').animating;
    },

    /**
     * Return the currently active item
     */
    getTarget: function() {
      return this.$carousel.jcarousel('target');
    },

    /**
     * Register event listeners
     * @private
     */
    _bindEvents: function() {
      // Fire create callback once the carousel has finished initializing
      this.one('createend', function() {
        this.created.resolve(this);
      }.bind(this));
    },

    /**
     * Cache re-used elements
     * @private
     */
    _cacheElems: function() {
      this.$carousel = this.$el.find('.bcc-carousel-hook');
      this.$ul = this.$carousel.find('ul');
      this.$lis = this.$ul.children();
    },

    /**
     * Adds placeholder items to the end of the carousel in order to
     * force the correct number of pages. Only relevant if the addPlaceholderItems
     * option is set to true.
     * @private
     */
    _addPlaceholderItems: function() {
      var perPage = this.options.perPage;
      var addLis = perPage - (this.$lis.length % perPage);
      var i;

      for (i = 0; i < addLis; i++) {
        this.$ul.append('<li class="bcc-carousel-placeholder"></li>');
      }

      this.$lis = this.$ul.children();
    }
  });

  /**
   * Add pub/sub methods
   */
  Carousel.extend({
    init: function() {
      /**
       * jQuery object that'll act as a pub/sub bus
       * @private
       */
      this._$eventBus = $({});
      this._super();
    },

    /**
     * Register an event listener
     */
    on: function() {
      this._$eventBus.on.apply(this._$eventBus, arguments);
      return this;
    },

    /**
     * Register an event listener, once
     */
    one: function() {
      this._$eventBus.one.apply(this._$eventBus, arguments);
      return this;
    },

    /**
     * Remove an event listener
     */
    off: function() {
      this._$eventBus.off.apply(this._$eventBus, arguments);
      return this;
    },

    /**
     * Trigger an event
     */
    trigger: function() {
      this._$eventBus.trigger.apply(this._$eventBus, arguments);
      return this;
    }
  });

  // Expose as an AMD module
  if(typeof define === 'function' && define.amd) {
    define('bcccarousel', [], function() {
      return Carousel;
    });
  } else if (typeof module != 'undefined') {
    module.exports = Carousel;
  }

  return Carousel;
})(window.jQuery);
;/**
  * Pagination
  */
(function() {
  'use strict';

  window.app.components.Carousel.extend({
    defaults: {
      paginationEnabled: 'auto', // true, false, or auto
      paginationElement: function() {
        return this.$el.find('.bcc-carousel-pagination');
      },
      paginationTemplate: function(page, carouselItems) {
        return '<li><a href="#' + page + '">&bull;</a></li>';
      }
    },

    init: function() {
      this._super();

      // Create the pagination
      if(this._hasPagination()) {
        this.$el.addClass('has-pagination');

        this.$pagination.jcarouselPagination({
          item: this.options.paginationTemplate,
          perPage: this.options.perPage
        });
      }
    },

    destroy: function() {
      if(this._hasPagination()) {
        this.$pagination.off();
        this.$pagination.jcarouselPagination('destroy');
      }

      this._super();
    },

    /**
     * Move the carousel forwards by one page
     * Triggering next on the pagination circle here because of this bug:
     * https://github.com/jsor/jcarousel/issues/585
     * https://github.com/jsor/jcarousel/issues/603
     */
    next: function() {
      // Delegate to the super method if this carousel doesn't have pagination
      // or if the carousel is set to wrap. If wrap is enabled then moving next
      // via pagination circles will screw up the animation.
      if(!this._hasPagination() || this.options.wrap === 'circular') {
        this._super();
        return;
      }

      if(!this.isAnimating()) {
        this.$pagination.find('.' + this.options.activeClass).next().trigger('click');
      }
    },

    /**
     * Move the carousel backwards by one page
     * Triggering next on the pagination circle here because of this bug:
     * https://github.com/jsor/jcarousel/issues/585
     */
    prev: function() {
      // Delegate to the super method if this carousel doesn't have pagination
      // or if the carousel is set to wrap. If wrap is enabled then moving prev
      // via pagination circles will screw up the animation.
      if(!this._hasPagination() || this.options.wrap === 'circular') {
        this._super();
        return;
      }

      if(!this.isAnimating()) {
        this.$pagination.find('.' + this.options.activeClass).prev().trigger('click');
      }
    },

    /**
     * Scroll to a specific page
     * @param {Number} pageNum - page number to scroll to
     */
    scrollToPage: function(pageNum) {
      if(!this.isAnimating()) {
        this.$pagination.find('li').eq(pageNum).trigger('click');
      }
    },

    /**
     * Scroll to the page that contains an element by index
     * @param {Number} index - index of the item, 0-based
     */
    scrollToPageByIndex: function(index) {
      var arr = this.$lis.get();
      var pageNum = 0;
      var groups = [];
      var counter = 0;

      while(arr.length) {
        groups.push(arr.splice(0, this.options.perPage));
      }

      // Find which page the index is in
      for(var groupIndex = 0, len = groups.length; groupIndex < len; groupIndex++) {
        var group = groups[groupIndex];

        if(pageNum) {
          break;
        }

        for(var x = 0, groupLen = group.length; x < groupLen; x++) {
          var elem = group[x];

          if($(elem).index() === index) {
            pageNum = groupIndex;
            break;
          }

          counter++;
        }
      }

      this.scrollToPage(pageNum);
    },

    /**
     * Return the jCarousel pagination instance
     * @return {Object} - jCarousel pagination plugin instance
     */
    getPaginationObject: function() {
      return this.$pagination.data('jcarouselPagination');
    },

    /**
     * Get the current page number
     * @return {Number} - current page number
     */
    getCurrentPage: function() {
      return parseInt(this.getPaginationObject()._currentPage, 10);
    },

    /**
     * Get the total number of pages
     * @return {Number} - total number of pages
     */
    getTotalPages: function() {
      return Object.keys(this.getPaginationObject()._pages).length;
    },

    _bindEvents: function() {
      this._super();

      if(!this._hasPagination()) {
        return;
      }

      var activeClass = this.options.activeClass;
      var disabledClass = this.options.disabledClass;
      var self = this;

      // Update the active pagination circle when a page is changed
      this.$pagination.on('jcarouselpagination:active', 'li', function(event) {
        self._currentPage = $(event.currentTarget).index();
        self._updatePagination();
      });

      // When clicking directly on a pagination circle, set that circle
      // as the active one.
      this.$pagination.on('click', 'li', function(event) {
        self._currentPage = $(event.currentTarget).index();
        self._updatePagination();
      });

      // Reload pagination plugin when the jcarousel plugin reloads
      this.on('reloadend', function() {
        self.$pagination.jcarouselPagination('reload', {
          perPage: self.options.perPage
        });
      });
    },

    _cacheElems: function() {
      this._super();
      this.$pagination = this.options.paginationElement.call(this);
    },

    /**
      * Are there enough videos to warrant pagination?
      * @private
      */
    _hasPagination: function() {
      var opt = this.options.paginationEnabled;

      return opt === true ?
        true : opt === 'auto' ?
        this.$lis.length > this.options.perPage : false;
    },

    /**
      * Update the active pagination circle
      * @private
      */
    _updatePagination: function() {
      var $pages = this.$pagination.find('li');
      var $active = $pages.eq(this._currentPage);
      var activeClass = this.options.activeClass;
      $active.addClass(activeClass);
      $active.siblings().removeClass(activeClass);
    }
  });
})();
;/**
  * Controls
  */
(function() {
  'use strict';

  window.app.components.Carousel.extend({
    defaults: {
      controls: {
        enabled: 'auto', // auto, true, or false
        nextBtn: '.bcc-carousel-next',
        prevBtn: '.bcc-carousel-prev'
      }
    },

    init: function() {
      this._super();

      if(this._hasControls()) {
        if(!this.$nextBtn.length || !this.$prevBtn.length) {
          throw new Error('Controls are enabled but they could not be found in the DOM');
        }

        this.$nextBtn.jcarouselControl({
          target: this._getTargetValueFor('next'),
          method: this.next.bind(this)
        });
        this.$prevBtn.jcarouselControl({
          target: this._getTargetValueFor('prev'),
          method: this.prev.bind(this)
        });
      }
    },

    destroy: function() {
      if(this._hasControls()) {
        this.$nextBtn.add(this.$prevBtn).off();
        this.$nextBtn.jcarouselControl('destroy');
        this.$prevBtn.jcarouselControl('destroy');
      }

      this._super();
    },

    _cacheElems: function() {
      this._super();
      this.$nextBtn = this.$el.find(this.options.controls.nextBtn);
      this.$prevBtn = this.$el.find(this.options.controls.prevBtn);
    },

    _bindEvents: function() {
      this._super();

      // Don't toggle disabled states if the carousel is set to wrap
      if(!this.options.wrap) {
        var disabledClass = this.options.disabledClass;

        this.$prevBtn.add(this.$nextBtn).on('jcarouselcontrol:active', function() {
          $(this).removeClass(disabledClass);
        });
        this.$prevBtn.add(this.$nextBtn).on('jcarouselcontrol:inactive', function() {
          $(this).addClass(disabledClass);
        });
      }

      // When jCarousel's configuration changes, update the control's
      // configuration as well.
      this.on('reloadend', function() {
        this.$nextBtn.jcarouselControl('reload', {
          target: this._getTargetValueFor('next')
        });
        this.$prevBtn.jcarouselControl('reload', {
          target: this._getTargetValueFor('prev')
        });
      }.bind(this));
    },

    /**
     * Tap into to the pagination logic to sync the controls enabled/disabled
     * state. We do this because jCarousel doesn't always calcualte whether or
     * not the prev/next arrows should be enabled or disabled correctly, so if
     * pagination is enabled, it's more accurate to piggyback on that logic.
     * @private
     */
    _updatePagination: function() {
      this._super();

      if(this.options.wrap !== 'circular' && this._hasControls()) {
        var disabledClass = this.options.disabledClass;
        var currPage = this._currentPage + 1;
        var totalPages = this.getTotalPages();
        var disablePrev = (currPage === 1 && totalPages > 1) || totalPages === 1;
        var disableNext = (totalPages === 1 || currPage >= totalPages);
        this.$prevBtn.toggleClass(disabledClass, disablePrev);
        this.$nextBtn.toggleClass(disabledClass, disableNext);
      }
    },

    /**
     * Determine if this carousel should have controls if the enabled option
     * is set to 'auto'. FIXME: this hasn't been implemented to work
     * with responsive carousels yet.
     * @private
     * @returns {Boolean} whether or not controls should exist or not.
     */
    _hasControls: function() {
      var opt = this.options.controls.enabled;

      return opt === true ?
        true : opt === 'auto' ?
        this.$lis.length > this.options.perPage : false;
    },

    /**
     * Returns the next/prev page of results.
     * @private
     * @param {String} dir - direction (prev or next)
     * @returns {String} how many slides to move and in which direction./
     */
    _getTargetValueFor: function(dir) {
      return (dir === 'next' ? '+' : '-') + '=' + this.options.moveBy;
    }
  });
})();
;/**
 * Lazy load images
 */
(function() {
  'use strict';

  window.app.components.Carousel.extend({
    defaults: {
      /**
       * Enable image lazy loading? If this is set to true, then image
       * tags inside of the carousel should have a `data-src` attribute
       * instead of `src`.
       */
      lazyLoadImages: false,

      /**
       * Class name that's applied to images in order to fade them in.
       */
      lazyLoadClass: 'bcc-carousel-fade-in'
    },

    init: function() {
      this._super();

      if(this.options.lazyLoadImages) {
        this.$el.addClass('has-lazyloading');
      }
    },

    _bindEvents: function() {
      this._super();

      if(this.options.lazyLoadImages) {
        var lazyload = this._lazyload.bind(this);
        this.on('scroll', lazyload);
        this.on('scrollend', lazyload);
        this.on('createend', lazyload);
        this.on('breakpoint:change', lazyload);
        this.$carousel.on('scroll', lazyload);
      }
    },

    /**
     * Return currently visible items.
     * @private
     * @return {jQuery} - Object of visible slides
     */
    _getVisibleItems: function() {
      // Take a different code path if using native overflow scrolling
      if(this._currentBreakpoint && this._currentBreakpoint.scroll === 'overflow') {
        return this.$lis.filter(function(i, elem) {
          var rect = elem.getBoundingClientRect();
          return rect.right <= (window.innerWidth || document.documentElement.clientWidth) + window.innerWidth;
        });
      }

      return this.$carousel.jcarousel('visible');
    },

    /**
     * Perform the actual lazy loading logic.
     * @private
     */
    _lazyload: function() {
      var $visible = this._getVisibleItems();
      var className = this.options.lazyLoadClass;

      if(!$visible || !$visible.length) {
        return;
      }

      $visible.find('img[data-src]').each(function(i, elem) {
        var $img = $(elem);
        var newSrc = $img.data('src');

        if(elem.complete) {
          $img.addClass(className);
        } else {
          $img.one('load', function() {
            $img.addClass(className);
          });

          // If this image fails to load then stop trying
          $img.one('error', function() {
            $img.removeAttr('data-src');
          });
        }

        if(elem.src !== newSrc) {
          elem.src = newSrc;
        }
      });
    }
  });

})();
;/**
  * Auto Scroll
  */
(function() {
  'use strict';

  window.app.components.Carousel.extend({
    defaults: {
      autoscroll: {
        target: '+=1',
        interval: 3000,
        autostart: false
      }
    },

    init: function() {
      this._super();

      var opts = this.options.autoscroll;

      // Create the pagination
      if(opts.autostart) {
        this.$carousel.jcarouselAutoscroll(opts);
      }
    },

    destroy: function() {
      if(this.options.autoscroll.autostart) {
        this.$carousel.jcarouselAutoscroll('destroy');
      }

      this._super();
    }
  });

})();
;/**
 * Touch scrolling
 * This is designed to be a very simple mobile fallback
 * TODO: update pagination/control arrows based on the current position
 * TODO: momentum scrolling
 */
(function() {
  'use strict';

  window.app.components.Carousel.extend({
    defaults: {
      /**
       * Enable touch scrolling. Supported values are:
       *   false - disable touch scrolling
       *   swipe - move through the carousel using a swipe event
       *   track - the carousel will follow your finger as you move it. The
       *           performance of this is pretty terrible on mobile devices.
       */
      touchScrolling: false,

      /**
       * Snap enable snapping as you touch scroll. Supported values are:
       *   false - disable snapping
       *   item - snap to the closest item
       *   page - snap to the closest page
       */
      touchScrollingSnap: 'item',

      /**
       * Snap delta. If the amount moved does not exceed this value then the
       * carousel will be snapped back to where it was (touchScrolling = track)
       * or the carousel won't move at all (touchScrolling = swipe).
       */
      touchScrollingDelta: 100
    },

    init: function() {
      this._super();
      this._enableTouchScrolling();
    },

    destroy: function() {
      this._disableTouchScrolling();
      this._disableOverflowScrolling();
      this._super();
    },

    _bindEvents: function() {
      this._super();

      this.on('breakpoint:change', function(event, breakpoint) {
        if(breakpoint.scroll === 'overflow') {
          this._enableOverflowScrolling();
        } else {
          this._enableTouchScrolling();
        }
      }.bind(this));
    },

    /**
     * Enable native scrolling via overflow: scroll
     * @private
     */
    _enableOverflowScrolling: function() {
      if(this._overflowScrollingEnabled) {
        return;
      }

      this._disableTouchScrolling();
      this.$el.addClass('has-overflow-scrolling');
      this._overflowScrollingEnabled = true;
    },

    /**
     * Disable native scrolling via overflow: scroll
     * @private
     */
    _disableOverflowScrolling: function() {
      if(this._overflowScrollingEnabled) {
        this.$carousel.scrollLeft(0);
        this.$el.removeClass('has-overflow-scrolling');
        this.$ul.removeAttr('style');
        this._overflowScrollingEnabled = false;
      }
    },

    /**
     * Enable scrolling via touchmove events
     * @private
     */
    _enableTouchScrolling: function() {
      this._disableOverflowScrolling();

      if(!('ontouchstart' in window) || this._touchScrollingEnabled || !this.options.touchScrolling) {
        return;
      }

      this.$carousel.on('touchstart touchend touchmove', this._handleTouchEvent.bind(this));
      this._touchScrollingEnabled = true;
    },

    /**
     * Disable scrolling via touchmove events
     * @private
     */
    _disableTouchScrolling: function() {
      this.$carousel.off('touchstart touchend touchmove');
      this._touchScrollingEnabled = false;
    },

    /**
     * Touch event handler
     * @private
     * @param {Object} event - event object
     */
    _handleTouchEvent: function(event) {
      event = event.originalEvent;

      if(event.type === 'touchstart') {
        this._onTouchStart(event);
      } else if(event.type === 'touchmove') {
        this._onTouchMove(event);
      } else {
        this._onTouchEnd(event);
      }
    },

    /**
     * Touch start handler
     * @private
     * @param {Object} event - event object
     */
    _onTouchStart: function(event) {
      var touch = event.targetTouches[0];
      this._firstVisibleElem = this.$carousel.jcarousel('fullyvisible')[0];
      this._startCoords = { x: touch.pageX, y: touch.pageY };
      this._touchMovePos = this._startCoords.x;
    },

    /**
     * Touch move handler
     * @private
     * @param {Object} event - event object
     */
    _onTouchMove: function(event) {
      var ul = this.$ul[0];
      var transformProp, currLeft;
      var opts = this.options;
      var usingTransitions = opts.transitions && opts.transitions.transforms;
      var touches = event.touches[0];
      var delta = {
        x: touches.pageX - this._startCoords.x,
        y: touches.pageY - this._startCoords.y
      };

      // Prevent native scrolling if we're obviously trying to pan
      // through the carousel instead of scrolling vertically
      if(Math.abs(delta.x) >= Math.abs(delta.y)) {
        event.preventDefault();
      }

      // Separate code paths for CSS3 transitions
      if(usingTransitions) {
        transformProp = ul.style.transform ?
          'transform' : ul.style.webkitTransform ?
          'webkitTransform' : ul.style.mozTransform ?
          'mozTransform' : null;

        currLeft = parseInt(ul.style[transformProp].split('(')[1].replace('px', ''), 10);
      } else {
        currLeft = parseInt(ul.style.left.replace('px', ''), 10);
      }

      var touchX = event.targetTouches[0].pageX;
      var fingerMovedDelta = this._touchMovePos - touchX;
      var liWidth = this.$lis.outerWidth();
      var totalWidth = (this.$lis.length * liWidth * -1) + (liWidth * this.options.perPage);
      var x = currLeft - fingerMovedDelta;
      this.direction = touchX > this._touchMovePos ? 'backwards' : 'forwards';
      this._touchMovePos = touchX;

      // keep in bounds
      if(x > 0) x = 0;
      if(x < 0 && x < totalWidth) x = totalWidth;
      x = x + 'px';

      // If the carousel should move with the user's finger..
      if(this.options.touchScrolling === 'track') {
        if(usingTransitions) {
          ul.style[transformProp] = 'translate(' + x + ', 0)';
        } else {
          ul.style.left = x;
        }
      }
    },

    /**
     * Touch end handler
     * @private
     * @param {Object} event - event object
     */
    _onTouchEnd: function(event) {
      var opts = this.options;
      var delta = Math.abs(this._startCoords.x - this._touchMovePos);
      var insideDelta = delta <= opts.touchScrollingDelta;

      // Snap back to where the user was prior to moving if they didn't move far enough
      if(opts.touchScrolling === 'track' && insideDelta) {
        this.scrollToElem(this._firstVisibleElem, true);
        return;
      }

      // If this is a swipe gesture, don't do anything if inside the delta
      if(opts.touchScrolling === 'swipe' && insideDelta) {
        return;
      }

      if(opts.touchScrollingSnap === 'item') {
        var liWidth = this.$lis.width();
        var containerWidth = this.$carousel.width();

        var visibleLis = this.$lis.filter(function(i, elem) {
          var left = elem.getBoundingClientRect().left;
          return (left + liWidth) > 0 && left < containerWidth;
        }.bind(this)).get();

        var target = this.direction === 'forwards' ? visibleLis[1] : visibleLis[0];

        this.scrollToElem(target, false);
      } else if(opts.touchScrollingSnap === 'page') {
        this[ this.direction === 'forwards' ? 'next' : 'prev' ]();
      }
    }
  });
})();
;/**
  * Responsive
  */
(function() {
  'use strict';

  // From http://remysharp.com/2010/07/21/throttling-function-calls/
  var throttle = function(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last, deferTimer;

    return function() {
      var context = scope || this;
      var now = (new Date().getTime()),
      args = arguments;
      if (last && now < last + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  };

  window.app.components.Carousel.extend({
    defaults: {
      /**
       * Enable responsive mode?
       */
      responsive: false,

      /**
       * The amount of time in ms to throttle the window.onresize event
       */
      responsiveThrottle: 100,

      /**
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
      breakpoints: []
    },

    init: function() {
      this._super();

      if(this.options.responsive) {
        this._calculateWidth();
      }
    },

    destroy: function() {
      if(this.options.responsive) {
        this.$lis.removeAttr('style');
      }

      this._super();
    },

    _bindEvents: function() {
      this._super();

      if(this.options.responsive) {
        var calc = throttle(this._calculateWidth, this.options.responsiveThrottle, this);
        $(window).on('resize' + this._namespace, calc);
      }
    },

    /**
     * Activate a breakpoint. Triggers a breakpoint:change event.
     * @private
     * @param {Object} breakpoint - breakpoint to activate
     */
    _applyBreakpoint: function(breakpoint) {
      this.options.moveBy = breakpoint.moveBy;
      this.options.perPage = breakpoint.perPage;
      this.$carousel.jcarousel('reload');
      this.trigger('breakpoint:change', breakpoint, this._currentBreakpoint);
      this._currentBreakpoint = breakpoint;
    },

    /**
     * Calculate a new width for each item in the carousel using the current
     * window's width.
     */
    _calculateWidth: function() {
      var opts = this.options;
      var point, breakpoint, i, len;

      var applyBreakpointWidth = function(breakpoint) {
        var width = this.$carousel.innerWidth() / breakpoint.perPage;
        this._applyWidth(width, breakpoint);
      }.bind(this);

      // If we're not using breakpoints, resize with the number of
      // items defined in the options.
      if(!opts.breakpoints.length) {
        return applyBreakpointWidth({
          perPage: opts.perPage
        });
      }

      // If we are using breakpoints, find the closest breakpoint that matches
      // and resize using the number of items defined in that breakpoint.
      var winWidth = window.innerWidth;
      for(i = 0, len = opts.breakpoints.length; i < len; i++) {
        point = opts.breakpoints[i];

        if(winWidth >= point.minWidth) {
          if(point.maxWidth && winWidth > point.maxWidth) {
            continue;
          }

          breakpoint = point;
        }
      }

      // If a breakpoint was found..
      if(breakpoint) {
        // Calculate and apply the new width.
        applyBreakpointWidth(breakpoint);

        // "Officially" apply the breakpoint if it changed.
        if(!this._currentBreakpoint || (this._currentBreakpoint.minWidth !== breakpoint.minWidth)) {
          this._applyBreakpoint(breakpoint);
        }
      }
    },

    /**
     * Set the carousel and item widths.
     * @private
     * @param {Number} width - new item width in px
     * @param {Object} breakpoint - current breakpoint or null
     */
    _applyWidth: function(width, breakpoint) {
      var lis = this.$lis;

      for(var i = 0, len = lis.length; i < len; i++) {
        lis[i].style.width = width + 'px';
      }

      if(breakpoint && breakpoint.scroll === 'overflow') {
        this.$ul[0].style.width = (lis.length * width) + 'px';
      }
    }
  });
})();
