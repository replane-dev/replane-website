/**
 * Generate unique social cards for each blog post.
 * Run with: npx tsx scripts/generate-social-cards.ts
 */

import fs from 'fs'
import path from 'path'
import satori from 'satori'
import sharp from 'sharp'
import type { ReactNode } from 'react'

const BLOG_DIR = path.join(process.cwd(), 'blog')
const OUTPUT_DIR = path.join(process.cwd(), 'static', 'img', 'social-cards')
const LOGO_PATH = path.join(process.cwd(), 'static', 'img', 'logo.png')

// Card dimensions (Twitter/X optimal: 1200x630)
const WIDTH = 1200
const HEIGHT = 630

interface BlogPost {
  slug: string
  title: string
  description?: string
  authors?: string
  date: string
}

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content: string): Record<string, string> {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) return {}

  const frontmatter: Record<string, string> = {}
  const lines = frontmatterMatch[1].split('\n')

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      // Remove quotes
      if (
        (value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))
      ) {
        value = value.slice(1, -1)
      }
      frontmatter[key] = value
    }
  }

  return frontmatter
}

/**
 * Get all blog posts from the blog directory
 */
function getBlogPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
  const posts: BlogPost[] = []

  for (const file of files) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
    const frontmatter = parseFrontmatter(content)

    // Extract date from filename (format: YYYY-MM-DD-slug.md)
    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/)
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]

    // Use slug from frontmatter or derive from filename
    const slug = frontmatter.slug || file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx?$/, '')

    posts.push({
      slug,
      title: frontmatter.title || slug,
      description: frontmatter.description,
      authors: frontmatter.authors,
      date
    })
  }

  return posts
}

/**
 * Generate SVG for a social card using satori
 */
async function generateSvg(post: BlogPost, logoBase64: string): Promise<string> {
  // Load font
  const interBold = fs.readFileSync(path.join(process.cwd(), 'scripts', 'fonts', 'Inter-Bold.ttf'))
  const interRegular = fs.readFileSync(
    path.join(process.cwd(), 'scripts', 'fonts', 'Inter-Regular.ttf')
  )

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0f',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)',
          padding: '60px',
          fontFamily: 'Inter'
        },
        children: [
          // Top bar with logo and site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              },
              children: [
                // Logo image
                {
                  type: 'img',
                  props: {
                    src: logoBase64,
                    width: 48,
                    height: 48,
                    style: {
                      width: '48px',
                      height: '48px'
                    }
                  }
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#ffffff',
                      fontSize: '28px',
                      fontWeight: 700
                    },
                    children: 'replane.dev'
                  }
                }
                // don't generate blog div for now
                // {
                //   type: 'div',
                //   props: {
                //     style: {
                //       marginLeft: 'auto',
                //       color: '#6b7280',
                //       fontSize: '20px'
                //     },
                //     children: 'Blog'
                //   }
                // }
              ]
            }
          },
          // Title
          {
            type: 'div',
            props: {
              style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '24px'
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#ffffff',
                      fontSize:
                        post.title.length > 60 ? '42px' : post.title.length > 40 ? '52px' : '58px',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      maxWidth: '100%',
                      wordWrap: 'break-word'
                    },
                    children: post.title
                  }
                },
                // Description (if exists)
                ...(post.description
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: '#9ca3af',
                            fontSize: '24px',
                            lineHeight: 1.4,
                            maxWidth: '90%'
                          },
                          children:
                            post.description.length > 120
                              ? post.description.slice(0, 117) + '...'
                              : post.description
                        }
                      }
                    ]
                  : [])
              ]
            }
          },
          // Bottom bar with date
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#6b7280',
                      fontSize: '20px'
                    },
                    children: new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }
                }
                // don't generate category div for now
                // {
                //   type: 'div',
                //   props: {
                //     style: {
                //       display: 'flex',
                //       gap: '8px'
                //     },
                //     children: [
                //       {
                //         type: 'div',
                //         props: {
                //           style: {
                //             background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                //             color: '#ffffff',
                //             padding: '8px 16px',
                //             borderRadius: '8px',
                //             fontSize: '18px',
                //             fontWeight: 600
                //           },
                //           children: 'Dynamic Configuration'
                //         }
                //       }
                //     ]
                //   }
                // }
              ]
            }
          }
        ]
      }
    } as ReactNode,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: 'Inter',
          data: interBold,
          weight: 700,
          style: 'normal'
        },
        {
          name: 'Inter',
          data: interRegular,
          weight: 400,
          style: 'normal'
        }
      ]
    }
  )

  return svg
}

/**
 * Convert SVG to PNG using sharp
 */
async function svgToPng(svg: string): Promise<Buffer> {
  return sharp(Buffer.from(svg)).png().toBuffer()
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 Generating social cards for blog posts...\n')

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Check if fonts exist
  const fontsDir = path.join(process.cwd(), 'scripts', 'fonts')
  const boldFontPath = path.join(fontsDir, 'Inter-Bold.ttf')
  const regularFontPath = path.join(fontsDir, 'Inter-Regular.ttf')

  if (!fs.existsSync(boldFontPath) || !fs.existsSync(regularFontPath)) {
    console.log('📥 Fonts not found. Downloading Inter fonts...')
    fs.mkdirSync(fontsDir, { recursive: true })

    const { execSync } = await import('child_process')

    // Download Inter font package and extract TTF files
    const zipPath = path.join(fontsDir, 'Inter.zip')
    console.log('   Downloading Inter font package...')
    execSync(
      `curl -L -o "${zipPath}" "https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip"`,
      { stdio: 'inherit' }
    )

    console.log('   Extracting fonts...')
    execSync(`unzip -o "${zipPath}" -d "${fontsDir}"`, { stdio: 'pipe' })

    // Copy TTF files to fonts directory
    execSync(`cp "${path.join(fontsDir, 'extras', 'ttf', 'Inter-Bold.ttf')}" "${boldFontPath}"`)
    execSync(
      `cp "${path.join(fontsDir, 'extras', 'ttf', 'Inter-Regular.ttf')}" "${regularFontPath}"`
    )

    // Clean up extracted files
    execSync(
      `rm -rf "${path.join(fontsDir, 'extras')}" "${path.join(fontsDir, 'web')}" "${zipPath}" ${path.join(fontsDir, '*.txt')} ${path.join(fontsDir, '*.ttc')} ${path.join(fontsDir, 'InterVariable*.ttf')}`,
      { stdio: 'pipe' }
    )

    console.log('   ✅ Fonts downloaded\n')
  }

  // Load logo as base64
  const logoBuffer = fs.readFileSync(LOGO_PATH)
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`

  const posts = getBlogPosts()
  console.log(`Found ${posts.length} blog posts\n`)

  for (const post of posts) {
    const outputPath = path.join(OUTPUT_DIR, `${post.slug}.png`)

    // Skip if already exists (use --force to regenerate)
    if (fs.existsSync(outputPath) && !process.argv.includes('--force')) {
      console.log(`⏭️  Skipping ${post.slug} (already exists)`)
      continue
    }

    console.log(`📝 Generating: ${post.slug}`)
    console.log(`   Title: ${post.title}`)

    try {
      const svg = await generateSvg(post, logoBase64)
      const png = await svgToPng(svg)
      fs.writeFileSync(outputPath, png)
      console.log(`   ✅ Saved to ${outputPath}\n`)
    } catch (error) {
      console.error(`   ❌ Error: ${error}\n`)
    }
  }

  console.log('✨ Done!')
}

main().catch(console.error)
