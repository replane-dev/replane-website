import path from 'path'
import type { Plugin } from '@docusaurus/types'

export default function webpackAliasPlugin(): Plugin {
  return {
    name: 'webpack-alias-plugin',
    configureWebpack() {
      return {
        resolve: {
          alias: {
            '@': path.resolve(__dirname, '../'),
            '@components': path.resolve(__dirname, '../components'),
            '@css': path.resolve(__dirname, '../css'),
            '@lib': path.resolve(__dirname, '../lib'),
            '@pages': path.resolve(__dirname, '../pages'),
            '@plugins': path.resolve(__dirname, '../plugins'),
            '@theme': path.resolve(__dirname, '../theme')
          }
        }
      }
    }
  }
}
