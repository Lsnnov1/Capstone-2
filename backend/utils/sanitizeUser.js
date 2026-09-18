// Strip the password hash before a user row is sent to a client.
function sanitizeUser(user) {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
}

module.exports = sanitizeUser;
