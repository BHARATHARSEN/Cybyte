import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const { AUTH0_DOMAIN, AUDIENCE } = process.env;
if (!AUTH0_DOMAIN || !AUDIENCE) {
  throw new Error(
    "Missing required environment variables: AUTH0_DOMAIN or AUDIENCE"
  );
}

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
}).unless({
  path: [
    "/get-token",
    "/create-user",
    { url: /^\/api\/v1\/workers.*/, methods: ["GET", "POST", "PUT", "DELETE"] },
  ],
});

export default jwtCheck;
