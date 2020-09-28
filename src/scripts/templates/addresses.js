/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

import {CountryProvinceSelector} from '@shopify/theme-addresses';

const countryProvinceSelector = new CountryProvinceSelector(window.theme.allCountryOptionTags);
const selectors = {
  addressContainer: '[data-address]',
  addressFields: '[data-address-fields]',
  addressToggle: '[data-address-toggle]',
  addressForm: '[data-address-form]',
  addressDeleteForm: '[data-address-delete-form]',
};
const hideClass = 'hidden';

function initializeAddressForm(container) {
  const addressFields = container.querySelector(selectors.addressFields);
  const addressForm = container.querySelector(selectors.addressForm);
  const deleteForm = container.querySelector(selectors.addressDeleteForm);

  container.querySelectorAll(selectors.addressToggle).forEach((button) => {
    button.addEventListener('click', () => {
      addressForm.classList.toggle(hideClass);
    });
  });
  console.log('before addresses');
  console.log("container.querySelector('#AddressCountry')", container.querySelector('[id^="AddressCountry"]'))
  console.log("container.querySelector('#AddressProvince')", container.querySelector('[id^="AddressProvince"]'))
  countryProvinceSelector.build(container.querySelector('[id^="AddressCountryNew"]'), container.querySelector('[id^="AddressProvinceNew"]'), {
    onCountryChange: (provinces) => container.querySelector('[data-address-province-wrapper]').classList.toggle('d-none', !provinces.length),
  });
  // AddressForm(addressForm, 'en');

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
