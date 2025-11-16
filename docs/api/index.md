---
sidebar_position: 0
---

# API Reference

The Replane API provides programmatic access to your configuration data.

## Base URL

```
https://your-replane-host.com/api/v1
```

## Authentication

All API requests require authentication using an API key:

```http
Authorization: Bearer your-api-key-here
```

Create API keys in the Replane UI under Settings → API Keys.

## Endpoints

- [**Get Config Value**](./get-config-value) - Retrieve a configuration value by name

## Response Format

All responses are in JSON format.

### Success Response

```json
{
  "name": "feature-flags",
  "value": {
    "new-onboarding": true,
    "dark-mode": false
  }
}
```

### Error Response

```json
{
  "error": "Config not found"
}
```

## Status Codes

- `200` - Success
- `400` - Bad Request (invalid config name)
- `403` - Forbidden (invalid API key or insufficient permissions)
- `404` - Not Found (config doesn't exist)
- `500` - Internal Server Error

## Rate Limiting

Currently, there are no rate limits. This may change in future versions.

## SDKs

For easier integration, use our official SDK:

- [**JavaScript/TypeScript SDK**](../sdk/javascript)

## Next Steps

- [**Get Config Value**](./get-config-value) - View the endpoint documentation
- [**JavaScript SDK**](../sdk/javascript) - Use the SDK for easier integration
