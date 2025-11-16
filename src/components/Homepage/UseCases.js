import React from 'react'

const useCases = [
  {
    title: 'Feature Flags',
    icon: '🎚️',
    problem: 'Deploying new features is risky. One bug can take down production.',
    solution: 'Ship code with features off. Enable for 1% → 10% → 100% of users. Kill switch ready if things go wrong.',
    example: {
      before: '{ "new-checkout": false }',
      after: '{ "new-checkout": true }'
    }
  },
  {
    title: 'Operational Tuning',
    icon: '⚙️',
    problem: 'Your API is getting hammered. Need to adjust rate limits NOW, not after a 20-minute deployment.',
    solution: 'Change rate limits, cache TTLs, batch sizes instantly. No deploy, no restart, no downtime.',
    example: {
      before: '{ "rate-limit": 100 }',
      after: '{ "rate-limit": 500 }'
    }
  },
  {
    title: 'Incident Response',
    icon: '🚨',
    problem: 'Production is on fire. A config change caused it but you don\'t remember what it was.',
    solution: 'Version history shows every change. Click rollback, back to safety in seconds.',
    example: {
      before: 'Version 47 (broken)',
      after: 'Rolled back to Version 46'
    }
  },
  {
    title: 'A/B Testing',
    icon: '🧪',
    problem: 'Want to test if blue or green buttons convert better? Need engineering to implement tracking.',
    solution: 'Store variant percentages in config. Product team adjusts, engineering focuses on features.',
    example: {
      before: '{ "button-color": "blue" }',
      after: '{ "blue": 50, "green": 50 }'
    }
  }
]

export default function UseCases() {
  return (
    <section className='bg-gradient-to-b from-white to-gray-50 py-16 px-4 dark:from-gray-800 dark:to-gray-900'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white'>
            Real-World Use Cases
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            See how teams use Replane to ship faster and sleep better
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {useCases.map((useCase, idx) => (
            <div
              key={idx}
              className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
            >
              <div className='mb-4 flex items-center gap-3'>
                <div className='text-4xl'>{useCase.icon}</div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>{useCase.title}</h3>
              </div>

              <div className='mb-4'>
                <p className='mb-2 text-sm font-semibold text-red-600 dark:text-red-400'>
                  ❌ The Problem:
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-300'>{useCase.problem}</p>
              </div>

              <div className='mb-4'>
                <p className='mb-2 text-sm font-semibold text-green-600 dark:text-green-400'>
                  ✅ With Replane:
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-300'>{useCase.solution}</p>
              </div>

              <div className='rounded-md bg-gray-50 p-3 dark:bg-gray-900'>
                <div className='flex items-center justify-between gap-2 text-xs'>
                  <code className='font-mono text-gray-700 dark:text-gray-300'>
                    {useCase.example.before}
                  </code>
                  <span className='text-gray-400'>→</span>
                  <code className='font-mono text-gray-700 dark:text-gray-300'>
                    {useCase.example.after}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
