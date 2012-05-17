# jquery-vanilladialog.js

A JQuery plugin which gives you completely vanilla container (div) in which to insert your dialog content. You decide what goes into the container (any html) and it handles resizing.

There is no support for "content types", it's job is to display what you give it in a centred, appropriately-sized container with a background overlay.

It will work with very little and simple code, but exposes an API which is intended to work with your javascript to give you adequate control over your modal dialog while keeping what you most likely want to achieve easy-to-do. This is geared towards people who know a bit about JavaScript.

It is highly customisable and quite light-weight (33kb uncompressed).

It is highly customisable and light-weight (33kb uncompressed).

## Usage
```javascript
   var dialog = $.VanillaDialog(options);
   dialog.show();
```
## Options

**content**: (*Required*)
  The content of the dialog. This can be a DOM element, an HTML string,
  JQuery object or another VanillaDialog object.

**overlayOpacity**: (Float)
  The opacity of the background overlay
  default: 0.7

**overlayCss**: (Object)
  A javascript object literal with css properties to apply to the overlay.
  default: null

**animateTime**: (Integer)
  Global duration of animations.
  default: 200

**closeSelector**: (String:selector)
  Convenience property to attach a click handler to the selected element(s)
  (within the dialog only) which will close the dialog.
  default: null

**onClose**: (Function)
  Called before the dialog is closed. Retuning false from the handler will prevent 
  the dialog from closing.
  default: null

**onShow**: (Function)
  Called after the dialog is shown.
  default: null

**onKeydown**: (Function)
  Callback for key down on dialog. By returning false from this handler, you can override
  the default behaviour of the escape key (closing the dialog).
  default: null

**onOverlayClicked**: (Function)
  Called when the overlay is clicked. By returning false in this handler you can 
  override the default behaviour of clicking the overlay (closing the dialog).
  default: null

**classes**: (Array)
  An array of classes to apply to the container element.
  default: []

**css**: (Object)
  Inline css styles to apply to the container element.
  default: {}

**offsets**: (Object)
  Override the top, left, width, and height of the container.
  default: { { top : 0, left: 0, height: 0, width: 0 } }

## API functions

For Example:
```javascript
  var dialog = $.VanillaDialog({
     content: '<a href="javascript:void(0)">Close</a>',
     closeSelector: 'a'
  });
```

The **dialog** variable exposes the following methods:

**resize([transition])**:
  Causes the container to reevaluate the content dimensions and resize/reposition accordingly.
  If *transition* is true the process will be animated, otherwise the dialog will immediately "snap"
  into position. 
  This method is chainable.

**on(type, [selector, [data, [handler]]])**: 
  Binds event handlers to the content within the dialog as well as 
  VanillaDialog events (such as 'show').
  This method is chainable.
  
**off([events, [selector, [handler]]])**:
 Unbinds event handler from dialog content as well as VanilaDialog events.
 This method is chainable.

**getContent([content])**:
  Gets the dialog content, or if *content* is specified - the JQuerified version of that object.
  *content* can be a DOM element, HTML string, JQuery object, or another VanillaDialog.
  On failure, returns null

**getContentRect([$content])**:
  Returns the dimensions (including padding, border and margin) of the current dialog content in the
  form of an object literal containing *top, left, width, height*.

**select(selector)**:
  Selects an element within the dialog and returns a jQuery object.

**setOptions(options)**:
  Sets the options for the dialog.
  This method is chainable.

**setContent(content)**:
  Sets the content of the dialog. If the dialog is shown, the container will 'transition' to
  the new content. onShow callback is automatically called when this function succeeds.
  This method is chainable.

**show()**:
  Shows the dialog and overlay (animated).
  This method is chainable.

**close()**:
  Closes the dialog (animated).
  This method is chainable.

## API Events

**show**: 
  Triggered when dialog is shown - bind as follows: dialog.on('show', handler);

**close**:
  Triggered when dialog is closed - bind as follows: dialog.on('close', handler);


## License

See the file [LICENSE](https://github.com/sdbondi/JQuery-VanillaDialog/blob/master/LICENSE.txt)
