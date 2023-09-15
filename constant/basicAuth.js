const { AUTH } = require("@/config");

module.exports = {
  token: {
    headers: {
      Authorization: AUTH.BASIC_AUTH_TOKEN
    }
  }
}