---
title: '@pixel-brewery/archipel-platform-resources'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-resources

## Classes

| Class                                                      | Description                                                                                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [BlobResourceStrategy](Class.BlobResourceStrategy)         | Strategy for loading resources from blob storage.                                                                             |
| [EmbeddedResourceStrategy](Class.EmbeddedResourceStrategy) | Strategy for loading embedded resources from memory.                                                                          |
| [FileResourceStrategy](Class.FileResourceStrategy)         | Strategy for loading resources from the local file system.                                                                    |
| [ResourceManager](Class.ResourceManager)                   | Central manager for loading resources from various sources. Supports multiple strategies (file, blob, embedded) with caching. |
| [ResourceModule](Class.ResourceModule)                     | Module providing the ResourceManager.                                                                                         |
| [ResourceNotFoundError](Class.ResourceNotFoundError)       | Error thrown when a Resource with a specified ID is not found.                                                                |

## Interfaces

| Interface                                                            | Description                                                    |
| -------------------------------------------------------------------- | -------------------------------------------------------------- |
| [IBlobResourceStrategyConfig](Interface.IBlobResourceStrategyConfig) | Configuration for the blob resource strategy.                  |
| [IBlobServiceAdapter](Interface.IBlobServiceAdapter)                 | Minimal blob service interface to avoid circular dependencies. |
| [IFileResourceStrategyConfig](Interface.IFileResourceStrategyConfig) | Configuration for the file resource strategy.                  |
| [IResourceManagerConfig](Interface.IResourceManagerConfig)           | Configuration for the ResourceManager.                         |
| [IResourceMetadata](Interface.IResourceMetadata)                     | Metadata about a resource.                                     |
| [IResourceResult](Interface.IResourceResult)                         | Result of loading a resource.                                  |
| [IResourceStrategy](Interface.IResourceStrategy)                     | Strategy for loading resources from a specific source.         |
