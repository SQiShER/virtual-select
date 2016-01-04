import 'array.prototype.findindex';
import $ from 'jquery';

function indexOfItem(dataProvider, item) {
  if (!item) {
    return -1;
  }
  const itemIdentity = dataProvider.identity(item);
  return dataProvider.availableItems.findIndex(availableItem => {
    return dataProvider.identity(availableItem) === itemIdentity;
  });
}

function startSelection(state, {dataProvider}) {
  const selectedItemIndex = indexOfItem(dataProvider, state.selectedItem);
  return $.extend({}, state, {
    open: true,
    activeItemIndex: selectedItemIndex >= 0 ? selectedItemIndex : 0,
  });
}

function activatePreviousItem(state) {
  return $.extend({}, state, {
    activeItemIndex: Math.max(state.activeItemIndex - 1, 0),
  });
}

function activateNextItem(state, options) {
  return $.extend({}, state, {
    activeItemIndex: Math.min(state.activeItemIndex + 1, options.dataProvider.items.length - 1),
  });
}

function activateItemAtIndex(state, options, index) {
  return $.extend({}, state, {
    activeItemIndex: index,
  });
}

function cancelSelection(state, options) {
  const targetState = changeQuery(state, options, '');
  targetState.open = false;
  return targetState;
}

function selectItemAtIndex(state, options, index) {
  const selectedItem = options.dataProvider.items[index];
  return selectItem(state, options, selectedItem);
}

function selectItem(state, options, item) {
  // notify the outside world about the selection
  if (options.onSelect) {
    options.onSelect(item);
  }

  const targetState = cancelSelection(state, options);
  targetState.selectedItem = item;
  return targetState;
}

function selectActiveItem(state, options) {
  const index = state.activeItemIndex;
  return selectItemAtIndex(state, options, index);
}

function toggleExtendedMode(state) {
  return $.extend({}, state, {
    extendedModeEnabled: !state.extendedModeEnabled,
  });
}

function changeQuery(state, options, query) {
  if (query !== state.query) {
    options.dataProvider.filter(query);
    return $.extend({}, state, {
      query: query,
      activeItemIndex: 0,
    });
  }
  return state;
}

function startLoading(state) {
  return $.extend({}, state, {
    itemsLoading: true,
  });
}

function finishLoading(state) {
  return $.extend({}, state, {
    itemsLoading: false,
    itemsLoaded: true,
  });
}

const actions = {
  startSelection,
  cancelSelection,
  changeQuery,
  activateItemAtIndex,
  activatePreviousItem,
  activateNextItem,
  selectItemAtIndex,
  selectItem,
  selectActiveItem,
  toggleExtendedMode,
  startLoading,
  finishLoading,
};

export default actions;
