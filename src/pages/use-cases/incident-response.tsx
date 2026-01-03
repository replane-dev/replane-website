import {
  AlertTriangle,
  History,
  Clock,
  Shield,
  RotateCcw,
  Eye,
  Users,
  Zap,
  Radio
} from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'Incident Response',
  title: 'Resolve incidents in seconds',
  subtitle: 'When production breaks, respond instantly without deploying',
  description:
    'React to production incidents immediately. Toggle kill switches, adjust rate limits, and revert configs without deploying.',
  accentColor: 'emerald',

  painPoints: [
    {
      title: 'Slow incident response',
      description:
        'Fixing production issues requires code changes, PR reviews, and deploys. MTTR is hours, not minutes.'
    },
    {
      title: 'No rollback option',
      description:
        'When a config change causes issues, reverting means finding old values and deploying again.'
    },
    {
      title: 'Missing audit trail',
      description:
        "Post-mortems are painful. You can't tell what changed, when, or who made the change."
    },
    {
      title: 'Coordination chaos',
      description:
        "Multiple teams making changes during an incident without visibility into each other's actions."
    }
  ],
  solutions: [
    {
      title: 'Instant config changes',
      description: 'Update any config in seconds. Changes propagate to all servers immediately.'
    },
    {
      title: 'One-click rollback',
      description: 'Every version is saved. Revert any config to a previous state instantly.'
    },
    {
      title: 'Complete audit trail',
      description:
        'Every change logged with timestamp, author, and optional message for post-mortems.'
    },
    {
      title: 'Real-time visibility',
      description:
        'See all config changes as they happen. Everyone on the same page during incidents.'
    }
  ],

  features: [
    {
      title: 'Instant Propagation',
      description: 'Changes reach all servers in milliseconds',
      icon: <Zap className='h-6 w-6' />
    },
    {
      title: 'Version History',
      description: 'Complete history preserved for every config',
      icon: <History className='h-6 w-6' />
    },
    {
      title: 'One-Click Rollback',
      description: 'Restore any previous version instantly',
      icon: <RotateCcw className='h-6 w-6' />
    },
    {
      title: 'Audit Trail',
      description: 'Track every change for post-mortems',
      icon: <Eye className='h-6 w-6' />
    }
  ],
  featuresHeading: 'MTTR in seconds, not hours',
  featuresSubheading: 'Respond, resolve, and learn from every incident',

  steps: [
    {
      title: 'Detect the issue',
      description:
        'Your monitoring alerts you to a problem. Open the Replane dashboard to see recent config changes.',
      icon: <AlertTriangle className='h-8 w-8' />
    },
    {
      title: 'Respond immediately',
      description:
        'Toggle a kill switch, adjust a rate limit, or revert a recent change. No deploy needed—changes apply instantly.',
      icon: <Radio className='h-8 w-8' />
    },
    {
      title: 'Review and learn',
      description:
        'Full audit trail shows exactly what changed and when. Use version history for post-mortems and prevention.',
      icon: <History className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Faster MTTR',
      description:
        'Respond to incidents in seconds, not hours. No waiting for deploys or approvals.',
      icon: <Clock className='h-6 w-6' />
    },
    {
      title: 'Safe rollbacks',
      description: 'Every version is preserved. Revert to any previous state with confidence.',
      icon: <Shield className='h-6 w-6' />
    },
    {
      title: 'Team coordination',
      description:
        'Everyone sees config changes in real-time. No stepping on each other during incidents.',
      icon: <Users className='h-6 w-6' />
    }
  ],

  faq: [
    {
      question: 'How fast can I respond to an incident?',
      answer:
        'Within seconds. Open the dashboard, find the relevant config, make your change. SSE pushes updates to all connected clients in milliseconds. No deploy, no restart needed.'
    },
    {
      question: 'How does rollback work?',
      answer:
        'Every config change creates a new version. You can view the full version history, see diffs between versions, and restore any previous version with one click. Changes propagate instantly.'
    },
    {
      question: 'What information is available for post-mortems?',
      answer:
        'Complete audit trail: every change includes timestamp, author, previous value, new value, and optional commit message. You can see exactly what changed, when, and who made the change.'
    },
    {
      question: 'Can multiple team members respond simultaneously?',
      answer:
        'Yes! All changes are visible in real-time. If someone else makes a change, you see it immediately. This prevents stepping on each other during incident response.'
    },
    {
      question: 'What if I make a mistake during an incident?',
      answer:
        'Just roll back. Every change is versioned, so you can always revert to a previous state. The version history makes it easy to find the last known good configuration.'
    }
  ],

  relatedUseCases: [
    {
      title: 'Kill Switch',
      description: 'Instantly disable features when things go wrong.',
      href: '/use-cases/kill-switch',
      accentColor: 'red'
    },
    {
      title: 'Feature Flags',
      description: 'Ship features safely with gradual rollouts.',
      href: '/use-cases/feature-flags',
      accentColor: 'blue'
    },
    {
      title: 'Operational Tuning',
      description: 'Adjust system parameters on the fly.',
      href: '/use-cases/operational-tuning',
      accentColor: 'violet'
    }
  ],

  codeExamples: [
    {
      sdk: 'typescript',
      label: 'TypeScript',
      docsLink: '/docs/sdk/javascript',
      code: `import { Replane } from '@replanejs/sdk'

interface Configs {
  'rate-limit-requests-per-minute': number
  'circuit-breaker-enabled': boolean
  'fallback-mode': 'cache' | 'static' | 'error'
}

const replane = new Replane<Configs>()

await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

// During an incident, these values update instantly
// when you change them in the dashboard
const rateLimit = replane.get('rate-limit-requests-per-minute')
const circuitBreaker = replane.get('circuit-breaker-enabled')
const fallbackMode = replane.get('fallback-mode')

// React to config changes in real-time
replane.subscribe('circuit-breaker-enabled', (config) => {
  if (config.value) {
    console.log('Circuit breaker activated!')
    // Switch to fallback behavior
  }
})

// Example: incident response via config
function handleRequest(req: Request) {
  if (replane.get('circuit-breaker-enabled')) {
    return getFallbackResponse(replane.get('fallback-mode'))
  }
  
  // Normal request handling...
}`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { useConfig } from '@replanejs/react'

function ServiceStatus() {
  // These update instantly during incident response
  const maintenanceMode = useConfig<boolean>('maintenance-mode')
  const statusMessage = useConfig<string>('status-message')

  if (maintenanceMode) {
    return (
      <div className="maintenance-banner">
        <h1>Scheduled Maintenance</h1>
        <p>{statusMessage}</p>
      </div>
    )
  }

  return <App />
}

// During an incident:
// 1. Toggle maintenance-mode to true in dashboard
// 2. Set status-message with user-facing explanation
// 3. Users see maintenance page instantly
// 4. Fix the issue, toggle maintenance-mode off
// 5. Users return to normal experience`
    },
    {
      sdk: 'nextjs',
      label: 'Next.js',
      docsLink: '/docs/sdk/nextjs',
      code: `// app/api/process/route.ts
import { getReplaneSnapshot } from '@replanejs/next'

export async function POST(request: Request) {
  const snapshot = await getReplaneSnapshot({
    connection: {
      baseUrl: process.env.REPLANE_BASE_URL!,
      sdkKey: process.env.REPLANE_SDK_KEY!
    }
  })
  
  // Check circuit breaker—adjustable during incidents
  if (snapshot.get('circuit-breaker-enabled')) {
    const fallbackMode = snapshot.get('fallback-mode')
    return Response.json(
      { status: 'degraded', mode: fallbackMode },
      { status: 503 }
    )
  }

  // Rate limit—adjustable during traffic spikes
  const rateLimit = snapshot.get('rate-limit-requests-per-minute')
  
  // Normal processing with current config values
  // ...
  
  return Response.json({ success: true })
}

// Incident response flow:
// 1. Alert fires: high error rate
// 2. Open dashboard, enable circuit-breaker
// 3. All requests immediately return 503
// 4. Investigate and fix root cause
// 5. Disable circuit-breaker when ready`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'

  // Reactive to incident response changes
  const maintenanceMode = config<boolean>('maintenance-mode')
  const statusMessage = config<string>('status-message')
  const degradedFeatures = config<string[]>('degraded-features')
</script>

{#if $maintenanceMode}
  <div class="maintenance-overlay">
    <h1>We're experiencing issues</h1>
    <p>{$statusMessage}</p>
  </div>
{:else}
  <main>
    {#each features as feature}
      {#if !$degradedFeatures.includes(feature.id)}
        <FeatureCard {feature} />
      {:else}
        <FeatureCard {feature} disabled />
      {/if}
    {/each}
  </main>
{/if}

<!-- During incident:
  1. Add problematic feature to degraded-features
  2. Users see it as disabled immediately
  3. Fix issue, remove from degraded-features
  4. Feature available again, no deploy -->`
    },
    {
      sdk: 'python',
      label: 'Python',
      docsLink: '/docs/sdk/python',
      code: `from replane import Replane
from fastapi import FastAPI, HTTPException
import os

app = FastAPI()

replane = Replane(
    base_url=os.environ["REPLANE_BASE_URL"],
    sdk_key=os.environ["REPLANE_SDK_KEY"]
)

@app.on_event("startup")
async def startup():
    replane.connect()

@app.on_event("shutdown")
async def shutdown():
    replane.close()

@app.post("/api/process")
async def process_request():
    # Check circuit breaker during incidents
    if replane.get("circuit-breaker-enabled"):
        raise HTTPException(
            status_code=503,
            detail="Service temporarily unavailable"
        )
    
    # Rate limit adjustable during traffic spikes
    rate_limit = replane.get("rate-limit-requests-per-minute")
    
    # Process with current config...
    return {"success": True}

# Incident response:
# - Enable circuit-breaker: immediate 503s
# - Lower rate-limit: reduce load instantly
# - Check version history: see what changed
# - Rollback: restore previous config`
    },
    {
      sdk: 'csharp',
      label: '.NET',
      docsLink: '/docs/sdk/dotnet',
      code: `using Replane;
using Microsoft.AspNetCore.Mvc;

public class ProcessController : ControllerBase
{
    private readonly IReplaneClient _replane;

    public ProcessController(IReplaneClient replane)
    {
        _replane = replane;
    }

    [HttpPost("api/process")]
    public IActionResult Process()
    {
        // Circuit breaker—toggle during incidents
        if (_replane.Get<bool>("circuit-breaker-enabled"))
        {
            return StatusCode(503, new { 
                status = "degraded",
                message = _replane.Get<string>("status-message")
            });
        }

        // Rate limit—adjust during traffic spikes  
        var rateLimit = _replane.Get<int>(
            "rate-limit-requests-per-minute"
        );

        // Process request with current config...
        return Ok(new { success = true });
    }
}

// Incident response flow:
// 1. Enable circuit-breaker in dashboard
// 2. All requests return 503 immediately
// 3. Investigate and fix the issue
// 4. Disable circuit-breaker when ready
// 5. Review version history for post-mortem`
    }
  ]
}

export default function IncidentResponsePage() {
  return <UseCaseLayout {...content} />
}
