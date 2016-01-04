import $ from 'jquery';

function LoadingIndicator(options) {
  this.options = options;
  this.renderedState = {};
  this.init();
}

LoadingIndicator.prototype.init = function init() {
  this.element = this.$loadingIndicator = $('<div/>')
    .addClass('ui-virtual-select--loading-indicator')
    .text('Loading...')
    .hide();
};

LoadingIndicator.prototype.render = function render(state) {
  // toggle loading indicator and class
  if (state.itemsLoading) {
    this.$loadingIndicator.show();
  } else {
    this.$loadingIndicator.hide();
  }

  this.renderedState = state;
};

export default LoadingIndicator;
