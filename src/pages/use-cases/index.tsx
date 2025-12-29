import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import {
  Flag,
  Settings,
  RotateCcw,
  BarChart3,
  ShieldOff,
  Users,
  Gauge,
  FileText,
  Server,
  Sliders,
  Shield,
  ArrowRight
} from 'lucide-react'

interface UseCase {
  title: string
  description: string
  icon: React.ReactNode
  link: string
  accentColor: string
}

const useCases: UseCase[] = [
  {
    title: 'Feature Flags',
    description:
      'Ship code with features off. Enable gradually for 1% → 10% → 100% of users. Kill switch ready if things go wrong.',
    icon: <Flag className='h-6 w-6' />,
    link: '/use-cases/feature-flags',
    accentColor: 'blue'
  },
  {
    title: 'A/B Testing',
    description:
      'Store variant percentages in config. Product team adjusts splits, engineering ships features.',
    icon: <BarChart3 className='h-6 w-6' />,
    link: '/use-cases/ab-testing',
    accentColor: 'amber'
  },
  {
    title: 'Kill Switch',
    description:
      'Instantly disable problematic features in production. No deploy needed—just flip a toggle and stop the bleeding.',
    icon: <ShieldOff className='h-6 w-6' />,
    link: '/use-cases/kill-switch',
    accentColor: 'red'
  },
  {
    title: 'Instant Rollback',
    description:
      'Version history tracks every change. When production breaks, revert to safety in seconds.',
    icon: <RotateCcw className='h-6 w-6' />,
    link: '/use-cases/instant-rollback',
    accentColor: 'emerald'
  },
  {
    title: 'Multi-Tenant Settings',
    description:
      'Different configs for different customers. Adjust limits, enable features, or customize behavior per tenant.',
    icon: <Users className='h-6 w-6' />,
    link: '/use-cases/multi-tenant',
    accentColor: 'sky'
  },
  {
    title: 'Operational Tuning',
    description:
      'Adjust rate limits, cache TTLs, and batch sizes instantly. No deploy, no restart, no downtime.',
    icon: <Settings className='h-6 w-6' />,
    link: '/use-cases/operational-tuning',
    accentColor: 'violet'
  },
  {
    title: 'Performance Tuning',
    description:
      'Fine-tune cache durations, connection pools, retry policies, and timeouts in real-time without deploys.',
    icon: <Gauge className='h-6 w-6' />,
    link: '/use-cases/performance-tuning',
    accentColor: 'orange'
  },
  {
    title: 'Content Management',
    description:
      'Store UI text and marketing copy in Replane. Non-developers update content directly—no CMS overhead.',
    icon: <FileText className='h-6 w-6' />,
    link: '/use-cases/content-management',
    accentColor: 'teal'
  },
  {
    title: 'Environment Config',
    description:
      'Replace scattered .env files with centralized configuration. Same code, different configs per environment.',
    icon: <Server className='h-6 w-6' />,
    link: '/use-cases/environment-config',
    accentColor: 'indigo'
  },
  {
    title: 'Product Config',
    description:
      'Tune ranking weights, similarity thresholds, and relevance parameters. Data scientists iterate without deploys.',
    icon: <Sliders className='h-6 w-6' />,
    link: '/use-cases/product-config',
    accentColor: 'fuchsia'
  },
  {
    title: 'Security Response',
    description:
      'Revoke API keys, block IPs, and activate lockdown mode instantly. Respond to threats in seconds, not hours.',
    icon: <Shield className='h-6 w-6' />,
    link: '/use-cases/security-response',
    accentColor: 'rose'
  }
]

const accentColorClasses = {
  blue: {
    iconBg: 'bg-blue-500/20',
    iconText: 'text-blue-400',
    border: 'hover:border-blue-500/50'
  },
  amber: {
    iconBg: 'bg-amber-500/20',
    iconText: 'text-amber-400',
    border: 'hover:border-amber-500/50'
  },
  red: {
    iconBg: 'bg-red-500/20',
    iconText: 'text-red-400',
    border: 'hover:border-red-500/50'
  },
  emerald: {
    iconBg: 'bg-emerald-500/20',
    iconText: 'text-emerald-400',
    border: 'hover:border-emerald-500/50'
  },
  sky: {
    iconBg: 'bg-sky-500/20',
    iconText: 'text-sky-400',
    border: 'hover:border-sky-500/50'
  },
  violet: {
    iconBg: 'bg-violet-500/20',
    iconText: 'text-violet-400',
    border: 'hover:border-violet-500/50'
  },
  orange: {
    iconBg: 'bg-orange-500/20',
    iconText: 'text-orange-400',
    border: 'hover:border-orange-500/50'
  },
  teal: {
    iconBg: 'bg-teal-500/20',
    iconText: 'text-teal-400',
    border: 'hover:border-teal-500/50'
  },
  indigo: {
    iconBg: 'bg-indigo-500/20',
    iconText: 'text-indigo-400',
    border: 'hover:border-indigo-500/50'
  },
  fuchsia: {
    iconBg: 'bg-fuchsia-500/20',
    iconText: 'text-fuchsia-400',
    border: 'hover:border-fuchsia-500/50'
  },
  rose: {
    iconBg: 'bg-rose-500/20',
    iconText: 'text-rose-400',
    border: 'hover:border-rose-500/50'
  }
}

export default function UseCasesPage() {
  return (
    <div className='usecase-dark-only' data-theme='dark'>
      <Layout
        title='Use Cases | Replane'
        description='Discover how teams use Replane for feature flags, A/B testing, kill switches, operational tuning, and more.'
      >
        <main className='background-grid background-grid--fade-out'>
          {/* Hero Section */}
          <section className='relative overflow-hidden pb-16 pt-24'>
            <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='text-center'>
                <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800/50 px-4 py-1.5 text-sm font-medium text-stone-300'>
                  Use Cases
                </div>
                <h1 className='mb-6 text-4xl font-bold tracking-tight text-stone-100 sm:text-5xl lg:text-6xl'>
                  Built for real teams
                </h1>
                <p className='mx-auto max-w-3xl text-xl leading-relaxed text-stone-400'>
                  From feature flags to security response, Replane helps teams ship faster, respond
                  to incidents instantly, and give everyone the control they need.
                </p>
              </div>
            </div>
          </section>

          {/* Use Cases Grid */}
          <section className='relative py-16'>
            <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {useCases.map((useCase, idx) => {
                  const colors = accentColorClasses[useCase.accentColor]
                  return (
                    <Link
                      key={idx}
                      to={useCase.link}
                      className={`group relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/50 p-8 transition-all duration-300 hover:bg-stone-900 hover:shadow-xl hover:no-underline ${colors.border}`}
                    >
                      {/* Icon */}
                      <div className={`mb-5 inline-flex rounded-xl p-3 ${colors.iconBg}`}>
                        <div className={colors.iconText}>{useCase.icon}</div>
                      </div>

                      {/* Content */}
                      <h2 className='mb-3 text-xl font-bold text-stone-100'>{useCase.title}</h2>
                      <p className='mb-6 leading-relaxed text-stone-400'>{useCase.description}</p>

                      {/* Link */}
                      <div
                        className={`flex items-center gap-2 text-sm font-medium ${colors.iconText}`}
                      >
                        <span>Learn more</span>
                        <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className='relative py-24'>
            <div className='relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
              <h2 className='mb-6 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl'>
                Ready to get started?
              </h2>
              <p className='mx-auto mb-10 max-w-2xl text-lg text-stone-400'>
                Deploy Replane in minutes with Docker or sign up for our managed cloud.
              </p>
              <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                <Link
                  to='/docs/getting-started/quickstart'
                  className='inline-flex items-center justify-center rounded-lg bg-stone-100 px-6 py-3 text-base font-semibold text-stone-900 shadow-lg transition-all hover:bg-white hover:no-underline'
                >
                  Read the Docs
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
                <Link
                  to='https://cloud.replane.dev/auth/signin'
                  className='inline-flex items-center justify-center rounded-lg border border-stone-700 bg-stone-800/50 px-6 py-3 text-base font-semibold text-stone-200 transition-all hover:border-stone-600 hover:bg-stone-800 hover:no-underline'
                >
                  Try Replane Cloud
                </Link>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

