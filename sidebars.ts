import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

import replaneSidebar from './docs/api/sidebar'

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: ['getting-started/quickstart', 'getting-started/installation']
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      items: ['concepts/overview', 'concepts/architecture']
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/feature-flags',
        'guides/override-rules',
        'guides/operational-tuning',
        'guides/gradual-rollouts'
      ]
    },
    {
      type: 'category',
      label: 'Self-Hosting',
      collapsed: false,
      items: ['self-hosting/docker', 'self-hosting/environment-variables']
    },
    {
      type: 'category',
      label: 'SDK',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'sdk/index'
      },
      items: [
        {
          type: 'category',
          label: 'JavaScript',
          link: { type: 'doc', id: 'sdk/javascript/index' },
          items: ['sdk/javascript/guide', 'sdk/javascript/api']
        },
        {
          type: 'category',
          label: 'React',
          link: { type: 'doc', id: 'sdk/react/index' },
          items: ['sdk/react/guide', 'sdk/react/api']
        },
        {
          type: 'category',
          label: 'Next.js',
          link: { type: 'doc', id: 'sdk/nextjs/index' },
          items: ['sdk/nextjs/guide', 'sdk/nextjs/api']
        },
        {
          type: 'category',
          label: 'Svelte',
          link: { type: 'doc', id: 'sdk/svelte/index' },
          items: ['sdk/svelte/guide', 'sdk/svelte/api']
        },
        {
          type: 'category',
          label: 'Python',
          link: { type: 'doc', id: 'sdk/python/index' },
          items: ['sdk/python/guide', 'sdk/python/api']
        },
        {
          type: 'category',
          label: '.NET',
          link: { type: 'doc', id: 'sdk/dotnet/index' },
          items: ['sdk/dotnet/guide', 'sdk/dotnet/api']
        },
        {
          type: 'category',
          label: 'Admin',
          link: { type: 'doc', id: 'sdk/admin/index' },
          items: ['sdk/admin/guide', 'sdk/admin/api']
        },
        'sdk/building-an-sdk'
      ]
    }
  ],

  // API Reference sidebar
  apisidebar: [
    {
      type: 'doc',
      id: 'api/index'
    },
    {
      type: 'category',
      label: 'Replane API',
      link: {
        type: 'doc',
        id: 'api/replane-api'
      },
      items: replaneSidebar
    }
  ]
}

export default sidebars
