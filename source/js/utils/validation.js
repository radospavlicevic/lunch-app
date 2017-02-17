
function checkUsername(username) {
  if (!username) {
    return 'Username field is required. ';
  }
  return '';
}

function checkEmail(email) {
  let result = '';
  const emailRegex = /^[a-z0-9](\.?[a-z0-9]){3,}@work.co/;
  if (!email) {
    result += 'Email field is required. ';
  }
  if (email && !emailRegex.test(email)) {
    result += 'Invalid email address (email must end with @work.co). ';
  }
  return result;
}

function checkPassword(password) {
  let result = '';
  const passwordRegex = /.{8}/;
  if (!password) {
    result += 'Password field is required. ';
  }
  if (password && !passwordRegex.test(password)) {
    result += 'Invalid password (must contain 8 chars). ';
  }
  return result;
}

export function getUserValidationErrors(user) {
  const errors = {
    username: checkUsername(user.username),
    email: checkEmail(user.email),
    password: checkPassword(user.password),
  };
  return errors;
}
