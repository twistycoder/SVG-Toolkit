import React, { useState } from 'react';

const SvgFilterEffects = () => {
  const [svgCode, setSvgCode] = useState(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#3B82F6"/>
  <text x="100" y="110" text-anchor="middle" fill="white" font-family="Arial" font-size="16">SVG</text>
</svg>`);
  const [activeEffects, setActiveEffects] = useState([]);
  const [filterSettings, setFilterSettings] = useState({
    blur: { stdDeviation: 2 },
    dropShadow: { dx: 2, dy: 2, stdDeviation: 3, color: '#000000' },
    glow: { stdDeviation: 5, color: '#3B82F6' },
    noise: { baseFrequency: 0.1, numOctaves: 2 },
    turbulence: { baseFrequency: 0.05, numOctaves: 2 },
    colorMatrix: { 
      type: 'saturate',
      values: '1',
      hueRotate: '0',
      brightness: '1',
      contrast: '1'
    }
  });

  const filterEffects = [
    {
      id: 'blur',
      name: 'Blur',
      description: 'Softens the image',
      code: (settings) => `<feGaussianBlur in="SourceGraphic" stdDeviation="${settings.blur.stdDeviation}" />`
    },
    {
      id: 'dropShadow',
      name: 'Drop Shadow',
      description: 'Adds a shadow behind the element',
      code: (settings) => `
        <feDropShadow dx="${settings.dropShadow.dx}" dy="${settings.dropShadow.dy}" 
                     stdDeviation="${settings.dropShadow.stdDeviation}" 
                     flood-color="${settings.dropShadow.color}" />`
    },
    {
      id: 'glow',
      name: 'Glow',
      description: 'Creates a glowing effect',
      code: (settings) => `
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="glowAlpha"/>
        <feGaussianBlur in="glowAlpha" stdDeviation="${settings.glow.stdDeviation}" result="glowBlur"/>
        <feFlood flood-color="${settings.glow.color}" result="glowColor"/>
        <feComposite in="glowColor" in2="glowBlur" operator="in" result="glowEffect"/>
        <feMerge>
          <feMergeNode in="glowEffect"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>`
    },
    {
      id: 'noise',
      name: 'Noise',
      description: 'Adds texture noise',
      code: (settings) => `
        <feTurbulence type="fractalNoise" baseFrequency="${settings.noise.baseFrequency}" 
                     numOctaves="${settings.noise.numOctaves}" result="noise"/>
        <feColorMatrix in="noise" type="saturate" values="0"/>
        <feBlend in="SourceGraphic" in2="noise" mode="multiply"/>`
    },
    {
      id: 'emboss',
      name: 'Emboss',
      description: 'Creates a 3D embossed effect',
      code: () => `
        <feConvolveMatrix kernelMatrix="1 0 0 0 0  0 0 0 0 0  0 0 -1 0 0  0 0 0 0 0" 
                         preserveAlpha="true"/>
        <feOffset dx="1" dy="1" result="offset"/>
        <feComposite in="SourceGraphic" in2="offset" operator="over"/>`
    },
    {
      id: 'colorMatrix',
      name: 'Color Adjust',
      description: 'Adjust colors and contrast',
      code: (settings) => {
        const { type, values, hueRotate, brightness, contrast } = settings.colorMatrix;
        if (type === 'hueRotate') {
          return `<feColorMatrix type="hueRotate" values="${hueRotate}"/>`;
        } else if (type === 'saturate') {
          return `<feColorMatrix type="saturate" values="${values}"/>`;
        } else if (type === 'brightness') {
          return `<feComponentTransfer><feFuncR type="linear" slope="${brightness}"/><feFuncG type="linear" slope="${brightness}"/><feFuncB type="linear" slope="${brightness}"/></feComponentTransfer>`;
        } else if (type === 'contrast') {
          return `<feComponentTransfer><feFuncR type="linear" slope="${contrast}" intercept="${(1 - contrast) / 2}"/><feFuncG type="linear" slope="${contrast}" intercept="${(1 - contrast) / 2}"/><feFuncB type="linear" slope="${contrast}" intercept="${(1 - contrast) / 2}"/></feComponentTransfer>`;
        }
        return `<feColorMatrix type="saturate" values="1"/>`;
      }
    }
  ];

  const toggleEffect = (effectId) => {
    if (activeEffects.includes(effectId)) {
      setActiveEffects(activeEffects.filter(id => id !== effectId));
    } else {
      setActiveEffects([...activeEffects, effectId]);
    }
  };

  const updateFilterSetting = (effectId, setting, value) => {
    setFilterSettings(prev => ({
      ...prev,
      [effectId]: {
        ...prev[effectId],
        [setting]: value
      }
    }));
  };

  const generateFilterCode = () => {
    const activeFilterEffects = filterEffects.filter(effect => 
      activeEffects.includes(effect.id)
    );

    if (activeFilterEffects.length === 0) return '';

    let filterCode = '<filter id="svg-filter" x="-20%" y="-20%" width="140%" height="140%">\n';
    
    activeFilterEffects.forEach((effect, index) => {
      const effectCode = effect.code(filterSettings);
      filterCode += `  ${effectCode}\n`;
    });
    
    filterCode += '</filter>';
    return filterCode;
  };

  const generateSvgWithFilter = () => {
    const filterCode = generateFilterCode();
    if (!filterCode) return svgCode;

    // Add filter attribute to the first graphic element
    let svgWithFilter = svgCode;
    
    // Find the first shape or text element to apply the filter
    const firstShapeMatch = svgWithFilter.match(/<(rect|circle|ellipse|polygon|path|text)([^>]*)>/);
    if (firstShapeMatch) {
      const tag = firstShapeMatch[1];
      const attributes = firstShapeMatch[2];
      const newTag = `<${tag}${attributes} filter="url(#svg-filter)">`;
      svgWithFilter = svgWithFilter.replace(firstShapeMatch[0], newTag);
    }

    // Insert filter definition
    if (svgWithFilter.includes('<defs>')) {
      svgWithFilter = svgWithFilter.replace('<defs>', `<defs>\n  ${filterCode}`);
    } else {
      svgWithFilter = svgWithFilter.replace('<svg', `<svg>\n  <defs>\n    ${filterCode}\n  </defs>`);
    }

    return svgWithFilter;
  };

  const svgWithFilter = generateSvgWithFilter();
  const filterCode = generateFilterCode();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">SVG Filter Effects</h1>
          <p className="text-lg text-gray-600">Apply advanced visual effects and filters to your SVG graphics</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="xl:col-span-1 space-y-6">
            {/* SVG Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">SVG Input</h2>
              <textarea
                value={svgCode}
                onChange={(e) => setSvgCode(e.target.value)}
                rows="6"
                className="w-full font-mono text-sm border border-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste your SVG code here..."
                spellCheck="false"
              />
            </div>

            {/* Filter Effects */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Filter Effects</h2>
              <div className="space-y-3">
                {filterEffects.map(effect => (
                  <div key={effect.id} className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeEffects.includes(effect.id)}
                        onChange={() => toggleEffect(effect.id)}
                        className="mt-1 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{effect.name}</div>
                        <div className="text-sm text-gray-600">{effect.description}</div>
                      </div>
                    </label>

                    {/* Effect-specific settings */}
                    {activeEffects.includes(effect.id) && (
                      <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                        {effect.id === 'blur' && (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Blur Amount: {filterSettings.blur.stdDeviation}
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              step="0.5"
                              value={filterSettings.blur.stdDeviation}
                              onChange={(e) => updateFilterSetting('blur', 'stdDeviation', parseFloat(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        )}

                        {effect.id === 'dropShadow' && (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">X Offset</label>
                                <input
                                  type="range"
                                  min="-10"
                                  max="10"
                                  value={filterSettings.dropShadow.dx}
                                  onChange={(e) => updateFilterSetting('dropShadow', 'dx', parseInt(e.target.value))}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Y Offset</label>
                                <input
                                  type="range"
                                  min="-10"
                                  max="10"
                                  value={filterSettings.dropShadow.dy}
                                  onChange={(e) => updateFilterSetting('dropShadow', 'dy', parseInt(e.target.value))}
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Shadow Blur: {filterSettings.dropShadow.stdDeviation}
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.5"
                                value={filterSettings.dropShadow.stdDeviation}
                                onChange={(e) => updateFilterSetting('dropShadow', 'stdDeviation', parseFloat(e.target.value))}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Color</label>
                              <input
                                type="color"
                                value={filterSettings.dropShadow.color}
                                onChange={(e) => updateFilterSetting('dropShadow', 'color', e.target.value)}
                                className="w-full h-8 rounded border border-gray-300"
                              />
                            </div>
                          </>
                        )}

                        {effect.id === 'glow' && (
                          <>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Glow Size: {filterSettings.glow.stdDeviation}
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="20"
                                value={filterSettings.glow.stdDeviation}
                                onChange={(e) => updateFilterSetting('glow', 'stdDeviation', parseInt(e.target.value))}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Glow Color</label>
                              <input
                                type="color"
                                value={filterSettings.glow.color}
                                onChange={(e) => updateFilterSetting('glow', 'color', e.target.value)}
                                className="w-full h-8 rounded border border-gray-300"
                              />
                            </div>
                          </>
                        )}

                        {effect.id === 'noise' && (
                          <>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Frequency: {filterSettings.noise.baseFrequency}
                              </label>
                              <input
                                type="range"
                                min="0.01"
                                max="0.5"
                                step="0.01"
                                value={filterSettings.noise.baseFrequency}
                                onChange={(e) => updateFilterSetting('noise', 'baseFrequency', parseFloat(e.target.value))}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Octaves: {filterSettings.noise.numOctaves}
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                value={filterSettings.noise.numOctaves}
                                onChange={(e) => updateFilterSetting('noise', 'numOctaves', parseInt(e.target.value))}
                                className="w-full"
                              />
                            </div>
                          </>
                        )}

                        {effect.id === 'colorMatrix' && (
                          <>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Adjustment Type</label>
                              <select
                                value={filterSettings.colorMatrix.type}
                                onChange={(e) => updateFilterSetting('colorMatrix', 'type', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="saturate">Saturation</option>
                                <option value="hueRotate">Hue Rotate</option>
                                <option value="brightness">Brightness</option>
                                <option value="contrast">Contrast</option>
                              </select>
                            </div>
                            
                            {filterSettings.colorMatrix.type === 'saturate' && (
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  Saturation: {filterSettings.colorMatrix.values}
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="2"
                                  step="0.1"
                                  value={filterSettings.colorMatrix.values}
                                  onChange={(e) => updateFilterSetting('colorMatrix', 'values', e.target.value)}
                                  className="w-full"
                                />
                              </div>
                            )}

                            {filterSettings.colorMatrix.type === 'hueRotate' && (
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  Hue Rotation: {filterSettings.colorMatrix.hueRotate}°
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="360"
                                  value={filterSettings.colorMatrix.hueRotate}
                                  onChange={(e) => updateFilterSetting('colorMatrix', 'hueRotate', e.target.value)}
                                  className="w-full"
                                />
                              </div>
                            )}

                            {filterSettings.colorMatrix.type === 'brightness' && (
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  Brightness: {filterSettings.colorMatrix.brightness}
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="2"
                                  step="0.1"
                                  value={filterSettings.colorMatrix.brightness}
                                  onChange={(e) => updateFilterSetting('colorMatrix', 'brightness', e.target.value)}
                                  className="w-full"
                                />
                              </div>
                            )}

                            {filterSettings.colorMatrix.type === 'contrast' && (
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  Contrast: {filterSettings.colorMatrix.contrast}
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="2"
                                  step="0.1"
                                  value={filterSettings.colorMatrix.contrast}
                                  onChange={(e) => updateFilterSetting('colorMatrix', 'contrast', e.target.value)}
                                  className="w-full"
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview & Output */}
          <div className="xl:col-span-2 space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-700 mb-2">Original</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white min-h-48 flex items-center justify-center">
                    <div dangerouslySetInnerHTML={{ __html: svgCode }} />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-700 mb-2">With Filter</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white min-h-48 flex items-center justify-center">
                    {activeEffects.length > 0 ? (
                      <div dangerouslySetInnerHTML={{ __html: svgWithFilter }} />
                    ) : (
                      <div className="text-gray-500">No filters applied</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Code */}
            {activeEffects.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Filter Code</h2>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-64 overflow-y-auto">
                  <code>{filterCode}</code>
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(filterCode)}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Copy Filter Code
                </button>
              </div>
            )}

            {/* Complete SVG */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Complete SVG</h2>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-64 overflow-y-auto">
                <code>{svgWithFilter}</code>
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(svgWithFilter)}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Copy Complete SVG
              </button>
            </div>

            {/* Filter Effects Guide */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Filter Effects Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Common Uses</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• <strong>Blur:</strong> Soft focus, depth effects</li>
                    <li>• <strong>Drop Shadow:</strong> 3D effects, floating elements</li>
                    <li>• <strong>Glow:</strong> Neon effects, highlights</li>
                    <li>• <strong>Noise:</strong> Texture, vintage effects</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Performance Tips</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Use fewer effects for better performance</li>
                    <li>• Combine effects in optimal order</li>
                    <li>• Test on target devices</li>
                    <li>• Consider fallbacks for older browsers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgFilterEffects;