import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { accentColorClasses, type AccentColor, type FAQItem } from './types'

interface UseCaseFAQProps {
  faq: FAQItem[]
  accentColor: AccentColor
  badge: string
}

export default function UseCaseFAQ({ faq, accentColor, badge }: UseCaseFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const colors = accentColorClasses[accentColor]

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-[#0c0a09]' />
      <div
        className={`pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full ${colors.glow} opacity-20 blur-[100px]`}
      />

      <div className='relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            FAQ
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl'>
            Questions about {badge}
          </h2>
          <p className='text-lg text-stone-400'>
            Common questions and answers
          </p>
        </div>

        {/* FAQ Items */}
        <div className='space-y-4'>
          {faq.map((item, index) => (
            <div
              key={index}
              className={`group rounded-2xl border transition-all duration-300 ${
                openIndex === index ? 'border-stone-700' : 'border-stone-800 hover:border-stone-700'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className='flex w-full items-start justify-between gap-4 bg-transparent p-6 text-left'
                aria-expanded={openIndex === index}
              >
                <div className='flex items-start gap-4'>
                  <span className={`mt-0.5 font-mono text-sm ${colors.text} opacity-70`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className='text-lg font-medium text-stone-100'>{item.question}</span>
                </div>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    openIndex === index
                      ? `${colors.bg} text-white`
                      : 'bg-stone-800 text-stone-400 group-hover:bg-stone-700'
                  }`}
                >
                  {openIndex === index ? (
                    <Minus className='h-4 w-4' />
                  ) : (
                    <Plus className='h-4 w-4' />
                  )}
                </div>
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className='overflow-hidden'>
                  <div className='px-6 pb-6 pl-16'>
                    <p className='leading-relaxed text-stone-400'>{item.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

