import $ from 'jquery';

function Container(options) {
  this.options = options;
  this.init();
}

Container.prototype.init = function init() {
  this.element = this.$container = $('<div/>').addClass('ui-virtual-select');
};

Container.prototype.render = function render(state) {
  // toggle loading indicator and class
  if (state.itemsLoading) {
    this.$container.addClass('loading');
  } else {
    this.$container.removeClass('loading');
  }

  // toggle open state and class
  if (state.open) {
    this.$container.addClass('open');
  } else {
    this.$container.removeClass('open');
  }
};

export default Container;
