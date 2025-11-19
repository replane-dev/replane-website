# Replane Documentation Website

Official documentation website for [Replane](https://github.com/replane-dev/replane) - versioned, auditable application configuration.

**Live Site:** [https://replane.dev](https://replane.dev)

## Tech Stack

- **Docusaurus V3** - Documentation framework
- **TailwindCSS V4** - Styling
- **Shadcn/UI** - Component library
- **OpenAPI Docs** - Auto-generated API reference from OpenAPI spec
- **Local Search** - Full-text search powered by `@easyops-cn/docusaurus-search-local`

## Local Development

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Setup

1. Clone the repository:

```bash
git clone https://github.com/replane-dev/replane-website.git
cd replane-website
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:

```bash
npm start
```

The site will open at `http://localhost:3000`.

### Building

Generate a production build:

```bash
npm run build
```

Serve the production build locally:

```bash
npm run serve
```

## Project Structure

```
replane-website/
├── api-swagger/          # OpenAPI specification files
│   └── replane.yaml      # Replane API spec
├── blog/                 # Blog posts
├── docs/                 # Documentation content
│   ├── getting-started/  # Quickstart and installation guides
│   ├── concepts/         # Core concepts and architecture
│   ├── self-hosting/     # Deployment guides
│   ├── guides/           # Use case guides
│   ├── sdk/              # SDK documentation
│   └── api/              # Generated API reference
├── src/
│   ├── components/       # React components
│   │   ├── ui/           # Shadcn/UI components
│   │   └── Homepage/     # Homepage components
│   ├── css/              # Styles
│   ├── pages/            # Custom pages
│   ├── plugins/          # Docusaurus plugins
│   └── theme/            # Theme customizations
├── static/               # Static assets
└── docusaurus.config.js  # Docusaurus configuration
```

## Generating API Documentation

The API reference is automatically generated from the OpenAPI specification:

```bash
# Generate API docs
npm run gen-api-docs

# Clean generated API docs
npm run clean-api-docs
```

The OpenAPI spec is located at `api-swagger/replane.yaml`. After updating it, regenerate the docs.

## Writing Documentation

### Adding New Docs

1. Create a new Markdown file in the appropriate `docs/` subdirectory
2. Add frontmatter with metadata:

```markdown
---
sidebar_position: 1
title: Your Page Title
---

# Your Page Title

Your content here...
```

3. The page will automatically appear in the sidebar based on the directory structure

### Linking Between Pages

Use absolute paths for links to ensure they work correctly:

```markdown
[Link text](/docs/path/to/page)
```

Avoid relative links like `./page` or `../other/page` as they may break with `trailingSlash: false`.

### Adding Images

Place images in `static/img/` and reference them:

```markdown
![Alt text](/img/your-image.png)
```

## Configuration

### Site Config

Main configuration is in `docusaurus.config.js`:

- Site metadata (title, tagline, URL)
- Theme configuration
- Plugin settings
- Navigation and footer links

### Styling

- TailwindCSS configuration is in `src/css/custom.css` (v4)
- Custom CSS variables and overrides are also in `custom.css`
- Shadcn/UI components are in `src/components/ui/`

### Search

The local search is configured to:

- Index all pages including docs and blog
- Support keyboard shortcuts (Cmd/Ctrl + K)
- Provide search suggestions
- Highlight search terms

## Deployment

The site is configured for deployment to static hosting platforms:

### Vercel (Recommended)

1. Push to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect Docusaurus and deploy

### Manual Deploy

```bash
npm run build
# Upload the 'build' directory to your hosting provider
```

## Contributing

Contributions to the documentation are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b docs/your-improvement`
3. Make your changes
4. Test locally: `npm start`
5. Build to check for errors: `npm run build`
6. Submit a pull request

### Writing Guidelines

- Use clear, concise language
- Include code examples where appropriate
- Add screenshots for UI walkthroughs
- Test all links and code snippets
- Follow the existing structure and formatting

## Resources

- [Replane Main Repository](https://github.com/replane-dev/replane)
- [Docusaurus Documentation](https://docusaurus.io/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Shadcn/UI Documentation](https://ui.shadcn.com/)

## License

MIT - See [LICENSE](../LICENSE) file in the main repository.
