const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;

export const validateSignupInputs = (
  username,
  password,
  confirmPassword,
  email
) => {
  const errors = {};
  if (!username || !usernameRegex.test(username)) {
    errors.username = "Enter a valid username";
  }
  if (!email || !emailRegex.test(email)) {
    errors.email = "Enter a valid email";
  }
  if (!password || password.length < 6 || password.trim() === "") {
    errors.password = "Password required";
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = "Confirm your password";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateLoginInputs = (username, password) => {
  const errors = {};
  if (!username || username.trim() === "") {
    errors.username = "Username required";
  }
  if (!password || password.trim() === "") {
    errors.username = "Password required";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
