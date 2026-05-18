function buildError(code, message, details = []) {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}

module.exports = { buildError };
