import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is Replane?',
    answer:
      'Replane is an open-source configuration management platform that lets you manage feature flags, application settings, and operational parameters without redeploying your code. Changes propagate instantly via Server-Sent Events.'
  },
  {
    question: 'Is Replane free?',
    answer:
      'Yes! Replane is open source under the MIT license. You can self-host it for free on your own infrastructure. We also offer a managed cloud version with a generous free tier for teams who prefer not to manage infrastructure.'
  },
  {
    question: 'How is Replane different from environment variables?',
    answer:
      'Unlike environment variables, Replane provides a UI for non-technical team members, version history with instant rollback, real-time updates without restarts, JSON schema validation, and complete audit trails. Changes take effect immediately without redeployment.'
  },
  {
    question: 'Can I self-host Replane?',
    answer:
      'Absolutely. Replane is designed for self-hosting. You can deploy it with a single Docker command. It uses SQLite by default (no external database required) and works great on a small VPS or your existing Kubernetes cluster.'
  },
  {
    question: 'What SDKs are available?',
    answer:
      'We currently offer official SDKs for JavaScript/TypeScript (works in Node.js, browsers, and edge runtimes), Python, and .NET. All SDKs support real-time updates via SSE and have zero external dependencies.'
  },
  {
    question: 'How do real-time updates work?',
    answer:
      'Replane uses Server-Sent Events (SSE) to push configuration changes to your applications instantly. When you update a config value in the dashboard, all connected clients receive the update within milliseconds—no polling required.'
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
        isOpen
          ? 'border-stone-700 bg-stone-800/50'
          : 'border-stone-800 bg-stone-900/50 hover:border-stone-700 hover:bg-stone-800/30'
      }`}
    >
      <button
        onClick={onToggle}
        className='flex w-full items-start justify-between gap-4 bg-transparent p-6 text-left'
        aria-expanded={isOpen}
      >
        <div className='flex items-start gap-4'>
          <span className='mt-0.5 font-mono text-sm text-stone-600'>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className='text-lg font-medium text-stone-100'>{item.question}</span>
        </div>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen
              ? 'bg-stone-600 text-white'
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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-[#0c0a09]' />

      {/* Subtle glow */}
      <div className='pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-500/3 blur-[100px]' />

      <div className='relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            FAQ
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Questions & Answers
          </h2>
          <p className='text-lg text-stone-400'>Everything you need to know about Replane</p>
        </div>

        {/* FAQ items */}
        <div className='space-y-4'>
          {faqs.map((faq, index) => (
            <FAQItemComponent
              key={index}
              item={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <div className='mt-16 rounded-2xl border border-stone-800 bg-stone-900/50 p-8 text-center'>
          <p className='mb-2 text-lg font-medium text-stone-100'>Still have questions?</p>
          <p className='text-stone-400'>
            Join our community on{' '}
            <a
              href='https://github.com/replane/replane/discussions'
              className='font-medium text-stone-200 underline decoration-stone-600 underline-offset-4 transition-colors hover:text-white hover:decoration-stone-400'
            >
              GitHub Discussions
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
