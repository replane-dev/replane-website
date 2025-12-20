import type { Plugin } from '@docusaurus/types'
import type { AcceptedPlugin } from 'postcss'

interface PostCssOptions {
  plugins: AcceptedPlugin[]
}

export default function tailwindPlugin(): Plugin {
  return {
    name: 'tailwind-plugin',
    configurePostCss(postcssOptions: PostCssOptions) {
      postcssOptions.plugins = [require('@tailwindcss/postcss')]
      return postcssOptions
    }
  }
}
