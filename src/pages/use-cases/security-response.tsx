import { Shield, AlertTriangle, Lock, Zap, History, Eye, Layers, Clock } from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'Security Response',
  title: 'Respond to threats instantly',
  subtitle: 'Revoke access, block IPs, and activate lockdown mode',
  description:
    'When security incidents happen, every second counts. Block IPs, revoke API keys, and enable lockdown mode instantly—no deploy, no downtime, no waiting.',
  accentColor: 'rose',

  painPoints: [
    {
      title: 'Slow response time',
      description: 'Revoking access or blocking IPs requires code changes and deploys.'
    },
    {
      title: 'No instant lockdown',
      description: "Can't quickly disable system access during active attacks."
    },
    {
      title: 'Manual blocklists',
      description: 'IP blocklists and revoked keys hardcoded in config files.'
    },
    {
      title: 'No audit trail',
      description: 'No record of when security settings changed or who changed them.'
    }
  ],
  solutions: [
    {
      title: 'Instant response',
      description: 'Block IPs, revoke keys, enable lockdown in seconds.'
    },
    {
      title: 'Live blocklists',
      description: 'Add IPs or keys to blocklist and see immediate effect.'
    },
    {
      title: 'Emergency lockdown',
      description: 'One click activates lockdown mode across all services.'
    },
    {
      title: 'Complete audit trail',
      description: 'Every security change logged with timestamp and author.'
    }
  ],

  features: [
    { title: 'Instant Response', description: 'Block threats in under a second', icon: <Zap className='h-6 w-6' /> },
    { title: 'Full Audit Trail', description: 'Complete history of all security changes', icon: <History className='h-6 w-6' /> },
    { title: 'No Deploys', description: 'Respond to threats without code changes', icon: <Layers className='h-6 w-6' /> },
    { title: 'One-Click Lockdown', description: 'Activate security mode instantly', icon: <Clock className='h-6 w-6' /> }
  ],

  steps: [
    {
      title: 'Detect threat',
      description:
        'Your security tools alert you to suspicious activity. An API key is compromised or an IP is attacking.',
      icon: <AlertTriangle className='h-8 w-8' />
    },
    {
      title: 'Take action',
      description:
        'Add the IP to blocklist, revoke the API key, or enable lockdown mode. Changes apply instantly.',
      icon: <Lock className='h-8 w-8' />
    },
    {
      title: 'Investigate safely',
      description:
        'With the threat blocked, take time to investigate. Full audit trail helps with post-mortem.',
      icon: <Eye className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Sub-second response',
      description:
        'Block threats in milliseconds. No waiting for deploys or cache invalidation.',
      icon: <Zap className='h-6 w-6' />
    },
    {
      title: 'Granular control',
      description:
        'Block specific IPs, revoke individual keys, or lock down entire systems.',
      icon: <Shield className='h-6 w-6' />
    },
    {
      title: 'Complete audit trail',
      description:
        'Every security action logged. Perfect for compliance and post-mortems.',
      icon: <History className='h-6 w-6' />
    }
  ],

  faq: [
    {
      question: 'How quickly can I block a malicious IP?',
      answer:
        'Within seconds. Add the IP to your blocklist config in Replane, and it propagates to all connected services via SSE in milliseconds. No deploy, no restart, no delay.'
    },
    {
      question: 'Can I implement an emergency lockdown mode?',
      answer:
        'Yes! Create a boolean config for lockdown mode. When enabled, your application checks this flag and restricts access. One toggle in the dashboard locks down everything instantly.'
    },
    {
      question: 'How do I handle API key revocation?',
      answer:
        'Store a list of revoked keys in Replane. Your API gateway checks incoming keys against this list. Add a compromised key to the list and it is immediately blocked everywhere.'
    },
    {
      question: 'Is there an audit trail for security changes?',
      answer:
        'Every change is logged with timestamp, author, and optional commit message. You can see exactly when a security change was made and by whom. Essential for compliance and post-mortems.'
    },
    {
      question: 'Can I set up automated responses?',
      answer:
        'Replane provides the config infrastructure. Your security tools can update Replane via API when they detect threats. Combine with your SIEM or threat detection tools for automated response.'
    }
  ],

  relatedUseCases: [
    {
      title: 'Kill Switch',
      description: 'Instantly disable problematic features.',
      href: '/use-cases/kill-switch',
      accentColor: 'red'
    },
    {
      title: 'Multi-Tenant',
      description: 'Block or restrict specific tenants.',
      href: '/use-cases/multi-tenant',
      accentColor: 'sky'
    },
    {
      title: 'Incident Response',
      description: 'Respond to incidents and revert changes instantly.',
      href: '/use-cases/incident-response',
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
  'security-lockdown-enabled': boolean
  'blocked-ips': string[]
  'revoked-api-keys': string[]
  'rate-limit-strict': number
}

const replane = new Replane<Configs>()

await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

// Security middleware
app.use((req, res, next) => {
  // Check lockdown mode
  if (replane.get('security-lockdown-enabled')) {
    return res.status(503).json({
      error: 'System in maintenance mode'
    })
  }

  // Check IP blocklist
  const blockedIps = replane.get('blocked-ips')
  if (blockedIps.includes(req.ip)) {
    return res.status(403).json({
      error: 'Access denied'
    })
  }

  // Check API key revocation
  const apiKey = req.headers['x-api-key']
  const revokedKeys = replane.get('revoked-api-keys')
  if (revokedKeys.includes(apiKey)) {
    return res.status(401).json({
      error: 'API key revoked'
    })
  }

  next()
})

// Alert on lockdown activation
replane.subscribe('security-lockdown-enabled', (config) => {
  if (config.value) {
    alertSecurityTeam('LOCKDOWN ACTIVATED')
  }
})`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { useConfig } from '@replanejs/react'

function SecurityGate({ children }) {
  const lockdownEnabled = useConfig<boolean>('security-lockdown-enabled')
  const maintenanceMessage = useConfig<string>('maintenance-message')

  if (lockdownEnabled) {
    return (
      <MaintenancePage>
        <ShieldIcon />
        <h1>System Maintenance</h1>
        <p>{maintenanceMessage}</p>
      </MaintenancePage>
    )
  }

  return children
}

function App() {
  return (
    <ReplaneProvider connection={...}>
      <SecurityGate>
        <MainApp />
      </SecurityGate>
    </ReplaneProvider>
  )
}

// Lockdown can be activated from dashboard
// All users immediately see maintenance page`
    },
    {
      sdk: 'nextjs',
      label: 'Next.js',
      docsLink: '/docs/sdk/nextjs',
      code: `// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Fetch security config
  const res = await fetch(
    \`\${process.env.REPLANE_BASE_URL}/api/snapshot\`,
    { headers: { 'X-SDK-Key': process.env.REPLANE_SDK_KEY! } }
  )
  const config = await res.json()

  // Check lockdown
  if (config['security-lockdown-enabled']) {
    return new NextResponse('System in maintenance', { status: 503 })
  }

  // Check IP blocklist
  const ip = request.ip || request.headers.get('x-forwarded-for')
  if (config['blocked-ips'].includes(ip)) {
    return new NextResponse('Access denied', { status: 403 })
  }

  return NextResponse.next()
}

// app/api/[...]/route.ts
import { getReplaneSnapshot } from '@replanejs/next'

export async function POST(request: Request) {
  const snapshot = await getReplaneSnapshot({ connection })
  
  const apiKey = request.headers.get('x-api-key')
  const revokedKeys = snapshot.get('revoked-api-keys')
  
  if (revokedKeys.includes(apiKey)) {
    return Response.json(
      { error: 'API key revoked' },
      { status: 401 }
    )
  }

  // Process request...
}`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'

  const lockdownEnabled = config<boolean>('security-lockdown-enabled')
  const maintenanceMessage = config<string>('maintenance-message')
</script>

{#if $lockdownEnabled}
  <div class="lockdown-screen">
    <ShieldIcon />
    <h1>System Maintenance</h1>
    <p>{$maintenanceMessage}</p>
  </div>
{:else}
  <slot />
{/if}

<!-- Server-side protection in hooks.server.ts -->
<script context="module">
  import { Replane } from '@replanejs/svelte/server'
  
  const replane = new Replane({ ... })
  
  export async function handle({ event, resolve }) {
    if (replane.get('security-lockdown-enabled')) {
      return new Response('Maintenance', { status: 503 })
    }
    
    const blockedIps = replane.get('blocked-ips')
    if (blockedIps.includes(event.getClientAddress())) {
      return new Response('Blocked', { status: 403 })
    }
    
    return resolve(event)
  }
</script>`
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

@app.middleware("http")
async def security_middleware(request: Request, call_next):
    # Check lockdown mode
    if replane.get("security-lockdown-enabled"):
        raise HTTPException(503, "System in maintenance mode")
    
    # Check IP blocklist
    client_ip = request.client.host
    blocked_ips = replane.get("blocked-ips")
    if client_ip in blocked_ips:
        raise HTTPException(403, "Access denied")
    
    # Check API key revocation
    api_key = request.headers.get("x-api-key")
    if api_key:
        revoked_keys = replane.get("revoked-api-keys")
        if api_key in revoked_keys:
            raise HTTPException(401, "API key revoked")
    
    return await call_next(request)

# Alert on lockdown
def on_lockdown_change(config):
    if config.value:
        alert_security_team("LOCKDOWN ACTIVATED")

replane.subscribe_config("security-lockdown-enabled", on_lockdown_change)`
    },
    {
      sdk: 'csharp',
      label: '.NET',
      docsLink: '/docs/sdk/dotnet',
      code: `using Replane;
using Microsoft.AspNetCore.Http;

public class SecurityMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IReplaneClient _replane;

    public SecurityMiddleware(
        RequestDelegate next, 
        IReplaneClient replane)
    {
        _next = next;
        _replane = replane;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Check lockdown mode
        if (_replane.Get<bool>("security-lockdown-enabled"))
        {
            context.Response.StatusCode = 503;
            await context.Response.WriteAsync("System in maintenance");
            return;
        }

        // Check IP blocklist
        var clientIp = context.Connection.RemoteIpAddress?.ToString();
        var blockedIps = _replane.Get<List<string>>("blocked-ips");
        if (blockedIps.Contains(clientIp))
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsync("Access denied");
            return;
        }

        // Check API key revocation
        var apiKey = context.Request.Headers["X-API-Key"].ToString();
        var revokedKeys = _replane.Get<List<string>>("revoked-api-keys");
        if (revokedKeys.Contains(apiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("API key revoked");
            return;
        }

        await _next(context);
    }
}`
    }
  ]
}

export default function SecurityResponsePage() {
  return <UseCaseLayout {...content} />
}
