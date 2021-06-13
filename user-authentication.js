let axios = require("axios")

module.exports = {
    type: "token",
    tokens: function(token) {
        return new Promise(function(resolve, reject) {
            if(token.includes("token_")) {
                var user = {username: token.replace("token_",""), permissions: '*'};
                resolve(user);
            } else {
                resolve(null);
            }
        });
    },
    default: function() {
        return new Promise(function(resolve) {
            resolve(null)
        });
    }
}