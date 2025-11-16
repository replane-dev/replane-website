const FeatureList = [
  {
    title: 'Version History & Rollback',
    icon: '🕐',
    description: (
      <>
        Every config change creates an append-only snapshot. Roll back to any previous version
        instantly when things go wrong. Full audit trail included.
      </>
    )
  },
  {
    title: 'Realtime Updates',
    icon: '⚡',
    description: (
      <>
        Changes propagate to your applications in realtime via Server-Sent Events (SSE). No polling,
        no delays. Your apps stay in sync automatically.
      </>
    )
  },
  {
    title: 'JSON Schema Validation',
    icon: '✓',
    description: (
      <>
        Attach JSON schemas to prevent invalid configs. Block out-of-range values and enforce structure
        before changes are saved. Keep your configs safe.
      </>
    )
  },
  {
    title: 'Role-Based Access',
    icon: '🔐',
    description: (
      <>
        Granular permissions with owner, editor, and viewer roles. Control who can view, modify, or
        manage configs. API keys for programmatic access.
      </>
    )
  },
  {
    title: 'Self-Hosted',
    icon: '🏠',
    description: (
      <>
        Run on your infrastructure with full data ownership. Simple Docker deployment with PostgreSQL.
        No external dependencies or vendor lock-in.
      </>
    )
  },
  {
    title: 'Developer-Friendly',
    icon: '🛠️',
    description: (
      <>
        Simple REST API and lightweight SDKs for JavaScript/TypeScript and Python. Works in Node.js,
        browsers, and edge runtimes. Zero dependencies.
      </>
    )
  }
]

function Feature({ icon, title, description }) {
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800'>
      <div className='mb-3 text-4xl'>{icon}</div>
      <div>
        <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>{title}</h3>
        <p className='text-gray-600 dark:text-gray-300'>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className='py-16 px-4'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white'>
            Everything you need for production config management
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            Built for teams and developers who need reliable, auditable configuration management
            without the complexity of feature flag platforms.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
