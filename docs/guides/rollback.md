---
sidebar_position: 5
---

# Instant Rollback

When things go wrong, revert to a previous working state in seconds.

## How Version History Works

Every config change creates an immutable snapshot. You can view the complete history and revert to any previous version.

## Viewing History

In the Replane UI:

1. Navigate to your config
2. Click "Version History"
3. See all changes with timestamps and authors

Each version shows:
- **Timestamp** - When the change was made
- **Author** - Who made the change
- **Changes** - What was modified
- **Version Number** - Sequential version ID

## Rolling Back

### Via UI

1. Open Version History
2. Find the working version
3. Click "Rollback to this version"
4. Confirm the rollback

Changes propagate to all connected applications in seconds.

### Via API

```bash
curl -X POST https://your-replane-url/api/configs/{config_id}/versions/{version_id}/rollback \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Common Rollback Scenarios

### Bad Configuration Value

**Problem:** Changed rate limit from 100 to 1000, now API is overloaded

**Solution:**
1. Open `rate-limits` config
2. View history to find previous version with `100`
3. Click rollback
4. API returns to normal immediately

### Incomplete Feature Flag

**Problem:** Enabled feature flag but new feature has a critical bug

**Solution:**
```json
// Current (broken)
{ "new-checkout": true }

// Rollback to previous
{ "new-checkout": false }
```

Users immediately stop seeing the broken feature.

### Wrong Experiment Split

**Problem:** Accidentally set A/B test to 100/0 instead of 50/50

**Solution:**
Rollback to correct distribution without any users getting inconsistent experience.

## Rollback Best Practices

### Test Before Full Rollout

Start with small percentages:
- Version 1: Feature at 0%
- Version 2: Feature at 5%
- Version 3: Feature at 25%
- Issue found → Rollback to Version 1

### Document Why

Add comments when making risky changes:
```json
{
  "rate-limit": 500,
  "_comment": "Increased from 100 to handle Black Friday traffic"
}
```

### Monitor After Changes

Watch metrics for 5-10 minutes after config changes:
- Error rates
- Response times
- User complaints
- Business metrics

If something looks wrong, rollback immediately.

### Use Watchers for Realtime Updates

Ensure your app uses watchers so rollbacks propagate instantly:

```javascript
const config = client.get('rate-limits');

// Value updates automatically when you rollback
const currentLimit = config.get()['api-requests-per-minute'];
```

## Version History Retention

Replane keeps all versions indefinitely. Storage is minimal since only diffs are stored.

## Combining with Feature Flags

Use feature flags as circuit breakers:

```json
{
  "new-feature-enabled": true,
  "new-feature-circuit-breaker": false
}
```

If issues occur:
- Flip `circuit-breaker` to `true` immediately (kills feature)
- Investigate the issue
- Fix and deploy
- Flip back to `false`
- Or rollback entire config if needed

## Avoiding Rollback Needs

### Use JSON Schema Validation

Prevent invalid configs from being saved:

```json
{
  "type": "object",
  "properties": {
    "rate-limit": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10000
    }
  },
  "required": ["rate-limit"]
}
```

### Gradual Rollouts

Instead of 0% → 100%, use gradual increases:
- 0% → 1% → 5% → 10% → 25% → 50% → 100%

Catch issues when only 1% of users are affected.

### Staging Environment

Test config changes in staging before production:
1. Deploy to staging
2. Test thoroughly
3. Apply same config to production
4. Monitor closely

## Emergency Procedures

### Production is Down

1. Open Replane UI
2. Navigate to recently changed config
3. Click "Version History"
4. Identify the last working version (usually one before current)
5. Click "Rollback"
6. Confirm immediately

Apps reconnect and receive rollback in 1-5 seconds.

### Can't Access UI

Use API directly:

```bash
# List versions
curl https://your-replane-url/api/configs/{config_id}/versions \
  -H "Authorization: Bearer YOUR_API_KEY"

# Rollback to specific version
curl -X POST https://your-replane-url/api/configs/{config_id}/versions/{version_id}/rollback \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Audit Trail

Version history provides complete audit trail:
- Who changed what
- When it changed
- What the values were before and after

Essential for:
- Post-mortems
- Compliance
- Security investigations
- Understanding system behavior

## Next Steps

- [**Feature Flags**](/docs/guides/feature-flags) - Learn about feature flag basics
- [**Gradual Rollouts**](/docs/guides/gradual-rollouts) - Roll out changes safely
- [**Operational Tuning**](/docs/guides/operational-tuning) - Adjust behavior without downtime
