import Inputmask from 'inputmask'

function set(el, binding) {
    let maskSettings = {
        clearMaskOnLostFocus: false,
        onincomplete: () => {
            el.setCustomValidity('Invalid value');
            el.checkValidity();            
        },
        oncomplete: () => {
            el.setCustomValidity('');
            el.checkValidity();            
        }
    };

    Inputmask({ 'mask': binding.value, ...maskSettings }).mask(el);
}

const inputmaskPlugin = {
    install: (Vue, options) => {
        Vue.directive('mask', {
            bind: (el, binding) => {
                set(el, binding);
            },
            update: (el, binding, newVnode, oldVnode) => {
                set(el, binding);
            }
        });
    }
};

exports.default = inputmaskPlugin