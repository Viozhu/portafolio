# Portfolio Website

A modern, multilingual portfolio website showcasing my work, skills, and experience as a Full Stack Developer. Built with Next.js, TypeScript, and Tailwind CSS, featuring an animated WebGL Aurora background and dynamic content management.

## 🌟 Features

- **🎨 Beautiful UI/UX**: Modern design with glass morphism effects, gradient text, and smooth animations
- **🌐 Multi-language Support**: Fully internationalized with support for English, Spanish, and Korean (i18next)
- **✨ Animated Hero Section**: Stunning WebGL Aurora background powered by Three.js
- **📱 Fully Responsive**: Optimized for all screen sizes and devices
- **📊 Dynamic Content**: Projects and experiences fetched from Google Sheets API
- **⚡ Performance Optimized**: Built with Next.js for optimal performance and SEO
- **🎯 Type-Safe**: Full TypeScript support for better developer experience

## 🛠️ Tech Stack

### Core Framework
- **Next.js 12.8** - React framework for production
- **React 17.0.2** - UI library
- **TypeScript 5.9.3** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS 3.0.16** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Custom animations** - Float, fade-in, and spin animations

### Internationalization
- **next-i18next 15.2.0** - i18n for Next.js
- **react-i18next 13.5.0** - React bindings for i18next
- **i18next 23.7.11** - Internationalization framework
- **Supported languages**: English (en), Spanish (es), Korean (ko)

### 3D Graphics & Animations
- **Three.js 0.182.0** - 3D graphics library
- **@types/three** - TypeScript definitions
- **react-tsparticles 1.39.0** - Particle animations

### Additional Libraries
- **react-vanilla-tilt 1.0.0** - 3D tilt effects
- **axios 1.4.0** - HTTP client
- **isomorphic-unfetch 3.0.0** - Fetch polyfill

### Deployment
- **Netlify** - Hosting platform
- **@netlify/plugin-nextjs 4.2.1** - Next.js plugin for Netlify

## 📁 Project Structure

```
portafolio/
├── components/           # React components
│   ├── About/           # About section component
│   ├── Contact/         # Contact form component
│   ├── Hero/            # Hero section with Aurora background
│   ├── Layout/          # Main layout wrapper
│   ├── NavBar/          # Navigation bar
│   ├── Projects/        # Project card components
│   ├── Skills/          # Skills showcase
│   ├── ui/              # UI components (starfall portfolio landing)
│   └── Waves/           # Wave animations
├── interfaces/          # TypeScript interfaces
├── pages/               # Next.js pages
│   ├── _app.tsx        # App wrapper with i18n
│   └── index.tsx       # Main portfolio page
├── public/              # Static assets
│   └── locales/        # Translation files
│       ├── en/
│       ├── es/
│       └── ko/
├── styles/              # Global styles
│   └── global.css      # Global CSS with animations
├── utils/               # Utility functions
│   ├── useLanguageDetection.ts  # Auto language detection
│   └── usePortfolioData.ts      # Google Sheets data fetching
├── netlify.toml         # Netlify configuration
├── next.config.js       # Next.js configuration
├── next-i18next.config.js  # i18next configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 24.x (specified in netlify.toml)
- **pnpm** (package manager used for deployment)
- **npm** or **yarn** (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portafolio
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using yarn
   yarn install
   
   # Or using pnpm (as configured for Netlify)
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run stage` - Build and start (for staging)
- `npm run type-check` - Run TypeScript type checking

## 🎨 Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  space: {
    dark: '#0B0B15',
    light: '#1F2937',
    accent: '#6366F1',
    cyan: '#06B6D4',
    pink: '#F472B6',
  },
}
```

### Translations

Translation files are located in `public/locales/{language}/common.json`. Add or modify translations there.

Supported languages:
- English (`en`)
- Spanish (`es`)
- Korean (`ko`)

### Content Management

Projects and experiences are managed through a Google Sheets spreadsheet. The data is fetched dynamically using the Google Sheets API.

To update the data source, modify the URL in `utils/usePortfolioData.ts`:

```typescript
const response = await axios.get(
  "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json"
);
```

**Note**: Make sure your Google Sheet is published to the web for public access.

### Hero Section

Customize the hero section in `components/Hero/Hero.tsx`:

```typescript
const portfolioProps: PortfolioPageProps = {
  logo: {
    initials: 'JIG',
    name: 'Jorge Ignacio Garay',
  },
  hero: {
    titleLine1: t('greeting'),
    titleLine2Gradient: t('role'),
    subtitle: t('about_text'),
  },
  // ... more configuration
};
```

## 🌍 Internationalization

The website automatically detects the user's browser language and displays content accordingly. Users can also manually switch languages.

### Adding a New Language

1. Create a new directory in `public/locales/` (e.g., `fr` for French)
2. Add a `common.json` file with translations
3. Update `next-i18next.config.js`:

```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'ko', 'fr'], // Add new language
  },
};
```

## 🎭 Sections

### Hero Section
- Animated Aurora WebGL background
- Personal greeting and role
- Call-to-action buttons
- Smooth scroll navigation

### About Section
- Professional background
- Work experience timeline
- Skills and expertise

### Portfolio Section
- Dynamic project showcase
- Project cards with images
- Technology stack tags
- Links to live projects

### Skills Section
- Technical skills visualization
- Technology icons and badges
- Proficiency indicators

### Contact Section
- Contact form
- Social media links
- Professional links

## 🚢 Deployment

### Netlify Deployment

The project is configured for deployment on Netlify:

1. **Connect your repository** to Netlify
2. **Build settings** (configured in `netlify.toml`):
   - Build command: `pnpm install --frozen-lockfile && pnpm run build`
   - Publish directory: `.next`
   - Node version: 24

3. **Deploy**: Netlify will automatically deploy on every push to your main branch

### Environment Variables

If needed, add environment variables in Netlify dashboard:
- Add any API keys or configuration values
- Access via `process.env.VARIABLE_NAME`

## 🔧 Configuration Files

- **`next.config.js`** - Next.js configuration with i18n support
- **`netlify.toml`** - Netlify deployment configuration
- **`tailwind.config.js`** - Tailwind CSS customization
- **`tsconfig.json`** - TypeScript compiler options
- **`next-i18next.config.js`** - Internationalization settings

## 📦 Dependencies

### Production Dependencies
- `next`, `react`, `react-dom` - Core framework
- `typescript` - Type safety
- `tailwindcss`, `postcss` - Styling
- `next-i18next`, `react-i18next`, `i18next` - Internationalization
- `three`, `@types/three` - 3D graphics
- `react-tsparticles` - Particle animations
- `axios` - HTTP client
- `react-vanilla-tilt` - Tilt effects

### Development Dependencies
- `@types/node`, `@types/react`, `@types/react-dom` - Type definitions
- `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` - ESLint
- `@fullhuman/postcss-purgecss` - CSS purging
- `autoprefixer` - CSS autoprefixing

## 🐛 Troubleshooting

### Build Issues
- Ensure Node.js version matches (24.x)
- Clear `.next` directory and rebuild
- Run `npm install` to update dependencies

### Translation Issues
- Check that translation files exist in `public/locales/{language}/`
- Verify `next-i18next.config.js` includes the language
- Clear browser cache if translations don't update

### Google Sheets Data Issues
- Ensure the Google Sheet is published to the web
- Check the sheet ID in `usePortfolioData.ts`
- Verify the sheet structure matches the expected format

## 📄 License

ISC

## 👤 Author

**Jorge Ignacio Garay**
- Full Stack Developer
- Portfolio: [https://jorgeignaciogaray.netlify.app/]
- LinkedIn: [https://www.linkedin.com/in/jorgeignaciogaray/]
- GitHub: [https://github.com/Viozhu/]

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Three.js community for WebGL resources
- All contributors and maintainers of the open-source libraries used

## 📝 Notes

- The Aurora background uses Three.js WebGL renderer for optimal performance
- All styles are scoped and won't conflict with existing components
- The project uses TypeScript for type safety and better developer experience
- Content is dynamically loaded from Google Sheets for easy updates without code changes

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
