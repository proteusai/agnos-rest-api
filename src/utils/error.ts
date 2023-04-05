const errorObject = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }
  return {
    name: "Unknown error",
    message: (error as object).toString() || "Unknown error",
  };
};

export default errorObject;
