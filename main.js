const form = document.querySelector("form");
const email = document.querySelector("#email");
const country = document.querySelector("#country");
const postal = document.querySelector("#postal");
const password = document.querySelector("#password");
const confirm = document.querySelector("#confirm");
const submit = document.querySelector("#submit");

const emailError = document.querySelector("#email-error");
const countryError = document.querySelector("#country-error");
const postalError = document.querySelector("#postal-error");
const passwordError = document.querySelector("#password-error");
const confirmError = document.querySelector("#confirm-error");
const error = document.querySelector(".error-message");

// regular expression for email validation as per HTML specification
const emailRegExp = /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d-]+(?:\.[a-z\d-]+)*$/i;

// check if the email is valid
const isValidEmail = () => {
  const validity = email.value.length !== 0 && emailRegExp.test(email.value);
  return validity;
};

let emailTouched = false;

// update email input class based on validity and touched state
const setEmailClass = (isValid) => {
  if (!emailTouched) {
    email.className = "";
  } else {
    email.className = isValid ? "valid" : "invalid";
  }
};

// update error message and visibility
const updateError = (isValidInput) => {
  if (!emailTouched) {
    emailError.textContent = "";
    emailError.removeAttribute("class");
    return;
  }
  if (isValidInput) {
    emailError.textContent = "";
    emailError.removeAttribute("class");
  } else {
    emailError.textContent = "Please enter a valid email.";
    emailError.setAttribute("class", "active");
  }
};

// handle blur event to mark field as touched
const handleBlur = () => {
  emailTouched = true;
  const emailInput = isValidEmail();
  setEmailClass(emailInput);
  updateError(emailInput);
};

// initialize email validity on page load
const initializeValidation = () => {
  const emailInput = isValidEmail();
  setEmailClass(emailInput);
};

// handle input event to update email validity
const handleInput = () => {
  const emailInput = isValidEmail();
  setEmailClass(emailInput);
  updateError(emailInput);
};

// handle form submission to show error if email is invalid
const handleSubmit = (event) => {
  // prevent default submit to server action
  event.preventDefault();

  const emailInput = isValidEmail();
  setEmailClass(emailInput);
  updateError(emailInput);
};

// now we can rebuild our validation constraint
// because we do not rely on css pseudo-class, we have to
// explicitly set the valid/invalid class on our email field
window.addEventListener("load", initializeValidation);
// this defines what happens when the user types in the field
email.addEventListener("input", handleInput);
// add blur event
email.addEventListener("blur", handleBlur);
// this defines what happens when the user tries to submit the data
form.addEventListener("submit", handleSubmit);
