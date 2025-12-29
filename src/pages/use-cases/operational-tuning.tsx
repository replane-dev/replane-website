import { Settings, Gauge, Sliders, Zap, Server, RefreshCw, Eye, RotateCcw } from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'Operational Tuning',
  title: 'Tune your system live',
  subtitle: 'Adjust rate limits, cache TTLs, and batch sizes instantly',
  description:
    'Stop deploying code to change operational parameters. Adjust rate limits, cache durations, connection pools, and batch sizes in real-time without any downtime.',
  accentColor: 'violet',

  painPoints: [
    {
      title: 'Hardcoded parameters',
      description: 'Rate limits, timeouts, and batch sizes buried in code. Changes require deploys.'
    },
    {
      title: 'Slow response to load',
      description: "Traffic spike? You're stuck with current settings until you can deploy."
    },
    {
      title: 'Risky tuning',
      description: 'Every parameter change requires a full deploy. Hard to iterate quickly.'
    },
    {
      title: 'No real-time visibility',
      description: "Can't see or change operational values without code access."
    }
  ],
  solutions: [
    {
      title: 'Externalized parameters',
      description: 'Store all operational values in Replane. Change without touching code.'
    },
    {
      title: 'Instant adjustments',
      description: 'Respond to traffic spikes immediately. Changes apply in milliseconds.'
    },
    {
      title: 'Safe iteration',
      description: 'Every change is versioned. Bad setting? Rollback in one click.'
    },
    {
      title: 'Central visibility',
      description: 'See all operational parameters in one dashboard. No code diving.'
    }
  ],

  features: [
    { title: 'Instant Apply', description: 'Changes take effect in under a second', icon: <Zap className='h-6 w-6' /> },
    { title: 'Zero Downtime', description: 'No restarts or deploys required', icon: <Server className='h-6 w-6' /> },
    { title: 'Full Visibility', description: 'All parameters in one dashboard', icon: <Eye className='h-6 w-6' /> },
    { title: 'Unlimited Iterations', description: 'Tune as often as needed', icon: <RefreshCw className='h-6 w-6' /> }
  ],

  steps: [
    {
      title: 'Define parameters',
      description:
        'Store operational values like rate limits, timeouts, and batch sizes in Replane instead of code.',
      icon: <Settings className='h-8 w-8' />
    },
    {
      title: 'Monitor performance',
      description:
        'Watch your metrics. When you need to adjust, the values are just a click away.',
      icon: <Gauge className='h-8 w-8' />
    },
    {
      title: 'Tune in real-time',
      description:
        'Change values and see the effect immediately. No deploy, no restart, no downtime.',
      icon: <Sliders className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Instant adjustments',
      description:
        'Changes take effect in milliseconds via SSE. Perfect for responding to traffic spikes.',
      icon: <Zap className='h-6 w-6' />
    },
    {
      title: 'Zero downtime',
      description:
        'Tune parameters without restarts. Your service keeps running while you optimize.',
      icon: <Server className='h-6 w-6' />
    },
    {
      title: 'Easy rollback',
      description:
        'Every change is versioned. Made things worse? Revert to the previous value in one click.',
      icon: <RefreshCw className='h-6 w-6' />
    }
  ],

  faq: [
    {
      question: 'What kind of parameters should I externalize?',
      answer:
        'Rate limits, cache TTLs, connection pool sizes, batch sizes, timeouts, retry policies, and any value you might need to adjust without deploying. If you have ever said "I wish I could change this without a deploy," it belongs in Replane.'
    },
    {
      question: 'How do I update parameters that need a restart?',
      answer:
        'Subscribe to config changes and reinitialize the affected component. For example, recreate a connection pool when pool size changes. The SDK makes this easy with its subscribe API.'
    },
    {
      question: 'Can I set different values for different environments?',
      answer:
        'Yes! Replane natively supports multiple environments within a single project. Each environment (dev, staging, production) has its own SDK key and can have different config values. No need for separate projects.'
    },
    {
      question: 'What about parameters that need coordination across instances?',
      answer:
        'Replane pushes updates to all connected clients simultaneously via SSE. All instances receive the new value at the same time, ensuring consistent behavior across your fleet.'
    },
    {
      question: 'How do I know what values to set?',
      answer:
        'Start with your current hardcoded values as defaults. Then use your monitoring and observability tools to understand the impact of changes. Replane makes it safe to experiment since you can always rollback.'
    }
  ],

  relatedUseCases: [
    {
      title: 'Performance Tuning',
      description: 'Optimize cache TTLs and resource limits.',
      href: '/use-cases/performance-tuning',
      accentColor: 'orange'
    },
    {
      title: 'Instant Rollback',
      description: 'Revert parameter changes instantly.',
      href: '/use-cases/instant-rollback',
      accentColor: 'emerald'
    },
    {
      title: 'Multi-Tenant',
      description: 'Different limits for different customers.',
      href: '/use-cases/multi-tenant',
      accentColor: 'sky'
    }
  ],

  codeExamples: [
    {
      sdk: 'typescript',
      label: 'TypeScript',
      docsLink: '/docs/sdk/javascript',
      code: `import { Replane } from '@replanejs/sdk'
import { RateLimiter } from './rate-limiter'

interface Configs {
  'rate-limit-requests': number
  'rate-limit-window-ms': number
  'cache-ttl-seconds': number
}

const replane = new Replane<Configs>()

await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

// Initialize with config values
let rateLimiter = new RateLimiter({
  maxRequests: replane.get('rate-limit-requests'),
  windowMs: replane.get('rate-limit-window-ms')
})

// Update rate limiter when config changes
replane.subscribe('rate-limit-requests', (config) => {
  rateLimiter.updateLimits({
    maxRequests: config.value,
    windowMs: replane.get('rate-limit-window-ms')
  })
  console.log('Rate limits updated:', config.value)
})

// Use in request handling
app.use((req, res, next) => {
  if (rateLimiter.isLimited(req.ip)) {
    return res.status(429).json({ error: 'Too many requests' })
  }
  next()
})`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { useConfig } from '@replanejs/react'

function DataFetcher({ endpoint }) {
  const timeoutMs = useConfig<number>('api-timeout-ms')
  const [data, setData] = useState(null)

  useEffect(() => {
    // Use config values for fetch behavior
    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(),
      timeoutMs
    )

    fetch(endpoint, { 
      signal: controller.signal 
    })
      .then(res => res.json())
      .then(setData)
      .finally(() => clearTimeout(timeout))

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [endpoint, timeoutMs])

  return <DataDisplay data={data} />
}

// Config in Replane:
// api-timeout-ms: 5000
// max-retries: 3`
    },
    {
      sdk: 'nextjs',
      label: 'Next.js',
      docsLink: '/docs/sdk/nextjs',
      code: `// lib/cache.ts
import { getReplaneSnapshot } from '@replanejs/next'

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const snapshot = await getReplaneSnapshot({
    connection: {
      baseUrl: process.env.REPLANE_BASE_URL!,
      sdkKey: process.env.REPLANE_SDK_KEY!
    }
  })
  
  const ttl = snapshot.get('cache-ttl-seconds')

  // Check cache first
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  // Fetch and cache with configurable TTL
  const data = await fetcher()
  await redis.setex(key, ttl, JSON.stringify(data))
  
  return data
}

// app/api/products/route.ts
export async function GET() {
  const snapshot = await getReplaneSnapshot({ connection })
  const maxProducts = snapshot.get('max-products-per-page')
  
  const products = await fetchWithCache(
    'products:all',
    () => db.products.findMany({ take: maxProducts })
  )

  return Response.json(products)
}`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'
  import { onMount } from 'svelte'

  // Reactive fetch with configurable timeout
  const timeoutMs = config<number>('api-timeout-ms')
  
  let data = null
  let loading = true

  onMount(async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(), 
      $timeoutMs
    )

    try {
      const res = await fetch('/api/data', {
        signal: controller.signal
      })
      data = await res.json()
    } finally {
      clearTimeout(timeoutId)
      loading = false
    }
  })
</script>

{#if loading}
  <p>Loading (timeout: {$timeoutMs}ms)...</p>
{:else}
  <DataDisplay {data} />
{/if}`
    },
    {
      sdk: 'python',
      label: 'Python',
      docsLink: '/docs/sdk/python',
      code: `from replane import Replane
import redis
import json
import os

replane = Replane(
    base_url=os.environ["REPLANE_BASE_URL"],
    sdk_key=os.environ["REPLANE_SDK_KEY"]
)

redis_client = redis.Redis()

async def fetch_with_cache(key: str, fetcher):
    ttl = replane.get("cache-ttl-seconds")
    
    # Check cache
    cached = redis_client.get(key)
    if cached:
        return json.loads(cached)
    
    # Fetch with configurable timeout
    timeout = replane.get("api-timeout-seconds")
    data = await asyncio.wait_for(fetcher(), timeout=timeout)
    
    # Cache with configurable TTL
    redis_client.setex(key, ttl, json.dumps(data))
    return data

# Rate limiting with live config
class DynamicRateLimiter:
    def is_limited(self, key: str) -> bool:
        limit = replane.get("rate-limit-requests")
        window = replane.get("rate-limit-window-seconds")
        
        count = redis_client.incr(f"ratelimit:{key}")
        if count == 1:
            redis_client.expire(f"ratelimit:{key}", window)
        
        return count > limit`
    },
    {
      sdk: 'csharp',
      label: '.NET',
      docsLink: '/docs/sdk/dotnet',
      code: `using Replane;
using StackExchange.Redis;

public class CacheService
{
    private readonly IReplaneClient _replane;
    private readonly IDatabase _redis;

    public CacheService(
        IReplaneClient replane, 
        IConnectionMultiplexer redis)
    {
        _replane = replane;
        _redis = redis.GetDatabase();
    }

    public async Task<T> FetchWithCacheAsync<T>(
        string key,
        Func<Task<T>> fetcher)
    {
        var ttl = TimeSpan.FromSeconds(
            _replane.Get<int>("cache-ttl-seconds")
        );

        // Check cache
        var cached = await _redis.StringGetAsync(key);
        if (cached.HasValue)
        {
            return JsonSerializer.Deserialize<T>(cached);
        }

        // Fetch with configurable timeout
        var timeout = TimeSpan.FromMilliseconds(
            _replane.Get<int>("api-timeout-ms")
        );
        
        using var cts = new CancellationTokenSource(timeout);
        var data = await fetcher();
        
        // Cache with configurable TTL
        await _redis.StringSetAsync(
            key, 
            JsonSerializer.Serialize(data),
            ttl
        );
        
        return data;
    }
}`
    }
  ]
}

export default function OperationalTuningPage() {
  return <UseCaseLayout {...content} />
}
