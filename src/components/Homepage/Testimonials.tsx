import React from 'react'

interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      'We were drowning in spreadsheets and env files. Replane gave us a single source of truth with audit logs. Game changer for our compliance needs.',
    author: 'Sarah Chen',
    role: 'Engineering Manager',
    company: 'FinTech Startup'
  },
  {
    quote:
      "Rolled out our biggest feature to 100k users without a single deploy. Started at 1%, caught bugs early, fixed them, then went to 100%. Can't imagine going back.",
    author: 'Marcus Rodriguez',
    role: 'Senior Developer',
    company: 'E-commerce Platform'
  },
  {
    quote:
      'Self-hosted was non-negotiable for us. Replane runs in our VPC, we own our data, and it just works. Simple, focused, exactly what we needed.',
    author: 'Emily Watson',
    role: 'CTO',
    company: 'Healthcare SaaS'
  },
  {
    quote:
      'Our product team can now toggle features themselves. No more waiting on engineering for simple on/off switches. Shipped 30% faster this quarter.',
    author: 'David Kim',
    role: 'VP of Product',
    company: 'B2B Software'
  }
]

export default function Testimonials() {
  return (
    <section className='bg-gradient-to-b from-white to-gray-50 px-4 py-20 dark:from-gray-800 dark:to-gray-900'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white'>
            What Teams Are Saying
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            Trusted by engineering teams shipping production code
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className='group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800'
            >
              {/* Quote icon with gradient background */}
              <div className='mb-6 inline-flex rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-3'>
                <svg
                  className='h-6 w-6 text-white'
                  fill='currentColor'
                  viewBox='0 0 32 32'
                  aria-hidden='true'
                >
                  <path d='M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z' />
                </svg>
              </div>

              {/* Quote text */}
              <p className='mb-8 text-base leading-relaxed text-gray-700 dark:text-gray-200'>
                "{testimonial.quote}"
              </p>

              {/* Author info */}
              <div className='flex items-center gap-3 border-t border-gray-200 pt-5 dark:border-gray-700'>
                {/* Avatar placeholder */}
                <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-base font-bold text-white'>
                  {testimonial.author.charAt(0)}
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='mb-0 truncate font-semibold text-gray-900 dark:text-white'>
                    {testimonial.author}
                  </p>
                  <p className='mb-0 truncate text-sm text-gray-600 dark:text-gray-400'>
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Decorative gradient */}
              <div className='pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl transition-opacity group-hover:opacity-100 dark:from-blue-400/5 dark:to-purple-400/5' />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
