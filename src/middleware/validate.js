const { createError } = require("../helpers/errorHelper");

function formatJoiDetails(error) {
  return error.details.map((detail) => ({
    path: detail.path.join("."),
    message: detail.message.replace(/"/g, ""),
  }));
}

function validate(schemas) {
  return (req, res, next) => {
    for (const [source, schema] of Object.entries(schemas)) {
      const { error, value } = schema.validate(req[source], {
        abortEarly: false,
        convert: true,
        stripUnknown: true,
      });

      if (error) {
        return next(
          createError(
            400,
            "VALIDATION_ERROR",
            "Validation failed.",
            formatJoiDetails(error)
          )
        );
      }

      req[source] = value;
    }

    return next();
  };
}

module.exports = { validate };
