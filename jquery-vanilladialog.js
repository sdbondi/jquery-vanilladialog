/*global window */
(function(window, $) {
  "use strict";

  var VanillaDialog = function() {    
    // Initialise the instance
    this.initialize.apply(this, arguments);
  };

  VanillaDialog.Version = '0.1.1';

  VanillaDialog._instanceCount = 0;

  VanillaDialog._initializeStatic = function() {
    var $window = VanillaDialog.$window = $(window),
    sampleInterval = 40,
    isResizing = false,
    resize = VanillaDialog.resizeHandler = function() {
      if (isResizing) {
        return;
      }

      isResizing = true;

      window.setTimeout(function() {
        VanillaDialog.windowWidth = $(this).width();
        VanillaDialog.windowHeight = $(this).height();
        isResizing = false;
      }, sampleInterval);
    };

    $window.on('resize', resize);
    resize.call(window);
  };

  VanillaDialog._staticTearDown = function() {
    VanillaDialog.$window.off('resize', VanillaDialog.resizeHandler);
    delete VanillaDialog.$window;
  };

  VanillaDialog.prototype = {
    initialize: function(options) {
      if (options) {
        this.setOptions(options);
      }

      this.$body = $(window.document.body);
      this.$this = $(this);

      this.closeHandler = function() { this.close(); }.bind(this);
    },

    // = Members
    // Dialog options
    options: {
      // Overlay opacity
      overlayOpacity: 0.7,
      // Overlay colour
      overlayCss: null,
      // Content of dialog
      content : null,
      // Time (ms) taken to perform dialog animations
      animateDelay : 200,
      // If specified, a click handler will be added 
      // which will close the dialog
      closeSelector: null, 
      // Callback before dialog is closed
      onClose: null,
      // Callback after dialog is shown
      onShow: null,
      // Callback for key down
      onKeydown: null,
      // Callback for overlay clicked
      onOverlayClicked: null,
      // Classes to add to dialog
      classes: [],
      // Custom content css object
      css: {},
      // Custom content positioning offsets
      offsets: {
        top : 0,
        left : 0,
        width : 0,
        height : 0
      }
    },

    $this: null,
    $overlay: null,
    $container: null,
    $content: null,
    $body: null,

    isResizing: false,
    isShown: false,

    closeHandler: null,

    // =Events
    events: {
      overlay_Click:function(e) {
        var options = this.options;
        
        if (options.onOverlayClicked && 
            options.onOverlayClicked.apply(this, [e]) === false) {
          return false;
        }

        this.close();
        return false;
      },

      document_KeyDown: function(e) {
        var options = this.options;
        
        if (options.onKeyDown && 
            options.onKeyDown.apply(this, [e]) === false) {
          return false;
        }

        if (e.keyCode === 27) {
          this.close();
        }
      },
      
      window_Resize: function() {
        if (this.isResizing || !this.$content) {
          return;
        }

        this.isResizing = true;

        var me = this;
        window.setTimeout(function() {
          me.resize();

          me.isResizing = false;
        }, 100);
      }
    },

    // =Methods
    resize: function(transition) {
      if (transition) {
        this.$container.stop().animate(this.getContentRect(), (!isNaN(transition-0)) ? transition : this.options.animateDelay);
      } else {
        this.$container.css(this.getContentRect());
      }
      this.$overlay.css({width: VanillaDialog.windowWidth, height: VanillaDialog.windowHeight});
      
      return this;
    },
    
    _trigger: function(type, extraData) {
      this.$this.triggerHandler.apply(this.$this, arguments);
    },
    
    on: function(type, selector, data, handler) {
      if (typeof selector === 'string') {
        if (!this.$content) {
          return this;
        }

        if (selector.length === 0) {
          Array.prototype.splice.apply(arguments, [1, 1]);
        }

        // Apply to content
        this.$content.on.apply(this.$content, arguments);
        return this;
      }
      
      // Apply to instance
      this.$this.on.apply(this.$this, arguments);
      return this;
    },

    off: function(events, selector, handler) {
      this.$content.off.apply(this.$content, arguments);
      this.$this.off.apply(this.$this, arguments);
      return this;
    },

    // This function must be given any supported content value
    // and always return a JQ Object or null
    getContent: function(content) {
      if (!content) {
        return this.$content;
      }

      if (content instanceof VanillaDialog) {
        return content.$content;
      }

      var $content = $(content);
      
      if ($content.length) {
        return $content;
      }

      return null;
    },

    getContentRect: function($content) { 
      if (!$content) {
        $content = this.$content;
      }

      if (!$content || !$content.length) {
        return null;
      }

      var 
      options = this.options,
      computed = window.getComputedStyle($content[0]),
      contentWidth = this.options.css.width,
      contentHeight = this.options.css.height,
      resetVis = false;

      if (this.$container && this.$container.css('display') === 'none') {
        this.$container.prop('visiblity', false).show();
        resetVis = true;
      }

      if (!contentWidth) {
        contentWidth = $content.width();
        if (contentWidth) {
          contentWidth += (computed.getPropertyValue('padding-left').slice(0, -2) >>> 0) + 
            (computed.getPropertyValue('padding-right').slice(0, -2) >>> 0) +
            (computed.getPropertyValue('border-left-width').slice(0, -2) >>> 0) +
            (computed.getPropertyValue('border-right-width').slice(0, -2) >>> 0);
        } else {
          contentWidth = 'auto';
        }
      }        

      if (!contentHeight) {
        contentHeight = $content.height();
        if (contentHeight) {
          contentHeight += (computed.getPropertyValue('padding-top').slice(0, -2) >>> 0) + 
            (computed.getPropertyValue('padding-bottom').slice(0, -2) >>> 0) +
            (computed.getPropertyValue('border-top-width').slice(0, -2) >>> 0) +
            (computed.getPropertyValue('border-bottom-width').slice(0, -2) >>> 0);
        } else {
          contentHeight = 'auto';
        }
      }  

      if (this.$container && resetVis) {
        this.$container.prop('visiblity', true).hide();
      }

      var top = (VanillaDialog.windowHeight / 2) - ((contentHeight >>> 0) / 2) + options.offsets.top,
      left = (VanillaDialog.windowWidth / 2) - ((contentWidth >>> 0) / 2) + options.offsets.left;

      return {
        top: top,
        left: left,
        width: contentWidth,
        height: contentHeight
      };
    },

    select: function(selector) {
      if (!this.$content) {
        return;
      }

      return $(selector, this.$content);
    },

    setOptions: function(options) {
      $.extend(true, this.options, options);
      return this;
    },

    setContent: function(content) {
      var $content = this.getContent(content);

      if (!$content) {
        throw new Error('No content');
      }

      this.$content = $content;

      if (!this.isShown) {
        return this;
      }

      if (!this.$container) {
        this.$container = this.createContainer();
      }

      var isInDOM = !!this.$container.parent().length,
      options = this.options,
      self = this;

      if (!isInDOM || !this.$container.is(':visible')) {
        this.$container.hide().append(this.$content);
        this.$body.append(this.$container);

        var rect = this.getContentRect();
        this.$container.css($.extend(rect, this.options.css))
          .fadeIn(options.animateDelay, function() {
            self.afterShow.call(self);
          });       
      } else {
        this.$container.children().fadeOut(options.animateDelay, function() {
          $(this).remove();

          self.$content.hide();
          self.$container.append(self.$content);

          var rect = self.getContentRect();
          self.$container.animate(rect, options.animateDelay, function() {
            self.$content.fadeIn(options.animateDelay);
            self.afterShow.call(self);
          });
        });
      }

      return this;
    },

    showOverlay: function(complete) {
      var isInDOM = !!this.$overlay.parent().length;

      if (isInDOM) {
        return;
      }

      this.$overlay.hide().on({
        click: this.events.overlay_Click.bind(this),
        selectstart: function() { return false; }
      });
      
      this.$body.append(this.$overlay);
      this.$overlay.fadeIn(this.options.animateDelay, complete);
    },

    show: function() {
      if (++VanillaDialog._instanceCount === 1) {
        // Initialise static 
        VanillaDialog._initializeStatic();
      }

      this.$overlay = this.createOverlay();

      var self = this;

      this.showOverlay(function() {
        self.isShown = true;
        self.setContent(self.options.content);
      });

      return this;
    },

    afterShow: function() {
      var options = this.options;

      if (options.onShow && 
          options.onShow.call(this) === false) {
          return;
      }

      this._trigger('show');

      var events = this.events;
      $(options.closeSelector, this.$content).on('click', this.closeHandler.bind(this));
      
      if (!events.document_KeyDown.handler) {
        events.document_KeyDown.handler = 
          events.document_KeyDown.bind(this);

        $(this.$body).on('keydown', events.document_KeyDown.handler);
      }

      if (!events.window_Resize.handler) {
        events.window_Resize.handler = 
          events.window_Resize.bind(this);

        $(VanillaDialog.$window).on('resize', events.window_Resize.handler);
      }
    },

    close: function() {
      if (!this.$content) {
        return;
      }

      var options = this.options;

      if (options.onClose && 
          options.onClose.call(this) === false) {
        return;
      }

      this._trigger('close');
      
      var fnRemove = function() { $(this).remove(); };

      this.$container.fadeOut(options.animateDelay, fnRemove);
      this.$overlay.fadeOut(options.animateDelay, fnRemove);

      this._tearDown();

      this.isShown = false;

      // Run static teardown if this is the last dialog instance
      if (VanillaDialog._instanceCount === 0) {
        VanillaDialog._staticTearDown();
      }

      return this;
    },

    _tearDown: function() {
      // Detach events
      this.$content.off();
      this.$overlay.off();
      
      this.$body.off('keydown', this.events.document_KeyDown.handler);
      this.events.document_KeyDown.handler = null;

      VanillaDialog.$window.off('resize', this.events.window_Resize.handler);
      this.events.window_Resize.handler = null;

      this.$container =
        this.$content = 
        this.$overlay = null;

      VanillaDialog._instanceCount--;
    },

    createOverlay: function() {
      var 
      options = this.options,
      css = {
        opacity: options.overlayOpacity, 
        backgroundColor: '#000',
        position: 'fixed',
        top: 0,
        left: 0,
        width: $(window).width(),
        height: $(window).height() + 10,
        zIndex: 999
      };

      if (options.overlayCss) {
        $.extend(css, options.overlayCss);
      }

      return $('<div class="vanilla-overlay"></div>')
        .css(css);
    },

    createContainer: function() {
      var 
      options = this.options,
      classes = options.classes || [],
      css = {
        position: 'fixed',
        zIndex: 1000,
        backgroundColor: '#FFF'
      };

      if (options.css) {
        $.extend(css, options.css);
      }

      return $('<div class="'+classes.join(' ')+' vanilla-content"></div>')
        .css(css);
    }
  };

  $.VanillaDialog = function(options) {
    return new VanillaDialog(options);
  };

}(window, window.jQuery));

