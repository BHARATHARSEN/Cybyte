import jwt from "express-jwt";
import jwks from "jwks-rsa";

const jwtCheck = jwt({
    secret : jwks.expressJwtSecret({
        cache: true,
        rateLimit : true,
        jwksRequestsPerMinute : 5,
        jwksUri : "https://dev-2y6m4pf8iiyqeu57.us.auth0.com/.well-known/jwks.json"
    }),

    audience : "https://dev-2y6m4pf8iiyqeu57.us.auth0.com/api/v2/",
    issuer : "https://dev-2y6m4pf8iiyqeu57.us.auth0.com/",
    algorithms : ["RS256"]
});

export default jwtCheck ;