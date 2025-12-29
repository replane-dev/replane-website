import { Server, Layers, Lock, RefreshCw, GitBranch, Eye, Zap, History } from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'Environment Config',
  title: 'Centralized environment settings',
  subtitle: 'Replace scattered .env files with live configuration',
  description:
    'Stop managing dozens of .env files across environments. Centralize configuration in Replane with instant updates, version history, and role-based access control.',
  accentColor: 'indigo',

  painPoints: [
    {
      title: 'Scattered .env files',
      description: 'Config files on every server. Hard to track what is where.'
    },
    {
      title: 'Sync problems',
      description: 'Dev, staging, and prod configs drift. Bugs from config mismatches.'
    },
    {
      title: 'No version history',
      description: "Who changed what? When? No way to know or rollback."
    },
    {
      title: 'Restart required',
      description: 'Config changes need a restart. Downtime for every update.'
    }
  ],
  solutions: [
    {
      title: 'Centralized configs',
      description: 'All environments in one dashboard. Clear visibility.'
    },
    {
      title: 'Environment isolation',
      description: 'Native multi-environment support with per-environment values and access control.'
    },
    {
      title: 'Full audit trail',
      description: 'Every change logged with author and timestamp.'
    },
    {
      title: 'Live updates',
      description: 'Config changes apply immediately. No restart needed.'
    }
  ],

  features: [
    { title: 'Unified Dashboard', description: 'Manage all environments from one place', icon: <Layers className='h-6 w-6' /> },
    { title: 'Live Updates', description: 'No restarts needed for config changes', icon: <Zap className='h-6 w-6' /> },
    { title: 'Full History', description: 'Complete change history with audit trail', icon: <History className='h-6 w-6' /> },
    { title: 'Unlimited Environments', description: 'Dev, staging, prod, and any custom env', icon: <Server className='h-6 w-6' /> }
  ],

  steps: [
    {
      title: 'Migrate from .env',
      description:
        'Import your existing environment variables into Replane. Keep the same names for easy migration.',
      icon: <Layers className='h-8 w-8' />
    },
    {
      title: 'Configure per environment',
      description:
        'Use separate SDK keys or override rules to serve different values per environment.',
      icon: <Server className='h-8 w-8' />
    },
    {
      title: 'Deploy once, configure anywhere',
      description:
        'Same code runs everywhere. Replane provides the right config for each environment.',
      icon: <GitBranch className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Single source of truth',
      description:
        'All config in one place. No more hunting through servers for .env files.',
      icon: <Eye className='h-6 w-6' />
    },
    {
      title: 'Secure by default',
      description:
        'Role-based access control. Audit logs for compliance. Encrypted at rest.',
      icon: <Lock className='h-6 w-6' />
    },
    {
      title: 'Instant rollback',
      description:
        'Every change is versioned. Revert to any previous state with one click.',
      icon: <RefreshCw className='h-6 w-6' />
    }
  ],

  faq: [
    {
      question: 'How do I migrate from .env files?',
      answer:
        'Create matching configs in Replane for each .env variable. Update your code to read from Replane instead of process.env. You can do this gradually—read from Replane with .env as fallback.'
    },
    {
      question: 'How do I handle secrets?',
      answer:
        'Replane encrypts all config values at rest. For highly sensitive secrets like database passwords, consider using a dedicated secrets manager and storing only the reference in Replane.'
    },
    {
      question: 'Can different environments share configs?',
      answer:
        'Yes! Use a base config with environment-specific overrides. Common values are shared, only differences are environment-specific. This prevents config drift.'
    },
    {
      question: 'How do I prevent accidental production changes?',
      answer:
        'Use role-based access control to restrict who can modify production configs. Each environment has its own SDK key and access controls. Require approval workflows for production changes.'
    },
    {
      question: 'What about configs that require a restart?',
      answer:
        'Most configs can be updated at runtime with our subscribe API. For configs that truly need a restart (like port numbers), trigger a rolling restart after updating. Replane pushes updates; your code decides how to apply them.'
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
      title: 'Multi-Tenant',
      description: 'Different configs for different customers.',
      href: '/use-cases/multi-tenant',
      accentColor: 'sky'
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
  'database-url': string
  'redis-url': string
  'log-level': 'debug' | 'info' | 'warn' | 'error'
  'feature-debug-mode': boolean
}

const replane = new Replane<Configs>()

// SDK key determines which environment config to load
await replane.connect({
  baseUrl: process.env.REPLANE_BASE_URL,
  sdkKey: process.env.REPLANE_SDK_KEY  // Different key per env
})

// Same code, different config values per environment
const config = {
  apiBaseUrl: replane.get('api-base-url'),
  databaseUrl: replane.get('database-url'),
  redisUrl: replane.get('redis-url'),
  logLevel: replane.get('log-level'),
  debugMode: replane.get('feature-debug-mode')
}

// Initialize services with config
const db = new Database(config.databaseUrl)
const redis = new Redis(config.redisUrl)
const logger = new Logger({ level: config.logLevel })

// React to config changes (e.g., log level)
replane.subscribe('log-level', (c) => {
  logger.setLevel(c.value)
  logger.info('Log level changed to:', c.value)
})`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { useConfig } from '@replanejs/react'

function ApiClient() {
  // Environment-specific API URL
  const apiBaseUrl = useConfig<string>('api-base-url')
  const debugMode = useConfig<boolean>('feature-debug-mode')

  const fetchData = async (endpoint: string) => {
    const url = \`\${apiBaseUrl}\${endpoint}\`
    
    if (debugMode) {
      console.log('Fetching:', url)
    }
    
    const response = await fetch(url)
    return response.json()
  }

  return { fetchData }
}

// In your provider, use environment-specific SDK key
function App() {
  return (
    <ReplaneProvider
      connection={{
        baseUrl: process.env.REACT_APP_REPLANE_BASE_URL,
        sdkKey: process.env.REACT_APP_REPLANE_SDK_KEY
      }}
    >
      <MyApp />
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

export async function getEnvConfig() {
  // SDK key from env determines which config to load
  const snapshot = await getReplaneSnapshot({
    connection: {
      baseUrl: process.env.REPLANE_BASE_URL!,
      sdkKey: process.env.REPLANE_SDK_KEY!
    }
  })
  
  return {
    apiBaseUrl: snapshot.get('api-base-url'),
    databaseUrl: snapshot.get('database-url'),
    logLevel: snapshot.get('log-level'),
    debugMode: snapshot.get('feature-debug-mode')
  }
}

// app/api/data/route.ts
import { getEnvConfig } from '@/lib/config'

export async function GET() {
  const config = await getEnvConfig()
  
  // Use environment-specific database URL
  const db = new Database(config.databaseUrl)
  const data = await db.query('SELECT * FROM items')

  return Response.json(data)
}

// Same code deploys to all environments
// Replane provides correct config based on SDK key`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'

  // Environment-specific values
  const apiBaseUrl = config<string>('api-base-url')
  const debugMode = config<boolean>('feature-debug-mode')

  async function fetchData(endpoint: string) {
    const url = \`\${$apiBaseUrl}\${endpoint}\`
    
    if ($debugMode) {
      console.log('Fetching:', url)
    }
    
    const response = await fetch(url)
    return response.json()
  }
</script>

<!-- Root layout uses env-specific SDK key -->
<script context="module">
  import { ReplaneContext } from '@replanejs/svelte'
</script>

<ReplaneContext connection={{
  baseUrl: import.meta.env.VITE_REPLANE_BASE_URL,
  sdkKey: import.meta.env.VITE_REPLANE_SDK_KEY
}}>
  <slot />
</ReplaneContext>`
    },
    {
      sdk: 'python',
      label: 'Python',
      docsLink: '/docs/sdk/python',
      code: `from replane import Replane
import os
import logging

# SDK key from environment determines which config to load
replane = Replane(
    base_url=os.environ["REPLANE_BASE_URL"],
    sdk_key=os.environ["REPLANE_SDK_KEY"]  # Different per env
)

# Get environment-specific config
api_base_url = replane.get("api-base-url")
database_url = replane.get("database-url")
redis_url = replane.get("redis-url")
log_level = replane.get("log-level")

# Initialize with config values
logging.basicConfig(level=getattr(logging, log_level.upper()))
logger = logging.getLogger(__name__)

# React to config changes
def on_log_level_change(config):
    logging.getLogger().setLevel(
        getattr(logging, config.value.upper())
    )
    logger.info(f"Log level changed to: {config.value}")

replane.subscribe_config("log-level", on_log_level_change)

# Same code runs in dev, staging, prod
# Replane provides the right config for each`
    },
    {
      sdk: 'csharp',
      label: '.NET',
      docsLink: '/docs/sdk/dotnet',
      code: `using Replane;
using Microsoft.Extensions.Logging;

public class ConfigService
{
    private readonly IReplaneClient _replane;
    private readonly ILogger _logger;

    public ConfigService(IReplaneClient replane, ILogger<ConfigService> logger)
    {
        _replane = replane;
        _logger = logger;
    }

    public EnvironmentConfig GetConfig()
    {
        // SDK key from env determines which config loads
        return new EnvironmentConfig
        {
            ApiBaseUrl = _replane.Get<string>("api-base-url"),
            DatabaseUrl = _replane.Get<string>("database-url"),
            RedisUrl = _replane.Get<string>("redis-url"),
            LogLevel = _replane.Get<string>("log-level"),
            DebugMode = _replane.Get<bool>("feature-debug-mode")
        };
    }
}

// In Program.cs
var replane = new ReplaneClient();
await replane.ConnectAsync(new ConnectOptions
{
    BaseUrl = Environment.GetEnvironmentVariable("REPLANE_BASE_URL"),
    SdkKey = Environment.GetEnvironmentVariable("REPLANE_SDK_KEY")
});

builder.Services.AddSingleton<IReplaneClient>(replane);

// Same code deploys everywhere
// SDK key determines which environment config to use`
    }
  ]
}

export default function EnvironmentConfigPage() {
  return <UseCaseLayout {...content} />
}
