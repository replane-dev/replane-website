import React from 'react'
import Link from '@docusaurus/Link'
import { Github } from 'lucide-react'

type LinkKey = 'cloud' | 'self-hosting' | 'docs' | 'concepts' | 'quickstart' | 'sdk'

interface TryReplaneCTAProps {
  /** Custom title. Defaults to "Try Replane" */
  title?: string
  /** Custom description. Defaults to the standard description */
  description?: string
  /** Which links to show. Defaults to all */
  links?: LinkKey[]
}

const linkConfigs = {
  'cloud': {
    href: 'https://cloud.replane.dev',
    label: 'Replane Cloud',
    description: 'Managed service with a free tier'
  },
  'self-hosting': {
    href: '/docs/self-hosting/docker',
    label: 'Self-hosting guide',
    description: 'Run on your own infrastructure'
  },
  'docs': {
    href: '/docs',
    label: 'Documentation',
    description: 'Full reference and guides'
  },
  'concepts': {
    href: '/docs/concepts/overview',
    label: 'Core concepts',
    description: 'Learn about workspaces, projects, and configs'
  },
  'quickstart': {
    href: '/docs/getting-started/quickstart',
    label: 'Quickstart',
    description: 'Get started in under 5 minutes'
  },
  'sdk': {
    href: '/docs/sdk/javascript',
    label: 'JavaScript SDK',
    description: 'Full API reference'
  }
}

const DEFAULT_LINKS: LinkKey[] = ['cloud', 'self-hosting', 'concepts']

export default function TryReplaneCTA({
  title = 'Try Replane',
  description = 'Replane is an open-source dynamic configuration platform with real-time updates via SSE, version history, instant rollback, and SDKs for JavaScript, Python, and .NET.',
  links
}: TryReplaneCTAProps) {
  const resolvedLinks = links ?? DEFAULT_LINKS

  return (
    <div className='mt-12'>
      <h2>{title}</h2>
      <p>{description}</p>

      <ul>
        {resolvedLinks.map((linkKey) => {
          const config = linkConfigs[linkKey]
          if (!config) return null

          const { href, label, description: linkDesc } = config
          const isExternal = href.startsWith('http')

          return (
            <li key={linkKey}>
              <Link
                href={href}
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <strong>{label}</strong>
              </Link>{' '}
              — {linkDesc}
            </li>
          )
        })}
      </ul>

      <p>
        MIT licensed.{' '}
        <Link
          href='https://github.com/replane-dev/replane'
          className='inline-flex items-center gap-1'
        >
          View on GitHub
        </Link>
        .
      </p>
    </div>
  )
}
