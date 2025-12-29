import { useState } from 'react'
import Link from '@docusaurus/Link'
import { Highlight, themes } from 'prism-react-renderer'
import { ExternalLink, Code2 } from 'lucide-react'
import { accentColorClasses, type AccentColor, type CodeExample } from './types'

interface CodeExamplesProps {
  codeExamples: CodeExample[]
  accentColor: AccentColor
}

const sdkIcons: Record<CodeExample['sdk'], string> = {
  typescript: 'TS',
  react: 'Re',
  nextjs: 'Nx',
  svelte: 'Sv',
  python: 'Py',
  csharp: 'C#'
}

const languageMap: Record<CodeExample['sdk'], string> = {
  typescript: 'typescript',
  react: 'tsx',
  nextjs: 'tsx',
  svelte: 'markup',
  python: 'python',
  csharp: 'csharp'
}

export default function CodeExamples({ codeExamples, accentColor }: CodeExamplesProps) {
  const [activeTab, setActiveTab] = useState(0)
  const colors = accentColorClasses[accentColor]

  const activeExample = codeExamples[activeTab]
  const language = languageMap[activeExample.sdk]

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-linear-to-b from-[#0c0a09] to-[#1c1917]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-12 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            <Code2 className='h-4 w-4' />
            Code Examples
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Works with your stack
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            Official SDKs for all major languages and frameworks
          </p>
        </div>

        {/* Code block container */}
        <div className='overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/50 backdrop-blur-sm'>
          {/* Tabs */}
          <div className='flex flex-wrap items-center gap-1 border-b border-stone-800 bg-stone-900 p-2'>
            {codeExamples.map((example, idx) => (
              <button
                key={example.sdk}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === idx
                    ? `${colors.bg} text-white`
                    : 'bg-transparent text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                <span className='font-mono text-xs opacity-70'>{sdkIcons[example.sdk]}</span>
                <span>{example.label}</span>
              </button>
            ))}
          </div>

          {/* Code content with syntax highlighting */}
          <div className='relative'>
            <Highlight theme={themes.vsDark} code={activeExample.code.trim()} language={language}>
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} overflow-x-auto p-6 text-sm leading-relaxed`}
                  style={{ ...style, background: 'transparent', margin: 0 }}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      <span className='mr-4 inline-block w-8 text-right text-stone-600 select-none'>
                        {i + 1}
                      </span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>

            {/* Docs link */}
            <div className='absolute top-4 right-4'>
              <Link
                href={activeExample.docsLink}
                className={`inline-flex items-center gap-1.5 rounded-lg border ${colors.border} ${colors.bgSubtle} px-3 py-1.5 text-xs font-medium ${colors.text} transition-all hover:no-underline hover:opacity-80`}
              >
                View {activeExample.label} SDK Docs
                <ExternalLink className='h-3 w-3' />
              </Link>
            </div>
          </div>
        </div>

        {/* All SDKs link */}
        <div className='mt-8 text-center'>
          <Link
            href='/docs/sdk'
            className='inline-flex items-center gap-2 text-stone-400 transition-colors hover:text-stone-200 hover:no-underline'
          >
            <span>View all SDKs and installation guides</span>
            <ExternalLink className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </section>
  )
}
