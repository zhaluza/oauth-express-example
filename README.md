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

- [Express](http://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Instructions

### Setup

- Create a new MongoDB database
- Create a `.env` file in your root directory with the following values:

```
PORT=8000
DB_URI=[your database uri goes here]
```

### Booting up

- Dev mode: Run `yarn dev` to boot up the app locally.
- Otherwise, create a build (`yarn build`) and start the app locally with Node
  (`yarn start`)

### Running the app

- Populate your database with at least one client and user:
  - **Add a client:** make a `POST` call to `http://localhost:8000/client` with
    the following body:
  ```
  {
      "clientId": "myClientId",
      "clientSecret": "secret",
      "redirectUris": ["http://localhost:8000/client/app"],
      "grants": ["authorization_code", "refresh_token"]
  }
  ```
  - **Add a user:** make a `POST` call to `http://localhost:8000/user` with the
    following body:
  ```
  {
      "email": "zac.haluza@gmail.com",
      "firstName": "Zac",
      "lastName": "Haluza",
      "username": "username",
      "password": "password"
  }
  ```
- You're all set. Now visit `http://localhost:8000` and follow the steps.
