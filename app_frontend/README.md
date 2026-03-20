# Portfolio Website

A modern, maintainable portfolio website built with Vite, TypeScript, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
portfolio-vite/
├── index.html              # Main HTML with Tailwind classes
├── src/
│   ├── main.ts             # Entry point - initializes all modules
│   ├── style.css           # Tailwind imports + custom CSS
│   ├── vite-env.d.ts       # TypeScript declarations
│   └── modules/
│       ├── config.ts       # API configuration (Azure Functions URL)
│       ├── theme.ts        # Dark/light mode toggle
│       ├── visitor-counter.ts  # Visitor tracking
│       ├── scroll-reveal.ts    # Scroll animations
│       └── mobile-menu.ts  # Mobile navigation
├── dist/                   # Production build output
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## How to Make Changes

### Update Content
Edit `index.html` directly. Tailwind classes are self-documenting:
- `text-2xl` = font size
- `font-bold` = bold text
- `text-primary-400` = primary color
- `bg-gray-900` = dark background

### Change Colors
Edit `src/style.css` → `@theme` section:
```css
@theme {
  --color-primary-500: #6366f1;  /* Change this */
}
```


### Update Azure Functions URL
Edit `src/modules/config.ts`:
```typescript
const PRODUCTION_API_URL = 'https://your-function-app.azurewebsites.net'
```

### Add New Section
Copy existing section in `index.html`:
```html
<section id="new-section" class="py-20">
  <div class="max-w-5xl mx-auto px-6">
    <div class="reveal">
      <span class="text-primary-400 font-mono text-sm">09.</span>
      <h2 class="text-3xl font-bold mt-2 mb-8">New Section</h2>
    </div>
    <!-- Content here -->
  </div>
</section>
```

## Icons (Lucide)

This project uses Lucide icons. Usage:
```html
<i data-lucide="icon-name" class="w-5 h-5"></i>
```

Find icons at: https://lucide.dev/icons/

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload `dist/` folder contents to your hosting:
   - Cloudflare Pages
   - Azure Storage Static Website
   - Netlify
   - Vercel
   - GitHub Pages

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Vite | 8.x | Build tool & dev server |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Lucide | Latest | SVG icons |

## Maintenance Notes

- **Dependencies**: Run `npm outdated` to check for updates
- **TypeScript**: Run `npx tsc --noEmit` to check for type errors
- **Bundle size**: Check with `npm run build` output
