---
title: .NET SDK
description: Integrate Replane into .NET applications with async support
sidebar_label: Overview
slug: /sdk/dotnet
---

# .NET SDK

The official .NET SDK for Replane. Works with .NET 10.0+ with zero external dependencies.

## Installation

```bash
dotnet add package Replane
```

## Quick start

```csharp
using Replane;

// Create client and connect
await using var replane = new ReplaneClient();

await replane.ConnectAsync(new ConnectOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key"
});

// Get a config value
var featureEnabled = replane.Get<bool>("feature-enabled");
var maxItems = replane.Get<int>("max-items", defaultValue: 100);
```

## Features

- **Real-time updates** via Server-Sent Events (SSE)
- **Client-side evaluation** — context never leaves your application
- **Gradual rollouts** with percentage-based segmentation
- **Override rules** with flexible conditions
- **Type-safe** configuration access
- **Async/await** support throughout
- **In-memory test client** for unit testing
- **Zero dependencies** — uses only System.Text.Json

## Next steps

- [API Reference](/docs/sdk/dotnet/api) — Full API documentation
- [Guide](/docs/sdk/dotnet/guide) — Testing, ASP.NET Core, best practices
- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Override Rules](/docs/guides/override-rules) — Target specific users

