const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

exports.validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = 'Please fill email';
  if (isEmpty(data.password)) errors.password = 'Please fill password';
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

exports.validateSignUpData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Please fill email';
  } else if (!isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (isEmpty(data.password)) errors.password = 'Please fill password';
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must be the same';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
