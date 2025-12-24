---
title: .NET SDK
description: Integrate Replane into .NET applications with async support
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

// Create and connect
await using var replane = new ReplaneClient(new ReplaneClientOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key"
});

await replane.ConnectAsync();

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

## API Reference

### ReplaneClient

Creates a new Replane client.

```csharp
await using var replane = new ReplaneClient(new ReplaneClientOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key"
});

await replane.ConnectAsync();
```

#### Options

| Option                    | Type                          | Default  | Description                     |
| ------------------------- | ----------------------------- | -------- | ------------------------------- |
| `BaseUrl`                 | `string`                      | required | Replane server URL              |
| `SdkKey`                  | `string`                      | required | SDK key for authentication      |
| `Context`                 | `ReplaneContext`              | `null`   | Default context for evaluations |
| `Defaults`                | `Dictionary<string, object?>` | `null`   | Default values                  |
| `Required`                | `IReadOnlyList<string>`       | `null`   | Required config names           |
| `RequestTimeoutMs`        | `int`                         | `2000`   | HTTP request timeout            |
| `InitializationTimeoutMs` | `int`                         | `5000`   | Initial connection timeout      |
| `RetryDelayMs`            | `int`                         | `200`    | Initial retry delay             |
| `InactivityTimeoutMs`     | `int`                         | `30000`  | SSE inactivity timeout          |
| `HttpClient`              | `HttpClient`                  | `null`   | Custom HttpClient               |
| `Debug`                   | `bool`                        | `false`  | Enable debug logging            |
| `Logger`                  | `IReplaneLogger`              | `null`   | Custom logger implementation    |
| `Agent`                   | `string`                      | `null`   | Agent identifier for User-Agent |

### Get&lt;T&gt;

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

Complex types work with overrides too:

```csharp
// Different themes for different user plans
var userTheme = replane.Get<ThemeConfig>("theme", new ReplaneContext { ["plan"] = "premium" });
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

### Default context

Set default context applied to all evaluations:

```csharp
var replane = new ReplaneClient(new ReplaneClientOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key",
    Context = new ReplaneContext
    {
        ["app_version"] = "2.0.0",
        ["platform"] = "ios"
    }
});
```

### ConfigChanged event

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

### Default values

Provide defaults for when configs aren't loaded:

```csharp
var replane = new ReplaneClient(new ReplaneClientOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key",
    Defaults = new Dictionary<string, object?>
    {
        ["feature-enabled"] = false,
        ["rate-limit"] = 100
    }
});
```

### Required configs

Ensure specific configs exist:

```csharp
var replane = new ReplaneClient(new ReplaneClientOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key",
    Required = ["essential-config", "api-endpoint"]
});

// ConnectAsync throws if required configs are missing
await replane.ConnectAsync();
```

## Testing

Use the in-memory test client for unit tests:

```csharp
using Replane.Testing;

[Fact]
public void TestFeatureFlag()
{
    // Create test client with initial configs
    using var client = TestClient.Create(new Dictionary<string, object?>
    {
        ["feature-enabled"] = true,
        ["max-items"] = 50
    });

    // Use like the real client
    client.Get<bool>("feature-enabled").Should().BeTrue();
    client.Get<int>("max-items").Should().Be(50);
}
```

### Testing with overrides

```csharp
[Fact]
public void TestOverrides()
{
    using var client = TestClient.Create();

    client.SetConfigWithOverrides(
        name: "premium-feature",
        value: false,
        overrides: [
            new OverrideData
            {
                Name = "premium-users",
                Conditions = [
                    new ConditionData
                    {
                        Operator = "equals",
                        Property = "plan",
                        Expected = "premium"
                    }
                ],
                Value = true
            }
        ]);

    client.Get<bool>("premium-feature", new ReplaneContext { ["plan"] = "free" })
        .Should().BeFalse();

    client.Get<bool>("premium-feature", new ReplaneContext { ["plan"] = "premium" })
        .Should().BeTrue();
}
```

### Testing config changes

```csharp
[Fact]
public void TestConfigChangeEvent()
{
    using var client = TestClient.Create();

    var receivedEvents = new List<ConfigChangedEventArgs>();
    client.ConfigChanged += (sender, e) => receivedEvents.Add(e);

    client.Set("feature", true);
    client.Set("feature", false);

    receivedEvents.Should().HaveCount(2);
    receivedEvents[0].GetValue<bool>().Should().BeTrue();
    receivedEvents[1].GetValue<bool>().Should().BeFalse();
}
```

### Testing complex types

```csharp
public record ThemeConfig
{
    public bool DarkMode { get; init; }
    public string PrimaryColor { get; init; } = "";
    public int FontSize { get; init; }
}

[Fact]
public void TestComplexType()
{
    var theme = new ThemeConfig
    {
        DarkMode = true,
        PrimaryColor = "#3B82F6",
        FontSize = 14
    };

    using var client = TestClient.Create(new Dictionary<string, object?>
    {
        ["theme"] = theme
    });

    var result = client.Get<ThemeConfig>("theme");

    result!.DarkMode.Should().BeTrue();
    result.PrimaryColor.Should().Be("#3B82F6");
}

[Fact]
public void TestComplexTypeWithOverrides()
{
    using var client = TestClient.Create();

    var defaultTheme = new ThemeConfig { DarkMode = false, PrimaryColor = "#000", FontSize = 12 };
    var premiumTheme = new ThemeConfig { DarkMode = true, PrimaryColor = "#FFD700", FontSize = 16 };

    client.SetConfigWithOverrides(
        name: "theme",
        value: defaultTheme,
        overrides: [
            new OverrideData
            {
                Name = "premium-theme",
                Conditions = [
                    new ConditionData { Operator = "equals", Property = "plan", Expected = "premium" }
                ],
                Value = premiumTheme
            }
        ]);

    client.Get<ThemeConfig>("theme", new ReplaneContext { ["plan"] = "free" })!
        .DarkMode.Should().BeFalse();

    client.Get<ThemeConfig>("theme", new ReplaneContext { ["plan"] = "premium" })!
        .DarkMode.Should().BeTrue();
}
```

## Debug logging

Enable debug logging to troubleshoot:

```csharp
var replane = new ReplaneClient(new ReplaneClientOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key",
    Debug = true
});
```

Example output:

```
[DEBUG] Replane: Initializing ReplaneClient with options:
[DEBUG] Replane:   BaseUrl: https://replane.example.com
[DEBUG] Replane:   SdkKey: your...key
[DEBUG] Replane: Connecting to SSE: https://replane.example.com/api/sdk/v1/replication/stream
[DEBUG] Replane: SSE event received: type=init
[DEBUG] Replane: Initialization complete: 5 configs loaded
[DEBUG] Replane: Get<Boolean>("feature-flag") called
[DEBUG] Replane:   Override #0 matched, returning: true
```

### Custom logger

```csharp
public class MyLogger : IReplaneLogger
{
    public void Log(LogLevel level, string message, Exception? exception = null)
    {
        _logger.Log(MapLevel(level), exception, message);
    }
}

var replane = new ReplaneClient(new ReplaneClientOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key",
    Logger = new MyLogger()
});
```

## Error handling

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

## ASP.NET Core integration

Both `ReplaneClient` and `InMemoryReplaneClient` implement the `IReplaneClient` interface, making it easy to swap implementations for testing or use with dependency injection.

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Register Replane client as the interface
builder.Services.AddSingleton<IReplaneClient>(sp =>
{
    var client = new ReplaneClient(new ReplaneClientOptions
    {
        BaseUrl = builder.Configuration["Replane:BaseUrl"]!,
        SdkKey = builder.Configuration["Replane:SdkKey"]!
    });
    return client;
});

var app = builder.Build();

// Connect on startup
var replane = app.Services.GetRequiredService<IReplaneClient>();
if (replane is ReplaneClient realClient)
{
    await realClient.ConnectAsync();
}

// Use in endpoints
app.MapGet("/api/items", (IReplaneClient replane) =>
{
    var maxItems = replane.Get<int>("max-items", defaultValue: 100);
    return Results.Ok(new { maxItems });
});

app.Run();
```

### Using in services

```csharp
public class FeatureService
{
    private readonly IReplaneClient _replane;

    public FeatureService(IReplaneClient replane)
    {
        _replane = replane;
    }

    public bool IsFeatureEnabled(string userId)
    {
        return _replane.Get<bool>("new-feature", new ReplaneContext
        {
            ["user_id"] = userId
        });
    }
}
```

### Testing with DI

```csharp
[Fact]
public void TestFeatureService()
{
    // Create test client implementing IReplaneClient
    using var testClient = TestClient.Create(new Dictionary<string, object?>
    {
        ["new-feature"] = true
    });

    // Inject into service
    var service = new FeatureService(testClient);

    // Test the service
    service.IsFeatureEnabled("user-123").Should().BeTrue();
}
```

## Best practices

### Use await using

```csharp
await using var replane = new ReplaneClient(options);
await replane.ConnectAsync();
// Client is disposed when scope exits
```

### Use defaults for resilience

```csharp
var replane = new ReplaneClient(new ReplaneClientOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key",
    Defaults = new Dictionary<string, object?>
    {
        ["feature-flag"] = false,
        ["rate-limit"] = 100
    }
});
```

### Register as interface in DI

```csharp
// Register as interface for easy testing
builder.Services.AddSingleton<IReplaneClient>(sp => {
    var client = new ReplaneClient(options);
    return client;
});
```

## Next steps

- [Feature Flags](/docs/guides/feature-flags) — Toggle features
- [Override Rules](/docs/guides/override-rules) — Target specific users
- [Gradual Rollouts](/docs/guides/gradual-rollouts) — Percentage-based releases
