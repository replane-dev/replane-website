import Layout from '@theme/Layout'
import UseCaseHero from './UseCaseHero'
import HowItWorks from './HowItWorks'
import PainVsSolution from './PainVsSolution'
import UseCaseFeatures from './UseCaseFeatures'
import Benefits from './Benefits'
import CodeExamples from './CodeExamples'
import UseCaseFAQ from './UseCaseFAQ'
import RelatedUseCases from './RelatedUseCases'
import UseCaseCTA from './UseCaseCTA'
import type { UseCaseContent } from './types'

interface UseCaseLayoutProps extends UseCaseContent {
  pageTitle?: string
  pageDescription?: string
}

export default function UseCaseLayout({
  badge,
  title,
  subtitle,
  description,
  accentColor,
  steps,
  benefits,
  codeExamples,
  painPoints,
  solutions,
  features,
  featuresHeading,
  featuresSubheading,
  faq,
  relatedUseCases,
  pageTitle,
  pageDescription
}: UseCaseLayoutProps) {
  const hasPainVsSolution = painPoints && painPoints.length > 0 && solutions && solutions.length > 0
  const hasFeatures = features && features.length > 0
  const hasFAQ = faq && faq.length > 0
  const hasRelatedUseCases = relatedUseCases && relatedUseCases.length > 0

  return (
    <div className='usecase-dark-only' data-theme='dark'>
      <Layout
        title={pageTitle || `${badge} | Replane`}
        description={pageDescription || description}
      >
        <main className='background-grid background-grid--fade-out'>
          <UseCaseHero
            badge={badge}
            title={title}
            subtitle={subtitle}
            description={description}
            accentColor={accentColor}
          />
          {hasPainVsSolution && (
            <PainVsSolution
              painPoints={painPoints}
              solutions={solutions}
              accentColor={accentColor}
            />
          )}
          {hasFeatures && (
            <UseCaseFeatures
              features={features}
              accentColor={accentColor}
              heading={featuresHeading}
              subheading={featuresSubheading}
            />
          )}
          <HowItWorks steps={steps} accentColor={accentColor} />
          <Benefits benefits={benefits} accentColor={accentColor} />
          <CodeExamples codeExamples={codeExamples} accentColor={accentColor} />
          {hasFAQ && <UseCaseFAQ faq={faq} accentColor={accentColor} badge={badge} />}
          {hasRelatedUseCases && <RelatedUseCases relatedUseCases={relatedUseCases} />}
          <UseCaseCTA accentColor={accentColor} badge={badge} />
        </main>
      </Layout>
    </div>
  )
}
