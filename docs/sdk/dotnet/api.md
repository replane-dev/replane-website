---
title: API Reference
description: .NET SDK API documentation
sidebar_label: API Reference
---

# API Reference

Complete API documentation for the .NET SDK.

## ReplaneClient

Creates a new Replane client.

```csharp
await using var replane = new ReplaneClient();

await replane.ConnectAsync(new ConnectOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key"
});
```

### ReplaneClientOptions

Options passed to the constructor. Connection options are provided via `ConnectAsync`.

| Option       | Type                          | Default | Description                     |
| ------------ | ----------------------------- | ------- | ------------------------------- |
| `Context`    | `ReplaneContext`              | `null`  | Default context for evaluations |
| `Defaults`   | `Dictionary<string, object?>` | `null`  | Default values                  |
| `Required`   | `IReadOnlyList<string>`       | `null`  | Required config names           |
| `HttpClient` | `HttpClient`                  | `null`  | Custom HttpClient               |
| `Debug`      | `bool`                        | `false` | Enable debug logging            |
| `Logger`     | `IReplaneLogger`              | `null`  | Custom logger implementation    |

## ConnectAsync

Connects to the Replane server. Requires `ConnectOptions` with connection parameters.

```csharp
await replane.ConnectAsync(new ConnectOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key"
});
```

### ConnectOptions

| Option               | Type     | Default  | Description                |
| -------------------- | -------- | -------- | -------------------------- |
| `BaseUrl`            | `string` | required | Replane server URL         |
| `SdkKey`             | `string` | required | SDK key for authentication |
| `RequestTimeoutMs`   | `int`    | `2000`   | HTTP request timeout       |
| `ConnectionTimeoutMs`| `int`    | `5000`   | Initial connection timeout |
| `RetryDelayMs`       | `int`    | `200`    | Initial retry delay        |
| `InactivityTimeoutMs`| `int`    | `30000`  | SSE inactivity timeout     |
| `Agent`              | `string` | `null`   | Agent identifier           |

## Get&lt;T&gt;

Gets a typed config value.

```csharp
// Basic usage
var enabled = replane.Get<bool>("feature-enabled");
var limit = replane.Get<int>("rate-limit");
var apiKey = replane.Get<string>("api-key");

// With default value
var timeout = replane.Get<int>("timeout-ms", defaultValue: 5000);
```

### Complex types

Configs can store complex objects:

```csharp
// Define your config type
public record ThemeConfig
{
    public bool DarkMode { get; init; }
    public string PrimaryColor { get; init; } = "";
    public int FontSize { get; init; }
}

public record FeatureFlags
{
    public bool NewUI { get; init; }
    public List<string> EnabledModules { get; init; } = [];
}

// Get complex configs
var theme = replane.Get<ThemeConfig>("theme");
var features = replane.Get<FeatureFlags>("features");

Console.WriteLine($"Dark mode: {theme.DarkMode}");
Console.WriteLine($"Enabled modules: {string.Join(", ", features.EnabledModules)}");
```

### Get with context

Pass context for override evaluation:

```csharp
var context = new ReplaneContext
{
    ["user_id"] = "user-123",
    ["plan"] = "premium",
    ["region"] = "us-east"
};

var premiumFeature = replane.Get<bool>("premium-feature", context);
```

## Default context

Set default context applied to all evaluations:

```csharp
var replane = new ReplaneClient(new ReplaneClientOptions
{
    Context = new ReplaneContext
    {
        ["app_version"] = "2.0.0",
        ["platform"] = "ios"
    }
});

await replane.ConnectAsync(new ConnectOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key"
});
```

## ConfigChanged event

Subscribe to config changes:

```csharp
// Subscribe to all config changes
replane.ConfigChanged += (sender, e) =>
{
    Console.WriteLine($"Config '{e.ConfigName}' updated");
};

// Get typed value from the event
replane.ConfigChanged += (sender, e) =>
{
    if (e.ConfigName == "feature-flag")
    {
        var enabled = e.GetValue<bool>();
        Console.WriteLine($"Feature flag changed to: {enabled}");
    }
};

// Works with complex types too
replane.ConfigChanged += (sender, e) =>
{
    if (e.ConfigName == "theme")
    {
        var theme = e.GetValue<ThemeConfig>();
        Console.WriteLine($"Theme updated: dark={theme?.DarkMode}");
    }
};

// Unsubscribe when needed
void OnConfigChanged(object? sender, ConfigChangedEventArgs e)
{
    Console.WriteLine($"Config changed: {e.ConfigName}");
}

replane.ConfigChanged += OnConfigChanged;
// Later...
replane.ConfigChanged -= OnConfigChanged;
```

## Exceptions

```csharp
try
{
    await replane.ConnectAsync();
    var value = replane.Get<string>("my-config");
}
catch (AuthenticationException)
{
    // Invalid SDK key
}
catch (ConfigNotFoundException ex)
{
    // Config doesn't exist
    Console.WriteLine($"Config not found: {ex.ConfigName}");
}
catch (ReplaneTimeoutException ex)
{
    // Operation timed out
    Console.WriteLine($"Timeout after {ex.TimeoutMs}ms");
}
catch (ReplaneException ex)
{
    // Other errors
    Console.WriteLine($"Error [{ex.Code}]: {ex.Message}");
}
```

## Condition operators

The SDK supports these override operators:

| Operator                | Description                |
| ----------------------- | -------------------------- |
| `equals`                | Exact match                |
| `in`                    | Value is in list           |
| `not_in`                | Value is not in list       |
| `less_than`             | Less than comparison       |
| `less_than_or_equal`    | Less than or equal         |
| `greater_than`          | Greater than comparison    |
| `greater_than_or_equal` | Greater than or equal      |
| `segmentation`          | Percentage-based bucketing |
| `and`                   | All conditions must match  |
| `or`                    | Any condition must match   |
| `not`                   | Negate a condition         |

