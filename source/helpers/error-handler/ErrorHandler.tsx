const ErrorHandler = (error, isFatal) => {
  if (isFatal) {
    // TODO: Handle fatal errors: Splash screen and error log.
    console.log('Error boundary: ', error);
  } else {
    // Error has been notified
    console.warn(error);
  }
};

export default ErrorHandler;
