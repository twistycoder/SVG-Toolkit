import React, { useState } from 'react';

const SvgOptimizer = () => {
  const [inputSvg, setInputSvg] = useState('');
  const [optimizedSvg, setOptimizedSvg] = useState('');
  const [optimizationStats, setOptimizationStats] = useState(null);
  const [options, setOptions] = useState({
    removeComments: true,
    removeMetadata: true,
    removeEditorsData: true,
    removeEmptyAttrs: true,
    removeHiddenElems: true,
    removeEmptyText: true,
    removeUnusedNS: true,
    removeUselessStrokeAndFill: true,
    removeNonInheritableGroupAttrs: true,
    removeUselessDefs: true,
    removeXMLProcInst: true,
    removeDimensions: false,
    minifyStyles: true,
    convertColors: true,
    convertPathData: true,
    convertTransform: true,
    mergePaths: true,
    collapseGroups: true,
  });

  const optimizeSVG = () => {
    if (!inputSvg.trim()) return;

    let optimized = inputSvg;
    let originalSize = optimized.length;
    let steps = [];

    // Remove comments
    if (options.removeComments) {
      optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
      steps.push('Removed comments');
    }

    // Remove metadata
    if (options.removeMetadata) {
      optimized = optimized.replace(/<metadata>[\s\S]*?<\/metadata>/gi, '');
      steps.push('Removed metadata');
    }

    // Remove editor data
    if (options.removeEditorsData) {
      optimized = optimized.replace(/sodipodi:|inkscape:|adobe:/gi, '');
      steps.push('Removed editor data');
    }

    // Remove empty attributes
    if (options.removeEmptyAttrs) {
      optimized = optimized.replace(/\s+\w+=""/g, '');
      steps.push('Removed empty attributes');
    }

    // Remove XML declaration
    if (options.removeXMLProcInst) {
      optimized = optimized.replace(/<\?xml[^>]*\?>/g, '');
      steps.push('Removed XML declaration');
    }

    // Minify styles
    if (options.minifyStyles) {
      optimized = optimized.replace(/\s*([{};:,])\s*/g, '$1');
      optimized = optimized.replace(/;}/g, '}');
      steps.push('Minified styles');
    }

    // Convert colors
    if (options.convertColors) {
      optimized = optimized.replace(/#ffffff/gi, '#fff');
      optimized = optimized.replace(/#000000/gi, '#000');
      optimized = optimized.replace(/rgb\(255,\s*255,\s*255\)/gi, '#fff');
      optimized = optimized.replace(/rgb\(0,\s*0,\s*0\)/gi, '#000');
      steps.push('Optimized colors');
    }

    // Remove dimensions if specified
    if (options.removeDimensions) {
      optimized = optimized.replace(/(width|height)="[^"]*"/g, '');
      steps.push('Removed dimensions');
    }

    // Final minification
    optimized = optimized
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/\s+\/>/g, '/>')
      .trim();

    const optimizedSize = optimized.length;
    const savings = originalSize - optimizedSize;
    const percentage = ((savings / originalSize) * 100).toFixed(1);

    setOptimizedSvg(optimized);
    setOptimizationStats({
      originalSize,
      optimizedSize,
      savings,
      percentage,
      steps
    });
  };

  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const sampleSVG = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <!-- This is a comment -->
  <metadata>Some metadata</metadata>
  <rect x="10" y="10" width="80" height="80" fill="#ff0000" stroke="#000000" stroke-width="2"/>
  <circle cx="50" cy="50" r="30" fill="#00ff00" opacity="0.5"/>
</svg>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">SVG Optimizer</h1>
          <p className="text-lg text-gray-600">Advanced SVG compression and optimization tool</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input & Options */}
          <div className="space-y-6">
            {/* Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Input SVG</h2>
              <textarea
                value={inputSvg}
                onChange={(e) => setInputSvg(e.target.value)}
                rows="10"
                className="w-full font-mono text-sm border border-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-orange-500"
                placeholder="Paste your SVG code here..."
                spellCheck="false"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setInputSvg(sampleSVG)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Load Sample
                </button>
                <button
                  onClick={optimizeSVG}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Optimize SVG
                </button>
              </div>
            </div>

            {/* Optimization Options */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Optimization Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(options).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleOptionChange(key)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Output & Results */}
          <div className="space-y-6">
            {/* Results */}
            {optimizationStats && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Optimization Results</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{optimizationStats.originalSize}</div>
                    <div className="text-sm text-gray-600">Original</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{optimizationStats.optimizedSize}</div>
                    <div className="text-sm text-gray-600">Optimized</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{optimizationStats.percentage}%</div>
                    <div className="text-sm text-gray-600">Saved</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Optimization Steps:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {optimizationStats.steps.map((step, index) => (
                      <li key={index}>• {step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Output */}
            {optimizedSvg && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">Optimized SVG</h2>
                  <button
                    onClick={() => copyToClipboard(optimizedSvg)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Copy Code
                  </button>
                </div>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-64 overflow-y-auto">
                  <code>{optimizedSvg}</code>
                </pre>
              </div>
            )}

            {/* Preview */}
            {optimizedSvg && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white flex items-center justify-center min-h-32">
                  <div dangerouslySetInnerHTML={{ __html: optimizedSvg }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgOptimizer;