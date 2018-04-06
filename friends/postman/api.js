function validateEmail(email) {
  return true;
}

async function testEmail(username, password) {
  return await Promise.resolve(true);
}

async function sendEmail(to, subject, content) {
  return await Promise.resolve(true);
}

exports = module.exports = {
  validateEmail,
  testEmail,
  sendEmail,
};
