# web3sdks.com

This repo contains the full source for all of web3sdks.com and the web3sdks dashboard.

## Building

### Install dependencies

We use `yarn`.

```sh
yarn install
```

### Starting local dev server.

```sh
yarn dev
```

### Building for production

```sh
yarn build
```

### Environment Variables

Some env vars can be overridden that are required for some external services to work. You can find them in the `.env.example` file at the root level of the project including some descriptions of what they are used for.

To define env vars please create a `.env` file based on the `.env.example` template at the root level of the project. This file is ignored by git so you can safely add it to your local copy of the project.

**No environment variables are required to build a basic functioning version of the site.**
