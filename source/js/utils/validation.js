
function checkUsername(username) {
  if (!username) {
    return 'Username field is required. ';
  }
  return '';
}

function checkEmail(email) {
  let result = '';
  const emailRegex = /^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@work.co/;
  if (!email) {
    result += 'Email field is required. ';
  }
  if (email && !emailRegex.test(email)) {
    result += 'Invalid email address (email must end with @work.co). ';
  }
  return result;
}

export function checkPassword(password, passwordHint = 'Password') {
  let result = '';
  const passwordRegex = /.{8}/;
  if (!password) {
    result += `${ passwordHint } field is required. `;
  }
  if (password && !passwordRegex.test(password)) {
    result += 'Invalid password (must contain 8 chars). ';
  }
  return result;
}

export function getUserValidationErrors(user, update) {
  const errors = {
    username: checkUsername(user.username),
    email: checkEmail(user.email),
    password: update ? '' : checkPassword(user.password),
  };
  return errors;
}
