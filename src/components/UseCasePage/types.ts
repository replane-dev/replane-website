import type { ReactNode } from 'react'

export type AccentColor =
  | 'blue'
  | 'amber'
  | 'red'
  | 'violet'
  | 'emerald'
  | 'sky'
  | 'orange'
  | 'rose'
  | 'teal'
  | 'indigo'
  | 'fuchsia'

export interface CodeExample {
  sdk: 'typescript' | 'react' | 'nextjs' | 'svelte' | 'python' | 'csharp'
  label: string
  code: string
  docsLink: string
}

export interface Step {
  title: string
  description: string
  icon: ReactNode
}

export interface Benefit {
  title: string
  description: string
  icon: ReactNode
}

export interface PainPoint {
  title: string
  description: string
}

export interface Solution {
  title: string
  description: string
}

export interface Feature {
  title: string
  description: string
  icon: ReactNode
}

export interface FAQItem {
  question: string
  answer: string
}

export interface RelatedUseCase {
  title: string
  description: string
  href: string
  accentColor: AccentColor
}

export interface UseCaseContent {
  badge: string
  title: string
  subtitle: string
  description: string
  accentColor: AccentColor
  steps: Step[]
  benefits: Benefit[]
  codeExamples: CodeExample[]
  // Optional new sections
  painPoints?: PainPoint[]
  solutions?: Solution[]
  features?: Feature[]
  faq?: FAQItem[]
  relatedUseCases?: RelatedUseCase[]
}

export const accentColorClasses: Record<
  AccentColor,
  {
    text: string
    bg: string
    bgSubtle: string
    border: string
    glow: string
    gradient: string
  }
> = {
  blue: {
    text: 'text-blue-400',
    bg: 'bg-blue-500',
    bgSubtle: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    glow: 'bg-blue-500/20',
    gradient: 'from-blue-500 to-blue-600'
  },
  amber: {
    text: 'text-amber-400',
    bg: 'bg-amber-500',
    bgSubtle: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: 'bg-amber-500/20',
    gradient: 'from-amber-500 to-amber-600'
  },
  red: {
    text: 'text-red-400',
    bg: 'bg-red-500',
    bgSubtle: 'bg-red-500/10',
    border: 'border-red-500/30',
    glow: 'bg-red-500/20',
    gradient: 'from-red-500 to-red-600'
  },
  violet: {
    text: 'text-violet-400',
    bg: 'bg-violet-500',
    bgSubtle: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    glow: 'bg-violet-500/20',
    gradient: 'from-violet-500 to-violet-600'
  },
  emerald: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500',
    bgSubtle: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'bg-emerald-500/20',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  sky: {
    text: 'text-sky-400',
    bg: 'bg-sky-500',
    bgSubtle: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    glow: 'bg-sky-500/20',
    gradient: 'from-sky-500 to-sky-600'
  },
  orange: {
    text: 'text-orange-400',
    bg: 'bg-orange-500',
    bgSubtle: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    glow: 'bg-orange-500/20',
    gradient: 'from-orange-500 to-orange-600'
  },
  rose: {
    text: 'text-rose-400',
    bg: 'bg-rose-500',
    bgSubtle: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    glow: 'bg-rose-500/20',
    gradient: 'from-rose-500 to-rose-600'
  },
  teal: {
    text: 'text-teal-400',
    bg: 'bg-teal-500',
    bgSubtle: 'bg-teal-500/10',
    border: 'border-teal-500/30',
    glow: 'bg-teal-500/20',
    gradient: 'from-teal-500 to-teal-600'
  },
  indigo: {
    text: 'text-indigo-400',
    bg: 'bg-indigo-500',
    bgSubtle: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    glow: 'bg-indigo-500/20',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  fuchsia: {
    text: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500',
    bgSubtle: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/30',
    glow: 'bg-fuchsia-500/20',
    gradient: 'from-fuchsia-500 to-fuchsia-600'
  }
}
