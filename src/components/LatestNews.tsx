import React from 'react'
import Link from '@docusaurus/Link'
import TagsListInline from '@theme/TagsListInline'
import { ArrowRight } from 'lucide-react'

import TimeStamp from './TimeStamp'
import { Avatar } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

interface Author {
  name: string
  imageURL?: string
  page?: { permalink: string }
}

interface Tag {
  label: string
  permalink: string
}

interface BlogMetadata {
  title: string
  description: string
  permalink: string
  date: string
  readingTime: number
  tags: Tag[]
  authors: Author[]
  frontMatter: {
    image?: string
  }
}

interface RecentPost {
  blogData: {
    metadata: BlogMetadata
  }
}

interface HomePageBlogMetadata {
  blogTitle?: string
  blogDescription?: string
  path?: string
}

interface RecentBlogPostCardProps {
  recentPost: RecentPost
}

function RecentBlogPostCard({ recentPost }: RecentBlogPostCardProps) {
  const { blogData } = recentPost
  const hasImage = blogData.metadata.frontMatter.image

  return (
    <Card className='group flex w-full flex-col gap-0 overflow-hidden border-stone-800 bg-stone-900 py-0 transition-all duration-300 hover:border-stone-600 hover:shadow-xl'>
      {hasImage && (
        <Link to={blogData.metadata.permalink} className='overflow-hidden'>
          <img
            className='block h-48 w-full rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-105'
            src={blogData.metadata.frontMatter.image}
            alt={blogData.metadata.title}
            loading='lazy'
          />
        </Link>
      )}

      <CardContent className='flex flex-1 flex-col p-6'>
        {blogData.metadata.tags.length > 0 && (
          <div className='blog-tags m-0 flex flex-wrap gap-2'>
            <TagsListInline tags={blogData.metadata.tags} />
          </div>
        )}

        <Link to={blogData.metadata.permalink} className='mt-4 hover:no-underline'>
          <p className='mb-1 p-0 text-lg font-semibold text-stone-100 transition-colors group-hover:text-stone-50'>
            {blogData.metadata.title}
          </p>
        </Link>

        <p className='mt-2 mb-4 flex-1 line-clamp-2 text-sm text-stone-400'>
          {blogData.metadata.description}
        </p>

        <div className='*:data-[slot=avatar]:ring-background flex items-center -space-x-2 *:data-[slot=avatar]:size-10 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale'>
          {blogData.metadata.authors.map((author, index) => (
            <Link
              href={author.page?.permalink || '#'}
              title={author.name}
              key={index}
              className='transition-opacity hover:opacity-80'
            >
              <Avatar>
                {author.imageURL ? (
                  <img
                    alt={author.name}
                    src={author.imageURL}
                    className='aspect-square h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center bg-stone-700'>
                    <span className='text-lg font-bold text-stone-300'>
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </Avatar>
            </Link>
          ))}

          <div className='ml-4 text-xs text-stone-500'>
            <span>
              <TimeStamp timestamp={blogData.metadata.date} />
            </span>
            <span className='mx-2'>•</span>
            <span>{Math.ceil(blogData.metadata.readingTime)} min read</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface LatestNewsProps {
  homePageBlogMetadata?: HomePageBlogMetadata
  recentPosts?: RecentPost[]
}

export default function LatestNews({ homePageBlogMetadata, recentPosts }: LatestNewsProps) {
  if (!homePageBlogMetadata || !recentPosts || recentPosts.length === 0) {
    return null
  }

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background - stone dark */}
      <div className='pointer-events-none absolute inset-0 bg-[#0c0a09]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-12 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            Blog
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl'>
            {homePageBlogMetadata.blogTitle || 'Latest from the blog'}
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            {homePageBlogMetadata.blogDescription ||
              'Stay updated with the latest news and articles about Replane'}
          </p>
        </div>

        {/* Blog posts grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>
          {recentPosts.map((recentPost, index) => (
            <div key={index} className='flex'>
              <RecentBlogPostCard recentPost={recentPost} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className='mt-12 text-center'>
          <Link
            to={homePageBlogMetadata.path || '/blog'}
            className='group inline-flex items-center gap-2 rounded-lg border border-stone-700 bg-stone-800 px-6 py-3 text-sm font-semibold text-stone-100 transition-all duration-200 hover:border-stone-600 hover:bg-stone-700 hover:text-stone-50 hover:no-underline'
          >
            See all posts
            <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
          </Link>
        </div>
      </div>
    </section>
  )
}
