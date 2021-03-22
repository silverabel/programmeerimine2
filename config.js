const config = {
  "tablePrefix": "",
  "jwtSecret": "secret",
}

config.sqllogin = {
  "connectionLimit": "10",
  "host": "mysql",
  "user": "root",
  "password": "secret",
  "database": "programmeerimine2",
  "multipleStatements": "true",
}

module.exports = config;