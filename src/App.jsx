import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PromoBanner from './components/PromoBanner';
import SeoJsonLd from './components/SeoJsonLd';
import TextToSvg from './TextToSvg';
import SvgToCode from './SvgToCode';
import SvgEditor from './SvgEditor';
import SvgOptimizer from './SvgOptimizer';
import SvgToReact from './SvgToReact';
import SvgBackgroundGenerator from './SvgBackgroundGenerator';
import SvgAnimationCreator from './SvgAnimationCreator';
import SvgPathEditor from './SvgPathEditor';
import SvgToImageConverter from './SvgToImageConverter';
import SvgIconCustomizer from './SvgIconCustomizer';
import SvgCodeFormatter from './SvgCodeFormatter';
import SvgMetadataEditor from './SvgMetadataEditor';
import SvgGradientGenerator from './SvgGradientGenerator';
import SvgFilterEffects from './SvgFilterEffects';

// Tool configurations with SEO data
const toolConfigs = {
  textToSvg: {
    component: TextToSvg,
    name: 'Text to SVG Converter - Create SVG Text with Custom Fonts | SVG Toolkit',
    path: '/text-to-svg',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'Text to SVG Converter', url: 'https://svg-toolkit.vercel.app/text-to-svg' }
    ]
  },
  svgToCode: {
    component: SvgToCode,
    name: 'SVG to Code Converter - Extract and Optimize SVG Code | SVG Toolkit',
    path: '/svg-to-code',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'SVG to Code Converter', url: 'https://svg-toolkit.vercel.app/svg-to-code' }
    ]
  },
  svgEditor: {
    component: SvgEditor,
    name: 'SVG Editor - Visual SVG Editing Tool | SVG Toolkit',
    path: '/svg-editor',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'SVG Editor', url: 'https://svg-toolkit.vercel.app/svg-editor' }
    ]
  },
  svgOptimizer: {
    component: SvgOptimizer,
    name: 'SVG Optimizer - Compress and Minify SVG Files | SVG Toolkit',
    path: '/svg-optimizer',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'SVG Optimizer', url: 'https://svg-toolkit.vercel.app/svg-optimizer' }
    ]
  },
  svgToReact: {
    component: SvgToReact,
    name: 'SVG to React Converter - Convert SVG to React Components | SVG Toolkit',
    path: '/svg-to-react',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'SVG to React Converter', url: 'https://svg-toolkit.vercel.app/svg-to-react' }
    ]
  },
  bgGenerator: {
    component: SvgBackgroundGenerator,
    name: 'SVG Background Generator - Create SVG Patterns | SVG Toolkit',
    path: '/background-generator',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'Background Generator', url: 'https://svg-toolkit.vercel.app/background-generator' }
    ]
  },
  animationCreator: {
    component: SvgAnimationCreator,
    name: 'SVG Animation Creator - Timeline-based SVG Animations | SVG Toolkit',
    path: '/animation-creator',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'Animation Creator', url: 'https://svg-toolkit.vercel.app/animation-creator' }
    ]
  },
  pathEditor: {
    component: SvgPathEditor,
    name: 'SVG Path Editor - Visual Path Manipulation Tool | SVG Toolkit',
    path: '/path-editor',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'Path Editor', url: 'https://svg-toolkit.vercel.app/path-editor' }
    ]
  },
  imageConverter: {
    component: SvgToImageConverter,
    name: 'SVG to Image Converter - Convert SVG to PNG, JPEG, WebP | SVG Toolkit',
    path: '/svg-to-image',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'SVG to Image Converter', url: 'https://svg-toolkit.vercel.app/svg-to-image' }
    ]
  },
  iconCustomizer: {
    component: SvgIconCustomizer,
    name: 'SVG Icon Customizer - Batch Customize SVG Icons | SVG Toolkit',
    path: '/icon-customizer',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'Icon Customizer', url: 'https://svg-toolkit.vercel.app/icon-customizer' }
    ]
  },
  codeFormatter: {
    component: SvgCodeFormatter,
    name: 'SVG Code Formatter - Beautify and Format SVG Code | SVG Toolkit',
    path: '/code-formatter',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'Code Formatter', url: 'https://svg-toolkit.vercel.app/code-formatter' }
    ]
  },
  metadataEditor: {
    component: SvgMetadataEditor,
    name: 'SVG Metadata Editor - Add SEO and Accessibility Metadata | SVG Toolkit',
    path: '/metadata-editor',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'Metadata Editor', url: 'https://svg-toolkit.vercel.app/metadata-editor' }
    ]
  },
  gradientGenerator: {
    component: SvgGradientGenerator,
    name: 'SVG Gradient Generator - Create Linear and Radial Gradients | SVG Toolkit',
    path: '/gradient-generator',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'Gradient Generator', url: 'https://svg-toolkit.vercel.app/gradient-generator' }
    ]
  },
  filterEffects: {
    component: SvgFilterEffects,
    name: 'SVG Filter Effects - Apply Visual Effects and Filters | SVG Toolkit',
    path: '/filter-effects',
    breadcrumbs: [
      { name: 'Home', url: 'https://svg-toolkit.vercel.app' },
      { name: 'Filter Effects', url: 'https://svg-toolkit.vercel.app/filter-effects' }
    ]
  },
};

// Home page configuration
const homeConfig = {
  name: 'SVG Toolkit - Complete SVG Solution for Developers and Designers',
  path: '/',
  breadcrumbs: [
    { name: 'Home', url: 'https://svg-toolkit.vercel.app' }
  ]
};

function App() {
  const [activeTab, setActiveTab] = useState('textToSvg');

  const currentConfig = activeTab ? toolConfigs[activeTab] : homeConfig;
  const ActiveComponent = currentConfig.component;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* SEO JSON-LD Structured Data */}
      <SeoJsonLd 
        pageName={currentConfig.name}
        pageUrl={`https://svg-toolkit.vercel.app${currentConfig.path}`}
        breadcrumbs={currentConfig.breadcrumbs}
      />
      
      {/* Separate container for header to avoid overflow issues */}
      <div className="sticky top-0 z-50">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <PromoBanner />
      </div>
      
      {/* Main content with overflow control */}
      <div className="flex-1 overflow-x-hidden">
        <main className="w-full">
          {ActiveComponent ? <ActiveComponent /> : (
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold text-gray-800">SVG Toolkit</h1>
              <p className="text-lg text-gray-600 mt-4">Select a tool from the navigation to get started</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;