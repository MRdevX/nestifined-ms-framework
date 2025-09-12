# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.7](https://github.com/MRdevX/nestifined-ms-framework/compare/v0.0.6...v0.0.7) (2025-09-12)


### Features

* **auth:** add TODOs for security enhancements and input validation in authentication module ([edbf30d](https://github.com/MRdevX/nestifined-ms-framework/commit/edbf30d63ca2857d34c2b11670823d6064da1fc0))
* **config:** add initial CodeRabbit configuration for NestJS microservice framework, including review settings, path filters, and code generation instructions ([a1633a7](https://github.com/MRdevX/nestifined-ms-framework/commit/a1633a7e708c61dcc31ef0e42815afa8327f6c09))
* **database:** implement soft and hard delete functionality, restore method, and includeDeleted option in search ([b80d546](https://github.com/MRdevX/nestifined-ms-framework/commit/b80d546d8a4042e693762a3c7b608aa924835dc0))
* **graphql:** enhance schema and resolvers with new fields and integration tests ([4b63860](https://github.com/MRdevX/nestifined-ms-framework/commit/4b63860909372f1554dcb687969c98ec43387c13))
* **graphql:** Implement GraphQL API with code-first approach ([699e444](https://github.com/MRdevX/nestifined-ms-framework/commit/699e4443dd5964145c779028f1c45abb218f1203))
* **pagination:** add limit and offset parameters to search book DTOs and repository for improved pagination support ([620890f](https://github.com/MRdevX/nestifined-ms-framework/commit/620890f829bc71937eec689cbd39809013e0c3c3))


### Bug Fixes

* **husky:** change pre-push command to pnpm check:fix; refactor test imports for consistency ([3dcfec3](https://github.com/MRdevX/nestifined-ms-framework/commit/3dcfec3575e10ea5966a70549d9004d43bb4bd28))
* **husky:** update husky hooks to v10 format and fix biome configuration ([7675747](https://github.com/MRdevX/nestifined-ms-framework/commit/767574723b9aa57c9a2a7130c86a7c27dfd2e635))

### [0.0.6](https://github.com/MRdevX/nestifined-ms-framework/compare/v0.0.5...v0.0.6) (2025-08-28)


### Features

* add all exception handler ([293ea8f](https://github.com/MRdevX/nestifined-ms-framework/commit/293ea8f8cb064743b180a96dbd0349234d81f070))
* add caching for book ([b249036](https://github.com/MRdevX/nestifined-ms-framework/commit/b24903658bfd81002248f4e074454bbf87ab77ac))
* add fixtures ([c7220bb](https://github.com/MRdevX/nestifined-ms-framework/commit/c7220bbbf2a725d80a2ffa05f7cda3513f8856af))
* add generic search ([e3dc820](https://github.com/MRdevX/nestifined-ms-framework/commit/e3dc8205fc02a6224673b5cc1a1ec6fa5e014fe3))
* add send and receive book over rabbitmq ([e220829](https://github.com/MRdevX/nestifined-ms-framework/commit/e2208296c0a050a91af14ec6dae1d1d76987e771))
* add support for safe delete and update tests regarding this feature ([1137b73](https://github.com/MRdevX/nestifined-ms-framework/commit/1137b731d419d27befea0797757510db44e5eb73))
* add tests ([f944fbb](https://github.com/MRdevX/nestifined-ms-framework/commit/f944fbbb2ed917f9779f567711d4d8e36fee2743))
* **base:** add orm-agnostic base + auth module + nice upgrades (biome, pnpm) ([a361399](https://github.com/MRdevX/nestifined-ms-framework/commit/a361399026d049f1cb8f811e36ab05ed10ef4f4c))
* **drizzle:** add Drizzle ORM support with base entity and repository implementations ([090c354](https://github.com/MRdevX/nestifined-ms-framework/commit/090c3548b6c67b7d840af2e42a0ba51f8e31ea3c))
* implement author module ([5a4a62e](https://github.com/MRdevX/nestifined-ms-framework/commit/5a4a62ee91437154190e6a90c2e0b3fd6aa84921))
* implement caching for book ([e7908b6](https://github.com/MRdevX/nestifined-ms-framework/commit/e7908b680a881cdab8adf8dd9c39f86a9825c590))
* implement dynamic errors ([7762db3](https://github.com/MRdevX/nestifined-ms-framework/commit/7762db391d11f46502ec979a150cd2c191aa722c))
* implement genetic search ([27f9571](https://github.com/MRdevX/nestifined-ms-framework/commit/27f95711cbc9ad0796f565bb658b72e25d58dafa))
* implement rabbitmq and redis moduels in the project ([8951dc5](https://github.com/MRdevX/nestifined-ms-framework/commit/8951dc55a299d232614fe9c3dcf257995264dc2f))
* optimise base search ([04ad477](https://github.com/MRdevX/nestifined-ms-framework/commit/04ad4777404bff271d546eb72f95eba6a57e8d56))
* refine base search service ([8b399a7](https://github.com/MRdevX/nestifined-ms-framework/commit/8b399a7c28e8815d1245aa357c4729b904d0ba02))
* refine base search service ([242e663](https://github.com/MRdevX/nestifined-ms-framework/commit/242e6639e670c314c76f49caf67e7a3ef0cd4d52))
* refine book dtos and their imports ([47855c1](https://github.com/MRdevX/nestifined-ms-framework/commit/47855c12e73ace42b14252c1378d973e7bf2bc42))
* refine errors ([0e6dc3c](https://github.com/MRdevX/nestifined-ms-framework/commit/0e6dc3cd00427d77b3755ecc5f18270ad60e5114))


### Bug Fixes

* add author to entities ([b1656a6](https://github.com/MRdevX/nestifined-ms-framework/commit/b1656a6e393a23058190c2a544df174cfda8252c))
* **auth:** update user identifier in auth methods for consistency ([bde6c5a](https://github.com/MRdevX/nestifined-ms-framework/commit/bde6c5a72ee73c3cd46b1d83996c027523693e88))
* migrate husky to v9 and update configuration ([bbd62f5](https://github.com/MRdevX/nestifined-ms-framework/commit/bbd62f58b29ed9d4d31f16eb482a8b082fdd90d6))
* tests ([4636b3d](https://github.com/MRdevX/nestifined-ms-framework/commit/4636b3dffcd72db25eb16af975576c9588bbc802))
* tests, mock ioredis ([0576ca0](https://github.com/MRdevX/nestifined-ms-framework/commit/0576ca00e9587f1523abd1f3448b36aa766b77c0))
* tests, mock ioredis ([7653200](https://github.com/MRdevX/nestifined-ms-framework/commit/76532007c6d297fcc3d3100acbcc7a3d3f9f6b63))

### [0.0.5](https://github.com/MRdevX/nestifined-ms-framework/compare/v0.0.4...v0.0.5) (2024-10-30)


### Features

* add bade entity ([6ba321f](https://github.com/MRdevX/nestifined-ms-framework/commit/6ba321fee5a9a152e3d8ef2608927f4e612ce8ac))
* add rabbitmq support ([fc0df82](https://github.com/MRdevX/nestifined-ms-framework/commit/fc0df828ba026d13f42cae0d1e167c2c77421629))
* add search to books ([2db5231](https://github.com/MRdevX/nestifined-ms-framework/commit/2db5231618e56690b54302ab3e889f6757288c12))
* connect to database and add book entity and module ([cc582d2](https://github.com/MRdevX/nestifined-ms-framework/commit/cc582d2fbb4e114a5ee6428d4283bf6a4b7e232c))
* refine book entity ([eac0720](https://github.com/MRdevX/nestifined-ms-framework/commit/eac0720fa0f6996ef431d2710fa68533c8546bab))
* use uuid for book id ([fb07fc0](https://github.com/MRdevX/nestifined-ms-framework/commit/fb07fc09498d432b5d4c0a210c00c9550a731d24))


### Bug Fixes

* books table name ([3dd8b9d](https://github.com/MRdevX/nestifined-ms-framework/commit/3dd8b9de9696e3071528db41493d786e6c8dcdad))

### [0.0.4](https://github.com/MRdevX/nestifined-ms-framework/compare/v0.0.3...v0.0.4) (2024-10-29)

### [0.0.3](https://github.com/MRdevX/nestifined-ms-framework/compare/v0.0.2...v0.0.3) (2024-10-29)


### Features

* add Docker to the project ([63004b3](https://github.com/MRdevX/nestifined-ms-framework/commit/63004b3b55153b557171a312b227f358883b4aef))
* add env support for rabbitmq in s2s envs ([822aadf](https://github.com/MRdevX/nestifined-ms-framework/commit/822aadfd07c52c476a007c1ef12f4bdbd29342aa))
* add kubernetes deployment configurations ([d02be08](https://github.com/MRdevX/nestifined-ms-framework/commit/d02be08665eceb57c8b55d8d49d4526b308ed847))
* add namespaces for each k8s environent ([9b47dc2](https://github.com/MRdevX/nestifined-ms-framework/commit/9b47dc254898463b42faf1541302f424aa0ff79a))
* add secrets for each k8s env ([ef14fee](https://github.com/MRdevX/nestifined-ms-framework/commit/ef14fee5a48c3e109349f485cf0bd969872bb8fd))
* add typeorm and db config ([c6477f1](https://github.com/MRdevX/nestifined-ms-framework/commit/c6477f1f7b21e6a1501d98d8809be00936dbcae5))
* add typeorm and db config ([d9fa39d](https://github.com/MRdevX/nestifined-ms-framework/commit/d9fa39d716e7f1e763ff8a4d21665a6df626a21d))
* support different types of cors configuration ([c04a886](https://github.com/MRdevX/nestifined-ms-framework/commit/c04a886c9bbdb33311c7544e4cc3173f6f871c0b))
* upgrade eslint config to new format ([c42d297](https://github.com/MRdevX/nestifined-ms-framework/commit/c42d2972151a3c99f786bdff8732ff25be3d62ca))


### Bug Fixes

* joi import issue ([4917efb](https://github.com/MRdevX/nestifined-ms-framework/commit/4917efb5eaee95745c6c9c31a7fa702658521826))
* joi imports ([26cdd50](https://github.com/MRdevX/nestifined-ms-framework/commit/26cdd50dd16871cb550f6c88916662e38a75ac50))
* k8s kustomize config ([6b5de09](https://github.com/MRdevX/nestifined-ms-framework/commit/6b5de09dc003249141b935508b836d3883098f08))
* refine main file ([dcbf2c2](https://github.com/MRdevX/nestifined-ms-framework/commit/dcbf2c2b38161e7c07216de3f1667ad78bd404e3))
* remove husky deprecated command ([dcc29fc](https://github.com/MRdevX/nestifined-ms-framework/commit/dcc29fc3a890fb3e90714d175f83fcaf1e197b93))
* remove validations for now ([78c489e](https://github.com/MRdevX/nestifined-ms-framework/commit/78c489e214acce2ca6b144b1996d878d815c7dc7))
* yarn cache ([087928c](https://github.com/MRdevX/nestifined-ms-framework/commit/087928ce41728a122a72e07a1a5dc8e6490a81a2))

### 0.0.2 (2023-03-10)


### Features

* add config service ([9d23a6f](https://github.com/MRdevX/nestifined-ms-framework/commit/9d23a6fd3ced01fd50d934e53860e8104d16762e))


### Bug Fixes

* node env ([c57a356](https://github.com/MRdevX/nestifined-ms-framework/commit/c57a3563927c026738e5dd532232ae7aad5e73da))
