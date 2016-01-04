import $ from 'jquery';
import VirtualSelect from './virtual-select';

const pluginName = 'virtualselect';

$.fn[pluginName] = function Plugin(optionsOrMethodName, ...args) {
  const pluginId = `plugin_${pluginName}`;

  return this.each((index, element) => {
    const plugin = $.data(element, pluginId);
    if (typeof optionsOrMethodName === 'object') {
      if (plugin) return;

      const options = optionsOrMethodName;
      $.data(element, pluginId, new VirtualSelect($(element), options));
    } else if (typeof optionsOrMethodName === 'string') {
      if (!plugin) return;

      const methodName = optionsOrMethodName;
      if (plugin[methodName]) {
        plugin[methodName](...args);
      }
    }
  });
};
