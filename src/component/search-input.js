import $ from 'jquery';
import noop from '../common/noop';
import { CursorUp, CursorDown, Escape, Enter, Control } from '../common/keys';

export const CHANNEL_FOCUS = 'focus';
export const CHANNEL_FILTER = 'change';
export const CHANNEL_NEXT = 'activate_next_item';
export const CHANNEL_PREVIOUS = 'activate_previous_item';
export const CHANNEL_SELECT_ACTIVE = 'select_active_item';
export const CHANNEL_CANCEL = 'cancel_selection';
export const CHANNEL_TOGGLE_EXTENDED_MODE = 'toggle_extended_mode';

function SearchInput(options) {
  this.options = options;
  this.channels = {
    [CHANNEL_FOCUS]: noop,
    [CHANNEL_FILTER]: noop,
    [CHANNEL_NEXT]: noop,
    [CHANNEL_PREVIOUS]: noop,
    [CHANNEL_SELECT_ACTIVE]: noop,
    [CHANNEL_CANCEL]: noop,
    [CHANNEL_TOGGLE_EXTENDED_MODE]: noop,
  };
  this.renderedState = {};
  this.init();
}

SearchInput.prototype.on = function on(channel, callback) {
  this.channels[channel] = callback ? callback : noop;
  return this;
};

SearchInput.prototype.init = function init() {
  const keydownHandlers = {
    [CursorUp]: CHANNEL_PREVIOUS,
    [CursorDown]: CHANNEL_NEXT,
    [Enter]: CHANNEL_SELECT_ACTIVE,
    [Escape]: CHANNEL_CANCEL,
    [Control]: CHANNEL_TOGGLE_EXTENDED_MODE,
  };

  this.element = this.$searchInputElement = $('<input type="text"/>')
    .addClass('ui-virtual-select--search-input')
    .on('focus', () => {
      this.channels[CHANNEL_FOCUS]();
    })
    .on('keydown', event => {
      const key = event.which;
      const channel = keydownHandlers[key];
      if (channel) {
        this.channels[channel]();
      }
    })
    .on('blur', () => {
      this.channels[CHANNEL_CANCEL]();
    })
    .on('keyup', event => {
      const query = $(event.target).val();
      if (query !== this.renderedState.query) {
        this.channels[CHANNEL_FILTER](query);
      }
    });
};

SearchInput.prototype.render = function render(state) {
  // update placeholder
  const dataProvider = this.options.dataProvider;
  const displayText = state.selectedItem ?
    dataProvider.displayText(state.selectedItem) :
    dataProvider.noSelectionText();
  if (displayText !== this.$searchInputElement.attr('placeholder')) {
    console.debug(`updating placeholder: '${displayText}'`);
    this.$searchInputElement.attr('placeholder', displayText);
  }

  // update value
  if (state.query !== this.$searchInputElement.val()) {
    console.debug(`updating query: '${state.query}'`);
    this.$searchInputElement.val(state.query);
  }

  if (this.$searchInputElement.is(':focus') && !state.open && this.renderedState.open) {
    console.debug(`blurring search input`);
    this.$searchInputElement.trigger('blur');
  }

  // FIXME: Not sure why I need the copy here
  this.renderedState = $.extend({}, state);
};

SearchInput.prototype.focus = function focus() {
  this.$searchInputElement.focus();
};

export default SearchInput;
