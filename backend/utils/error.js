export const errorHendler = (statasCode, message) => {
  const error = new Error();
  error.statusCode = statasCode;
  error.message = message;
  return error;
};
