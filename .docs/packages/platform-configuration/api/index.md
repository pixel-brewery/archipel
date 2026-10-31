---
title: '@pixel-brewery/archipel-platform-configuration'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-configuration

## Classes

| Class                                                        | Description                                                                                                                                                                                                          |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ConfigKeyNotFoundError](Class.ConfigKeyNotFoundError)       | Error thrown when a configuration key cannot be resolved.                                                                                                                                                            |
| [ConfigModule](Class.ConfigModule)                           | The `ConfigModule` class.                                                                                                                                                                                            |
| [ConfigRegistry](Class.ConfigRegistry)                       | A static, global registry that collects all configuration keys registered by platform libraries. This enables a central overview of every environment variable the application depends on, grouped by source module. |
| [ConfigService](Class.ConfigService)                         | -                                                                                                                                                                                                                    |
| [ConfigStrategyBase](Class.ConfigStrategyBase)               | The `ConfigStrategyBase` class. Represents the base class for configuration strategies.                                                                                                                              |
| [EnvironmentConfigStrategy](Class.EnvironmentConfigStrategy) | The `EnvironmentConfigStrategy` class.                                                                                                                                                                               |
| [FileConfigStrategy](Class.FileConfigStrategy)               | The `FileConfigStrategy` class.                                                                                                                                                                                      |

## Interfaces

| Interface                                              | Description                                                                                                                                   |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [IConfigKey](Interface.IConfigKey)                     | A type-safe config key that encodes both the config key and the type of its value.                                                            |
| [IConfigModuleOptions](Interface.IConfigModuleOptions) | The `IConfigModuleOptions` interface.                                                                                                         |
| [IConfigRegistryEntry](Interface.IConfigRegistryEntry) | Describes a registered configuration entry, including its source module and whether the entry is required or optional (with a default value). |

## Functions

| Function                                    | Description                     |
| ------------------------------------------- | ------------------------------- |
| [createConfigKey](Function.createConfigKey) | Creates a type-safe config key. |
