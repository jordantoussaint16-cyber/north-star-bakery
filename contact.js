const form = document.querySelector("form");
const successMessage = document.getElementById("form-success");

// Each rule returns an error message, or "" if the value is valid
const validators = {
  "name": value => {
    if (value.trim() === "") return "Please enter your full name.";
    if (value.trim().length < 2) return "Name must be at least 2 characters.";
    return "";
  },
  "email": value => {
    if (value.trim() === "") return "Please enter your email address.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value.trim())) return "Please enter a valid email, like jane@example.com.";
    return "";
  },
  "request-type": value => {
    return value === "" ? "Please choose a request type." : "";
  },
  "pickup-date": value => {
    if (value === "") return "Please choose a pickup date.";
    const picked = new Date(value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (picked < today) return "Pickup date can't be in the past.";
    if (picked.getDay() === 1) return "We're closed on Mondays. Please pick another day.";
    return "";
  },
  "item-details": value => {
    if (value.trim() === "") return "Please tell us what you'd like.";
    if (value.trim().length < 10) return "Please add a little more detail (at least 10 characters).";
    return "";
  }
};

// Show or clear the error message next to a field
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorSpan = document.getElementById(fieldId + "-error");
  errorSpan.textContent = message;
  field.classList.toggle("invalid", message !== "");
  field.setAttribute("aria-invalid", message !== "");
}

// Validate one field; returns true if valid
function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  const message = validators[fieldId](field.value);
  showError(fieldId, message);
  return message === "";
}

// Validate every field; focus the first invalid one
function validateForm() {
  let firstInvalid = null;
  Object.keys(validators).forEach(fieldId => {
    if (!validateField(fieldId) && !firstInvalid) {
      firstInvalid = fieldId;
    }
  });
  if (firstInvalid) document.getElementById(firstInvalid).focus();
  return firstInvalid === null;
}

// On submit: block if invalid, otherwise confirm and reset
form.addEventListener("submit", event => {
  event.preventDefault();
  successMessage.textContent = "";
  if (validateForm()) {
    successMessage.textContent = "Thank you! We received your request and will be in touch soon.";
    form.reset();
  }
});

// Let users fix errors in place: re-check a field as they type, but only if it already shows an error
Object.keys(validators).forEach(fieldId => {
  const field = document.getElementById(fieldId);
  const eventName = field.tagName === "SELECT" ? "change" : "input";
  field.addEventListener(eventName, () => {
    if (field.classList.contains("invalid")) validateField(fieldId);
  });
  field.addEventListener("blur", () => {
    if (field.value !== "") validateField(fieldId);
  });
});
