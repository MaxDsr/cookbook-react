
export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN as string,
  clientId: process.env.AUTH0_CLIENT_ID as string,
  audience: process.env.AUTH0_AUDIENCE as string
};
