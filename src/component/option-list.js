import $ from 'jquery';
import { throttle } from 'lodash/function';
import noop from '../common/noop.js';

function OptionList(options) {
  this.options = options;
  this.channels = {
    select: noop,
    activate: noop,
  };
  this.lastMouseX = NaN;
  this.lastMouseY = NaN;
  this.init();
}

OptionList.prototype.onlyIfMousePositionChanged = function onlyIfMousePositionChanged(callback) {
  return event => {
    // workaround to prevent scripted scrolling from triggering mousemove events
    const {lastMouseX: previousX, lastMouseY: previousY} = this;
    const {pageX: currentX, pageY: currentY} = event;
    return (currentX !== previousX || currentY !== previousY) ? callback(event) : noop();
  };
};

OptionList.prototype.on = function on(channel, callback) {
  this.channels[channel] = callback ? callback : noop;
  return this;
};

OptionList.prototype.init = function init() {
  const $items = $('<div/>')
    .addClass('ui-virtual-select--items')
    .css('overflow-y', 'scroll')
    .on('scroll', throttle(() => {
      this.render(this.renderedState);
    }, 10))
    .on('mousemove', event => {
      this.lastMouseX = event.pageX;
      this.lastMouseY = event.pageY;
    })
    .on('mousedown', event => {
      /* prevent blur event when clicking options */
      if ($.contains($items.get(0), event.target)) {
        event.preventDefault();
      }
    })
    .hide();

  const $canvas = $('<div/>')
    .addClass('ui-virtual-select--canvas')
    .appendTo($items)
    .on('mousemove', '.ui-virtual-select--item', this.onlyIfMousePositionChanged(event => {
      const index = $(event.currentTarget).data('index');
      if (index !== this.renderedState.activeItemIndex) {
        this.channels.activate(index);
      }
    }))
    .on('mousedown', '.ui-virtual-select--item', event => {
      const index = $(event.currentTarget).data('index');
      this.channels.select(index);
    });

  this.element = this.$items = $items;
  this.$canvas = $canvas;
};

function calculateItemsElementHeight(options) {
  const {maxVisibleItems, dataProvider, itemHeight} = options;
  return Math.min(maxVisibleItems, dataProvider.items.length) * itemHeight;
}

// FIXME: one of these two functions doesn't do what it says. but which one?
function calculateFirstRenderedItemIndex(options, scrollPosition) {
  const {itemHeight, maxVisibleItems} = options;
  return Math.max(Math.floor(scrollPosition / itemHeight) - maxVisibleItems, 0);
}
function calculateFirstVisibleItemIndex(options, scrollPosition) {
  const {itemHeight, maxVisibleItems} = options;
  return Math.max(Math.floor(scrollPosition / itemHeight) - maxVisibleItems, 0);
}

function calculateCanvasElementHeight(options, scrollPosition) {
  const firstVisibleItemIndex = calculateFirstVisibleItemIndex(options, scrollPosition);
  const {dataProvider, itemHeight} = options;
  return dataProvider.items.length * itemHeight - firstVisibleItemIndex * itemHeight;
}

function calculateCanvasElementMarginTop(options, scrollPosition) {
  const firstVisibleItemIndex = calculateFirstVisibleItemIndex(options, scrollPosition);
  return firstVisibleItemIndex * options.itemHeight;
}

function calculateCanvasSize(options) {
  const {dataProvider, maxVisibleItems, itemHeight} = options;
  return Math.min(dataProvider.items.length, maxVisibleItems) * itemHeight;
}

function getItemsToRender(options, scrollPosition) {
  const firstRenderedItemIndex = calculateFirstRenderedItemIndex(options, scrollPosition);
  return options.dataProvider.get(firstRenderedItemIndex, firstRenderedItemIndex + options.maxRenderedItems);
}

OptionList.prototype.render = function init(state) {
  const self = this;

  // toggle open state and class
  if (state.open) {
    this.$items.show();
  } else {
    this.$items.hide();
  }

  if (state.open) {
    // adjust first item
    const scrollPosition = this.$items.scrollTop();
    const firstRenderedItemIndex = calculateFirstRenderedItemIndex(this.options, scrollPosition);

    // update items height
    const itemsElementHeight = calculateItemsElementHeight(this.options);
    this.$items.css({
      height: `${itemsElementHeight}px`,
    });

    // update canvas size
    const canvasElementMarginTop = calculateCanvasElementMarginTop(this.options, scrollPosition);
    const canvasElementHeight = calculateCanvasElementHeight(this.options, scrollPosition);
    this.$canvas.css({
      'height': `${canvasElementHeight}px`,
      'margin-top': `${canvasElementMarginTop}px`,
    });

    // adjust scroll position
    if (state.activeItemIndex !== this.renderedState.activeItemIndex || !this.renderedState.open) {
      const canvasSize = calculateCanvasSize(this.options);
      const targetScrollPosition = state.activeItemIndex * this.options.itemHeight;
      const a1 = Math.ceil(scrollPosition / this.options.itemHeight) * this.options.itemHeight;
      const a2 = Math.floor(scrollPosition / this.options.itemHeight) * this.options.itemHeight + canvasSize;
      if (targetScrollPosition <= a1 || !this.renderedState.open) {
        this.$items.scrollTop(targetScrollPosition);
      } else if (targetScrollPosition >= a2) {
        this.$items.scrollTop(targetScrollPosition - canvasSize + this.options.itemHeight);
      }
    }

    // get items to render
    const items = getItemsToRender(this.options, scrollPosition);

    // create dom elements if necessary
    items.forEach((item, index) => {
      let $itemElement = this.$canvas.children('.ui-virtual-select--item').eq(index);
      if ($itemElement.length === 0) {
        $itemElement = $('<div/>').addClass('ui-virtual-select--item').appendTo(this.$canvas);
      }
      // TODO Optimize?
      $itemElement
        .data('item', item)
        .data('offset', firstRenderedItemIndex)
        .data('index', firstRenderedItemIndex + index);
    });

    // remove excess dom elements
    this.$canvas.children('.ui-virtual-select--item').slice(items.length).remove();

    // update text
    this.$canvas.children('.ui-virtual-select--item').each((index, element) => {
      const $itemElement = $(element);
      const item = $itemElement.data('item');
      const displayText = self.options.dataProvider.displayText(item, state.extendedModeEnabled);
      if ($itemElement.text() !== displayText) {
        $itemElement.text(displayText).attr('title', displayText);
      }
    });
  }

  // change active class
  this.$canvas.children('.ui-virtual-select--item').each((index, element) => {
    const $itemElement = $(element);
    const itemIndex = $itemElement.data('index');
    const hasActiveClass = $itemElement.hasClass('active');
    if (itemIndex === state.activeItemIndex && !hasActiveClass) {
      $itemElement.addClass('active');
    }
    if (itemIndex !== state.activeItemIndex && hasActiveClass) {
      $itemElement.removeClass('active');
    }
  });

  // update state with rendered one
  this.renderedState = state;
// this.renderedState = $.extend({}, state);
};

export default OptionList;
