import React, { useState } from 'react';

const SvgBackgroundGenerator = () => {
  const [patternType, setPatternType] = useState('grid');
  const [colors, setColors] = useState({
    primary: '#3B82F6',
    secondary: '#1D4ED8',
    background: '#FFFFFF'
  });
  const [size, setSize] = useState(20);
  const [opacity, setOpacity] = useState(0.5);
  const [generatedSvg, setGeneratedSvg] = useState('');

  const patterns = {
    grid: {
      name: 'Grid',
      generate: () => `<pattern id="grid" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
        <rect width="${size}" height="${size}" fill="${colors.background}"/>
        <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${colors.primary}" stroke-width="1" opacity="${opacity}"/>
      </pattern>`
    },
    dots: {
      name: 'Dots',
      generate: () => `<pattern id="dots" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
        <circle cx="${size/2}" cy="${size/2}" r="${size/8}" fill="${colors.primary}" opacity="${opacity}"/>
      </pattern>`
    },
    lines: {
      name: 'Lines',
      generate: () => `<pattern id="lines" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
        <rect width="${size}" height="${size}" fill="${colors.background}"/>
        <line x1="0" y1="${size/2}" x2="${size}" y2="${size/2}" stroke="${colors.primary}" stroke-width="1" opacity="${opacity}"/>
        <line x1="${size/2}" y1="0" x2="${size/2}" y2="${size}" stroke="${colors.primary}" stroke-width="1" opacity="${opacity}"/>
      </pattern>`
    },
    zigzag: {
      name: 'ZigZag',
      generate: () => `<pattern id="zigzag" width="${size}" height="${size * 2}" patternUnits="userSpaceOnUse">
        <rect width="${size}" height="${size * 2}" fill="${colors.background}"/>
        <path d="M0,${size} l${size},${size} l${size},-${size} l${size},${size} l${size},-${size}" 
              stroke="${colors.primary}" stroke-width="2" fill="none" opacity="${opacity}"/>
      </pattern>`
    },
    triangles: {
      name: 'Triangles',
      generate: () => `<pattern id="triangles" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
        <polygon points="0,0 ${size},0 ${size/2},${size}" fill="${colors.primary}" opacity="${opacity}"/>
        <polygon points="0,${size} ${size},${size} ${size/2},0" fill="${colors.secondary}" opacity="${opacity}"/>
      </pattern>`
    },
    waves: {
      name: 'Waves',
      generate: () => `<pattern id="waves" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
        <path d="M0,${size/2} Q${size/4},${size/4} ${size/2},${size/2} T${size},${size/2}" 
              stroke="${colors.primary}" stroke-width="2" fill="none" opacity="${opacity}"/>
        <path d="M0,${size/1.5} Q${size/4},${size/1.8} ${size/2},${size/1.5} T${size},${size/1.5}" 
              stroke="${colors.secondary}" stroke-width="1" fill="none" opacity="${opacity}"/>
      </pattern>`
    }
  };

  const generateBackground = () => {
    const pattern = patterns[patternType].generate();
    const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${pattern}
  </defs>
  <rect width="100%" height="100%" fill="url(#${patternType})"/>
</svg>`;
    setGeneratedSvg(svg);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedSvg);
      alert('SVG code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadSVG = () => {
    const blob = new Blob([generatedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `svg-background-${patternType}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    generateBackground();
  }, [patternType, colors, size, opacity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">SVG Background Generator</h1>
          <p className="text-lg text-gray-600">Create beautiful SVG patterns and backgrounds for your projects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pattern Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(patterns).map(([key, pattern]) => (
                  <button
                    key={key}
                    onClick={() => setPatternType(key)}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      patternType === key
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{pattern.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Colors</h2>
              <div className="space-y-4">
                {Object.entries(colors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key} Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-12 h-12 rounded-lg border border-gray-300"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pattern Size: {size}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opacity: {opacity}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Export</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyToClipboard}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Copy SVG Code
                </button>
                <button
                  onClick={downloadSVG}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Download SVG
                </button>
              </div>
            </div>
          </div>

          {/* Preview & Code */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white min-h-64 flex items-center justify-center">
                {generatedSvg ? (
                  <div 
                    className="w-full h-64 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(generatedSvg)}")`,
                      backgroundSize: 'cover'
                    }}
                  />
                ) : (
                  <p className="text-gray-500">Preview will appear here</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">SVG Code</h2>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-64 overflow-y-auto">
                <code>{generatedSvg}</code>
              </pre>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Usage Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use as CSS background: <code>background-image: url('pattern.svg')</code></li>
                <li>• Embed directly in HTML for better performance</li>
                <li>• Adjust pattern size for different densities</li>
                <li>• Combine multiple patterns for complex designs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgBackgroundGenerator;