## [1.5.0](https://github.com/flow-build/diagrams-core/compare/v1.4.0...v1.5.0) (2023-01-26)


### Features

* verify whether the blueprint exists before saving ([3f68c0b](https://github.com/flow-build/diagrams-core/commit/3f68c0ba5aa2129f6b676829b418e7b3f9e49be1))


### Bug Fixes

* prevent the same workflow from be saved twice ([96115b7](https://github.com/flow-build/diagrams-core/commit/96115b7080592c2757214606a96269d70ba17645))

## [1.4.0](https://github.com/flow-build/diagrams-core/compare/v1.3.2...v1.4.0) (2023-01-25)


### Features

* add public diagrams on save ([87c01e1](https://github.com/flow-build/diagrams-core/commit/87c01e10b12519114f3095e989ce4c8c8504f613))
* allow saving a diagram without a user (public diagram) ([63a9432](https://github.com/flow-build/diagrams-core/commit/63a94320155e33575813c0c9f78287635cf091fa))
* save blueprint_id when saving a diagram ([e47b30c](https://github.com/flow-build/diagrams-core/commit/e47b30c61f4d5337323e413e0a5c1917363e725f))

## [1.3.2](https://github.com/flow-build/diagrams-core/compare/v1.3.1...v1.3.2) (2023-01-25)


### Bug Fixes

* :lock: fix knex and json5 sec issues ([114ad74](https://github.com/flow-build/diagrams-core/commit/114ad748ae0eee2720eb3856485df9698edb2644))

## [1.3.1](https://github.com/flow-build/diagrams-core/compare/v1.3.0...v1.3.1) (2022-10-28)


### Bug Fixes

* adjust migrations ([0e5e612](https://github.com/flow-build/diagrams-core/commit/0e5e6127734101d7111480beeadd313e53d75a6b))

## [1.3.0](https://github.com/flow-build/diagrams-core/compare/v1.2.1...v1.3.0) (2022-10-20)


### Features

* add methods to update and delete new entities ([f29ba11](https://github.com/flow-build/diagrams-core/commit/f29ba11fe2b9381896181fbcf8d8ed4de691cc80))

## [1.2.1](https://github.com/flow-build/diagrams-core/compare/v1.2.0...v1.2.1) (2022-10-19)


### Bug Fixes

* adjust diagram2workflow to accept relation N:N ([4b303f7](https://github.com/flow-build/diagrams-core/commit/4b303f79849ea787099dd35c0b9ad09bca79bcf0))

## [1.2.0](https://github.com/flow-build/diagrams-core/compare/v1.1.0...v1.2.0) (2022-10-19)


### Features

* add entity diagramToWorkflow ([17b3dc5](https://github.com/flow-build/diagrams-core/commit/17b3dc58345b5908a0a414f16ce5aad347b74416))
* add entity workflow ([59532f1](https://github.com/flow-build/diagrams-core/commit/59532f1662603b8df365ac187fb58ebdf0c83eea))
* add new classes on knex persist ([2f24f87](https://github.com/flow-build/diagrams-core/commit/2f24f879144ea3dda4ea648f61c8d8a06b365101))
* add new entity blueprint ([7ddeb34](https://github.com/flow-build/diagrams-core/commit/7ddeb344d8a5cfdc00cd114d837378a9f408a35c))
* add workflow_id on methods to fetch diagrams ([83dee1a](https://github.com/flow-build/diagrams-core/commit/83dee1a93b0f720471ba90757520407329a39bd0))
* change diagram and base entities to attend new entities ([2fd65fe](https://github.com/flow-build/diagrams-core/commit/2fd65fe2da5efd3107529223accfbba4d8e155e9))


### Bug Fixes

* adjust blueprint entity to save only blueprint_spec ([43ee811](https://github.com/flow-build/diagrams-core/commit/43ee8114de4a970172e1e44b19b2fd3da33c95a1))
* adjust entities to attend new requirements ([398f46a](https://github.com/flow-build/diagrams-core/commit/398f46a663911f15c83a12fa0aa4952ed81c240d))
* adjust migrations and seeds ([2769173](https://github.com/flow-build/diagrams-core/commit/27691731ba801578063f9ff761cf1509fc4f4286))

## [1.1.0](https://github.com/flow-build/diagrams-core/compare/v1.0.2...v1.1.0) (2022-10-14)


### Features

* add new property 'aligned' for Diagram ([866e6c5](https://github.com/flow-build/diagrams-core/commit/866e6c571043af01b087842a01c2323378f579c7))

## [1.0.2](https://github.com/flow-build/diagrams-core/compare/v1.0.1...v1.0.2) (2022-09-10)


### Bug Fixes

* fix CI ([2e1cefb](https://github.com/flow-build/diagrams-core/commit/2e1cefb1940d3919a7ae10fe562e5a5b199b86a2))
* update workflow, for now ([4903c14](https://github.com/flow-build/diagrams-core/commit/4903c1419aa0b876368d475134947ff70184230a))
