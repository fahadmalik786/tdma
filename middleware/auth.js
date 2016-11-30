const auth = (req, res, next) => {
  const username = req.headers['username'];
  const password = req.headers['password'];

  if (req.method === 'POST' && (username !== 'admin' || password != 'admin')) {
    res.status(417).json({
      severity: "error",
      summary: "Invalid username/password",
      documentation: "http://www.localhost:8080/tdma/documentation/",
      error: "1",
    });
    return;
  }

  next();
}

module.exports = auth;
