const jsonwebtoken = require('jsonwebtoken');
const { jwtSecret } = require('../config');

exports.checkLogin = async (req, res, next) => {
  if (!req.headers.authorization) return res.status(403).json({"Error": "No authorization header"});

  try {
    var payload = await jsonwebtoken.verify(req.headers.authorization.split(' ')[1], jwtSecret);
  }
  catch (error) {
    return res.status(500).json({error});
  }
  
  if (!payload) return res.status(403).json({"Error": "Unauthorized"});

  req.userRoleID = payload.roleID;
  next();
}

exports.checkAdmin = (req, res, next) => {
  if (req.userRoleID !== 1) return res.status(403).json({"Error": "Admin authorization required"});
  next(); 
}