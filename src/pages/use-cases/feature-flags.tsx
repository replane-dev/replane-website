import { Flag, Code, Zap, Shield, Users, Clock, Gauge, Server, Layers } from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'Feature Flags',
  title: 'Ship features safely',
  subtitle: 'Control what users see without deploying',
  description:
    'Deploy code with features off. Enable for 1% of users, then 10%, then everyone. If something breaks, disable instantly—no rollback needed.',
  accentColor: 'blue',

  // Pain points vs solutions
  painPoints: [
    {
      title: 'Deploy to enable features',
      description: 'Every feature toggle requires a code change, PR review, and full deployment cycle.'
    },
    {
      title: 'All-or-nothing releases',
      description: 'Features go live for everyone at once. Issues affect 100% of users immediately.'
    },
    {
      title: 'Slow incident response',
      description: 'Disabling a broken feature means emergency rollback—if you can even do it quickly.'
    },
    {
      title: 'Engineering bottleneck',
      description: 'Product managers wait for developers to toggle flags. Simple changes take days.'
    }
  ],
  solutions: [
    {
      title: 'Toggle without deploying',
      description: 'Enable or disable features from the dashboard. Changes propagate in milliseconds.'
    },
    {
      title: 'Gradual rollouts',
      description: 'Start with 1%, increase to 10%, then 100%. Catch issues before they affect everyone.'
    },
    {
      title: 'Instant kill switch',
      description: 'One click disables any feature. No rollback, no downtime, no panic.'
    },
    {
      title: 'Self-service for teams',
      description: 'Product managers control flags directly. Engineers focus on building features.'
    }
  ],

  // Key features
  features: [
    { title: 'Instant Updates', description: 'Changes propagate in under a second via SSE', icon: <Zap className='h-6 w-6' /> },
    { title: 'High Availability', description: 'Enterprise-grade reliability with 99.99% uptime', icon: <Server className='h-6 w-6' /> },
    { title: 'No Deploys Needed', description: 'Toggle features from the dashboard without code changes', icon: <Gauge className='h-6 w-6' /> },
    { title: 'All Major SDKs', description: 'JavaScript, React, Next.js, Svelte, Python, .NET', icon: <Layers className='h-6 w-6' /> }
  ],

  steps: [
    {
      title: 'Define your flag',
      description:
        'Create a boolean or percentage-based flag in the Replane dashboard. Set targeting rules if needed.',
      icon: <Flag className='h-8 w-8' />
    },
    {
      title: 'Check in your code',
      description:
        'Use our SDK to check the flag value. Your code stays clean with simple boolean checks.',
      icon: <Code className='h-8 w-8' />
    },
    {
      title: 'Enable gradually',
      description:
        'Roll out to a small percentage, monitor, then increase. Full control without any deploys.',
      icon: <Zap className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Zero-risk deployments',
      description:
        'Ship code with features disabled. Enable when ready, disable if issues arise. No rollback needed.',
      icon: <Shield className='h-6 w-6' />
    },
    {
      title: 'Gradual rollouts',
      description:
        'Start with 1% of users, increase to 10%, then 100%. Catch issues early with limited blast radius.',
      icon: <Users className='h-6 w-6' />
    },
    {
      title: 'Instant updates',
      description:
        'Changes propagate in real-time via SSE. No polling, no delays, no cache invalidation.',
      icon: <Clock className='h-6 w-6' />
    }
  ],

  // FAQ
  faq: [
    {
      question: 'How fast do flag changes propagate?',
      answer:
        'Flag changes propagate to all connected clients within milliseconds via Server-Sent Events (SSE). There\'s no polling or cache invalidation needed—updates are pushed instantly.'
    },
    {
      question: 'Can I target specific users or groups?',
      answer:
        'Yes! You can use our evaluation context to target specific users, percentage-based rollouts, or any custom attribute. The SDK supports consistent hashing so users always see the same variant.'
    },
    {
      question: 'What happens if Replane is unavailable?',
      answer:
        'Our SDKs cache the last known configuration locally. If the Replane server becomes unreachable, your application continues running with cached values. When connectivity is restored, updates resume automatically.'
    },
    {
      question: 'Is there version history for flags?',
      answer:
        'Every flag change is versioned with timestamp and author. You can view the complete history, compare versions, and rollback to any previous state with one click.'
    },
    {
      question: 'Can non-developers manage flags?',
      answer:
        'Absolutely! The dashboard is designed for product managers, QA, and operations teams. Role-based access control lets you define who can view, edit, or publish flag changes.'
    }
  ],

  // Related use cases
  relatedUseCases: [
    {
      title: 'Kill Switch',
      description: 'Instantly disable problematic features when things go wrong.',
      href: '/use-cases/kill-switch',
      accentColor: 'red'
    },
    {
      title: 'A/B Testing',
      description: 'Run experiments with variant percentages and consistent assignment.',
      href: '/use-cases/ab-testing',
      accentColor: 'amber'
    },
    {
      title: 'Gradual Rollouts',
      description: 'Release features to a percentage of users and increase over time.',
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
  'feature-new-checkout': boolean
  'checkout-rollout-percent': number
}

const replane = new Replane<Configs>()

await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

// Check if feature is enabled
const newCheckoutEnabled = replane.get('feature-new-checkout')

if (newCheckoutEnabled) {
  renderNewCheckout()
} else {
  renderLegacyCheckout()
}

// Subscribe to real-time updates
replane.subscribe('feature-new-checkout', (config) => {
  console.log('Feature flag changed:', config.value)
})`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { ReplaneProvider, useConfig } from '@replanejs/react'

function CheckoutPage() {
  // Automatically re-renders when flag changes
  const newCheckoutEnabled = useConfig<boolean>('feature-new-checkout')

  if (newCheckoutEnabled) {
    return <NewCheckoutFlow />
  }

  return <LegacyCheckoutFlow />
}

// Wrap your app with the provider
function App() {
  return (
    <ReplaneProvider
      connection={{
        baseUrl: 'https://replane.example.com',
        sdkKey: process.env.REPLANE_SDK_KEY
      }}
      loader={<LoadingSpinner />}
    >
      <CheckoutPage />
    </ReplaneProvider>
  )
}`
    },
    {
      sdk: 'nextjs',
      label: 'Next.js',
      docsLink: '/docs/sdk/nextjs',
      code: `// app/layout.tsx
import { ReplaneRoot } from '@replanejs/next'

export default async function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReplaneRoot
          connection={{
            baseUrl: process.env.NEXT_PUBLIC_REPLANE_BASE_URL,
            sdkKey: process.env.NEXT_PUBLIC_REPLANE_SDK_KEY
          }}
        >
          {children}
        </ReplaneRoot>
      </body>
    </html>
  )
}

// app/checkout/page.tsx
'use client'
import { useConfig } from '@replanejs/next'

export default function CheckoutPage() {
  const newCheckoutEnabled = useConfig<boolean>('feature-new-checkout')

  return newCheckoutEnabled 
    ? <NewCheckout /> 
    : <LegacyCheckout />
}`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'

  const newCheckoutEnabled = config<boolean>('feature-new-checkout')
</script>

{#if $newCheckoutEnabled}
  <NewCheckoutFlow />
{:else}
  <LegacyCheckoutFlow />
{/if}

<!-- In your root +layout.svelte -->
<script>
  import { ReplaneContext } from '@replanejs/svelte'

  const connection = {
    baseUrl: import.meta.env.VITE_REPLANE_BASE_URL,
    sdkKey: import.meta.env.VITE_REPLANE_SDK_KEY
  }
</script>

<ReplaneContext {connection}>
  <slot />
</ReplaneContext>`
    },
    {
      sdk: 'python',
      label: 'Python',
      docsLink: '/docs/sdk/python',
      code: `from replane import Replane
import os

with Replane(
    base_url=os.environ["REPLANE_BASE_URL"],
    sdk_key=os.environ["REPLANE_SDK_KEY"]
) as replane:
    # Check feature flag
    new_checkout_enabled = replane.get("feature-new-checkout")

    if new_checkout_enabled:
        return render_new_checkout()
    else:
        return render_legacy_checkout()

# Subscribe to real-time updates
def on_flag_change(config):
    print(f"Feature flag changed: {config.value}")

replane.subscribe_config("feature-new-checkout", on_flag_change)`
    },
    {
      sdk: 'csharp',
      label: '.NET',
      docsLink: '/docs/sdk/dotnet',
      code: `using Replane;

await using var replane = new ReplaneClient();

await replane.ConnectAsync(new ConnectOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = Environment.GetEnvironmentVariable("REPLANE_SDK_KEY")
});

// Check feature flag
var newCheckoutEnabled = replane.Get<bool>("feature-new-checkout");

if (newCheckoutEnabled)
{
    return RenderNewCheckout();
}
else
{
    return RenderLegacyCheckout();
}

// Subscribe to updates
replane.ConfigChanged += (sender, e) =>
{
    if (e.ConfigName == "feature-new-checkout")
    {
        Console.WriteLine($"Feature flag changed: {e.GetValue<bool>()}");
    }
};`
    }
  ]
}

export default function FeatureFlagsPage() {
  return <UseCaseLayout {...content} />
}
