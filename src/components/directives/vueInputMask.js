import Inputmask from 'inputmask'

var inputmaskPlugin = {
    install: function(Vue, options) {
        Vue.directive('mask', {
            bind: function(el, binding) {
                Inputmask(binding.value).mask(el);
            },    
            update: function (el, binding, newVnode, oldVnode) {    
                Inputmask(binding.value).mask(el);  
            }  
        });
    }
};

exports.default = inputmaskPlugin