import { Users, Building2, Layers, Settings, Shield, Gauge, Zap, Eye, Rocket } from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'Multi-Tenant Settings',
  title: 'Per-customer configuration',
  subtitle: 'Different limits, features, and settings for each tenant',
  description:
    'Manage customer-specific configurations centrally. Adjust rate limits, enable premium features, or customize behavior per tenant—all without code changes.',
  accentColor: 'sky',

  painPoints: [
    {
      title: 'Hardcoded tenant logic',
      description: 'Customer-specific settings scattered across code. Changes require deploys.'
    },
    {
      title: 'Database-driven complexity',
      description: 'Tenant configs in database require cache invalidation and schema migrations.'
    },
    {
      title: 'No central visibility',
      description: "Can't easily see or compare settings across tenants. Debugging is painful."
    },
    {
      title: 'Slow onboarding',
      description: 'Setting up new enterprise customers requires engineering involvement.'
    }
  ],
  solutions: [
    {
      title: 'Config-driven tenancy',
      description: 'Define base config with tenant-specific overrides. No code changes needed.'
    },
    {
      title: 'Instant updates',
      description: 'Change tenant limits and see effects immediately. No cache invalidation.'
    },
    {
      title: 'Central dashboard',
      description: 'See and compare all tenant configs in one place. Full visibility.'
    },
    {
      title: 'Self-service setup',
      description: 'Customer success can configure new tenants without engineering.'
    }
  ],

  features: [
    { title: 'Unlimited Tenants', description: 'No limit on customers or accounts', icon: <Users className='h-6 w-6' /> },
    { title: 'Instant Updates', description: 'Changes apply in under a second', icon: <Zap className='h-6 w-6' /> },
    { title: 'Full Visibility', description: 'All configs in one dashboard', icon: <Eye className='h-6 w-6' /> },
    { title: 'No Deploys', description: 'No code changes needed', icon: <Rocket className='h-6 w-6' /> }
  ],

  steps: [
    {
      title: 'Define base config',
      description:
        'Set default values that apply to all tenants. These are your baseline limits and features.',
      icon: <Layers className='h-8 w-8' />
    },
    {
      title: 'Create tenant overrides',
      description:
        'Override specific values per tenant. Premium customers get higher limits, beta testers get new features.',
      icon: <Building2 className='h-8 w-8' />
    },
    {
      title: 'Resolve at runtime',
      description:
        'SDK merges base config with tenant overrides. Your code just reads the final values.',
      icon: <Settings className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Centralized management',
      description:
        'Manage all tenant configurations from one dashboard. No scattered config files or databases.',
      icon: <Users className='h-6 w-6' />
    },
    {
      title: 'Instant updates',
      description:
        "Change a tenant's limits and see it take effect immediately. No deploy required.",
      icon: <Gauge className='h-6 w-6' />
    },
    {
      title: 'Audit trail',
      description:
        'Full history of who changed what for which tenant. Perfect for enterprise compliance.',
      icon: <Shield className='h-6 w-6' />
    }
  ],

  faq: [
    {
      question: 'How do tenant overrides work?',
      answer:
        "Use Replane's override rules with context. Pass the tenant ID in your evaluation context, and set up override rules that match specific tenants. The SDK automatically resolves the correct value."
    },
    {
      question: 'Can I have different config schemas per tenant?',
      answer:
        'All tenants share the same config schema (base config), but can have different values. If a tenant needs a completely different config structure, create a separate Replane project for them.'
    },
    {
      question: 'How do I migrate existing tenant configs to Replane?',
      answer:
        'Export your current tenant configs, create matching configs in Replane with override rules for each tenant. Then update your code to read from Replane instead of your database or config files.'
    },
    {
      question: 'Can non-engineers manage tenant configs?',
      answer:
        'Yes! Customer success, sales, or account managers can adjust tenant configs directly in the dashboard. Role-based access control lets you define who can modify which configs.'
    },
    {
      question: 'What about performance with many tenants?',
      answer:
        'Configs are cached locally in the SDK. Tenant resolution happens in your application, not on our servers. There is zero additional latency per tenant, regardless of how many tenants you have.'
    }
  ],

  relatedUseCases: [
    {
      title: 'Feature Flags',
      description: 'Enable features for specific tenants or plans.',
      href: '/use-cases/feature-flags',
      accentColor: 'blue'
    },
    {
      title: 'Operational Tuning',
      description: 'Adjust rate limits and quotas per tenant.',
      href: '/use-cases/operational-tuning',
      accentColor: 'violet'
    },
    {
      title: 'A/B Testing',
      description: 'Run experiments on specific tenant segments.',
      href: '/use-cases/ab-testing',
      accentColor: 'amber'
    }
  ],

  codeExamples: [
    {
      sdk: 'typescript',
      label: 'TypeScript',
      docsLink: '/docs/sdk/javascript',
      code: `import { Replane } from '@replanejs/sdk'

interface Configs {
  'api-rate-limit': number
  'storage-limit-gb': number
  'feature-advanced-analytics': boolean
  'feature-custom-branding': boolean
}

const replane = new Replane<Configs>()

await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

// Get tenant-specific config using context
function getTenantLimits(tenantId: string) {
  return {
    rateLimit: replane.get('api-rate-limit', {
      context: { tenantId }
    }),
    storageLimit: replane.get('storage-limit-gb', {
      context: { tenantId }
    }),
    advancedAnalytics: replane.get('feature-advanced-analytics', {
      context: { tenantId }
    })
  }
}

// Use in request handling
app.use((req, res, next) => {
  const tenantId = req.headers['x-tenant-id']
  const limits = getTenantLimits(tenantId)
  
  // Apply tenant-specific rate limit
  if (rateLimiter.isLimited(tenantId, limits.rateLimit)) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded',
      limit: limits.rateLimit
    })
  }
  
  req.tenantLimits = limits
  next()
})`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { useConfig } from '@replanejs/react'
import { useTenant } from './auth'

function useTenantConfig<T>(configName: string) {
  const { tenantId } = useTenant()
  
  // Pass tenant context for override evaluation
  return useConfig<T>(configName, {
    context: { tenantId }
  })
}

function FeatureList() {
  const rateLimit = useTenantConfig<number>('api-rate-limit')
  const storageLimit = useTenantConfig<number>('storage-limit-gb')
  const advancedAnalytics = useTenantConfig<boolean>('feature-advanced-analytics')
  const customBranding = useTenantConfig<boolean>('feature-custom-branding')

  return (
    <div>
      <h2>Your Plan Features</h2>
      <ul>
        <li>API Rate Limit: {rateLimit}/min</li>
        <li>Storage: {storageLimit}GB</li>
        <li>
          Advanced Analytics: 
          {advancedAnalytics ? '✓' : '✗'}
        </li>
        <li>
          Custom Branding: 
          {customBranding ? '✓' : '✗'}
        </li>
      </ul>
    </div>
  )
}`
    },
    {
      sdk: 'nextjs',
      label: 'Next.js',
      docsLink: '/docs/sdk/nextjs',
      code: `// lib/tenant-config.ts
import { getReplaneSnapshot } from '@replanejs/next'

export async function getTenantConfig(tenantId: string) {
  const snapshot = await getReplaneSnapshot({
    connection: {
      baseUrl: process.env.REPLANE_BASE_URL!,
      sdkKey: process.env.REPLANE_SDK_KEY!
    }
  })
  
  const context = { tenantId }
  
  return {
    rateLimit: snapshot.get('api-rate-limit', { context }),
    uploadSizeMb: snapshot.get('max-upload-size-mb', { context }),
    advancedAnalytics: snapshot.get('feature-advanced-analytics', { context })
  }
}

// app/api/upload/route.ts
import { getTenantConfig } from '@/lib/tenant-config'

export async function POST(request: Request) {
  const tenantId = request.headers.get('x-tenant-id')
  const config = await getTenantConfig(tenantId)

  // Use tenant-specific limits
  const maxSize = config.uploadSizeMb * 1024 * 1024

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (file.size > maxSize) {
    return Response.json({
      error: \`File exceeds your plan limit of \${config.uploadSizeMb}MB\`
    }, { status: 413 })
  }

  // Process with tenant config...
  return Response.json({ success: true })
}`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'
  import { tenant } from './auth'

  // Get tenant-specific configs with context
  $: tenantContext = { tenantId: $tenant.id }
  
  const rateLimit = config<number>('api-rate-limit', { 
    context: tenantContext 
  })
  const storageLimit = config<number>('storage-limit-gb', { 
    context: tenantContext 
  })
  const advancedAnalytics = config<boolean>('feature-advanced-analytics', { 
    context: tenantContext 
  })
</script>

<div class="plan-features">
  <h2>Your Plan</h2>
  <ul>
    <li>API Limit: {$rateLimit}/min</li>
    <li>Storage: {$storageLimit}GB</li>
    {#if $advancedAnalytics}
      <li>✓ Advanced Analytics</li>
    {/if}
  </ul>
</div>`
    },
    {
      sdk: 'python',
      label: 'Python',
      docsLink: '/docs/sdk/python',
      code: `from replane import Replane
from fastapi import FastAPI, Request, HTTPException
import os

app = FastAPI()

replane = Replane(
    base_url=os.environ["REPLANE_BASE_URL"],
    sdk_key=os.environ["REPLANE_SDK_KEY"]
)

def get_tenant_config(tenant_id: str) -> dict:
    context = {"tenant_id": tenant_id}
    
    return {
        "rate_limit": replane.get("api-rate-limit", context=context),
        "storage_limit": replane.get("storage-limit-gb", context=context),
        "upload_size_mb": replane.get("max-upload-size-mb", context=context),
    }

@app.middleware("http")
async def tenant_middleware(request: Request, call_next):
    tenant_id = request.headers.get("x-tenant-id")
    request.state.tenant_config = get_tenant_config(tenant_id)
    return await call_next(request)

@app.post("/api/upload")
async def upload(request: Request, file: UploadFile):
    config = request.state.tenant_config
    max_size = config["upload_size_mb"] * 1024 * 1024
    
    if file.size > max_size:
        raise HTTPException(
            413, 
            f"Exceeds your plan limit of {config['upload_size_mb']}MB"
        )
    
    return {"success": True}`
    },
    {
      sdk: 'csharp',
      label: '.NET',
      docsLink: '/docs/sdk/dotnet',
      code: `using Replane;

public class TenantConfigService
{
    private readonly IReplaneClient _replane;

    public TenantConfigService(IReplaneClient replane)
    {
        _replane = replane;
    }

    public TenantConfig GetTenantConfig(string tenantId)
    {
        var context = new ReplaneContext { ["tenantId"] = tenantId };
        
        return new TenantConfig
        {
            ApiRateLimit = _replane.Get<int>("api-rate-limit", context),
            StorageLimitGb = _replane.Get<int>("storage-limit-gb", context),
            AdvancedAnalytics = _replane.Get<bool>("feature-advanced-analytics", context)
        };
    }
}

// Usage in controller
[HttpPost("api/upload")]
public async Task<IActionResult> Upload(
    [FromHeader(Name = "x-tenant-id")] string tenantId,
    IFormFile file)
{
    var config = _tenantService.GetTenantConfig(tenantId);
    var maxSize = config.StorageLimitGb * 1024 * 1024 * 1024;
    
    if (file.Length > maxSize)
    {
        return StatusCode(413, "Exceeds plan limit");
    }
    
    return Ok();
}`
    }
  ]
}

export default function MultiTenantPage() {
  return <UseCaseLayout {...content} />
}
