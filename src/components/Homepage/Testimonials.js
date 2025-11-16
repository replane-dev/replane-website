import React from 'react'

const testimonials = [
  {
    quote: "We were drowning in spreadsheets and env files. Replane gave us a single source of truth with audit logs. Game changer for our compliance needs.",
    author: 'Sarah Chen',
    role: 'Engineering Manager',
    company: 'FinTech Startup'
  },
  {
    quote: "Rolled out our biggest feature to 100k users without a single deploy. Started at 1%, caught bugs early, fixed them, then went to 100%. Can't imagine going back.",
    author: 'Marcus Rodriguez',
    role: 'Senior Developer',
    company: 'E-commerce Platform'
  },
  {
    quote: "Self-hosted was non-negotiable for us. Replane runs in our VPC, we own our data, and it just works. Simple, focused, exactly what we needed.",
    author: 'Emily Watson',
    role: 'CTO',
    company: 'Healthcare SaaS'
  },
  {
    quote: "Our product team can now toggle features themselves. No more waiting on engineering for simple on/off switches. Shipped 30% faster this quarter.",
    author: 'David Kim',
    role: 'VP of Product',
    company: 'B2B Software'
  }
]

export default function Testimonials() {
  return (
    <section className='py-16 px-4'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white'>
            What Teams Are Saying
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            Join teams already shipping faster with Replane
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'
            >
              <div className='mb-4'>
                <svg
                  className='h-8 w-8 text-blue-500'
                  fill='currentColor'
                  viewBox='0 0 32 32'
                  aria-hidden='true'
                >
                  <path d='M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z' />
                </svg>
              </div>
              <p className='mb-4 text-sm text-gray-600 dark:text-gray-300'>{testimonial.quote}</p>
              <div className='border-t border-gray-200 pt-4 dark:border-gray-700'>
                <p className='font-semibold text-gray-900 dark:text-white'>{testimonial.author}</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>{testimonial.role}</p>
                <p className='text-xs text-gray-400 dark:text-gray-500'>{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
