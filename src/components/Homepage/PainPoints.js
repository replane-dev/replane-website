import React from 'react'

const problems = [
  {
    icon: '😰',
    title: 'Deploying for Every Config Change',
    description: 'Want to adjust a rate limit? Need a full deployment. Want to disable a feature? Wait for CI/CD. Every config change requires code deployment.'
  },
  {
    icon: '😵',
    title: 'No History or Rollback',
    description: 'Changed a setting that broke production? Good luck remembering what it was. No version history means no easy way to undo mistakes.'
  },
  {
    icon: '😤',
    title: 'Scattered Config Everywhere',
    description: 'Feature flags in LaunchDarkly. Env vars in AWS. Settings in a database. Google Sheet for operational values. Where is the source of truth?'
  },
  {
    icon: '😱',
    title: 'No Audit Trail',
    description: "Who changed that critical setting? When? Why? Without audit logs, you're flying blind during incidents and compliance reviews."
  }
]

export default function PainPoints() {
  return (
    <section className='bg-gray-50 py-16 px-4 dark:bg-gray-900'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white'>
            Tired of This?
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            If you're managing application config, you've probably faced these problems
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {problems.map((problem, idx) => (
            <div
              key={idx}
              className='rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'
            >
              <div className='mb-3 text-4xl'>{problem.icon}</div>
              <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                {problem.title}
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-300'>{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
