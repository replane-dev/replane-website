import React from 'react'
import Link from '@docusaurus/Link'
import { History, Zap, Shield, Users, Cloud, Code2, ArrowRight } from 'lucide-react'

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
  link: string
  size: 'small' | 'large'
}

const features: Feature[] = [
  {
    title: 'Version History & Rollback',
    description:
      'Every change creates an immutable snapshot. Roll back to any previous version instantly when things go wrong. Full audit trail included.',
    icon: <History className='h-6 w-6 text-blue-400' />,
    link: '/docs/concepts/overview#versions',
    size: 'large'
  },
  {
    title: 'Realtime Updates',
    description:
      'Changes propagate instantly via Server-Sent Events. No polling, no delays. Your apps stay in sync automatically.',
    icon: <Zap className='h-6 w-6 text-amber-400' />,
    link: '/docs/concepts/architecture#realtime-updates',
    size: 'small'
  },
  {
    title: 'JSON Schema Validation',
    description:
      'Attach schemas to prevent invalid configs. Block out-of-range values before they reach production.',
    icon: <Shield className='h-6 w-6 text-emerald-400' />,
    link: '/docs/guides/operational-tuning#json-schema-validation',
    size: 'small'
  },
  {
    title: 'Role-Based Access',
    description:
      'Granular permissions with owner, editor, and viewer roles. Control who can view, modify, or manage configs. SDK keys for programmatic access.',
    icon: <Users className='h-6 w-6 text-violet-400' />,
    link: '/docs/concepts/overview#workspaces',
    size: 'small'
  },
  {
    title: 'Cloud or Self-Hosted',
    description:
      "Deploy on your infrastructure with Docker. Same API, same features, no lock-in.",
    icon: <Cloud className='h-6 w-6 text-sky-400' />,
    link: '/docs/getting-started/quickstart',
    size: 'small'
  },
  {
    title: 'Developer-Friendly',
    description:
      'Simple REST API and lightweight SDKs for JavaScript/TypeScript. Works in Node.js, browsers, and edge runtimes. Zero dependencies.',
    icon: <Code2 className='h-6 w-6 text-rose-400' />,
    link: '/docs/sdk/javascript',
    size: 'large'
  }
]

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Link
      to={feature.link}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 p-6 transition-all duration-300 hover:border-stone-600 hover:shadow-xl hover:no-underline ${
        feature.size === 'large' ? 'md:col-span-2 md:p-8' : ''
      }`}
    >
      {/* Hover gradient effect */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-stone-500/10 to-stone-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

      <div className='relative z-10'>
        {/* Icon */}
        <div className='mb-4 inline-flex rounded-xl bg-stone-800/80 p-3 transition-colors group-hover:bg-stone-700'>
          {feature.icon}
        </div>

        {/* Content */}
        <h3
          className={`mb-2 font-bold text-stone-100 ${
            feature.size === 'large' ? 'text-xl md:text-2xl' : 'text-lg'
          }`}
        >
          {feature.title}
        </h3>

        <p
          className={`mb-4 leading-relaxed text-stone-400 ${
            feature.size === 'large' ? 'text-base' : 'text-sm'
          }`}
        >
          {feature.description}
        </p>

        {/* Link arrow */}
        <div className='mt-auto flex items-center gap-2 text-sm font-medium text-stone-300'>
          <span>Learn more</span>
          <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
        </div>
      </div>
    </Link>
  )
}

export default function HomepageFeatures() {
  return (
    <section className='relative py-24'>
      {/* Background - stone dark */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1c1917] to-[#0c0a09]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Everything you need for production
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            Enterprise-grade configuration management without the complexity
          </p>
        </div>

        {/* Bento grid */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-6'>
          {/* First row: 2 cols + 1 col + 1 col */}
          <FeatureCard feature={features[0]} />
          <FeatureCard feature={features[1]} />
          <FeatureCard feature={features[2]} />

          {/* Second row: 1 col + 1 col + 2 cols */}
          <FeatureCard feature={features[3]} />
          <FeatureCard feature={features[4]} />
          <FeatureCard feature={features[5]} />
        </div>
      </div>
    </section>
  )
}
