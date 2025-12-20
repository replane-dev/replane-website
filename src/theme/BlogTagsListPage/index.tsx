import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames, translateTagsPageTitle } from '@docusaurus/theme-common'
import BlogLayout from '@theme/BlogLayout'
import SearchMetadata from '@theme/SearchMetadata'
import Heading from '@theme/Heading'

interface TagItem {
  label: string
  permalink: string
  count: number
}

interface Sidebar {
  items: Array<{ title: string; permalink: string }>
  title?: string
}

interface BlogTagsListPageProps {
  tags: TagItem[]
  sidebar: Sidebar
}

export default function BlogTagsListPage({ tags, sidebar }: BlogTagsListPageProps) {
  const title = translateTagsPageTitle()

  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogTagsListPage)}
    >
      <PageMetadata title={title} />
      <SearchMetadata tag='blog_tags_list' />
      <BlogLayout sidebar={sidebar}>
        <div className='mb-12'>
          {/* Hero Section */}
          <div className='bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4 dark:from-blue-700 dark:to-purple-700'>
            <div className='mx-auto max-w-4xl text-center'>
              <h1 className='mb-4 text-4xl font-bold text-white sm:text-5xl'>Blog Tags</h1>
              <p className='text-lg text-blue-100 sm:text-xl'>
                Browse posts by topic and explore related content
              </p>
            </div>
          </div>
        </div>

        <div className='mx-auto max-w-5xl'>
          <div className='mb-8'>
            <p className='text-gray-600 dark:text-gray-400'>
              {tags.length} {tags.length === 1 ? 'tag' : 'tags'} total
            </p>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {tags.map((tag) => (
              <Link
                key={tag.permalink}
                to={tag.permalink}
                className='group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:no-underline dark:border-gray-700 dark:bg-gray-800'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className='mb-1 text-xl font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                      {tag.label}
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {tag.count} {tag.count === 1 ? 'post' : 'posts'}
                    </p>
                  </div>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 group-hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:group-hover:bg-blue-800'>
                    {tag.count}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </BlogLayout>
    </HtmlClassNameProvider>
  )
}
