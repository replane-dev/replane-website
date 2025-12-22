# Contributing to Replane Documentation

Thank you for your interest in contributing to the Replane documentation! This guide will help you get started.

## Getting Started

### Prerequisites

- **Node.js**: Version 20.0 or greater
- **npm**, **yarn**, or **pnpm**

### Clone the Repository

```sh
git clone https://github.com/replane-dev/replane-website.git
cd replane-website
```

### Install Dependencies

```sh
npm install
# or
pnpm install
```

## Development

### Start Development Server

```sh
npm run dev
```

The site will open at `http://localhost:4000`.

### Build for Production

```sh
npm run build
```

### Serve Production Build

```sh
npm run serve
```

### Generate API Documentation

```sh
npm run gen-api-docs
```

## Writing Documentation

### Adding New Pages

1. Create a new Markdown file in the appropriate `docs/` subdirectory
2. Add the page to `sidebars.ts` in the appropriate category
3. Add frontmatter with metadata:

```markdown
---
title: Your Page Title
description: A brief description of the page content
---

# Your Page Title

Your content here...
```

### Linking Between Pages

Use absolute paths for links:

```markdown
[Link text](/docs/path/to/page)
```

### Adding Images

Place images in `static/img/` and reference them:

```markdown
![Alt text](/img/your-image.png)
```

## Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b docs/your-improvement`
3. Make your changes
4. Test locally: `npm run dev`
5. Build to check for errors: `npm run build`
6. Commit your changes with a descriptive message
7. Push to your fork and submit a pull request

### Writing Guidelines

- Use clear, concise language
- Include code examples where appropriate
- Add screenshots for UI walkthroughs
- Test all links and code snippets
- Follow the existing structure and formatting

## Reporting Issues

Found an error or have a suggestion? Please [open an issue](https://github.com/replane-dev/replane-website/issues) on GitHub.

## Community

Have questions or want to discuss Replane? Join the conversation in [GitHub Discussions](https://github.com/orgs/replane-dev/discussions).

## License

By contributing to Replane documentation, you agree that your contributions will be licensed under the MIT License.
