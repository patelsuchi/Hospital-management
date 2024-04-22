export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  // Calculate the expiration time in milliseconds
  const expirationTime = Date.now() + parseInt(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000;

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(expirationTime), // Convert expiration time to a Date object
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
