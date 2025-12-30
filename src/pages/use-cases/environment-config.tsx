import { Server, Layers, Lock, RefreshCw, GitBranch, Eye, Zap, History } from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'Environment Config',
  title: 'Dynamic runtime configuration',
  subtitle: 'Manage application settings that change across environments',
  description:
    'Centralize runtime configuration like API endpoints, feature flags, rate limits, and operational parameters. Update settings instantly without deployments. For secrets, use a dedicated secrets manager.',
  accentColor: 'indigo',

  painPoints: [
    {
      title: 'Hardcoded settings',
      description: 'Timeouts, limits, and URLs baked into code. Changes need deploys.'
    },
    {
      title: 'Environment drift',
      description: 'Dev and prod configs diverge. Bugs from config mismatches.'
    },
    {
      title: 'No visibility',
      description: "What config is running where? No central view or history."
    },
    {
      title: 'Slow changes',
      description: 'Tuning a rate limit means a new release. Too slow for operations.'
    }
  ],
  solutions: [
    {
      title: 'Centralized dashboard',
      description: 'All environments visible in one place. Clear and organized.'
    },
    {
      title: 'Instant updates',
      description: 'Change config values in seconds. No restart or deploy needed.'
    },
    {
      title: 'Full audit trail',
      description: 'Every change logged with author and timestamp.'
    },
    {
      title: 'Environment isolation',
      description: 'Per-environment values with separate access controls.'
    }
  ],

  features: [
    { title: 'Live Updates', description: 'Config changes apply in seconds', icon: <Zap className='h-6 w-6' /> },
    { title: 'Full History', description: 'Complete audit trail for every change', icon: <History className='h-6 w-6' /> },
    { title: 'Multi-Environment', description: 'Dev, staging, prod with one config', icon: <Server className='h-6 w-6' /> },
    { title: 'Access Control', description: 'Role-based permissions per environment', icon: <Lock className='h-6 w-6' /> }
  ],

  steps: [
    {
      title: 'Identify runtime configs',
      description:
        'Find settings that vary by environment: API URLs, timeouts, rate limits, feature flags, log levels.',
      icon: <Layers className='h-8 w-8' />
    },
    {
      title: 'Create configs per environment',
      description:
        'Define base values with environment-specific overrides. Each environment gets its own SDK key.',
      icon: <Server className='h-8 w-8' />
    },
    {
      title: 'Deploy once, tune anywhere',
      description:
        'Same code runs everywhere. Adjust operational parameters from the dashboard.',
      icon: <GitBranch className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Operational agility',
      description:
        'Tune rate limits, timeouts, and thresholds without code changes or deploys.',
      icon: <RefreshCw className='h-6 w-6' />
    },
    {
      title: 'Clear visibility',
      description:
        'See exactly what config each environment is running. Compare across envs.',
      icon: <Eye className='h-6 w-6' />
    },
    {
      title: 'Safe and audited',
      description:
        'Role-based access control. Full history of who changed what and when.',
      icon: <Lock className='h-6 w-6' />
    }
  ],

  faq: [
    {
      question: 'What should I store in Replane?',
      answer:
        'Runtime configuration that varies by environment: API endpoints, feature flags, rate limits, cache TTLs, log levels, retry counts, timeout values, UI settings, and operational parameters. Things you want to change without redeploying.'
    },
    {
      question: 'What about secrets like API keys and passwords?',
      answer:
        'Don\'t store secrets in Replane. Use a dedicated secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.) for sensitive credentials. Replane is for configuration, not secrets management.'
    },
    {
      question: 'Can different environments share configs?',
      answer:
        'Yes! Define a base config with environment-specific overrides. Common values are shared, only differences are per-environment. This prevents config drift while allowing flexibility.'
    },
    {
      question: 'How do I prevent accidental production changes?',
      answer:
        'Use role-based access control. Each environment has its own SDK key and access controls. Enable approval workflows for production changes to require review before applying.'
    },
    {
      question: 'How quickly do config changes take effect?',
      answer:
        'Changes propagate in real-time via Server-Sent Events. Your application receives updates within seconds. Use the subscribe API to react to changes immediately.'
    }
  ],

  relatedUseCases: [
    {
      title: 'Operational Tuning',
      description: 'Adjust runtime parameters per environment.',
      href: '/use-cases/operational-tuning',
      accentColor: 'violet'
    },
    {
      title: 'Feature Flags',
      description: 'Control features across environments.',
      href: '/use-cases/feature-flags',
      accentColor: 'blue'
    },
    {
      title: 'Instant Rollback',
      description: 'Revert config changes quickly.',
      href: '/use-cases/instant-rollback',
      accentColor: 'emerald'
    }
  ],

  codeExamples: [
    {
      sdk: 'typescript',
      label: 'TypeScript',
      docsLink: '/docs/sdk/javascript',
      code: `import { Replane } from '@replanejs/sdk'

interface Configs {
  'api-base-url': string
  'request-timeout-ms': number
  'max-retries': number
  'rate-limit-per-minute': number
  'log-level': 'debug' | 'info' | 'warn' | 'error'
  'cache-ttl-seconds': number
}

const replane = new Replane<Configs>()

// SDK key determines which environment config to load
await replane.connect({
  baseUrl: process.env.REPLANE_BASE_URL,
  sdkKey: process.env.REPLANE_SDK_KEY  // Different key per env
})

// Runtime config that can be tuned without deploys
const apiClient = new ApiClient({
  baseUrl: replane.get('api-base-url'),
  timeout: replane.get('request-timeout-ms'),
  maxRetries: replane.get('max-retries')
})

const rateLimiter = new RateLimiter({
  maxRequests: replane.get('rate-limit-per-minute'),
  window: 60_000
})

// React to config changes in real-time
replane.subscribe('log-level', (c) => {
  logger.setLevel(c.value)
  logger.info('Log level changed to:', c.value)
})

replane.subscribe('rate-limit-per-minute', (c) => {
  rateLimiter.setLimit(c.value)
})`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { useConfig } from '@replanejs/react'

function AppSettings() {
  // Runtime config values
  const apiBaseUrl = useConfig<string>('api-base-url')
  const maxUploadSizeMb = useConfig<number>('max-upload-size-mb')
  const supportedLocales = useConfig<string[]>('supported-locales')
  const maintenanceMode = useConfig<boolean>('maintenance-mode')

  if (maintenanceMode) {
    return <MaintenancePage />
  }

  return (
    <AppContext.Provider value={{
      apiBaseUrl,
      maxUploadSizeMb,
      supportedLocales
    }}>
      <App />
    </AppContext.Provider>
  )
}

// Provider uses environment-specific SDK key
function Root() {
  return (
    <ReplaneProvider
      connection={{
        baseUrl: import.meta.env.VITE_REPLANE_BASE_URL,
        sdkKey: import.meta.env.VITE_REPLANE_SDK_KEY
      }}
    >
      <AppSettings />
    </ReplaneProvider>
  )
}`
    },
    {
      sdk: 'nextjs',
      label: 'Next.js',
      docsLink: '/docs/sdk/nextjs',
      code: `// lib/config.ts
import { getReplaneSnapshot } from '@replanejs/next'

export async function getRuntimeConfig() {
  const snapshot = await getReplaneSnapshot({
    connection: {
      baseUrl: process.env.REPLANE_BASE_URL!,
      sdkKey: process.env.REPLANE_SDK_KEY!
    }
  })
  
  return {
    apiBaseUrl: snapshot.get('api-base-url'),
    requestTimeoutMs: snapshot.get('request-timeout-ms'),
    maxRetries: snapshot.get('max-retries'),
    cacheTtlSeconds: snapshot.get('cache-ttl-seconds'),
    maintenanceMode: snapshot.get('maintenance-mode')
  }
}

// app/api/data/route.ts
import { getRuntimeConfig } from '@/lib/config'

export async function GET() {
  const config = await getRuntimeConfig()
  
  if (config.maintenanceMode) {
    return Response.json({ error: 'Service unavailable' }, { status: 503 })
  }

  const response = await fetch(config.apiBaseUrl + '/data', {
    signal: AbortSignal.timeout(config.requestTimeoutMs)
  })

  return Response.json(await response.json())
}`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'

  // Runtime config values - update without deploys
  const apiBaseUrl = config<string>('api-base-url')
  const requestTimeoutMs = config<number>('request-timeout-ms')
  const maintenanceMode = config<boolean>('maintenance-mode')

  async function fetchData(endpoint: string) {
    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(),
      $requestTimeoutMs
    )
    
    try {
      const response = await fetch(\`\${$apiBaseUrl}\${endpoint}\`, {
        signal: controller.signal
      })
      return response.json()
    } finally {
      clearTimeout(timeoutId)
    }
  }
</script>

{#if $maintenanceMode}
  <MaintenancePage />
{:else}
  <slot />
{/if}`
    },
    {
      sdk: 'python',
      label: 'Python',
      docsLink: '/docs/sdk/python',
      code: `from replane import Replane
import os
import logging

replane = Replane(
    base_url=os.environ["REPLANE_BASE_URL"],
    sdk_key=os.environ["REPLANE_SDK_KEY"]
)

# Runtime config - tune without redeploying
api_base_url = replane.get("api-base-url")
request_timeout = replane.get("request-timeout-seconds")
max_retries = replane.get("max-retries")
rate_limit = replane.get("rate-limit-per-minute")
log_level = replane.get("log-level")

# Initialize with tunable config
logging.basicConfig(level=getattr(logging, log_level.upper()))
logger = logging.getLogger(__name__)

http_client = HttpClient(
    base_url=api_base_url,
    timeout=request_timeout,
    max_retries=max_retries
)

# React to config changes in real-time
def on_log_level_change(config):
    logging.getLogger().setLevel(
        getattr(logging, config.value.upper())
    )
    logger.info(f"Log level updated to: {config.value}")

replane.subscribe_config("log-level", on_log_level_change)`
    },
    {
      sdk: 'csharp',
      label: '.NET',
      docsLink: '/docs/sdk/dotnet',
      code: `using Replane;

public class RuntimeConfig
{
    private readonly IReplaneClient _replane;

    public RuntimeConfig(IReplaneClient replane)
    {
        _replane = replane;
    }

    // Tunable config - change from dashboard
    public string ApiBaseUrl => _replane.Get<string>("api-base-url");
    public int RequestTimeoutMs => _replane.Get<int>("request-timeout-ms");
    public int MaxRetries => _replane.Get<int>("max-retries");
    public int RateLimitPerMinute => _replane.Get<int>("rate-limit-per-minute");
    public int CacheTtlSeconds => _replane.Get<int>("cache-ttl-seconds");
    public bool MaintenanceMode => _replane.Get<bool>("maintenance-mode");
}

// In Program.cs
var replane = new ReplaneClient();
await replane.ConnectAsync(new ConnectOptions
{
    BaseUrl = Environment.GetEnvironmentVariable("REPLANE_BASE_URL"),
    SdkKey = Environment.GetEnvironmentVariable("REPLANE_SDK_KEY")
});

builder.Services.AddSingleton(new RuntimeConfig(replane));

// Tune rate limits, timeouts etc. from the dashboard
// No code changes or deploys needed`
    }
  ]
}

export default function EnvironmentConfigPage() {
  return <UseCaseLayout {...content} />
}
