import { ShieldOff, Zap, AlertTriangle, Clock, Shield, Activity, Server, Rocket, Layers } from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'Kill Switch',
  title: 'Stop the bleeding instantly',
  subtitle: 'Disable problematic features without deploying',
  description:
    'When something breaks in production, every second counts. Kill switches let you disable features instantly—no deploy, no restart, no waiting for CI/CD.',
  accentColor: 'red',

  painPoints: [
    {
      title: 'Slow incident response',
      description: 'Disabling a broken feature requires a code change, PR, and full deployment cycle.'
    },
    {
      title: 'Full rollback required',
      description: "Can't disable just one feature. Have to roll back the entire release."
    },
    {
      title: 'Downtime during fixes',
      description: 'Users experience the bug for 30+ minutes while you rush to deploy a fix.'
    },
    {
      title: 'No granular control',
      description: "It's all or nothing. Can't disable for specific users or regions first."
    }
  ],
  solutions: [
    {
      title: 'Instant disable',
      description: 'One click disables any feature. Changes propagate in milliseconds.'
    },
    {
      title: 'Granular control',
      description: 'Disable specific features, not the entire service. Keep the rest running.'
    },
    {
      title: 'Zero downtime',
      description: 'No deploy, no restart. Your service keeps running while you investigate.'
    },
    {
      title: 'Targeted disabling',
      description: 'Disable for specific users, regions, or percentages while you fix.'
    }
  ],

  features: [
    { title: 'Instant Response', description: 'Disable features in under a second', icon: <Zap className='h-6 w-6' /> },
    { title: 'Zero Downtime', description: 'No service restart needed', icon: <Server className='h-6 w-6' /> },
    { title: 'No Deploys', description: 'No code changes required', icon: <Rocket className='h-6 w-6' /> },
    { title: 'Unlimited Switches', description: 'Protect every risky feature', icon: <Layers className='h-6 w-6' /> }
  ],

  steps: [
    {
      title: 'Detect the issue',
      description:
        'Your monitoring alerts you to a problem. Error rates spike, users complain, or you spot the bug.',
      icon: <AlertTriangle className='h-8 w-8' />
    },
    {
      title: 'Flip the switch',
      description:
        'Open Replane, find the feature, toggle it off. The change propagates to all servers instantly.',
      icon: <ShieldOff className='h-8 w-8' />
    },
    {
      title: 'Investigate safely',
      description:
        'With the feature disabled, take your time to debug. Fix properly, test thoroughly, then re-enable.',
      icon: <Clock className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Sub-second response',
      description:
        'Changes propagate via SSE in milliseconds. No waiting for deploys, cache invalidation, or restarts.',
      icon: <Zap className='h-6 w-6' />
    },
    {
      title: 'Granular control',
      description:
        'Disable specific features, not the entire service. Keep your app running while you fix the issue.',
      icon: <Shield className='h-6 w-6' />
    },
    {
      title: 'Full audit trail',
      description:
        'Every toggle is logged with timestamp and user. Perfect for post-mortems and compliance.',
      icon: <Activity className='h-6 w-6' />
    }
  ],

  faq: [
    {
      question: 'How fast can I disable a feature?',
      answer:
        "Within seconds. Open the Replane dashboard, find the kill switch config, toggle it off. The change propagates to all connected clients via SSE in milliseconds. No deploy, no restart needed."
    },
    {
      question: 'What if I accidentally flip the wrong switch?',
      answer:
        'Every change is versioned with full history. You can see exactly what changed, when, and by whom. Rollback to any previous state with one click if you make a mistake.'
    },
    {
      question: 'Can I disable features for specific users only?',
      answer:
        'Yes! Use override rules to target specific users, regions, or percentages. For example, disable a feature only for users on the free plan, or only in a specific region.'
    },
    {
      question: 'How do I set up kill switches in my code?',
      answer:
        "Wrap risky features in a simple boolean check: `if (replane.get('kill-switch-payments'))`. When you flip the switch in the dashboard, the feature is disabled instantly."
    },
    {
      question: 'What happens to in-flight requests when I flip a switch?',
      answer:
        'The SDK caches configs locally and updates them in real-time. In-flight requests complete with their current config. New requests immediately use the updated config.'
    }
  ],

  relatedUseCases: [
    {
      title: 'Feature Flags',
      description: 'Control feature rollouts with fine-grained targeting.',
      href: '/use-cases/feature-flags',
      accentColor: 'blue'
    },
    {
      title: 'Instant Rollback',
      description: 'Revert any config to a previous state in one click.',
      href: '/use-cases/instant-rollback',
      accentColor: 'emerald'
    },
    {
      title: 'Security Response',
      description: 'Lock down systems and revoke access instantly.',
      href: '/use-cases/security-response',
      accentColor: 'rose'
    }
  ],

  codeExamples: [
    {
      sdk: 'typescript',
      label: 'TypeScript',
      docsLink: '/docs/sdk/javascript',
      code: `import { Replane } from '@replanejs/sdk'

interface Configs {
  'kill-switch-payments': boolean
  'kill-switch-stripe': boolean
}

const replane = new Replane<Configs>()

await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

// Wrap risky features in kill switches
async function processPayment(order: Order) {
  // Kill switch: disable if issues detected
  const paymentsEnabled = replane.get('kill-switch-payments')
  if (!paymentsEnabled) {
    throw new PaymentDisabledError(
      'Payment processing temporarily disabled'
    )
  }

  // Kill switch for specific provider
  const stripeEnabled = replane.get('kill-switch-stripe')
  if (!stripeEnabled) {
    return fallbackToPayPal(order)
  }

  return await stripe.charges.create({
    amount: order.total,
    currency: 'usd',
    source: order.paymentMethod
  })
}

// React to kill switch changes
replane.subscribe('kill-switch-payments', (config) => {
  if (!config.value) {
    alertOps('Payments kill switch activated!')
  }
})`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { useConfig } from '@replanejs/react'

function PaymentForm() {
  const paymentsEnabled = useConfig<boolean>('kill-switch-payments')

  // Show maintenance message when payments disabled
  if (!paymentsEnabled) {
    return (
      <MaintenanceMessage>
        <AlertIcon />
        <h2>Payments Temporarily Unavailable</h2>
        <p>We're experiencing issues and have temporarily 
           disabled payments. Please try again shortly.</p>
      </MaintenanceMessage>
    )
  }

  return (
    <form onSubmit={handlePayment}>
      <CreditCardInput />
      <SubmitButton>Pay Now</SubmitButton>
    </form>
  )
}

// Graceful degradation for specific features
function CheckoutPage() {
  const expressCheckoutEnabled = useConfig<boolean>('kill-switch-express-checkout')

  return (
    <div>
      <CartSummary />
      {expressCheckoutEnabled && (
        <ExpressCheckoutButton />
      )}
      <PaymentForm />
    </div>
  )
}`
    },
    {
      sdk: 'nextjs',
      label: 'Next.js',
      docsLink: '/docs/sdk/nextjs',
      code: `// app/checkout/page.tsx
'use client'
import { useConfig } from '@replanejs/next'

export default function CheckoutPage() {
  const checkoutEnabled = useConfig<boolean>('kill-switch-checkout')

  if (!checkoutEnabled) {
    return <MaintenancePage />
  }

  return <CheckoutFlow />
}

// For API routes, check directly in the handler
// app/api/payments/route.ts
import { getReplaneSnapshot } from '@replanejs/next'

export async function POST(request: Request) {
  const snapshot = await getReplaneSnapshot({
    connection: {
      baseUrl: process.env.REPLANE_BASE_URL!,
      sdkKey: process.env.REPLANE_SDK_KEY!
    }
  })
  
  const paymentsEnabled = snapshot.get('kill-switch-payments')
  if (!paymentsEnabled) {
    return Response.json(
      { error: 'Payments temporarily disabled' },
      { status: 503 }
    )
  }

  // Process payment...
}`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'

  const paymentsEnabled = config<boolean>('kill-switch-payments')
  const expressCheckoutEnabled = config<boolean>('kill-switch-express-checkout')
</script>

{#if !$paymentsEnabled}
  <div class="maintenance-banner">
    <AlertIcon />
    <h2>Payments Temporarily Unavailable</h2>
    <p>We're working to resolve an issue. Please try again shortly.</p>
  </div>
{:else}
  <form on:submit|preventDefault={handlePayment}>
    <CreditCardInput />
    <button type="submit">Pay Now</button>
  </form>
{/if}

<!-- Conditional features based on kill switches -->
{#if $expressCheckoutEnabled}
  <ExpressCheckoutButton />
{/if}`
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

@app.post("/api/payments")
async def process_payment(payment: PaymentRequest):
    # Kill switch check
    if not replane.get("kill-switch-payments"):
        raise HTTPException(
            status_code=503,
            detail="Payments temporarily disabled"
        )
    
    # Fallback to alternative provider
    if not replane.get("kill-switch-stripe"):
        return await process_with_paypal(payment)
    
    return await process_with_stripe(payment)

# Alert when kill switch activated
def on_payments_change(config):
    if not config.value:
        alert_ops("Payments kill switch activated!")

replane.subscribe_config("kill-switch-payments", on_payments_change)`
    },
    {
      sdk: 'csharp',
      label: '.NET',
      docsLink: '/docs/sdk/dotnet',
      code: `using Replane;
using Microsoft.AspNetCore.Mvc;

public class PaymentController : ControllerBase
{
    private readonly IReplaneClient _replane;

    public PaymentController(IReplaneClient replane)
    {
        _replane = replane;
    }

    [HttpPost("api/payments")]
    public async Task<IActionResult> ProcessPayment(
        PaymentRequest request)
    {
        // Kill switch check
        if (!_replane.Get<bool>("kill-switch-payments"))
        {
            return StatusCode(503, new {
                error = "Payments temporarily disabled"
            });
        }

        // Fallback to alternative provider
        if (!_replane.Get<bool>("kill-switch-stripe"))
        {
            return await ProcessWithPayPal(request);
        }

        return await ProcessWithStripe(request);
    }
}`
    }
  ]
}

export default function KillSwitchPage() {
  return <UseCaseLayout {...content} />
}
