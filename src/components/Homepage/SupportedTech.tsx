import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import { Highlight, themes } from 'prism-react-renderer'
import { ExternalLink, Code2 } from 'lucide-react'

interface Technology {
  name: string
  logo: string
  category: 'javascript' | 'python' | 'dotnet'
}

interface CodeExample {
  sdk: 'typescript' | 'react' | 'nextjs' | 'svelte' | 'python' | 'csharp'
  label: string
  code: string
  docsLink: string
}

const technologies: Technology[] = [
  // JavaScript ecosystem
  { name: 'TypeScript', logo: '/img/tech-logos/typescript.svg', category: 'javascript' },
  { name: 'JavaScript', logo: '/img/tech-logos/javascript.svg', category: 'javascript' },
  { name: 'React', logo: '/img/tech-logos/react.svg', category: 'javascript' },
  { name: 'Next.js', logo: '/img/tech-logos/nextjs.svg', category: 'javascript' },
  { name: 'Svelte', logo: '/img/tech-logos/svelte.svg', category: 'javascript' },
  { name: 'Node.js', logo: '/img/tech-logos/nodejs.svg', category: 'javascript' },
  { name: 'Bun', logo: '/img/tech-logos/bun.svg', category: 'javascript' },
  { name: 'Deno', logo: '/img/tech-logos/deno.svg', category: 'javascript' },
  // Python ecosystem
  { name: 'Python', logo: '/img/tech-logos/python.svg', category: 'python' },
  { name: 'Django', logo: '/img/tech-logos/django.svg', category: 'python' },
  { name: 'FastAPI', logo: '/img/tech-logos/fastapi.svg', category: 'python' },
  { name: 'Flask', logo: '/img/tech-logos/flask.svg', category: 'python' },
  // .NET ecosystem
  { name: '.NET', logo: '/img/tech-logos/dotnet.svg', category: 'dotnet' }
]

const codeExamples: CodeExample[] = [
  {
    sdk: 'typescript',
    label: 'TypeScript',
    docsLink: '/docs/sdk/javascript',
    code: `import { Replane } from '@replanejs/sdk'

const replane = new Replane()
await replane.connect({
  baseUrl: 'https://replane.example.com',
  sdkKey: process.env.REPLANE_SDK_KEY
})

// Get a config value
const featureEnabled = replane.get('new-feature')

// Subscribe to real-time updates
replane.subscribe('new-feature', (config) => {
  console.log('Feature changed:', config.value)
})`
  },
  {
    sdk: 'react',
    label: 'React',
    docsLink: '/docs/sdk/react',
    code: `import { ReplaneProvider, useConfig } from '@replanejs/react'

function App() {
  return (
    <ReplaneProvider
      connection={{
        baseUrl: 'https://replane.example.com',
        sdkKey: process.env.REPLANE_SDK_KEY
      }}
    >
      <FeatureComponent />
    </ReplaneProvider>
  )
}

function FeatureComponent() {
  const isEnabled = useConfig<boolean>('new-feature')
  return isEnabled ? <NewFeature /> : <OldFeature />
}`
  },
  {
    sdk: 'svelte',
    label: 'Svelte',
    docsLink: '/docs/sdk/svelte',
    code: `<script>
  import { ReplaneContext, config } from '@replanejs/svelte'

  const connection = {
    baseUrl: 'https://replane.example.com',
    sdkKey: import.meta.env.VITE_REPLANE_SDK_KEY
  }

  const featureEnabled = config<boolean>('new-feature')
</script>

<ReplaneContext {connection}>
  {#if $featureEnabled}
    <NewFeature />
  {:else}
    <OldFeature />
  {/if}
</ReplaneContext>`
  },
  {
    sdk: 'python',
    label: 'Python',
    docsLink: '/docs/sdk/python',
    code: `from replane import Replane

with Replane(
    base_url="https://replane.example.com",
    sdk_key=os.environ["REPLANE_SDK_KEY"],
) as replane:
    # Get a config value
    feature_enabled = replane.get("new-feature")

    # With context for targeted overrides
    limit = replane.get(
        "rate-limit",
        context={"user_id": user.id, "plan": user.plan}
    )`
  },
  {
    sdk: 'csharp',
    label: '.NET',
    docsLink: '/docs/sdk/dotnet',
    code: `using Replane;

await using var replane = new ReplaneClient();
await replane.ConnectAsync(new ConnectOptions
{
    BaseUrl = "https://replane.example.com",
    SdkKey = Environment.GetEnvironmentVariable("REPLANE_SDK_KEY")
});

// Get a typed config value
var featureEnabled = replane.Get<bool>("new-feature");

// Subscribe to changes
replane.ConfigChanged += (sender, e) =>
{
    Console.WriteLine($"Config changed: {e.ConfigName}");
};`
  }
]

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

const sdkLinks = {
  javascript: '/docs/sdk/javascript',
  python: '/docs/sdk/python',
  dotnet: '/docs/sdk/dotnet'
}

export default function SupportedTech() {
  const [activeTab, setActiveTab] = useState(0)
  const activeExample = codeExamples[activeTab]
  const language = languageMap[activeExample.sdk]

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0c0a09] to-[#1c1917]' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='mb-12 text-center'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm font-medium text-stone-300'>
            <Code2 className='h-4 w-4' />
            SDKs & Integrations
          </div>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl lg:text-5xl'>
            Works with your stack
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-stone-400'>
            Official SDKs for JavaScript, Python, and .NET. Zero dependencies, real-time updates out
            of the box.
          </p>
        </div>

        {/* Technology grid */}
        <div className='grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-7'>
          {technologies.map((tech) => (
            <Link
              key={tech.name}
              to={sdkLinks[tech.category]}
              className='group flex flex-col items-center gap-3 rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-stone-700 hover:bg-stone-800/50 hover:no-underline'
              title={tech.name}
            >
              <div className='flex h-12 w-12 items-center justify-center'>
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className='h-10 w-10 object-contain transition-opacity duration-200 group-hover:opacity-100'
                />
              </div>
              <span className='text-center text-xs font-medium text-stone-500 transition-colors group-hover:text-stone-300'>
                {tech.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Code block container */}
        <div className='mt-12 overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/50 backdrop-blur-sm'>
          {/* Tabs */}
          <div className='flex flex-wrap items-center gap-1 border-b border-stone-800 bg-stone-900 p-2'>
            {codeExamples.map((example, idx) => (
              <button
                key={example.sdk}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === idx
                    ? 'bg-blue-500 text-white'
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
                className='inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 transition-all hover:no-underline hover:opacity-80'
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
