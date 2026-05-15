const { AppError } = require("../utilities/appError");
const { z } = require("zod");

function formatPath(path = []) {
  const usefulPath = path.filter((part) => !["body", "query", "params", "files"].includes(part));
  if (!usefulPath.length) return "";

  return usefulPath
    .map((part) => String(part))
    .join(".")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase())
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase());
}

function formatValidationError(error) {
  const issues = error?.issues || error?.errors || [];

  if (!issues.length) {
    return "Validation error";
  }

  return issues
    .map((issue) => {
      const field = formatPath(issue.path);
      return field ? `${field}: ${issue.message}` : issue.message;
    })
    .join(", ");
}

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
    if (err instanceof z.ZodError || err?.issues || err?.errors) {
      return next(new AppError(formatValidationError(err), 400));
    }

    return next(new AppError("Validation error", 400));
  }
};

module.exports = validate;
