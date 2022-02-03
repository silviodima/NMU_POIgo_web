const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validatePOIInsertion(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.poi_name = !isEmpty(data.poi_name) ? data.poi_name : "";
  data.description = !isEmpty(data.description) ? data.description: ""
  data.opening_hours = !isEmpty(data.opening_hours) ? data.opening_hours : "";
  data.photo = !isEmpty(data.photo) ? data.photo : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.partita_iva = !isEmpty(data.partita_iva) ? data.partita_iva : "";
  data.tel_number = !isEmpty(data.tel_number) ? data.tel_number : "";
  data.address =!isEmpty(data.address) ? data.address : "";
  data.latitude = !isEmpty(data.latitude) ? data.latitude : "";
  data.longitude = !isEmpty(data.longitude) ? data.longitude : "";

  // Photo checks
  if (Validator.isEmpty(data.photo)) {
    errors.photo ="Carica una foto";
    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
  
  // Name checks
  if (Validator.isEmpty(data.poi_name)) {
    errors.poi_name = "Inserisci il nome del punto di interesse";
  }


  // Description checks
  if (Validator.isEmpty(data.description)) {
    errors.description = "Inserisci la descrizione";
  }

  // Opening hours checks
  if (Validator.isEmpty(data.opening_hours)) {
    errors.opening_hours = "Inserisci l'orario di apertura";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Inserisci l'email";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email non valida";
  }

  // Partita iva checks
  if(data.partita_iva>0 && data.partita_iva.length<11) {
    errors.partita_iva = "Partita iva non valida";
  }

  // Tel_number checks
  if (Validator.isEmpty(data.tel_number)) {
    errors.tel_number = "Inserisci il numero di telefono";
  } else if(data.tel_number.length<10) {
    errors.tel_number = "Numero di telefono non valido";
  }

  // Category checks
  if (data.categories == undefined) {
    errors.categories = "Scegli almeno una categoria";
  }

  // Subcategory checks
  if (data.clickedSubCategories == undefined) {
    errors.clickedSubCategories = "Scegli almeno una sottocategoria";
  }

  // Section checks
  if (data.clickedSections == undefined || data.clickedSections.length==0) {
    errors.clickedSections = "Scegli almeno una sezione";
  }

  // Address checks
  if (Validator.isEmpty(data.address)) {
    errors.address = "Inserisci l'indirizzo";
  }

  // Latitude checks
  if (Validator.isEmpty(data.latitude)) {
    errors.latitude = "Inserisci la latitudine";
  }

  // Longitude checks
  if (Validator.isEmpty(data.longitude)) {
    errors.longitude = "Inserisci la longitudine";
  }


  // // Email checks
  // if (Validator.isEmpty(data.email)) {
  //   errors.email = "Inserisci l'email";
  // } else if (!Validator.isEmail(data.email)) {
  //   errors.email = "Email non valida";
  // }

  // // Password checks
  // if (Validator.isEmpty(data.password)) {
  //   errors.password = "Inserisci la password";
  // }

  // if (Validator.isEmpty(data.password2)) {
  //   errors.password2 = "Devi confermare la password";
  // }

  // if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
  //   errors.password = "La password deve avere almeno 6 caratteri";
  // }

  // if (!Validator.equals(data.password, data.password2)) {
  //   errors.password2 = "Le password non coincidono";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
