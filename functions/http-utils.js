exports.handleResponse = (res, data = {}) => {
  res.send(data);
};

exports.handleError = (res,err) => {
  res.status(500).send(err)
}