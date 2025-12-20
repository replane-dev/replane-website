import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common'
import BlogLayout from '@theme/BlogLayout'
import SearchMetadata from '@theme/SearchMetadata'
import BlogPostItems from '@theme/BlogPostItems'

import { BlogPagination } from '../BlogPagination'

interface Author {
  name: string
  imageURL?: string
}

interface Tag {
  label: string
  permalink: string
}

interface BlogMetadata {
  blogDescription: string
  blogTitle: string
  permalink: string
  totalPages: number
}

interface BlogItem {
  content: {
    metadata: {
      permalink: string
      title: string
      description?: string
      date: string
      tags: Tag[]
      authors: Author[]
      frontMatter: { image?: string }
      readingTime: number
    }
    frontMatter: Record<string, unknown>
  }
}

interface Sidebar {
  items: Array<{ title: string; permalink: string }>
  title?: string
}

interface BlogListPageProps {
  metadata: BlogMetadata
  items: BlogItem[]
  sidebar: Sidebar
}

function BlogListPageMetadata(props: BlogListPageProps) {
  const { metadata } = props
  const {
    siteConfig: { title: siteTitle }
  } = useDocusaurusContext()
  const { blogDescription, blogTitle, permalink } = metadata
  const isBlogOnlyMode = permalink === '/'
  const title = isBlogOnlyMode ? siteTitle : blogTitle

  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag='blog_posts_list' />
    </>
  )
}

function BlogHomepageBanner(props: BlogListPageProps) {
  const { metadata, items } = props

  // Get featured post (first post with specific tag or just the latest)
  const featuredPost = items.length > 0 ? items[0] : null

  return (
    <div className='mb-12'>
      {/* Hero Section */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4 dark:from-blue-700 dark:to-purple-700'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='mb-4 text-4xl font-bold text-white sm:text-5xl'>
            {metadata.blogTitle}
          </h1>
          <p className='text-lg text-blue-100 sm:text-xl'>
            {metadata.blogDescription}
          </p>
        </div>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className='mx-auto -mt-8 max-w-5xl px-4'>
          <div className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'>
            <div className='grid gap-6 md:grid-cols-2'>
              {featuredPost.content.metadata.frontMatter.image && (
                <div className='relative h-64 md:h-auto'>
                  <img
                    src={featuredPost.content.metadata.frontMatter.image}
                    alt={featuredPost.content.metadata.title}
                    className='h-full w-full object-cover'
                    loading='lazy'
                  />
                  <div className='absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white'>
                    Featured
                  </div>
                </div>
              )}
              <div className='flex flex-col justify-center p-6'>
                <div className='mb-2 flex flex-wrap gap-2'>
                  {featuredPost.content.metadata.tags.slice(0, 2).map((tag) => (
                    <Link
                      key={tag.label}
                      to={tag.permalink}
                      className='rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 hover:no-underline dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
                    >
                      {tag.label}
                    </Link>
                  ))}
                </div>
                <h2 className='mb-3 text-2xl font-bold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 md:text-3xl'>
                  <Link to={featuredPost.content.metadata.permalink} className='hover:no-underline'>
                    {featuredPost.content.metadata.title}
                  </Link>
                </h2>
                {featuredPost.content.metadata.description && (
                  <p className='mb-4 text-gray-600 dark:text-gray-300'>
                    {featuredPost.content.metadata.description}
                  </p>
                )}
                <div className='flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400'>
                  {featuredPost.content.metadata.authors.length > 0 && (
                    <>
                      {featuredPost.content.metadata.authors[0].imageURL ? (
                        <img
                          src={featuredPost.content.metadata.authors[0].imageURL}
                          alt={featuredPost.content.metadata.authors[0].name}
                          className='h-8 w-8 rounded-full'
                          loading='lazy'
                        />
                      ) : (
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white'>
                          {featuredPost.content.metadata.authors[0].name?.charAt(0) || 'R'}
                        </div>
                      )}
                      <span>{featuredPost.content.metadata.authors[0].name}</span>
                      <span>•</span>
                    </>
                  )}
                  <time dateTime={featuredPost.content.metadata.date}>
                    {new Date(featuredPost.content.metadata.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BlogListPageContent(props: BlogListPageProps) {
  const { metadata, items, sidebar } = props

  // Skip first item in the list since it's featured
  const regularItems = items.length > 1 ? items.slice(1) : []

  return (
    <BlogLayout sidebar={sidebar}>
      <BlogHomepageBanner {...props} />

      {regularItems.length > 0 ? (
        <>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Latest Posts</h2>
          </div>
          <BlogPostItems items={regularItems} />
        </>
      ) : items.length === 1 ? (
        <div className='py-12 text-center'>
          <p className='text-gray-600 dark:text-gray-400'>More posts coming soon!</p>
        </div>
      ) : (
        <div className='py-12 text-center'>
          <p className='text-gray-600 dark:text-gray-400'>No blog posts yet.</p>
        </div>
      )}

      <BlogPagination metadata={metadata} />
    </BlogLayout>
  )
}

export default function BlogListPage(props: BlogListPageProps) {
  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}
    >
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  )
}
