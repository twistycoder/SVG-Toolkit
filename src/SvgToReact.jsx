import React, { useState } from 'react';

const SvgToReact = () => {
  const [svgCode, setSvgCode] = useState('');
  const [reactCode, setReactCode] = useState('');
  const [componentName, setComponentName] = useState('SvgComponent');
  const [options, setOptions] = useState({
    useJSX: true,
    addProps: true,
    typescript: false,
    removeStyle: false,
    removeClass: false,
  });

  const convertToReact = () => {
    if (!svgCode.trim()) return;

    let converted = svgCode;

    // Convert SVG attributes to React camelCase
    converted = converted.replace(/(\w+-)(\w)/g, (match, p1, p2) => {
      return p1.slice(0, -1) + p2.toUpperCase();
    });

    // Replace stroke-width with strokeWidth, etc.
    converted = converted.replace(/(\w+)-(\w+)=/g, (match, p1, p2) => {
      return p1 + p2.charAt(0).toUpperCase() + p2.slice(1) + '=';
    });

    // Handle class to className
    converted = converted.replace(/class=/g, 'className=');

    // Handle style attributes
    converted = converted.replace(/style="([^"]*)"/g, (match, style) => {
      const reactStyle = style.split(';').reduce((acc, rule) => {
        const [key, value] = rule.split(':').map(s => s.trim());
        if (key && value) {
          const reactKey = key.replace(/-(\w)/g, (m, p1) => p1.toUpperCase());
          acc[reactKey] = value;
        }
        return acc;
      }, {});
      
      return `style={${JSON.stringify(reactStyle)}}`;
    });

    // Remove style tags if option is enabled
    if (options.removeStyle) {
      converted = converted.replace(/<style>[\s\S]*?<\/style>/g, '');
    }

    // Remove class attributes if option is enabled
    if (options.removeClass) {
      converted = converted.replace(/\s+className="[^"]*"/g, '');
    }

    // Close self-closing tags properly for JSX
    converted = converted.replace(/<(\w+)([^>]*)\s*\/?\s*>/g, (match, tag, attrs) => {
      if (match.endsWith('/>')) {
        return `<${tag}${attrs} />`;
      }
      return `<${tag}${attrs}></${tag}>`;
    });

    // Create React component wrapper
const propsInterface = options.typescript ? 
  `interface ${componentName}Props {\n  className?: string;\n  style?: React.CSSProperties;\n}` : '';

// Generate component code
const component = options.useJSX ? `
${options.typescript ? propsInterface : ''}
const ${componentName} = (${options.addProps ? `{ className, style }${options.typescript ? `: ${componentName}Props` : ''}` : ''}) => {
  return (
    ${converted.replace(/<svg/, `<svg ${options.addProps ? 'className={className} style={style} ' : ''}`)}
  );
};
`.trim() : converted;

    setReactCode(component);
  };

  const sampleSVG = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
  <style>.text { font-family: Arial; }</style>
  <text x="50" y="60" text-anchor="middle" class="text">Hello</text>
</svg>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">SVG to React Converter</h1>
          <p className="text-lg text-gray-600">Convert SVG files to React components with proper JSX syntax</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Input SVG</h2>
              <textarea
                value={svgCode}
                onChange={(e) => setSvgCode(e.target.value)}
                rows="12"
                className="w-full font-mono text-sm border border-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Paste your SVG code here..."
                spellCheck="false"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSvgCode(sampleSVG)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Load Sample
                </button>
                <button
                  onClick={convertToReact}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Convert to React
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Conversion Options</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Component Name
                </label>
                <input
                  type="text"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-3">
                {[
                  { key: 'useJSX', label: 'Wrap in JSX Component' },
                  { key: 'addProps', label: 'Add className and style props' },
                  { key: 'typescript', label: 'TypeScript Support' },
                  { key: 'removeStyle', label: 'Remove Style Tags' },
                  { key: 'removeClass', label: 'Remove Class Names' },
                ].map(option => (
                  <label key={option.key} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options[option.key]}
                      onChange={() => setOptions(prev => ({ ...prev, [option.key]: !prev[option.key] }))}
                      className="text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {reactCode && (
              <>
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">React Component</h2>
                    <button
                      onClick={() => navigator.clipboard.writeText(reactCode)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Copy Code
                    </button>
                  </div>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
                    <code>{reactCode}</code>
                  </pre>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview</h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white flex items-center justify-center min-h-32">
                    <div dangerouslySetInnerHTML={{ __html: svgCode }} />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Usage Instructions</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Copy the generated React component code</li>
                    <li>• Paste it into your React project</li>
                    <li>• Import and use like: <code>{`<${componentName} />`}</code></li>
                    {options.addProps && (
                      <li>• Customize with: <code>{`<${componentName} className="..." style={{...}} />`}</code></li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgToReact;