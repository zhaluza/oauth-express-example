# OAuth Server Example

TypeScript & MongoDB implementation of
[14gasher's extremely informative OAuth example](https://github.com/14gasher/oauth-example).
(Read the Readme in this repo for a much more detailed walkthrough of the OAuth
flow for this app)

## Libraries used

OAuth:

- [Node OAuth2 Server](https://github.com/oauthjs/node-oauth2-server)
- [Express OAuth Server](https://github.com/oauthjs/express-oauth-server) (a
  wrapper for the above library)

Everything else:

- [Mongoose](https://mongoosejs.com/)
- [TypeScript](https://www.typescriptlang.org/)

Instructions

- Dev mode: Run `yarn dev` to boot up the app locally.
- Otherwise, create a build (`yarn build`) and start the app locally with Node
  (`yarn start`)
