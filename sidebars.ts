import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

import replaneSidebar from './docs/api/sidebar'

const sidebars: SidebarsConfig = {
  'docsSidebar': [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/quickstart',
        'getting-started/installation'
      ]
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      items: [
        'concepts/overview',
        'concepts/architecture'
      ]
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
      items: [
        'self-hosting/docker',
        'self-hosting/environment-variables'
      ]
    },
    {
      type: 'category',
      label: 'SDK',
      collapsed: false,
      items: [
        'sdk/javascript',
        'sdk/python',
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
