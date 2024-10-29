<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">A refined and optimized codebase for setting up NestJS microservices.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/MRdevX/nestifined-ms-framework" target="_blank"><img src="https://img.shields.io/circleci/build/github/MRdevX/nestifined-ms-framework/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/MRdevX/nestifined-ms-framework?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/MRdevX/nestifined-ms-framework/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## Description

[nestifined-ms-framework](https://github.com/MRdevX/nestifined-ms-framework) is a refined and optimized codebase for setting up NestJS microservices.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Linting

```bash
# lint the code
$ yarn run lint

# lint and fix the code
$ yarn run lint:fix
```

## Husky

Husky is used to manage Git hooks. The following hooks are configured:

- `pre-commit`: Runs lint-staged to lint and format code before committing.
- `commit-msg`: Ensures commit messages follow the conventional commit format.
- `post-commit`: Runs after a commit is made.
- `pre-push`: Runs before pushing code to the repository.
- `post-merge`: Runs after merging branches.
- `post-checkout`: Runs after checking out a branch.
- `prepare-commit-msg`: Runs before the commit message editor is opened.
- `post-rewrite`: Runs after a commit is rewritten.
- `pre-rebase`: Runs before rebasing branches.

## Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the root of the project and add the following variables:

```env
NODE_ENV=development
APP_NAME=MyApp
HOST=127.0.0.1
PORT=3000
CORS={"origin": ["http://example1.com", "/\\.example2\\.com$/"], "methods": ["GET", "POST"], "credentials": true}
API_PREFIX=api
RELEASE=1.0.0
S2S_TRANSPORT=RABBITMQ
S2S_REDIS_URL=redis://localhost:6379
S2S_RABBITMQ_URL=amqp://localhost:5672
S2S_RABBITMQ_QUEUE=my_queue
```

## Support

This project is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Your Name](https://github.com/MRdevX)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

This project is [MIT licensed](LICENSE).
