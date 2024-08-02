import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

// Middleware to validate JWT tokens
const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
}).unless({ path: ["/get-token", "/create-user"] });

export default jwtCheck;
