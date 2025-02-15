export const validation = (schema) => {
  return (req, res, next) => {
    let validation = schema.validate(
      { ...req.body, ...req.params },
      {
        abortEarly: false,
      }
    );

    //console.log(validation.error);
    if (validation.error && validation.details) {
      let error = validation.details.map((ele) => ele.message);
      return res.status(400).json({ message: "validation errors", error });
    } else {
      next();
    }
  };
};
