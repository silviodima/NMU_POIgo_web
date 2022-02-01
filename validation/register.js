const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.surname = !isEmpty(data.surname) ? data.surname: ""
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Inserisci il nome";
  }

  // Surname checks
  if (Validator.isEmpty(data.surname)) {
    errors.surname = "Inserisci il cognome";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Inserisci l'email";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email non valida";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Inserisci la password";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Devi confermare la password";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "La password deve avere almeno 6 caratteri";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Le password non coincidono";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
