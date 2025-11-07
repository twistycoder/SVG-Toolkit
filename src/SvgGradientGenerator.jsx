import React, { useState } from 'react';

const SvgGradientGenerator = () => {
  const [gradientType, setGradientType] = useState('linear');
  const [gradientColors, setGradientColors] = useState([
    { id: 1, color: '#3B82F6', offset: '0%' },
    { id: 2, color: '#8B5CF6', offset: '50%' },
    { id: 3, color: '#EC4899', offset: '100%' }
  ]);
  const [gradientSettings, setGradientSettings] = useState({
    x1: '0%',
    y1: '0%',
    x2: '100%',
    y2: '0%',
    cx: '50%',
    cy: '50%',
    r: '50%',
    fx: '50%',
    fy: '50%',
    spreadMethod: 'pad',
    gradientUnits: 'objectBoundingBox'
  });

  const addColorStop = () => {
    const newId = Math.max(...gradientColors.map(c => c.id)) + 1;
    setGradientColors([
      ...gradientColors,
      { id: newId, color: '#000000', offset: `${Math.round((gradientColors.length / (gradientColors.length + 1)) * 100)}%` }
    ]);
  };

  const updateColorStop = (id, field, value) => {
    setGradientColors(gradientColors.map(stop =>
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  const removeColorStop = (id) => {
    if (gradientColors.length > 2) {
      setGradientColors(gradientColors.filter(stop => stop.id !== id));
    }
  };

  const generateGradientCode = () => {
    const sortedColors = [...gradientColors].sort((a, b) => {
      const aOffset = parseInt(a.offset);
      const bOffset = parseInt(b.offset);
      return aOffset - bOffset;
    });

    if (gradientType === 'linear') {
      return `<linearGradient id="gradient" x1="${gradientSettings.x1}" y1="${gradientSettings.y1}" x2="${gradientSettings.x2}" y2="${gradientSettings.y2}" gradientUnits="${gradientSettings.gradientUnits}" spreadMethod="${gradientSettings.spreadMethod}">
  ${sortedColors.map(stop => `  <stop offset="${stop.offset}" stop-color="${stop.color}"/>`).join('\n  ')}
</linearGradient>`;
    } else {
      return `<radialGradient id="gradient" cx="${gradientSettings.cx}" cy="${gradientSettings.cy}" r="${gradientSettings.r}" fx="${gradientSettings.fx}" fy="${gradientSettings.fy}" gradientUnits="${gradientSettings.gradientUnits}" spreadMethod="${gradientSettings.spreadMethod}">
  ${sortedColors.map(stop => `  <stop offset="${stop.offset}" stop-color="${stop.color}"/>`).join('\n  ')}
</radialGradient>`;
    }
  };

  const generateExampleSVG = () => {
    const gradientCode = generateGradientCode();
    return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gradientCode}
  </defs>
  <rect width="200" height="200" fill="url(#gradient)"/>
</svg>`;
  };

  const presetGradients = [
    {
      name: 'Ocean Blue',
      type: 'linear',
      colors: [
        { id: 1, color: '#667eea', offset: '0%' },
        { id: 2, color: '#764ba2', offset: '100%' }
      ]
    },
    {
      name: 'Sunset',
      type: 'linear',
      colors: [
        { id: 1, color: '#ff6b6b', offset: '0%' },
        { id: 2, color: '#ffa726', offset: '50%' },
        { id: 3, color: '#ffee58', offset: '100%' }
      ]
    },
    {
      name: 'Emerald',
      type: 'radial',
      colors: [
        { id: 1, color: '#10b981', offset: '0%' },
        { id: 2, color: '#047857', offset: '100%' }
      ]
    },
    {
      name: 'Neon',
      type: 'linear',
      colors: [
        { id: 1, color: '#00ff87', offset: '0%' },
        { id: 2, color: '#60efff', offset: '100%' }
      ]
    }
  ];

  const loadPreset = (preset) => {
    setGradientType(preset.type);
    setGradientColors(preset.colors);
  };

  const gradientCode = generateGradientCode();
  const exampleSVG = generateExampleSVG();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">SVG Gradient Generator</h1>
          <p className="text-lg text-gray-600">Create beautiful linear and radial gradients for your SVG graphics</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="xl:col-span-1 space-y-6">
            {/* Gradient Type */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gradient Type</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setGradientType('linear')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    gradientType === 'linear'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium">Linear</div>
                  <div className="text-xs text-gray-500 mt-1">Left to right</div>
                </button>
                <button
                  onClick={() => setGradientType('radial')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    gradientType === 'radial'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium">Radial</div>
                  <div className="text-xs text-gray-500 mt-1">Center to edges</div>
                </button>
              </div>
            </div>

            {/* Color Stops */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Color Stops</h2>
                <button
                  onClick={addColorStop}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-lg transition-colors text-sm"
                >
                  Add Stop
                </button>
              </div>
              
              <div className="space-y-4">
                {gradientColors.map(stop => (
                  <div key={stop.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                      className="w-10 h-10 rounded border border-gray-300"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={stop.color}
                        onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-mono"
                      />
                    </div>
                    <input
                      type="text"
                      value={stop.offset}
                      onChange={(e) => updateColorStop(stop.id, 'offset', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                    />
                    <button
                      onClick={() => removeColorStop(stop.id)}
                      disabled={gradientColors.length <= 2}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Settings */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gradient Settings</h2>
              
              <div className="space-y-4">
                {gradientType === 'linear' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">X1</label>
                        <input
                          type="text"
                          value={gradientSettings.x1}
                          onChange={(e) => setGradientSettings(prev => ({ ...prev, x1: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Y1</label>
                        <input
                          type="text"
                          value={gradientSettings.y1}
                          onChange={(e) => setGradientSettings(prev => ({ ...prev, y1: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">X2</label>
                        <input
                          type="text"
                          value={gradientSettings.x2}
                          onChange={(e) => setGradientSettings(prev => ({ ...prev, x2: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Y2</label>
                        <input
                          type="text"
                          value={gradientSettings.y2}
                          onChange={(e) => setGradientSettings(prev => ({ ...prev, y2: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">CX</label>
                        <input
                          type="text"
                          value={gradientSettings.cx}
                          onChange={(e) => setGradientSettings(prev => ({ ...prev, cx: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">CY</label>
                        <input
                          type="text"
                          value={gradientSettings.cy}
                          onChange={(e) => setGradientSettings(prev => ({ ...prev, cy: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">R</label>
                        <input
                          type="text"
                          value={gradientSettings.r}
                          onChange={(e) => setGradientSettings(prev => ({ ...prev, r: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">FX</label>
                        <input
                          type="text"
                          value={gradientSettings.fx}
                          onChange={(e) => setGradientSettings(prev => ({ ...prev, fx: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">FY</label>
                      <input
                        type="text"
                        value={gradientSettings.fy}
                        onChange={(e) => setGradientSettings(prev => ({ ...prev, fy: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Units</label>
                    <select
                      value={gradientSettings.gradientUnits}
                      onChange={(e) => setGradientSettings(prev => ({ ...prev, gradientUnits: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="objectBoundingBox">Object Bounding Box</option>
                      <option value="userSpaceOnUse">User Space</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Spread</label>
                    <select
                      value={gradientSettings.spreadMethod}
                      onChange={(e) => setGradientSettings(prev => ({ ...prev, spreadMethod: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="pad">Pad</option>
                      <option value="reflect">Reflect</option>
                      <option value="repeat">Repeat</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Preset Gradients */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preset Gradients</h2>
              <div className="grid grid-cols-2 gap-3">
                {presetGradients.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-rose-400 hover:bg-rose-50 transition-colors text-center relative"
                  >
                    <div 
                      className="w-full h-8 rounded mb-2"
                      style={{
                        background: preset.type === 'linear' 
                          ? `linear-gradient(to right, ${preset.colors.map(c => c.color).join(', ')})`
                          : `radial-gradient(circle, ${preset.colors.map(c => c.color).join(', ')})`
                      }}
                    />
                    <div className="text-xs font-medium text-gray-800">{preset.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{preset.type}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview & Output */}
          <div className="xl:col-span-2 space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white min-h-64 flex items-center justify-center">
                <div dangerouslySetInnerHTML={{ __html: exampleSVG }} />
              </div>
            </div>

            {/* Gradient Code */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gradient Code</h2>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-64 overflow-y-auto">
                <code>{gradientCode}</code>
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(gradientCode)}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Copy Gradient Code
              </button>
            </div>

            {/* Complete SVG */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Complete SVG</h2>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-64 overflow-y-auto">
                <code>{exampleSVG}</code>
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(exampleSVG)}
                className="w-full mt-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Copy Complete SVG
              </button>
            </div>

            {/* Usage Guide */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Usage Guide</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Linear Gradients:</strong> Define start (x1,y1) and end (x2,y2) points
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Radial Gradients:</strong> Define center (cx,cy), radius (r), and focus (fx,fy)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Color Stops:</strong> At least 2 stops required, use percentages for offsets
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Spread Method:</strong> Controls how gradient fills beyond defined bounds
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgGradientGenerator;