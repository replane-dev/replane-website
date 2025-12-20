import React from 'react'
import clsx from 'clsx'
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common'
import {
  useBlogAuthorPageTitle,
  BlogAuthorsListViewAllLabel
} from '@docusaurus/theme-common/internal'
import Link from '@docusaurus/Link'
import { useBlogMetadata } from '@docusaurus/plugin-content-blog/client'
import BlogLayout from '@theme/BlogLayout'
import BlogListPaginator from '@theme/BlogListPaginator'
import SearchMetadata from '@theme/SearchMetadata'
import BlogPostItems from '@theme/BlogPostItems'
import Author from '@theme/Blog/Components/Author'

interface AuthorData {
  name: string
  description?: string
  imageURL?: string
  url?: string
}

interface ListMetadata {
  totalCount: number
  totalPages: number
  page: number
  postsPerPage: number
  previousPage?: string
  nextPage?: string
}

interface BlogItem {
  content: {
    metadata: {
      permalink: string
      title: string
      description?: string
      date: string
      tags: Array<{ label: string; permalink: string }>
      authors: AuthorData[]
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

interface BlogAuthorsPostsPageProps {
  author: AuthorData
  items: BlogItem[]
  sidebar: Sidebar
  listMetadata: ListMetadata
}

function Metadata({ author }: { author: AuthorData }) {
  const title = useBlogAuthorPageTitle(author)
  return (
    <>
      <PageMetadata title={title} />
      <SearchMetadata tag='blog_authors_posts' />
    </>
  )
}

function ViewAllAuthorsLink() {
  const { authorsListPath } = useBlogMetadata()
  return (
    <Link href={authorsListPath}>
      <BlogAuthorsListViewAllLabel />
    </Link>
  )
}

function Content({ author, items, sidebar, listMetadata }: BlogAuthorsPostsPageProps) {
  return (
    <BlogLayout sidebar={sidebar}>
      <header className='margin-bottom--xl'>
        <Author as='h2' author={author} />
        {author.description && <p>{author.description}</p>}
        <ViewAllAuthorsLink />
      </header>
      <BlogPostItems items={items} />
      <BlogListPaginator metadata={listMetadata} />
    </BlogLayout>
  )
}

export default function BlogAuthorsPostsPage(props: BlogAuthorsPostsPageProps) {
  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogAuthorsPostsPage)}
    >
      <Metadata {...props} />
      <Content {...props} />
    </HtmlClassNameProvider>
  )
}
