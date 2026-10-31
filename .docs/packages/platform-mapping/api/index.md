---
title: '@pixel-brewery/archipel-platform-mapping'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-mapping

## Classes

| Class                                                                | Description                                                                        |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [MappingBuilder](Class.MappingBuilder)                               | A mapping builder that uses the mapping service to register maps.                  |
| [MappingErrorBase](Class.MappingErrorBase)                           | Base class for mapping related domain errors.                                      |
| [MappingModule](Class.MappingModule)                                 | Module that provides mapping services and allows registration of mapping profiles. |
| [MappingNotRegisteredError](Class.MappingNotRegisteredError)         | Thrown when a keyed mapping is requested but not registered.                       |
| [MappingProfileBase](Class.MappingProfileBase)                       | Base class for mapping profiles to simplify implementation.                        |
| [MappingService](Class.MappingService)                               | Central mapping registry supporting keyed & type-based mappings.                   |
| [TypeMappingNotRegisteredError](Class.TypeMappingNotRegisteredError) | Thrown when a type mapping is requested but not registered.                        |

## Interfaces

| Interface                                    | Description                                                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [IMappingBuilder](Interface.IMappingBuilder) | Defines the interface for a mapping builder.                                                                                          |
| [IMappingKey](Interface.IMappingKey)         | Type-safe mapping key that encodes both input and output types. This ensures compile-time type safety when using the mapping service. |
| [IMappingProfile](Interface.IMappingProfile) | Defines the interface for a mapping profile.                                                                                          |

## Type Aliases

| Type Alias                           | Description |
| ------------------------------------ | ----------- |
| [Constructor](TypeAlias.Constructor) | -           |

## Functions

| Function                                      | Description                      |
| --------------------------------------------- | -------------------------------- |
| [createMappingKey](Function.createMappingKey) | Creates a type-safe mapping key. |
