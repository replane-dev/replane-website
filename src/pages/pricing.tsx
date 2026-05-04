import { useState } from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import { Check, X, Github, ArrowRight, Building2, Server, Plus, Minus } from 'lucide-react'

interface Feature {
  name: string
  selfHosted: boolean | string
  enterprise: boolean | string
}

const features: Feature[] = [
  { name: 'Unlimited configs', selfHosted: true, enterprise: true },
  { name: 'Unlimited workspaces', selfHosted: true, enterprise: true },
  { name: 'Version history & rollback', selfHosted: true, enterprise: true },
  { name: 'Realtime updates (SSE)', selfHosted: true, enterprise: true },
  { name: 'JSON Schema validation', selfHosted: true, enterprise: true },
  { name: 'REST API access', selfHosted: true, enterprise: true },
  { name: 'All SDKs included', selfHosted: true, enterprise: true },
  { name: 'Team members', selfHosted: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Audit logs', selfHosted: true, enterprise: true },
  { name: 'GitHub OAuth', selfHosted: true, enterprise: true },
  { name: 'Okta SSO', selfHosted: true, enterprise: true },
  { name: 'SAML/SCIM', selfHosted: false, enterprise: true },
  { name: 'Custom SSO integration', selfHosted: false, enterprise: true },
  { name: 'Priority support', selfHosted: false, enterprise: true },
  { name: 'SLA guarantee', selfHosted: false, enterprise: true },
  { name: 'Dedicated success manager', selfHosted: false, enterprise: true }
]

interface PricingTier {
  name: string
  description: string
  price: string
  priceDetail: string
  icon: React.ReactNode
  features: string[]
  cta: {
    text: string
    href: string
    primary?: boolean
  }
  popular?: boolean
}

const tiers: PricingTier[] = [
  {
    name: 'Self-Hosted',
    description: 'Deploy on your own infrastructure. Full control, no limits.',
    price: 'Free',
    priceDetail: 'forever',
    icon: <Server className='h-6 w-6 text-violet-400' />,
    features: [
      'Unlimited configs & workspaces',
      'Unlimited team members',
      'Version history & rollback',
      'Realtime SSE updates',
      'All SDKs included',
      'GitHub & Okta OAuth',
      'Community support'
    ],
    cta: {
      text: 'Get Started',
      href: '/docs/getting-started/quickstart'
    }
  },
  {
    name: 'Enterprise',
    description: 'For organizations with advanced security & compliance needs.',
    price: 'Custom',
    priceDetail: 'contact us',
    icon: <Building2 className='h-6 w-6 text-amber-400' />,
    features: [
      'Everything in Self-Hosted',
      'Unlimited team members',
      'SAML/SCIM provisioning',
      'Custom SSO integration',
      'Dedicated success manager',
      'Custom SLA',
      'On-premise deployment option'
    ],
    cta: {
      text: 'Contact Sales',
      href: 'mailto:tilyupo@gmail.com'
    }
  }
]

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is the difference between Self-Hosted and Enterprise?',
    answer:
      'Self-Hosted gives you the full open-source product to run on your own infrastructure. Enterprise adds commercial support, identity integrations such as SAML/SCIM, and assistance for organizations with stricter operational requirements.'
  },
  {
    question: 'Why is Replane free?',
    answer:
      'We believe configuration management should be accessible to all teams. The self-hosted product is MIT licensed and available without product-imposed limits. We monetize through Enterprise plans for organizations that need support, SSO integrations, and commercial guarantees.'
  },
  {
    question: 'Can I upgrade from Self-Hosted to Enterprise support later?',
    answer:
      'Yes. Enterprise builds on the same self-hosted deployment model, so you can start with the open-source version and add support or commercial features later.'
  },
  {
    question: 'Are there any usage limits?',
    answer:
      'No artificial limits. You can create unlimited workspaces, configs, and versions. API rate limits are generous (1000 requests/minute for reads, 100/minute for writes) and can be increased for Enterprise customers.'
  },
  {
    question: 'How do realtime updates work?',
    answer:
      'Replane uses Server-Sent Events (SSE) to push config changes to your applications instantly. When you update a config in the dashboard, all connected SDK clients receive the update within milliseconds—no polling required.'
  },
  {
    question: 'What happens if my Replane deployment goes down?',
    answer:
      'Our SDKs cache the last known configuration locally. If the Replane server becomes unreachable, your application continues running with cached values. When connectivity is restored, updates resume automatically.'
  },
  {
    question: 'What authentication options are available?',
    answer:
      'Self-Hosted includes GitHub OAuth and also supports Okta OAuth. Enterprise adds SAML 2.0 and SCIM for providers like Azure AD, Google Workspace, and OneLogin.'
  },
  {
    question: 'When should I consider Enterprise?',
    answer:
      'Enterprise is for organizations needing SAML/SCIM provisioning, custom SSO integrations, SLA guarantees, dedicated support, or on-premise deployment with our assistance. Contact tilyupo@gmail.com to discuss your requirements.'
  }
]

function FAQItemComponent({
  item,
  isOpen,
  onToggle,
  index
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <div
      className={`group rounded-2xl border transition-all duration-300 ${
        isOpen ? 'border-stone-700' : 'border-stone-800 hover:border-stone-700'
      }`}
    >
      <button
        onClick={onToggle}
        className='flex w-full items-start justify-between gap-4 bg-transparent p-6 text-left'
        aria-expanded={isOpen}
      >
        <div className='flex items-start gap-4'>
          <span className='mt-0.5 font-mono text-sm text-blue-400/70'>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className='text-lg font-medium text-stone-100'>{item.question}</span>
        </div>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen
              ? 'bg-blue-500 text-white'
              : 'bg-stone-800 text-stone-400 group-hover:bg-stone-700'
          }`}
        >
          {isOpen ? <Minus className='h-4 w-4' /> : <Plus className='h-4 w-4' />}
        </div>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className='overflow-hidden'>
          <div className='px-6 pb-6 pl-16'>
            <p className='leading-relaxed text-stone-400'>{item.answer}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className='text-sm text-stone-300'>{value}</span>
  }
  if (value) {
    return <Check className='h-5 w-5 text-emerald-500' />
  }
  return <X className='h-5 w-5 text-stone-600' />
}

export default function Pricing() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  return (
    <div className='pricing-dark-only' data-theme='dark'>
      <Layout
        title='Pricing'
        description='Simple, transparent pricing for Replane. Self-host for free or contact us for enterprise support.'
      >
        <main className='background-grid background-grid--fade-out'>
          {/* Hero Section */}
          <section className='relative overflow-hidden pt-24 pb-16'>
            <div className='pointer-events-none absolute inset-0 bg-linear-to-b from-[#0c0a09] to-[#1c1917]' />

            <div className='relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
              <h1 className='mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl'>
                Simple, transparent pricing
              </h1>
              <p className='mx-auto max-w-2xl text-lg text-stone-400'>
                Self-host for free, or contact us for enterprise support. No hidden fees, no surprises.
              </p>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className='relative py-16'>
            <div className='pointer-events-none absolute inset-0 bg-[#1c1917]' />

            <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8'>
                {tiers.map((tier, index) => (
                  <div
                    key={tier.name}
                    className='group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.02]'
                  >
                    {/* Card content */}
                    <div className='relative flex h-full flex-col rounded-3xl border border-stone-800 bg-stone-900/50 transition-colors group-hover:border-stone-700 group-hover:bg-stone-900/80'>
                      <div className='flex flex-1 flex-col p-8'>
                        {/* Name */}
                        <h3 className='mb-2 text-2xl font-bold text-white'>{tier.name}</h3>

                        {/* Description */}
                        <p className='mb-6 text-sm leading-relaxed text-stone-400'>
                          {tier.description}
                        </p>

                        {/* Price */}
                        <div className='mb-8'>
                          <div className='flex items-baseline gap-2'>
                            <span className='text-5xl font-bold tracking-tight text-white'>
                              {tier.price}
                            </span>
                            <span className='text-stone-500'>{tier.priceDetail}</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <Link
                          href={tier.cta.href}
                          className={`mb-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-200 hover:no-underline ${
                            tier.cta.primary
                              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 hover:text-white hover:shadow-blue-500/30'
                              : 'border border-stone-700 bg-stone-800 text-white hover:border-stone-600 hover:bg-stone-700'
                          }`}
                        >
                          {tier.cta.text}
                          <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                        </Link>

                        {/* Divider */}
                        <div className='mb-6 h-px bg-linear-to-r from-transparent via-stone-700 to-transparent' />

                        {/* Features */}
                        <ul className='flex-1 space-y-4'>
                          {tier.features.map((feature) => (
                            <li key={feature} className='flex items-start gap-3'>
                              <div className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10'>
                                <Check className='h-3.5 w-3.5 text-emerald-500' />
                              </div>
                              <span className='text-sm leading-relaxed text-stone-300'>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Open Source Note */}
              <div className='mt-16 text-center'>
                <Link
                  href='https://github.com/replane-dev/replane'
                  className='group inline-flex items-center gap-3 rounded-full border border-stone-800 bg-stone-900/50 px-6 py-3 text-stone-400 transition-all hover:border-stone-700 hover:bg-stone-900 hover:text-white hover:no-underline'
                >
                  <Github className='h-5 w-5' />
                  <span>Replane is open source. Star us on GitHub!</span>
                  <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Link>
              </div>
            </div>
          </section>

          {/* Feature Comparison Table */}
          <section className='relative py-24'>
            <div className='pointer-events-none absolute inset-0 bg-linear-to-b from-[#1c1917] to-[#0c0a09]' />

            <div className='relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
              <div className='mb-16 text-center'>
                <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
                  Feature Comparison
                </div>
                <h2 className='mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl'>
                  Compare plans
                </h2>
                <p className='text-lg text-stone-400'>See what&apos;s included in each plan</p>
              </div>

              <div className='overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/30 backdrop-blur-sm'>
                {/* Header with plan names */}
                <div className='grid grid-cols-3 border-b border-stone-800 bg-stone-900'>
                  <div className='p-6'>
                    <span className='text-sm font-medium text-stone-500'>Features</span>
                  </div>
                  <div className='border-l border-stone-800 p-6 text-center'>
                    <div className='mb-1 flex items-center justify-center gap-2'>
                      <Server className='h-4 w-4 text-stone-400' />
                      <span className='font-semibold text-white'>Self-Hosted</span>
                    </div>
                    <span className='text-sm text-stone-500'>Free forever</span>
                  </div>
                  <div className='border-l border-stone-800 p-6 text-center'>
                    <div className='mb-1 flex items-center justify-center gap-2'>
                      <Building2 className='h-4 w-4 text-stone-400' />
                      <span className='font-semibold text-white'>Enterprise</span>
                    </div>
                    <span className='text-sm text-stone-500'>Custom</span>
                  </div>
                </div>

                {/* Feature rows */}
                <div className='divide-y divide-stone-800/50'>
                  {features.map((feature, idx) => (
                    <div
                      key={feature.name}
                      className='grid grid-cols-3 transition-colors hover:bg-stone-800/20'
                    >
                      <div className='flex items-center p-5'>
                        <span className='text-sm text-stone-300'>{feature.name}</span>
                      </div>
                      <div className='flex items-center justify-center border-l border-stone-800/50 p-5'>
                        <FeatureValue value={feature.selfHosted} />
                      </div>
                      <div className='flex items-center justify-center border-l border-stone-800/50 p-5'>
                        <FeatureValue value={feature.enterprise} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA row */}
                <div className='grid grid-cols-3 border-t border-stone-800 bg-stone-900'>
                  <div className='p-6' />
                  <div className='flex items-center justify-center border-l border-stone-800 p-6'>
                    <Link
                      href='/docs/getting-started/quickstart'
                      className='rounded-lg border border-stone-700 bg-stone-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-stone-600 hover:bg-stone-700 hover:text-white hover:no-underline'
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className='flex items-center justify-center border-l border-stone-800 p-6'>
                    <Link
                      href='mailto:tilyupo@gmail.com'
                      className='rounded-lg border border-stone-700 bg-stone-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-stone-600 hover:bg-stone-700 hover:text-white hover:no-underline'
                    >
                      Contact Sales
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className='relative overflow-hidden py-24'>
            <div className='pointer-events-none absolute inset-0 bg-[#0c0a09]' />
            <div className='pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-500/3 blur-[100px]' />

            <div className='relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
              <div className='mb-16 text-center'>
                <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
                  FAQ
                </div>
                <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl'>
                  Pricing Questions
                </h2>
                <p className='text-lg text-stone-400'>
                  Everything you need to know about our pricing
                </p>
              </div>

              <div className='space-y-4'>
                {faqs.map((faq, index) => (
                  <FAQItemComponent
                    key={index}
                    item={faq}
                    index={index}
                    isOpen={openFaqIndex === index}
                    onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  />
                ))}
              </div>

              {/* Contact CTA */}
              <div className='mt-16 rounded-2xl border border-stone-800 bg-stone-900/50 p-8 text-center'>
                <p className='mb-2 text-lg font-medium text-stone-100'>Still have questions?</p>
                <p className='mb-6 text-stone-400'>
                  We&apos;re here to help. Reach out and we&apos;ll get back to you within 24 hours.
                </p>
                <Link
                  href='mailto:tilyupo@gmail.com'
                  className='inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-stone-900 transition-all duration-200 hover:bg-stone-100 hover:text-stone-900 hover:no-underline'
                >
                  Contact Us
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}
