import SharedCodeExamples from '@/components/shared/CodeExamples'
import type { CodeExample } from './types'

interface CodeExamplesProps {
  codeExamples: CodeExample[]
  accentColor: string
}

export default function CodeExamples({ codeExamples }: CodeExamplesProps) {
  return (
    <SharedCodeExamples
      showTechLogos
      codeExamples={codeExamples}
      badge='Code Examples'
      subtitle='Official SDKs for all major languages and frameworks'
    />
  )
}
