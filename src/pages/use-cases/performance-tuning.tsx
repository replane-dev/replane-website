import { Gauge, TrendingUp, Timer, Zap, RefreshCw, Activity, Rocket, RotateCcw } from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'Performance Tuning',
  title: 'Optimize in real-time',
  subtitle: 'Fine-tune caches, pools, and timeouts without deploys',
  description:
    'Adjust cache durations, connection pools, retry policies, and timeouts on the fly. Respond to performance issues instantly without waiting for deploys.',
  accentColor: 'orange',

  painPoints: [
    {
      title: 'Guessing at values',
      description: 'Cache TTLs and pool sizes are hardcoded. Changing them requires a deploy.'
    },
    {
      title: 'Slow iteration',
      description: 'Testing performance tweaks takes hours with deploy cycles.'
    },
    {
      title: "Can't respond to incidents",
      description: 'Database slow? You have to deploy to increase timeouts.'
    },
    {
      title: 'One-size-fits-all',
      description: "Same values for dev and prod. Can't tune per environment."
    }
  ],
  solutions: [
    {
      title: 'Live tuning',
      description: 'Change values and see immediate impact. Iterate in minutes, not hours.'
    },
    {
      title: 'Respond instantly',
      description: 'Database slow? Increase timeouts immediately. No deploy needed.'
    },
    {
      title: 'Environment-specific',
      description: 'Different values for dev, staging, prod. Same code, different configs.'
    },
    {
      title: 'Safe experimentation',
      description: 'Every change is versioned. Made things worse? Rollback instantly.'
    }
  ],

  features: [
    {
      title: 'Instant Apply',
      description: 'Changes take effect in under a second',
      icon: <Zap className='h-6 w-6' />
    },
    {
      title: 'No Deploys',
      description: 'Tune performance without code changes',
      icon: <Rocket className='h-6 w-6' />
    },
    {
      title: 'Unlimited Iterations',
      description: 'Tune parameters as often as needed',
      icon: <RefreshCw className='h-6 w-6' />
    },
    {
      title: 'Instant Rollback',
      description: 'Revert any change with one click',
      icon: <RotateCcw className='h-6 w-6' />
    }
  ],

  steps: [
    {
      title: 'Monitor under load',
      description:
        "Watch your application's performance. Identify bottlenecks and opportunities for optimization.",
      icon: <Gauge className='h-8 w-8' />
    },
    {
      title: 'Tune in real-time',
      description: 'Adjust values and see immediate impact. Iterate quickly without deploy cycles.',
      icon: <TrendingUp className='h-8 w-8' />
    },
    {
      title: 'Lock in improvements',
      description: 'Found the sweet spot? Values persist until you change them again.',
      icon: <Timer className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Instant feedback',
      description: 'Change a value, see the effect immediately. Iterate in minutes, not hours.',
      icon: <Zap className='h-6 w-6' />
    },
    {
      title: 'Respond to load',
      description: 'Traffic spike? Increase connection pools and reduce cache TTLs on the fly.',
      icon: <Timer className='h-6 w-6' />
    },
    {
      title: 'Safe experimentation',
      description: 'Every change is versioned. Made things worse? Rollback in one click.',
      icon: <RefreshCw className='h-6 w-6' />
    }
  ],

  faq: [
    {
      question: 'What performance parameters should I externalize?',
      answer:
        'Cache TTLs, connection pool sizes, request timeouts, retry counts, batch sizes, and queue depths. Anything you might need to adjust based on load or performance issues.'
    },
    {
      question: 'How do I update a connection pool size at runtime?',
      answer:
        'Subscribe to the config change and reinitialize the pool. Most pooling libraries support dynamic resizing. The SDK makes it easy to react to changes in real-time.'
    },
    {
      question: 'Can I A/B test performance configurations?',
      answer:
        'Yes! Use override rules to serve different configs to different request percentages. Compare the performance impact in your observability tools.'
    },
    {
      question: 'What about parameters that require restart?',
      answer:
        'Some parameters (like heap size) require a restart. For those, update the config and trigger a rolling restart. For most runtime parameters, changes apply immediately.'
    },
    {
      question: 'How do I coordinate changes across instances?',
      answer:
        'Replane pushes updates to all connected clients simultaneously via SSE. All instances receive new values at the same time, ensuring consistent behavior.'
    }
  ],

  relatedUseCases: [
    {
      title: 'Operational Tuning',
      description: 'Adjust rate limits and system parameters.',
      href: '/use-cases/operational-tuning',
      accentColor: 'violet'
    },
    {
      title: 'Instant Rollback',
      description: 'Revert performance changes instantly.',
      href: '/use-cases/instant-rollback',
      accentColor: 'emerald'
    },
    {
      title: 'Environment Config',
      description: 'Different settings per environment.',
      href: '/use-cases/environment-config',
      accentColor: 'indigo'
    }
  ],

  codeExamples: [
    {
      sdk: 'typescript',
      label: 'TypeScript',
      docsLink: '/docs/sdk/javascript',
      code: `import { Replane } from '@replanejs/sdk'
import { Pool } from 'pg'

interface Configs {
  'db-pool-size': number
  'db-timeout-ms': number
  'cache-ttl-seconds': number
  'max-retries': number
}

const replane = new Replane<Configs>()

await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

// Initialize pool with configurable size
let pool = new Pool({
  max: replane.get('db-pool-size'),
  idleTimeoutMillis: replane.get('db-timeout-ms')
})

// Resize pool when config changes
replane.subscribe('db-pool-size', async (config) => {
  console.log('Resizing pool to:', config.value)
  await pool.end()
  pool = new Pool({
    max: config.value,
    idleTimeoutMillis: replane.get('db-timeout-ms')
  })
})

// Use configurable timeouts and retries
async function fetchWithRetry(fn: () => Promise<any>) {
  const maxRetries = replane.get('max-retries')
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (err) {
      if (i === maxRetries - 1) throw err
    }
  }
}`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { useConfig } from '@replanejs/react'

function OptimizedDataLoader({ id }) {
  // Configurable fetch behavior
  const timeoutMs = useConfig<number>('api-timeout-ms')
  const cacheTtl = useConfig<number>('cache-ttl-seconds')
  const maxRetries = useConfig<number>('max-retries')
  
  const { data, error } = useSWR(
    \`/api/data/\${id}\`,
    {
      fetcher: async (url) => {
        const controller = new AbortController()
        const timeout = setTimeout(
          () => controller.abort(),
          timeoutMs
        )
        
        try {
          const res = await fetch(url, { 
            signal: controller.signal 
          })
          return res.json()
        } finally {
          clearTimeout(timeout)
        }
      },
      dedupingInterval: cacheTtl * 1000,
      errorRetryCount: maxRetries
    }
  )

  return data ? <Display data={data} /> : <Loading />
}`
    },
    {
      sdk: 'nextjs',
      label: 'Next.js',
      docsLink: '/docs/sdk/nextjs',
      code: `// lib/db.ts
import { Pool } from 'pg'
import { getReplaneSnapshot } from '@replanejs/next'

let pool: Pool | null = null

export async function getPool() {
  const snapshot = await getReplaneSnapshot({
    connection: {
      baseUrl: process.env.REPLANE_BASE_URL!,
      sdkKey: process.env.REPLANE_SDK_KEY!
    }
  })
  
  if (!pool) {
    pool = new Pool({
      max: snapshot.get('db-pool-size'),
      idleTimeoutMillis: snapshot.get('db-timeout-ms')
    })
  }
  
  return pool
}

// app/api/data/route.ts
export async function GET() {
  const snapshot = await getReplaneSnapshot({ connection })
  const cacheTtl = snapshot.get('cache-ttl-seconds')

  const pool = await getPool()
  const data = await pool.query('SELECT * FROM items')

  return Response.json(data.rows, {
    headers: {
      'Cache-Control': \`public, max-age=\${cacheTtl}\`
    }
  })
}`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'
  
  // Configurable performance parameters
  const timeoutMs = config<number>('api-timeout-ms')
  const maxRetries = config<number>('max-retries')

  async function fetchWithRetry(url: string) {
    let lastError
    
    for (let i = 0; i < $maxRetries; i++) {
      const controller = new AbortController()
      const timeout = setTimeout(
        () => controller.abort(), 
        $timeoutMs
      )
      
      try {
        const res = await fetch(url, { 
          signal: controller.signal 
        })
        return await res.json()
      } catch (err) {
        lastError = err
      } finally {
        clearTimeout(timeout)
      }
    }
    
    throw lastError
  }
</script>

<p>Timeout: {$timeoutMs}ms, Retries: {$maxRetries}</p>`
    },
    {
      sdk: 'python',
      label: 'Python',
      docsLink: '/docs/sdk/python',
      code: `from replane import Replane
import asyncpg
import os

replane = Replane(
    base_url=os.environ["REPLANE_BASE_URL"],
    sdk_key=os.environ["REPLANE_SDK_KEY"]
)

pool = None

async def get_pool():
    global pool
    
    if pool is None:
        pool = await asyncpg.create_pool(
            dsn=os.environ["DATABASE_URL"],
            min_size=2,
            max_size=replane.get("db-pool-size"),
            command_timeout=replane.get("db-timeout-ms") / 1000
        )
    
    return pool

# React to pool size changes
async def on_pool_size_change(config):
    global pool
    if pool:
        await pool.close()
        pool = None  # Will be recreated with new size

replane.subscribe_config("db-pool-size", on_pool_size_change)

# Retry logic with configurable retries
async def fetch_with_retry(fn):
    max_retries = replane.get("max-retries")
    
    for i in range(max_retries):
        try:
            return await fn()
        except Exception as e:
            if i == max_retries - 1:
                raise e`
    },
    {
      sdk: 'csharp',
      label: '.NET',
      docsLink: '/docs/sdk/dotnet',
      code: `using Replane;
using Npgsql;

public class DatabaseService
{
    private readonly IReplaneClient _replane;
    private NpgsqlDataSource? _dataSource;

    public DatabaseService(IReplaneClient replane)
    {
        _replane = replane;
        InitializePool();
        
        // React to pool size changes
        _replane.ConfigChanged += (s, e) =>
        {
            if (e.ConfigName == "db-pool-size")
            {
                ReinitializePool();
            }
        };
    }

    private void InitializePool()
    {
        var builder = new NpgsqlDataSourceBuilder(
            Environment.GetEnvironmentVariable("DATABASE_URL"));
        
        builder.ConnectionStringBuilder.MaxPoolSize = 
            _replane.Get<int>("db-pool-size");
        builder.ConnectionStringBuilder.CommandTimeout = 
            _replane.Get<int>("db-timeout-ms") / 1000;
        
        _dataSource = builder.Build();
    }

    public async Task<T> FetchWithRetryAsync<T>(
        Func<Task<T>> fn)
    {
        var maxRetries = _replane.Get<int>("max-retries");
        
        for (int i = 0; i < maxRetries; i++)
        {
            try
            {
                return await fn();
            }
            catch when (i < maxRetries - 1)
            {
                await Task.Delay(100 * (i + 1));
            }
        }
        
        throw new Exception("Max retries exceeded");
    }
}`
    }
  ]
}

export default function PerformanceTuningPage() {
  return <UseCaseLayout {...content} />
}
