const form = document.querySelector("form");
const email = document.querySelector("#email");
const country = document.querySelector("#country");
const postal = document.querySelector("#postal");
const password = document.querySelector("#password");
const confirm = document.querySelector("#confirm");

const emailError = document.querySelector("#email-error");
const countryError = document.querySelector("#country-error");
const postalError = document.querySelector("#postal-error");
const passwordError = document.querySelector("#password-error");
const confirmError = document.querySelector("#confirm-error");

const fields = { email, country, postal, password, confirm };

const errors = {
  email: emailError,
  country: countryError,
  postal: postalError,
  password: passwordError,
  confirm: confirmError,
};

// store touched state for each field
const touched = {
  email: false,
  country: false,
  postal: false,
  password: false,
  confirm: false,
};

// top 25 countries by population
const topCountries = [
  "China",
  "India",
  "United States",
  "Indonesia",
  "Pakistan",
  "Brazil",
  "Nigeria",
  "Bangladesh",
  "Russia",
  "Mexico",
  "Japan",
  "Ethiopia",
  "Philippines",
  "Egypt",
  "Vietnam",
  "DR Congo",
  "Turkey",
  "Iran",
  "Germany",
  "Thailand",
  "United Kingdom",
  "France",
  "Italy",
  "South Africa",
  "Tanzania",
];

// postal code regex by country
const postalRegex = {
  "United States": /^\d{5}(-\d{4})?$/,
  Canada: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  "United Kingdom": /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
  Germany: /^\d{5}$/,
  France: /^\d{5}$/,
  // add more as needed
};

// validation functions for each field
const validators = {
  // regular expression for email validation as per HTML specification
  email: (value) =>
    /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d-]+(?:\.[a-z\d-]+)*$/i.test(value),
  country: (value) => topCountries.includes(value.trim()),
  postal: (value) => {
    const selectedCountry = country.value.trim();
    if (!topCountries.includes(selectedCountry)) return false;
    const regex = postalRegex[selectedCountry];
    return regex ? regex.test(value.trim()) : false;
  },
  password: (value) => {
    const errors = [];
    if (value.length < 10) errors.push("at least 10 characters");
    if (!/[A-Z]/.test(value)) errors.push("one capital letter");
    if (!/\d/.test(value)) errors.push("one number");
    return errors;
  },
  confirm: (value) => value === password.value && value.length > 0,
};

const errorMessages = {
  email: "Please enter a valid email.",
  country: "Please enter a top 25 country by population.",
  postal: "Please enter a valid postal code for the selected country.",
  password: (value) => {
    const missing = validators.password(value);
    if (missing.length === 0) return "";
    return "Password must contain " + missing.join(", ") + ".";
  },
  confirm: "Passwords do not match.",
};

function validateField(field, inputElem, errorElem) {
  let isValid;
  // SPECIAL CASE: postal code depends on country validity
  if (field === "postal" && !validators.country(country.value)) {
    inputElem.className = "invalid";
    errorElem.textContent = "Please select a valid country first.";
    errorElem.setAttribute("class", "active");
    return;
  }
  // SPECIAL CASE: password returns an array of missing requirements
  if (field === "password") {
    isValid = validators.password(inputElem.value).length === 0;
  } else {
    // all other fields use their validator directly
    isValid = validators[field](inputElem.value);
  }
  // only show validation if field has been touched
  if (!touched[field]) {
    inputElem.className = "";
    errorElem.textContent = "";
    errorElem.removeAttribute("class");
    return;
  }
  // set valid/invalid class and error message
  inputElem.className = isValid ? "valid" : "invalid";
  if (isValid) {
    errorElem.textContent = "";
    errorElem.removeAttribute("class");
  } else {
    // use errorMessages object, supports functions for dynamic messages
    errorElem.textContent =
      typeof errorMessages[field] === "function"
        ? errorMessages[field](inputElem.value)
        : errorMessages[field];
    errorElem.setAttribute("class", "active");
  }
}

// prevent typing in postal until country is valid
postal.addEventListener("focus", () => {
  // mark as touched so errors show after blur
  touched.postal = true;
  validateField("postal", postal, postalError);
});

// prevent typing in confirm password until previous field is valid
confirm.addEventListener("focus", () => {
  touched.confirm = true;
  if (validators.password(password.value).length !== 0) {
    confirmError.textContent = "Please complete password first.";
    confirmError.setAttribute("class", "active");
    confirm.blur();
  } else {
    validateField("confirm", confirm, confirmError);
  }
});

// hide password/confirm input as asterisks
password.type = "password";
confirm.type = "password";

// attach event listeners for each field
function setupField(field, inputElem, errorElem) {
  inputElem.addEventListener("input", () =>
    validateField(field, inputElem, errorElem)
  );
  inputElem.addEventListener("blur", () => {
    touched[field] = true;
    validateField(field, inputElem, errorElem);
  });
}

// run setupField on all input fields
Object.keys(fields).forEach((field) =>
  setupField(field, fields[field], errors[field])
);

// submit handler
form.addEventListener("submit", (event) => {
  event.preventDefault();
  Object.keys(fields).forEach((field) => {
    touched[field] = true;
    validateField(field, fields[field], errors[field]);
  });

  // check if all fields are valid
  const allValid =
    validators.email(email.value) &&
    validators.country(country.value) &&
    validators.postal(postal.value) &&
    validators.password(password.value).length === 0 &&
    validators.confirm(confirm.value);

  if (allValid) {
    alert("Congratulations! Your form was submitted successfully.");
    // reset the form after submission
    form.reset();
    // reset touched state on form reset
    Object.keys(touched).forEach((field) => (touched[field] = false));
  }
});
