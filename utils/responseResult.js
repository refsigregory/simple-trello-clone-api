const responseResult = (res, obj) => {
  res.status(obj.code).json({
    code: obj.code,
    status: obj.status,
    message: obj.message,
    data: obj.data,
  });
};

export default responseResult;