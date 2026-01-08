import React from 'react'
import Link from '@docusaurus/Link'

import BlogPostItem from '@theme/BlogPostItem'
import TagsListInline from '@theme/TagsListInline'

import TimeStamp from '@components/TimeStamp'
import { Avatar } from '@components/ui/avatar'
import { Card, CardContent } from '@components/ui/card'

interface Author {
  name: string
  imageURL?: string
}

interface Tag {
  label: string
  permalink: string
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

interface BlogPostItemsProps {
  items: BlogItem[]
  component?: React.ComponentType<{ children: React.ReactNode }>
}

export default function BlogPostItems({
  items,
  component: BlogPostItemComponent = BlogPostItem
}: BlogPostItemsProps) {
  return (
    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
      {items.map((blog) => (
        <article
          key={blog.content.metadata.permalink}
          className='group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800'
        >
          <div className='flex flex-1 flex-col p-6'>
            {blog.content.metadata.tags.length > 0 && (
              <div className='mb-3 flex flex-wrap gap-2'>
                {blog.content.metadata.tags.slice(0, 2).map((tag) => (
                  <Link
                    key={tag.label}
                    to={tag.permalink}
                    className='rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200 hover:no-underline dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            )}

            <h2 className='mb-2 flex-grow'>
              <Link
                to={blog.content.metadata.permalink}
                className='text-xl font-bold text-gray-900 transition-colors hover:text-blue-600 hover:no-underline dark:text-white dark:hover:text-blue-400'
              >
                {blog.content.metadata.title}
              </Link>
            </h2>

            {blog.content.metadata.description && (
              <p className='mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
                {blog.content.metadata.description}
              </p>
            )}

            <div className='mt-auto flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-700'>
              <div className='flex -space-x-2'>
                {blog.content.metadata.authors.slice(0, 3).map((author, index) => (
                  <div key={index} className='relative' title={author.name}>
                    {author.imageURL ? (
                      <img
                        alt={author.name}
                        src={author.imageURL}
                        className='h-8 w-8 rounded-full border-2 border-white object-cover dark:border-gray-800'
                        loading='lazy'
                      />
                    ) : (
                      <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-semibold text-white dark:border-gray-800'>
                        {author.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className='flex flex-col text-xs text-gray-500 dark:text-gray-400'>
                <time dateTime={blog.content.metadata.date}>
                  <TimeStamp timestamp={blog.content.metadata.date} />
                </time>
                <span>{Math.ceil(blog.content.metadata.readingTime)} min read</span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
