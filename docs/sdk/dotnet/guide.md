---
title: .NET SDK Guide
description: Learn how to integrate the Replane .NET SDK with ASP.NET Core, dependency injection, testing patterns with InMemoryReplaneClient, and production best practices.
sidebar_label: Guide
---

# .NET SDK Guide

Testing, ASP.NET Core integration, and best practices for the .NET SDK.

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
```

## Debug logging

Enable debug logging to troubleshoot:

```csharp
var replane = new ReplaneClient(new ReplaneClientOptions
{
    Debug = true
});

await replane.ConnectAsync(new ConnectOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key"
});
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
    Logger = new MyLogger()
});
```

## ASP.NET Core integration

Both `ReplaneClient` and `InMemoryReplaneClient` implement the `IReplaneClient` interface, making it easy to swap implementations for testing or use with dependency injection.

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Register Replane client as the interface
var replaneClient = new ReplaneClient();
builder.Services.AddSingleton<IReplaneClient>(replaneClient);

var app = builder.Build();

// Connect on startup
await replaneClient.ConnectAsync(new ConnectOptions
{
    BaseUrl = builder.Configuration["Replane:BaseUrl"]!,
    SdkKey = builder.Configuration["Replane:SdkKey"]!
});

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
await using var replane = new ReplaneClient();
await replane.ConnectAsync(new ConnectOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key"
});
// Client is disposed when scope exits
```

### Use defaults for resilience

```csharp
var replane = new ReplaneClient(new ReplaneClientOptions
{
    Defaults = new Dictionary<string, object?>
    {
        ["feature-flag"] = false,
        ["rate-limit"] = 100
    }
});

await replane.ConnectAsync(new ConnectOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = "your-sdk-key"
});
```

### Register as interface in DI

```csharp
// Register as interface for easy testing
var replaneClient = new ReplaneClient();
builder.Services.AddSingleton<IReplaneClient>(replaneClient);

// Connect after building the app
var app = builder.Build();
await replaneClient.ConnectAsync(new ConnectOptions
{
    BaseUrl = "...",
    SdkKey = "..."
});
```
