window.app || (window.app = {});
window.app.components || (window.app.components = {});
window.app.components.Dropdown = (function($) {
  'use strict';

  function Dropdown(el) {
    this.$el = el;
    this.$menu = el.find('.dropdown-menu');
    this._initEvents();
  }

  Dropdown.prototype = {
    _initEvents: function() {
      this.$el.on('click', '.dropdown-button', function(event) {
        event.stopPropagation();
        this.toggle();
      }.bind(this));

      $(document).click(this.close.bind(this));
    },

    toggle: function() {
      this[this.isOpen ? 'close' : 'open']();
    },

    open: function() {
      this.$el.addClass('is-active');
      this.isOpen = true;
    },

    close: function() {
      this.$el.removeClass('is-active');
      this.isOpen = false;
    }
  };

  // Expose as an AMD module
  if(typeof define === 'function' && define.amd) {
    define('bccdropdown', [], function() {
      return Dropdown;
    });
  } else if (typeof module != 'undefined') {
    module.exports = Dropdown;
  }

  return Dropdown;
})(window.jQuery);
