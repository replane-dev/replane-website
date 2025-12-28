import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

import HeroBanner from '@/components/HeroBanner'
import TrustedBy from '@/components/Homepage/TrustedBy'
import PainPoints from '@/components/Homepage/PainPoints'
import Benefits from '@/components/Homepage/Benefits'
import HomepageFeatures from '@/components/Homepage/Features'
import UseCases from '@/components/Homepage/UseCases'
import Testimonials from '@/components/Homepage/Testimonials'
import Authentication from '@/components/Homepage/Integrations'
import SupportedTech from '@/components/Homepage/SupportedTech'
import FinalCTA from '@/components/Homepage/FinalCTA'
import FAQ from '@/components/Homepage/FAQ'
import LatestNews from '@/components/LatestNews'

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
    <div className='homepage-dark-only' data-theme='dark'>
      <Layout
        title={`${siteConfig.title}`}
        description='Stop deploying code to change settings. Self-hosted config management with version history, instant rollback, and realtime updates.'
      >
        <main className='background-grid background-grid--fade-out'>
          <HeroBanner />
          <TrustedBy />
          <PainPoints />
          <Benefits />
          <HomepageFeatures />
          <UseCases />
          <SupportedTech />
          <Authentication />
          {/* <Testimonials /> */}
          <LatestNews recentPosts={recentPosts} homePageBlogMetadata={homePageBlogMetadata} />
          <FinalCTA />
          <FAQ />
        </main>
      </Layout>
    </div>
  )
}
