import React, { useState } from 'react';
import { 
  Palette, 
  Code, 
  Edit3, 
  Zap, 
  Image,
  PenTool,
  Settings,
  Layout,
  Sparkles,
  Filter,
  Type,
  FileCode,
  Square,
  ImageIcon,
  Atom,
  SquaresSubtract
} from 'lucide-react';

const Header = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tools = [
    { 
      id: 'textToSvg', 
      name: 'Text to SVG', 
      icon: <Type className="w-5 h-5" />,
      category: 'Converters'
    },
    { 
      id: 'svgToCode', 
      name: 'SVG to Code', 
      icon: <FileCode className="w-5 h-5" />,
      category: 'Converters'
    },
    { 
      id: 'svgEditor', 
      name: 'SVG Editor', 
      icon: <Edit3 className="w-5 h-5" />,
      category: 'Editors'
    },
    { 
      id: 'svgOptimizer', 
      name: 'SVG Optimizer', 
      icon: <Zap className="w-5 h-5" />,
      category: 'Optimization'
    },
    { 
      id: 'svgToReact', 
      name: 'SVG to React', 
      icon: <Atom className="w-5 h-5" />, // Using Atom for React
      category: 'Converters'
    },
    { 
      id: 'bgGenerator', 
      name: 'Backgrounds', 
      icon: <Layout className="w-5 h-5" />,
      category: 'Design'
    },
    { 
      id: 'animationCreator', 
      name: 'Animation', 
      icon: <Sparkles className="w-5 h-5" />,
      category: 'Design'
    },
    { 
      id: 'pathEditor', 
      name: 'Path Editor', 
      icon: <PenTool className="w-5 h-5" />,
      category: 'Editors'
    },
    { 
      id: 'imageConverter', 
      name: 'SVG to Image', 
      icon: <ImageIcon className="w-5 h-5" />,
      category: 'Converters'
    },
    { 
      id: 'iconCustomizer', 
      name: 'Icon Customizer', 
      icon: <Settings className="w-5 h-5" />,
      category: 'Editors'
    },
    { 
      id: 'codeFormatter', 
      name: 'Code Formatter', 
      icon: <Code className="w-5 h-5" />,
      category: 'Optimization'
    },
    { 
      id: 'metadataEditor', 
      name: 'Metadata Editor', 
      icon: <FileCode className="w-5 h-5" />,
      category: 'Optimization'
    },
    { 
      id: 'gradientGenerator', 
      name: 'Gradient Generator', 
      icon: <Square className="w-5 h-5" />,
      category: 'Design'
    },
    { 
      id: 'filterEffects', 
      name: 'Filter Effects', 
      icon: <Filter className="w-5 h-5" />,
      category: 'Design'
    },
  ];

  const categories = {
    'Converters': ['textToSvg', 'svgToCode', 'svgToReact', 'imageConverter'],
    'Editors': ['svgEditor', 'pathEditor', 'iconCustomizer'],
    'Design': ['bgGenerator', 'gradientGenerator', 'filterEffects', 'animationCreator'],
    'Optimization': ['svgOptimizer', 'codeFormatter', 'metadataEditor']
  };

  const getToolsByCategory = (categoryName) => {
    return tools.filter(tool => categories[categoryName].includes(tool.id));
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-purple-600 rounded-xl flex items-center justify-center">
                <SquaresSubtract className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SVG Toolkit</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Complete SVG Solution</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {Object.keys(categories).map(category => (
              <div key={category} className="relative group">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1">
                  <span>{category}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    {getToolsByCategory(category).map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => setActiveTab(tool.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          activeTab === tool.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`p-1.5 rounded ${
                          activeTab === tool.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tool.icon}
                        </div>
                        <span>{tool.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {Object.keys(categories).map(category => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-2 mb-2">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {getToolsByCategory(category).map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setActiveTab(tool.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          activeTab === tool.id
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`p-1.5 rounded ${
                          activeTab === tool.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tool.icon}
                        </div>
                        <span>{tool.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Access Bar */}
        <div className="hidden lg:block border-t border-gray-200 py-2">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Quick Access:</span>
            <div className="flex space-x-1">
              {tools.slice(0, 6).map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === tool.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                  }`}
                >
                  {tool.icon}
                  <span>{tool.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;