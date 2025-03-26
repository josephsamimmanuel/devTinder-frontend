export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateFirstName = (firstName) => {
  const firstNameRegex = /^[a-zA-Z]+$/;
  return firstNameRegex.test(firstName);
};

export const validateLastName = (lastName) => {
  const lastNameRegex = /^[a-zA-Z]+$/;
  return lastNameRegex.test(lastName);
};


