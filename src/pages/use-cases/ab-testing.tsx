import { BarChart3, Percent, Target, TrendingUp, Shuffle, LineChart } from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'A/B Testing',
  title: 'Test variants at scale',
  subtitle: 'Store experiment splits in config, not code',
  description:
    'Define experiment variants and traffic splits in Replane. Product teams adjust percentages without engineering involvement. Consistent assignment across sessions.',
  accentColor: 'amber',

  painPoints: [
    {
      title: 'Hardcoded experiment logic',
      description: 'Traffic splits are buried in code. Changing percentages requires a deploy.'
    },
    {
      title: 'Inconsistent user experience',
      description: 'Users see different variants on page refresh or across devices.'
    },
    {
      title: 'Slow iteration cycles',
      description:
        'Product teams wait for engineering to adjust splits. Experiments take weeks to tune.'
    },
    {
      title: 'No real-time adjustments',
      description:
        "Can't scale winners or pause losers quickly. Losing money while waiting for deploys."
    }
  ],
  solutions: [
    {
      title: 'Config-driven experiments',
      description:
        'Define variants and percentages in Replane. Change splits without touching code.'
    },
    {
      title: 'Consistent hashing',
      description: 'Users always see the same variant across sessions, devices, and page reloads.'
    },
    {
      title: 'Self-service for product',
      description: 'Product teams adjust experiments directly. No engineering bottleneck.'
    },
    {
      title: 'Instant traffic shifts',
      description:
        'Scale winners to 100% or pause losers immediately. Changes apply in milliseconds.'
    }
  ],

  stats: [
    { value: '100%', label: 'Consistent', description: 'Same variant across sessions' },
    { value: '<1s', label: 'Traffic shifts', description: 'Changes propagate instantly' },
    { value: '0', label: 'Deploys', description: 'Adjust splits without code' },
    { value: '∞', label: 'Variants', description: 'No limit on experiment variants' }
  ],

  steps: [
    {
      title: 'Define variants',
      description:
        'Create an experiment config with variant names and traffic percentages. No code changes required.',
      icon: <Percent className='h-8 w-8' />
    },
    {
      title: 'Assign consistently',
      description:
        'Use our built-in hashing to ensure users see the same variant across sessions and devices.',
      icon: <Target className='h-8 w-8' />
    },
    {
      title: 'Adjust in real-time',
      description:
        'Shift traffic between variants instantly. Scale winners, pause losers—no deploy needed.',
      icon: <TrendingUp className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Consistent assignment',
      description:
        'Built-in hashing ensures users see the same variant across sessions, devices, and page reloads.',
      icon: <Shuffle className='h-6 w-6' />
    },
    {
      title: 'Real-time traffic shifts',
      description: 'Adjust variant percentages instantly. No code changes, no deploys, no waiting.',
      icon: <BarChart3 className='h-6 w-6' />
    },
    {
      title: 'Track everything',
      description:
        'Full audit log of all changes. Know exactly when traffic splits changed for accurate analysis.',
      icon: <LineChart className='h-6 w-6' />
    }
  ],

  faq: [
    {
      question: 'How does consistent assignment work?',
      answer:
        'Replane uses consistent hashing based on your context properties (like userId). The same user always gets the same variant, even across different sessions or devices. The hash is deterministic and stable.'
    },
    {
      question: 'Can I run multiple experiments simultaneously?',
      answer:
        'Yes! Each experiment is a separate config. You can run as many concurrent experiments as you need. Just make sure to track which experiments each user is exposed to for accurate analysis.'
    },
    {
      question: 'How do I analyze experiment results?',
      answer:
        'Replane focuses on experiment assignment, not analytics. Track experiment exposure events in your analytics tool (Mixpanel, Amplitude, etc.) and analyze results there. This separation of concerns gives you maximum flexibility.'
    },
    {
      question: 'What happens when I change traffic splits?',
      answer:
        'Changes propagate instantly via SSE. New users get assigned based on updated percentages. Existing users may get reassigned if their hash bucket changes—this is expected behavior when adjusting splits.'
    },
    {
      question: 'Can I target specific user segments?',
      answer:
        'Yes! Use override rules to target specific segments. For example, show variant_a only to premium users, or exclude certain regions from an experiment entirely.'
    }
  ],

  relatedUseCases: [
    {
      title: 'Feature Flags',
      description: 'Ship code with features off and enable gradually.',
      href: '/use-cases/feature-flags',
      accentColor: 'blue'
    },
    {
      title: 'Instant Rollback',
      description: 'Revert experiment config to any previous state.',
      href: '/use-cases/instant-rollback',
      accentColor: 'emerald'
    },
    {
      title: 'Multi-Tenant',
      description: 'Run different experiments for different customers.',
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

interface Configs {
  'checkout-experiment': 'control' | 'variant_a' | 'variant_b'
}

const replane = new Replane<Configs>()

await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

// Get variant for user (consistent across sessions)
const variant = replane.get('checkout-experiment', {
  context: { userId: user.id }
})

switch (variant) {
  case 'control':
    return renderClassicCheckout()
  case 'variant_a':
    return renderStreamlinedCheckout()
  case 'variant_b':
    return renderOneClickCheckout()
}

// Track conversion for analytics
analytics.track('checkout_started', {
  experiment: 'checkout-experiment',
  variant,
  userId: user.id
})`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { useConfig } from '@replanejs/react'
import { useAuth } from './auth'

function CheckoutExperiment() {
  const { userId } = useAuth()
  
  // Get variant with context for consistent assignment
  const variant = useConfig<string>('checkout-experiment', {
    context: { userId }
  })

  // Track exposure for analytics
  useEffect(() => {
    analytics.track('experiment_exposure', {
      experiment: 'checkout-experiment',
      variant,
      userId
    })
  }, [variant, userId])

  switch (variant) {
    case 'control':
      return <ClassicCheckout />
    case 'variant_a':
      return <StreamlinedCheckout />
    case 'variant_b':
      return <OneClickCheckout />
    default:
      return <ClassicCheckout />
  }
}`
    },
    {
      sdk: 'nextjs',
      label: 'Next.js',
      docsLink: '/docs/sdk/nextjs',
      code: `// app/checkout/page.tsx
'use client'
import { useConfig } from '@replanejs/next'
import { useSession } from 'next-auth/react'

export default function CheckoutPage() {
  const { data: session } = useSession()
  
  const variant = useConfig<string>('checkout-experiment', {
    context: { userId: session?.user?.id }
  })

  const components = {
    control: <ClassicCheckout />,
    variant_a: <StreamlinedCheckout />,
    variant_b: <OneClickCheckout />
  }

  return components[variant] || <ClassicCheckout />
}

// Config in Replane dashboard uses segmentation
// to assign users to variants based on userId hash`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'
  import { page } from '$app/stores'

  // Get variant with user context
  const variant = config<string>('checkout-experiment', { 
    context: { userId: $page.data.user.id }
  })
</script>

{#if $variant === 'control'}
  <ClassicCheckout />
{:else if $variant === 'variant_a'}
  <StreamlinedCheckout />
{:else if $variant === 'variant_b'}
  <OneClickCheckout />
{:else}
  <ClassicCheckout />
{/if}`
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
    # Get variant for user (consistent assignment)
    variant = replane.get(
        "checkout-experiment",
        context={"user_id": user.id}
    )

    # Render appropriate experience
    match variant:
        case "control":
            return render_classic_checkout()
        case "variant_a":
            return render_streamlined_checkout()
        case "variant_b":
            return render_one_click_checkout()
        case _:
            return render_classic_checkout()

    # Track for analytics
    analytics.track("experiment_exposure", {
        "experiment": "checkout-experiment",
        "variant": variant,
        "user_id": user.id
    })`
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

// Get variant for user with context
var variant = replane.Get<string>("checkout-experiment",
    new ReplaneContext { ["userId"] = user.Id });

// Render appropriate experience
return variant switch
{
    "control" => RenderClassicCheckout(),
    "variant_a" => RenderStreamlinedCheckout(),
    "variant_b" => RenderOneClickCheckout(),
    _ => RenderClassicCheckout()
};`
    }
  ]
}

export default function ABTestingPage() {
  return <UseCaseLayout {...content} />
}
