import { FileText, Edit3, Users, Zap, History, Eye, Layers, Clock } from 'lucide-react'
import { UseCaseLayout, type UseCaseContent } from '@/components/UseCasePage'

const content: UseCaseContent = {
  badge: 'Content Management',
  title: 'Update content without deploys',
  subtitle: 'Simple CMS alternative for UI text and copy',
  description:
    'Store UI labels, marketing copy, and announcements in Replane. Non-developers update content directly from the dashboard—no CMS overhead, no deploy cycles.',
  accentColor: 'teal',

  painPoints: [
    {
      title: 'Hardcoded text',
      description: 'Fixing a typo requires a code change, PR review, and full deployment.'
    },
    {
      title: 'CMS overhead',
      description: 'Full CMS is overkill for simple text. Too complex to set up and maintain.'
    },
    {
      title: 'Engineering bottleneck',
      description: 'Marketing waits for devs to update copy. Simple changes take days.'
    },
    {
      title: 'Slow content updates',
      description: "Can't respond quickly to events. Time-sensitive content goes stale."
    }
  ],
  solutions: [
    {
      title: 'Externalized content',
      description: 'Store UI text in Replane. Update without touching code.'
    },
    {
      title: 'Lightweight CMS',
      description: 'Simple dashboard for text, no complex CMS infrastructure.'
    },
    {
      title: 'Self-service editing',
      description: 'Marketing and product teams edit content directly.'
    },
    {
      title: 'Instant updates',
      description: 'Changes go live immediately. Perfect for time-sensitive content.'
    }
  ],

  features: [
    { title: 'Instant Publish', description: 'Content goes live in under a second', icon: <Zap className='h-6 w-6' /> },
    { title: 'No Deploys', description: 'Update content without code changes', icon: <Layers className='h-6 w-6' /> },
    { title: 'Full Version History', description: 'Every revision saved and restorable', icon: <Clock className='h-6 w-6' /> },
    { title: 'Self-Service', description: 'Non-technical teams can update content', icon: <Users className='h-6 w-6' /> }
  ],

  steps: [
    {
      title: 'Define content configs',
      description:
        'Create configs for UI text, announcements, and marketing copy. Use simple strings or structured JSON.',
      icon: <FileText className='h-8 w-8' />
    },
    {
      title: 'Integrate with your app',
      description:
        'Use the SDK to fetch content. Components update automatically when content changes.',
      icon: <Edit3 className='h-8 w-8' />
    },
    {
      title: 'Enable self-service',
      description:
        'Give marketing and content teams dashboard access. They edit, you focus on features.',
      icon: <Users className='h-8 w-8' />
    }
  ],
  benefits: [
    {
      title: 'Instant publishing',
      description:
        'Content updates propagate immediately via SSE. No waiting for deployments.',
      icon: <Zap className='h-6 w-6' />
    },
    {
      title: 'Version control',
      description:
        'Full history of content changes. Rollback to previous versions with one click.',
      icon: <History className='h-6 w-6' />
    },
    {
      title: 'Preview before publish',
      description:
        'Review changes in staging before pushing to production.',
      icon: <Eye className='h-6 w-6' />
    }
  ],

  faq: [
    {
      question: 'How is this different from a traditional CMS?',
      answer:
        'Replane is much simpler. No complex content models, no database, no infrastructure to manage. Just key-value configs for your text content. Perfect when you need to update UI text but don not need a full CMS.'
    },
    {
      question: 'Can I store rich text or HTML?',
      answer:
        'Yes! Store markdown or HTML strings in Replane. Your frontend renders them as needed. For complex layouts, consider a headless CMS—Replane excels at simpler content like labels, copy, and announcements.'
    },
    {
      question: 'How do I handle translations?',
      answer:
        'Create separate configs for each locale (e.g., "hero-title-en", "hero-title-es"), or store a JSON object with all translations. Use override rules to serve content based on user locale.'
    },
    {
      question: 'Who can edit content?',
      answer:
        'Anyone you give dashboard access to. Role-based access control lets you define who can view, edit, or publish content changes. Marketing edits copy, engineering approves if needed.'
    },
    {
      question: 'What about images and media?',
      answer:
        'Store image URLs in Replane, not the images themselves. Host images on a CDN or media service, then reference URLs in your content configs. This keeps Replane fast and focused.'
    }
  ],

  relatedUseCases: [
    {
      title: 'Feature Flags',
      description: 'Control which content sections are visible.',
      href: '/use-cases/feature-flags',
      accentColor: 'blue'
    },
    {
      title: 'A/B Testing',
      description: 'Test different copy variations.',
      href: '/use-cases/ab-testing',
      accentColor: 'amber'
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
  'hero-title': string
  'hero-subtitle': string
  'announcement-banner': {
    enabled: boolean
    message: string
    type: 'info' | 'warning' | 'promo'
  }
}

const replane = new Replane<Configs>()

await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

// Get content values
const heroTitle = replane.get('hero-title')
const heroSubtitle = replane.get('hero-subtitle')
const announcement = replane.get('announcement-banner')

// Content updates automatically when changed in dashboard
replane.subscribe('announcement-banner', (config) => {
  if (config.value.enabled) {
    showBanner(config.value.message, config.value.type)
  } else {
    hideBanner()
  }
})`
    },
    {
      sdk: 'react',
      label: 'React',
      docsLink: '/docs/sdk/react',
      code: `import { useConfig } from '@replanejs/react'

function HeroSection() {
  // Content updates automatically when changed in dashboard
  const title = useConfig<string>('hero-title')
  const subtitle = useConfig<string>('hero-subtitle')
  const ctaText = useConfig<string>('hero-cta-text')

  return (
    <section className="hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <button>{ctaText}</button>
    </section>
  )
}

function AnnouncementBanner() {
  const announcement = useConfig<{
    enabled: boolean
    message: string
    type: 'info' | 'warning' | 'promo'
  }>('announcement-banner')

  if (!announcement.enabled) return null

  return (
    <div className={\`banner banner-\${announcement.type}\`}>
      {announcement.message}
    </div>
  )
}

// Marketing team updates content in dashboard
// Component re-renders with new text automatically`
    },
    {
      sdk: 'nextjs',
      label: 'Next.js',
      docsLink: '/docs/sdk/nextjs',
      code: `// app/page.tsx
import { getReplaneSnapshot } from '@replanejs/next'

export default async function HomePage() {
  const snapshot = await getReplaneSnapshot({
    connection: {
      baseUrl: process.env.REPLANE_BASE_URL!,
      sdkKey: process.env.REPLANE_SDK_KEY!
    }
  })
  
  const title = snapshot.get('hero-title')
  const subtitle = snapshot.get('hero-subtitle')
  const ctaText = snapshot.get('hero-cta-text')

  return (
    <main>
      <section className="hero">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <button>{ctaText}</button>
      </section>
    </main>
  )
}

// Client component for dynamic content
'use client'
import { useConfig } from '@replanejs/next'

function LiveAnnouncement() {
  const announcement = useConfig<{
    enabled: boolean
    message: string
  }>('announcement-banner')

  if (!announcement.enabled) return null
  return <Banner>{announcement.message}</Banner>
}`
    },
    {
      sdk: 'svelte',
      label: 'Svelte',
      docsLink: '/docs/sdk/svelte',
      code: `<script>
  import { config } from '@replanejs/svelte'

  // Content from Replane
  const title = config<string>('hero-title')
  const subtitle = config<string>('hero-subtitle')
  const ctaText = config<string>('hero-cta-text')
  const announcement = config<{
    enabled: boolean
    message: string
    type: string
  }>('announcement-banner')
</script>

{#if $announcement.enabled}
  <div class="banner banner-{$announcement.type}">
    {$announcement.message}
  </div>
{/if}

<section class="hero">
  <h1>{$title}</h1>
  <p>{$subtitle}</p>
  <button>{$ctaText}</button>
</section>

<!-- Marketing updates text in dashboard -->
<!-- Page updates automatically, no deploy needed -->`
    },
    {
      sdk: 'python',
      label: 'Python',
      docsLink: '/docs/sdk/python',
      code: `from replane import Replane
from flask import Flask, render_template
import os

app = Flask(__name__)

replane = Replane(
    base_url=os.environ["REPLANE_BASE_URL"],
    sdk_key=os.environ["REPLANE_SDK_KEY"]
)

@app.route("/")
def home():
    # Get content from Replane
    content = {
        "title": replane.get("hero-title"),
        "subtitle": replane.get("hero-subtitle"),
        "cta_text": replane.get("hero-cta-text"),
        "announcement": replane.get("announcement-banner")
    }
    
    return render_template("home.html", **content)

# In template:
# <h1>{{ title }}</h1>
# <p>{{ subtitle }}</p>
# {% if announcement.enabled %}
#   <div class="banner">{{ announcement.message }}</div>
# {% endif %}

# Marketing updates content in dashboard
# Next page load shows new content`
    },
    {
      sdk: 'csharp',
      label: '.NET',
      docsLink: '/docs/sdk/dotnet',
      code: `using Replane;
using Microsoft.AspNetCore.Mvc;

public class ContentController : Controller
{
    private readonly IReplaneClient _replane;

    public ContentController(IReplaneClient replane)
    {
        _replane = replane;
    }

    public IActionResult Index()
    {
        var model = new HomeViewModel
        {
            Title = _replane.Get<string>("hero-title"),
            Subtitle = _replane.Get<string>("hero-subtitle"),
            CtaText = _replane.Get<string>("hero-cta-text"),
            Announcement = _replane.Get<Announcement>("announcement-banner")
        };
        
        return View(model);
    }
}

public class Announcement
{
    public bool Enabled { get; set; }
    public string Message { get; set; }
    public string Type { get; set; }
}

// In Razor view:
// <h1>@Model.Title</h1>
// <p>@Model.Subtitle</p>
// @if (Model.Announcement.Enabled)
// {
//     <div class="banner">@Model.Announcement.Message</div>
// }`
    }
  ]
}

export default function ContentManagementPage() {
  return <UseCaseLayout {...content} />
}
