import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common'
import BlogLayout from '@theme/BlogLayout'
import BlogPostItems from '@theme/BlogPostItems'
import SearchMetadata from '@theme/SearchMetadata'
import { BlogPagination } from '../BlogPagination'

export default function BlogTagsPostsPage(props) {
  const { tag, items, sidebar, listMetadata } = props

  const title = `Posts tagged with "${tag.label}"`

  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogTagPostListPage)}
    >
      <PageMetadata title={title} />
      <SearchMetadata tag='blog_tags_posts' />
      <BlogLayout sidebar={sidebar}>
        {/* Hero Section */}
        <div className='mb-12'>
          <div className='rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-12 px-6 dark:from-blue-700 dark:to-purple-700'>
            <div className='mx-auto max-w-4xl'>
              <div className='mb-4'>
                <Link
                  to='/blog/tags'
                  className='inline-flex items-center gap-2 text-sm font-medium text-blue-100 hover:text-white hover:no-underline'
                >
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                  All tags
                </Link>
              </div>
              <h1 className='mb-3 text-3xl font-bold text-white sm:text-4xl'>{tag.label}</h1>
              <p className='text-lg text-blue-100'>
                {tag.count} {tag.count === 1 ? 'post' : 'posts'} tagged with "{tag.label}"
              </p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className='mb-8'>
          <BlogPostItems items={items} />
        </div>

        <BlogPagination metadata={listMetadata} />
      </BlogLayout>
    </HtmlClassNameProvider>
  )
}
