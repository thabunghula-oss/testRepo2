const form = document.getElementById('contact-form');
const dialog = document.getElementById('thank-you-dialog');
const nameInput = document.getElementById('contact-name');

/** Valid submit only (the `required` attributes block empty fields). Nothing is sent anywhere: clear the form and show the thank-you modal. */
form.addEventListener('submit', (event) => {
  event.preventDefault();
  form.reset();
  dialog.showModal();
});

/** Fires when the modal closes via the Close button or Esc; return focus to the first field. */
dialog.addEventListener('close', () => {
  nameInput.focus();
});
