import Link from '@docusaurus/Link'

const FeatureList = [
  {
    title: 'Version History & Rollback',
    icon: '🕐',
    description: (
      <>
        Every config change creates an append-only snapshot. Roll back to any previous version
        instantly when things go wrong. Full audit trail included.
      </>
    ),
    link: '/docs/guides/rollback'
  },
  {
    title: 'Realtime Updates',
    icon: '⚡',
    description: (
      <>
        Changes propagate to your applications in realtime via Server-Sent Events (SSE). No polling,
        no delays. Your apps stay in sync automatically.
      </>
    ),
    link: '/docs/concepts/overview#realtime-updates-sse'
  },
  {
    title: 'JSON Schema Validation',
    icon: '✓',
    description: (
      <>
        Attach JSON schemas to prevent invalid configs. Block out-of-range values and enforce
        structure before changes are saved. Keep your configs safe.
      </>
    ),
    link: '/docs/concepts/overview#json-schema-validation'
  },
  {
    title: 'Role-Based Access',
    icon: '🔐',
    description: (
      <>
        Granular permissions with owner, editor, and viewer roles. Control who can view, modify, or
        manage configs. SDK keys for programmatic access.
      </>
    ),
    link: '/docs/concepts/overview#roles--permissions'
  },
  {
    title: 'Self-Hosted',
    icon: '🏠',
    description: (
      <>
        Run on your infrastructure with full data ownership. Simple Docker deployment with
        PostgreSQL. No external dependencies or vendor lock-in.
      </>
    ),
    link: '/docs/self-hosting/docker'
  },
  {
    title: 'Developer-Friendly',
    icon: '🛠️',
    description: (
      <>
        Simple REST API and lightweight SDKs for JavaScript/TypeScript. Works in Node.js, browsers,
        and edge runtimes. Zero dependencies.
      </>
    ),
    link: '/docs/sdk/javascript'
  }
]

function Feature({ icon, title, description, link }) {
  return (
    <div className='group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800'>
      {/* Gradient accent on hover */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-950/20 dark:to-purple-950/20' />

      <div className='relative'>
        <div className='mb-4 text-5xl'>{icon}</div>
        <h3 className='mb-3 text-xl font-bold text-gray-900 dark:text-white'>{title}</h3>
        <p className='mb-6 text-gray-600 dark:text-gray-300'>{description}</p>
        <Link
          to={link}
          className='inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:gap-3 hover:text-blue-700 hover:no-underline dark:text-blue-400 dark:hover:text-blue-300'
        >
          Learn more
          <svg
            className='h-4 w-4 transition-transform group-hover:translate-x-1'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className='bg-gray-50 px-4 py-20 dark:bg-gray-900'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white'>
            Everything you need for production
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            Enterprise-grade configuration management without the complexity
          </p>
        </div>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
