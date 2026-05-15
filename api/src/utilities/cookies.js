function getAuthCookieOptions(req, maxAge) {
  const isHttps =
    req.secure || req.headers["x-forwarded-proto"] === "https";

  const options = {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "None" : "Lax",
  };

  if (maxAge) {
    options.maxAge = maxAge;
  }

  return options;
}

const sendAuthCookies = (req, res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...getAuthCookieOptions(req, 15 * 60 * 1000),
  });

  res.cookie("refreshToken", refreshToken, {
    ...getAuthCookieOptions(req, 7 * 24 * 60 * 60 * 1000),
  });
};

module.exports = sendAuthCookies;
module.exports.getAuthCookieOptions = getAuthCookieOptions;
