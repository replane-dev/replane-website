import type { LoadContext, Plugin, PluginOptions } from '@docusaurus/types'

const blogPluginExports = require('@docusaurus/plugin-content-blog')
const defaultBlogPlugin = blogPluginExports.default

interface BlogPostMetadata {
  title: string
  description: string
  permalink: string
  date: string
  source: string
}

interface BlogPost {
  metadata: BlogPostMetadata
}

interface BlogContent {
  blogPosts: BlogPost[]
}

interface BlogPluginOptions extends PluginOptions {
  blogTitle?: string
  blogDescription?: string
  path?: string
}

interface ContentLoadedParams {
  content: BlogContent
  actions: {
    createData: (name: string, data: string) => Promise<string>
    addRoute: (route: {
      path: string
      exact: boolean
      component: string
      modules: Record<string, unknown>
    }) => void
  }
}

async function blogPluginExtended(
  context: LoadContext,
  options: BlogPluginOptions
): Promise<Plugin> {
  const blogPluginInstance = await defaultBlogPlugin(context, options)

  return {
    // Add all properties of the default blog plugin so existing functionality is preserved
    ...blogPluginInstance,
    /**
     * Override the default `contentLoaded` hook to access blog posts data
     */
    contentLoaded: async function (params: ContentLoadedParams) {
      const { content, actions } = params

      // Get the 6 latest blog posts
      const recentPostsLimit = 6
      const recentPosts = [...content.blogPosts].splice(0, recentPostsLimit)

      async function createRecentPostModule(blogPost: BlogPost, index: number) {
        return {
          // Inject the metadata you need for each recent blog post
          blogData: await actions.createData(
            `home-page-recent-post-metadata-${index}.json`,
            JSON.stringify({
              metadata: blogPost.metadata
            })
          ),

          // Inject the MDX excerpt as a JSX component prop
          // (what's above the <!-- truncate --> marker)
          Preview: {
            __import: true,
            // The markdown file for the blog post will be loaded by webpack
            path: blogPost.metadata.source,
            query: {
              truncated: true
            }
          }
        }
      }

      actions.addRoute({
        // Add route for the home page
        path: '/',
        exact: true,

        // The component to use for the "Home" page route
        component: '@site/src/components/Homepage/index.tsx',

        // These are the props that will be passed to our "Home" page component
        modules: {
          homePageBlogMetadata: await actions.createData(
            'home-page-blog-metadata.json',
            JSON.stringify({
              blogTitle: options.blogTitle,
              blogDescription: options.blogDescription,
              path: options.path,
              totalPosts: content.blogPosts.length,
              totalRecentPosts: recentPosts.length
            })
          ),
          recentPosts: await Promise.all(recentPosts.map(createRecentPostModule))
        }
      })

      // Call the default overridden `contentLoaded` implementation
      return blogPluginInstance.contentLoaded(params)
    }
  }
}

module.exports = {
  ...blogPluginExports,
  default: blogPluginExtended
}
