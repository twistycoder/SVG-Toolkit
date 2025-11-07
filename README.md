# SVG Toolkit 🎨

A comprehensive suite of 14+ SVG tools for developers and designers. Create, edit, optimize, and convert SVG graphics with ease.

![SVG Toolkit](https://svg-toolkit.vercel.app/og-image.png)

## ✨ Features

### 🔄 Converters
- **Text to SVG** - Create SVG text with 100+ custom fonts
- **SVG to Code** - Extract and optimize SVG code from files
- **SVG to React** - Convert SVG to React components with JSX syntax
- **SVG to Image** - Export SVG to PNG, JPEG, and WebP formats

### 🎨 Editors
- **SVG Editor** - Visual editing with drag-and-drop shapes
- **Path Editor** - Visual path manipulation and editing
- **Icon Customizer** - Batch customize SVG icons with consistent styling

### ⚡ Optimization
- **SVG Optimizer** - Advanced compression and minification
- **Code Formatter** - Beautify and format SVG code
- **Metadata Editor** - Add SEO and accessibility metadata

### 🎭 Design Tools
- **Background Generator** - Create beautiful SVG patterns
- **Gradient Generator** - Linear and radial gradient creation
- **Filter Effects** - Apply visual effects and filters
- **Animation Creator** - Timeline-based SVG animations

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/svg-toolkit.git
cd svg-toolkit
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel
- **SEO**: Structured Data (JSON-LD)

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Site footer
│   ├── PromoBanner.jsx # Promotion banner
│   └── SeoJsonLd.jsx   # SEO component
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles

public/
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Crawler instructions
└── og-image.png        # Social media image
```

## 🎯 Tool Overview

### Text to SVG Converter
- 100+ Google Fonts integration
- Customizable text properties
- Real-time preview
- Download as SVG file

### SVG Editor
- Drag-and-drop interface
- Basic shapes library
- Real-time property editing
- Copy SVG code

### SVG Optimizer
- Remove comments and metadata
- Minify code
- Remove empty attributes
- File size analysis

### SVG to React Converter
- Convert SVG to JSX components
- TypeScript support
- Customizable props
- Clean code output

## 🌟 Key Features

- **100% Client-side** - No server processing required
- **Real-time Preview** - See changes instantly
- **No Upload Required** - All processing happens in browser
- **Responsive Design** - Works on all devices
- **Fast & Lightweight** - Built with Vite for optimal performance
- **SEO Optimized** - Structured data and meta tags
- **Accessible** - Proper ARIA labels and keyboard navigation

## 🔧 Development

### Adding New Tools

1. Create a new component in `src/`
2. Add tool configuration in `App.jsx`:
```jsx
const toolConfigs = {
  yourTool: {
    component: YourToolComponent,
    name: 'Your Tool Name',
    path: '/your-tool',
    breadcrumbs: [...]
  }
}
```

3. Update the header navigation in `Header.jsx`

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the existing color scheme
- Maintain responsive design
- Ensure accessibility compliance

## 📊 SEO & Performance

- **Lighthouse Score**: 95+ 
- **Core Web Vitals**: All green
- **Structured Data**: JSON-LD implementation
- **Sitemap**: Automatic generation
- **Meta Tags**: Open Graph and Twitter Cards

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🐛 Bug Reports

If you encounter any bugs, please [create an issue](https://github.com/your-username/svg-toolkit/issues) with:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Lucide Icons](https://lucide.dev) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com) for utility-first CSS
- [Vite](https://vitejs.dev) for fast development build
- [React](https://reactjs.org) for the component architecture

## 📞 Support

If you need help or have questions:
- 📧 Email: webdipo@mail.io
- 🐦 Twitter: [@Webdipo](https://twitter.com/Webdipo)
- 💼 LinkedIn: [Webdipo](https://linkedin.com/company/webdipo)

## 🌐 Live Demo

Visit [SVG Toolkit](https://svg-toolkit.vercel.app) to try all tools online!

---

**Built with 💛 by [Webdipo](https://webdipo.vercel.app)**

*Making SVG manipulation accessible to everyone*