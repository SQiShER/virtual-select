import $ from 'jquery';
import fn from './core/functions';
import Container from './component/container';
import LoadingIndicator from './component/loading-indicator';
import SearchInput from './component/search-input';
import OptionList from './component/option-list';

function detectItemHeight() {
  const $sampleItem = $('<div/>')
    .addClass('ui-virtual-select--item')
    .text('Text')
    .hide()
    .appendTo(document.body);
  const height = $sampleItem.outerHeight();
  $sampleItem.remove();
  return height;
}

function VirtualSelect(element, userOptions) {
  const defaults = {
    itemHeight: detectItemHeight(),
    maxVisibleItems: 10,
    maxRenderedItems: 30,
  };

  const options = $.extend({}, defaults, userOptions);

  let state = {
    activeItemIndex: 0,
    selectedItem: null,
    query: '',
    itemsLoading: false,
    itemsLoaded: false,
    open: false,
  };

  const containerComponent = new Container(options);

  const searchInputComponent = new SearchInput(options)
    .on('focus', () => {
      console.log('focus');
      loadItems().then(() => {
        const targetState = fn.startSelection(state, options);
        changeState(targetState);
      });
    })
    .on('activate_previous_item', () => {
      console.log('activate_previous_item');
      const targetState = fn.activatePreviousItem(state, options);
      changeState(targetState);
    })
    .on('activate_next_item', () => {
      console.log('activate_next_item');
      const targetState = fn.activateNextItem(state, options);
      changeState(targetState);
    })
    .on('select_active_item', () => {
      console.log('select_active_item');
      const targetState = fn.selectActiveItem(state, options);
      changeState(targetState);
    })
    .on('cancel_selection', () => {
      console.log('cancel_selection');
      const targetState = fn.cancelSelection(state, options);
      changeState(targetState);
    })
    .on('toggle_extended_mode', () => {
      console.log('toggle_extended_mode');
      const targetState = fn.toggleExtendedMode(state, options);
      changeState(targetState);
    })
    .on('change', query => {
      console.log('change');
      const targetState = fn.changeQuery(state, options, query);
      changeState(targetState);
    });

  const loadingIndicatorComponent = new LoadingIndicator(options);

  const optionListComponent = new OptionList(options)
    .on('select', index => {
      console.log('select');
      const targetState = fn.selectItemAtIndex(state, options, index);
      changeState(targetState);
    })
    .on('activate', index => {
      console.log('activate');
      const targetState = fn.activateItemAtIndex(state, options, index);
      changeState(targetState);
    });

  const $searchInput = searchInputComponent.element;
  const $loadingIndicator = loadingIndicatorComponent.element;
  const $optionList = optionListComponent.element;
  const $container = containerComponent.element;
  $container.append($searchInput, $loadingIndicator, $optionList);
  element.empty().append($container);

  function loadItems() {
    if (state.itemsLoaded) {
      return Promise.resolve();
    }
    changeState(fn.startLoading(state));
    return options.dataProvider.load().then(() => {
      changeState(fn.finishLoading(state));
    });
  }

  function changeState(targetState) {
    // FIXME: rendering the search input causes a blur event, which in return
    // triggers another rendering cycle. in order for that to work, the state
    // needs to be updated beforehand. i don't really like that, but am
    // currently out of ideas on how to fix it.
    state = targetState;

    // FIXME: this lends itself to be extracted into a separate "render" function
    containerComponent.render(targetState);
    loadingIndicatorComponent.render(targetState);
    optionListComponent.render(targetState);
    searchInputComponent.render(targetState);
  }

  this.select = function select(item) {
    console.debug('selection changed from outside:', item);
    changeState(fn.selectItem(state, options, item));
  };

  this.focus = function focus() {
    console.debug('focussed from outside');
    searchInputComponent.focus();
  };

  this.load = function load() {
    console.debug('loading triggered from outside');
    loadItems();
  };

  changeState(state);
}

export default VirtualSelect;
