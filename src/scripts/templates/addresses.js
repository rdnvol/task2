/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

import { AddressForm } from '@shopify/theme-addresses';

const selectors = {
  addressContainer: '[data-address]',
  addressFields: '[data-address-fields]',
  addressToggle: '[data-address-toggle]',
  addressForm: '[data-address-form]',
  addressDeleteForm: '[data-address-delete-form]',
};
const hideClass = 'hidden';

function triggerDefaultValues(domElem) {
  let elements = document.querySelectorAll(domElem);
  [...elements].forEach((element, i) => {
    let value = element.getAttribute('data-default');
    [...element.options].forEach((option) => {
      if (option.text === value) {
        element.value = option.value;
        element.dispatchEvent(new Event('change'));
      }
    });
  });
}

function initializeAddressForm(container) {
  const addressFields = container.querySelector(selectors.addressFields);
  const addressForm = container.querySelector(selectors.addressForm);
  const deleteForm = container.querySelector(selectors.addressDeleteForm);
  
  container.querySelectorAll(selectors.addressToggle).forEach((button) => {
    button.addEventListener('click', () => {
      addressForm.classList.toggle(hideClass);
    });
  });
  AddressForm(addressFields, 'en')
    .then(function () {
      triggerDefaultValues('.address-country-option[data-default]')
      triggerDefaultValues('.address-province-option[data-default]')
    });
  
  if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
      const confirmMessage = deleteForm.getAttribute('data-confirm-message');
      
      if (!window.confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
        event.preventDefault();
      }
    });
  }
}

const addressForms = document.querySelectorAll(selectors.addressContainer);

if (addressForms.length) {
  addressForms.forEach((addressContainer) => {
    initializeAddressForm(addressContainer);
  });
}
