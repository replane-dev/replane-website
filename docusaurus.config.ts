import type { Config } from '@docusaurus/types'
import type { Options as PresetClassicOptions, ThemeConfig } from '@docusaurus/preset-classic'
import type { PluginOptions as IdealImagePluginOptions } from '@docusaurus/plugin-ideal-image'

const config: Config = {
  clientModules: [require.resolve('./src/clientModules/sentry.ts')],

  headTags: [
    {
      tagName: 'script',
      attributes: {
        'defer': 'true',
        'data-domain': 'replane.dev',
        'src': 'https://plausible.tilyupo.com/js/script.js'
      }
    }
  ],

  title: 'Replane',
  tagline: 'Dynamic configuration for apps and services.',
  favicon: '/img/favicon.ico',

  // Set the production url of your site here
  url: 'https://replane.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  // Ensure all routes (and sitemap URLs) use trailing slashes, matching our hosting setup.
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'replane-dev', // Usually your GitHub org/user name.
  projectName: 'replane-website', // Usually your repo name.

  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn'
    }
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  // Enable Docusaurs Faster: https://github.com/facebook/docusaurus/issues/10556
  future: {
    experimental_faster: true,
    v4: true
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/replane-dev/replane-website/tree/main',
          docItemComponent: '@theme/ApiItem' // Derived from docusaurus-theme-openapi
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css'
        }
      } satisfies PresetClassicOptions
    ]
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    mermaid: {
      theme: {
        light: 'neutral',
        dark: 'dark'
      }
    },
    navbar: {
      title: 'Replane',
      logo: {
        alt: 'Replane Logo',
        src: 'img/logo.svg'
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
          to: '/docs/'
        },
        // {
        //   label: 'API',
        //   position: 'left',
        //   to: '/docs/api'
        // },
        {
          label: 'Pricing',
          position: 'left',
          to: '/pricing/'
        },
        {
          to: '/blog/',
          label: 'Blog',
          position: 'left'
        },
        {
          label: 'Use Cases',
          position: 'left',
          to: '/use-cases/'
        },
        {
          label: 'Cloud',
          position: 'left',
          href: 'https://cloud.replane.dev/app'
        },
        {
          href: 'https://cloud.replane.dev/auth/signin',
          label: 'Log in',
          position: 'right'
        },
        {
          href: 'https://cloud.replane.dev/auth/signin',
          label: 'Sign up',
          position: 'right'
        },
        {
          'href': 'https://github.com/replane-dev/replane',
          'position': 'right',
          'className': 'header-github-link',
          'aria-label': 'GitHub repository'
        }
      ]
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
        hideable: true
      }
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started/quickstart/'
            },
            {
              label: 'Concepts',
              to: '/docs/concepts/overview/'
            },
            {
              label: 'Self-Hosting',
              to: '/docs/self-hosting/docker/'
            },
            {
              label: 'API Reference',
              to: '/docs/api/'
            }
          ]
        },
        {
          title: 'SDK',
          items: [
            {
              label: 'JavaScript',
              to: '/docs/sdk/javascript/'
            },
            {
              label: 'React',
              to: '/docs/sdk/react/'
            },
            {
              label: 'Next.js',
              to: '/docs/sdk/nextjs/'
            },
            {
              label: 'Svelte',
              to: '/docs/sdk/svelte/'
            },
            {
              label: 'Python',
              to: '/docs/sdk/python/'
            },
            {
              label: '.NET',
              to: '/docs/sdk/dotnet/'
            }
          ]
        },
        {
          title: 'Use Cases',
          items: [
            {
              label: 'Feature Flags',
              to: '/use-cases/feature-flags/'
            },
            {
              label: 'A/B Testing',
              to: '/use-cases/ab-testing/'
            },
            {
              label: 'Kill Switch',
              to: '/use-cases/kill-switch/'
            },
            {
              label: 'Incident Response',
              to: '/use-cases/incident-response/'
            },
            {
              label: 'Multi-Tenant',
              to: '/use-cases/multi-tenant/'
            },
            {
              label: 'Operational Tuning',
              to: '/use-cases/operational-tuning/'
            },
            {
              label: 'Performance Tuning',
              to: '/use-cases/performance-tuning/'
            },
            {
              label: 'Content Management',
              to: '/use-cases/content-management/'
            },
            {
              label: 'Environment Config',
              to: '/use-cases/environment-config/'
            },
            {
              label: 'Product Config',
              to: '/use-cases/product-config/'
            },
            {
              label: 'Security Response',
              to: '/use-cases/security-response/'
            }
          ]
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/replane-dev/replane'
            },
            {
              label: 'Discussions',
              href: 'https://github.com/orgs/replane-dev/discussions'
            },
            {
              label: 'Issues',
              href: 'https://github.com/replane-dev/replane/issues'
            },
            {
              label: 'Blog',
              to: '/blog/'
            }
          ]
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Pricing',
              to: '/pricing/'
            },
            {
              label: 'Changelog',
              href: 'https://github.com/replane-dev/replane/releases'
            },
            {
              label: 'Contact',
              href: 'mailto:tilyupo@gmail.com'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Replane. Released under the MIT License.`
    },
    prism: {
      theme: require('prism-react-renderer').themes.github,
      darkTheme: require('prism-react-renderer').themes.vsDark,
      additionalLanguages: [
        'ruby',
        'csharp',
        'php',
        'java',
        'powershell',
        'json',
        'bash',
        'dart',
        'objectivec',
        'r',
        'typescript',
        'tsx',
        'jsx',
        'yaml',
        'toml',
        'diff',
        'markup'
      ],
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' }
        }
      ]
    },
    languageTabs: [
      {
        highlight: 'python',
        language: 'python',
        logoClass: 'python'
      },
      {
        highlight: 'bash',
        language: 'curl',
        logoClass: 'curl'
      },
      {
        highlight: 'csharp',
        language: 'csharp',
        logoClass: 'csharp'
      },
      {
        highlight: 'go',
        language: 'go',
        logoClass: 'go'
      },
      {
        highlight: 'javascript',
        language: 'nodejs',
        logoClass: 'nodejs'
      },
      {
        highlight: 'ruby',
        language: 'ruby',
        logoClass: 'ruby'
      },
      {
        highlight: 'php',
        language: 'php',
        logoClass: 'php'
      },
      {
        highlight: 'java',
        language: 'java',
        logoClass: 'java',
        variant: 'unirest'
      },
      {
        highlight: 'powershell',
        language: 'powershell',
        logoClass: 'powershell'
      },
      {
        highlight: 'dart',
        language: 'dart',
        logoClass: 'dart'
      },
      {
        highlight: 'javascript',
        language: 'javascript',
        logoClass: 'javascript'
      },
      {
        highlight: 'c',
        language: 'c',
        logoClass: 'c'
      },
      {
        highlight: 'objective-c',
        language: 'objective-c',
        logoClass: 'objective-c'
      },
      {
        highlight: 'ocaml',
        language: 'ocaml',
        logoClass: 'ocaml'
      },
      {
        highlight: 'r',
        language: 'r',
        logoClass: 'r'
      },
      {
        highlight: 'swift',
        language: 'swift',
        logoClass: 'swift'
      },
      {
        highlight: 'kotlin',
        language: 'kotlin',
        logoClass: 'kotlin'
      },
      {
        highlight: 'rust',
        language: 'rust',
        logoClass: 'rust'
      }
    ]
  } satisfies ThemeConfig,

  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        indexPages: true,
        docsRouteBasePath: '/docs',
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: false,
        searchResultContextMaxLength: 50,
        searchResultLimits: 8,
        searchBarShortcut: true,
        searchBarShortcutHint: false
      }
    ],
    'docusaurus-theme-openapi-docs'
  ],
  plugins: [
    ['./src/plugins/webpack-alias.ts', {}],
    ['./src/plugins/tailwind-config.ts', {}],
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'openapi',
        docsPluginId: 'classic',
        config: {
          replane: {
            specPath: 'api-swagger/replane.yaml',
            outputDir: 'docs/api',
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag'
            },
            downloadUrl:
              'https://raw.githubusercontent.com/replane-dev/replane-website/main/api-swagger/replane.yaml',
            hideSendButton: false,
            showSchemas: true
          }
        }
      }
    ],
    [
      'ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        // Use false to debug, but it incurs huge perf costs
        disableInDev: true
      } satisfies IdealImagePluginOptions
    ],
    [
      './src/plugins/blog-plugin.ts',
      {
        path: 'blog',
        editLocalizedFiles: false,
        blogTitle: 'Blog',
        blogDescription:
          'Technical insights, tutorials, and updates on self-hosted configuration management with Replane',
        blogSidebarCount: 'ALL',
        blogSidebarTitle: 'List blog',
        routeBasePath: 'blog',
        include: ['**/*.md', '**/*.mdx'],
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**'
        ],
        postsPerPage: 6,
        truncateMarker: /<!--\s*(truncate)\s*-->/,
        showReadingTime: true,
        onUntruncatedBlogPosts: 'ignore',
        // Remove this to remove the "edit this page" links.
        editUrl: 'https://github.com/replane-dev/replane-website/tree/main/',
        remarkPlugins: [
          [
            require('@docusaurus/remark-plugin-npm2yarn'),
            {
              sync: true
            }
          ]
        ]
      }
    ]
  ]
}

export default config
