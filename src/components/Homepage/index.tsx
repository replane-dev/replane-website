import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

import HomepageFeatures from '@/components/Homepage/Features'
import LatestNews from '@/components/LatestNews'
import HeroBanner from '@/components/HeroBanner'

interface HomePageBlogMetadata {
  blogTitle?: string
  blogDescription?: string
  path?: string
  totalPosts?: number
  totalRecentPosts?: number
}

interface RecentPost {
  blogData: {
    metadata: {
      title: string
      description: string
      permalink: string
      date: string
      readingTime: number
      tags: Array<{ label: string; permalink: string }>
      authors: Array<{
        name: string
        imageURL?: string
        page?: { permalink: string }
      }>
      frontMatter: {
        image?: string
      }
    }
  }
  Preview: React.ComponentType
}

interface HomeProps {
  homePageBlogMetadata?: HomePageBlogMetadata
  recentPosts?: RecentPost[]
}

export default function Home({ homePageBlogMetadata, recentPosts }: HomeProps) {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout
      title={`${siteConfig.title}`}
      description='Description will go into a meta tag in <head />'
    >
      <main className='background-grid background-grid--fade-out'>
        <HeroBanner />
        <HomepageFeatures />
        <LatestNews recentPosts={recentPosts} homePageBlogMetadata={homePageBlogMetadata} />
      </main>
    </Layout>
  )
}
