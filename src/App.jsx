import React, { useState } from 'react';
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

function App() {
  const [activeTab, setActiveTab] = useState('textToSvg');

  const tools = [
    { id: 'textToSvg', name: 'Text to SVG', component: TextToSvg },
    { id: 'svgToCode', name: 'SVG to Code', component: SvgToCode },
    { id: 'svgEditor', name: 'SVG Editor', component: SvgEditor },
    { id: 'svgOptimizer', name: 'SVG Optimizer', component: SvgOptimizer },
    { id: 'svgToReact', name: 'SVG to React', component: SvgToReact },
    { id: 'bgGenerator', name: 'Backgrounds', component: SvgBackgroundGenerator },
    { id: 'animationCreator', name: 'Animation', component: SvgAnimationCreator },
    { id: 'pathEditor', name: 'Path Editor', component: SvgPathEditor },
    { id: 'imageConverter', name: 'SVG to Image', component: SvgToImageConverter },
    { id: 'iconCustomizer', name: 'Icon Customizer', component: SvgIconCustomizer },
    { id: 'codeFormatter', name: 'Code Formatter', component: SvgCodeFormatter },
    { id: 'metadataEditor', name: 'Metadata Editor', component: SvgMetadataEditor },
    { id: 'gradientGenerator', name: 'Gradient Generator', component: SvgGradientGenerator },
    { id: 'filterEffects', name: 'Filter Effects', component: SvgFilterEffects },
  ];

  const ActiveComponent = tools.find(tool => tool.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4">
            <div className="flex items-center mb-4 sm:mb-0">
              <svg className="w-8 h-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <h1 className="text-2xl font-bold text-gray-800">
                SVG Toolkit
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-1 max-w-2xl">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`px-3 py-2 text-sm rounded-md font-medium transition-all ${
                    activeTab === tool.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {tool.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {ActiveComponent && <ActiveComponent />}
      </main>
    </div>
  );
}

export default App;