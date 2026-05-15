const { AppError } = require("../utilities/appError");

const validate = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse({
      body: req.body || {},
      query: req.query || {},
      params: req.params || {},
      files: req.files || [],
    });

    if (Object.prototype.hasOwnProperty.call(parsedData, "body")) {
      req.body = parsedData.body;
    }
    if (Object.prototype.hasOwnProperty.call(parsedData, "query")) {
      req.query = parsedData.query;
    }
    if (Object.prototype.hasOwnProperty.call(parsedData, "params")) {
      req.params = parsedData.params;
    }
    if (Object.prototype.hasOwnProperty.call(parsedData, "files")) {
      req.files = parsedData.files;
    }
    next();
  } catch (err) {
    console.log(err);
    return next(new AppError(err || "Validation Error", 400));
  }
};

module.exports = validate;
