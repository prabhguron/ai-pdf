module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error(err); // Print the error message to the console
    next(err); // Call the next middleware function with the error
  });
};