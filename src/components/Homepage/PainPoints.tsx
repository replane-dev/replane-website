import React from 'react'
import { AlertTriangle, RotateCcw, FolderOpen, FileSearch } from 'lucide-react'

interface Problem {
  icon: React.ReactNode
  title: string
  description: string
}

const problems: Problem[] = [
  {
    icon: <AlertTriangle className='h-6 w-6' />,
    title: 'Deploying for Every Config Change',
    description:
      'Want to adjust a rate limit? Need a full deployment. Want to disable a feature? Wait for CI/CD. Every config change requires code deployment.'
  },
  {
    icon: <RotateCcw className='h-6 w-6' />,
    title: 'No History or Rollback',
    description:
      "Changed a setting that broke production? Good luck remembering what it was. No version history means no easy way to undo mistakes."
  },
  {
    icon: <FolderOpen className='h-6 w-6' />,
    title: 'Scattered Config Everywhere',
    description:
      'Feature flags in LaunchDarkly. Env vars in AWS. Settings in a database. Google Sheet for operational values. Where is the source of truth?'
  },
  {
    icon: <FileSearch className='h-6 w-6' />,
    title: 'No Audit Trail',
    description:
      "Who changed that critical setting? When? Why? Without audit logs, you're flying blind during incidents and compliance reviews."
  }
]

export default function PainPoints() {
  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background - stone dark */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0c0a09] to-[#1c1917]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            The Problem
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Tired of this?
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            Common pain points when managing application configuration
          </p>
        </div>

        {/* Problems grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {problems.map((problem, idx) => (
            <div
              key={idx}
              className='group relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 p-6 transition-all duration-300 hover:border-stone-600'
            >
              {/* Icon */}
              <div className='mb-4 inline-flex rounded-xl bg-stone-800 p-3 text-stone-400'>
                {problem.icon}
              </div>

              {/* Content */}
              <h3 className='mb-3 text-lg font-bold text-stone-100'>{problem.title}</h3>
              <p className='text-sm leading-relaxed text-stone-400'>{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
