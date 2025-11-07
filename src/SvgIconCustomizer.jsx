import React, { useState, useRef } from 'react';

const SvgIconCustomizer = () => {
  const [icons, setIcons] = useState([]);
  const [customizations, setCustomizations] = useState({
    color: '#3B82F6',
    size: 24,
    strokeWidth: 2,
    rotate: 0,
    flipX: false,
    flipY: false
  });
  const fileInputRef = useRef(null);

  const predefinedIcons = [
    {
      name: 'Heart',
      svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
    },
    {
      name: 'Star',
      svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>'
    },
    {
      name: 'Settings',
      svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    },
    {
      name: 'Download',
      svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
    },
    {
      name: 'Upload',
      svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'
    },
    {
      name: 'Trash',
      svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
    }
  ];

  const handleFileUpload = (files) => {
    Array.from(files).forEach(file => {
      if (file.type.includes('svg')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newIcon = {
            id: Date.now() + Math.random(),
            name: file.name.replace('.svg', ''),
            originalSvg: e.target.result,
            customizedSvg: e.target.result
          };
          setIcons(prev => [...prev, newIcon]);
        };
        reader.readAsText(file);
      }
    });
  };

  const applyCustomizations = (svgCode) => {
    let customized = svgCode;
    
    // Apply color
    customized = customized.replace(/stroke="[^"]*"/g, `stroke="${customizations.color}"`);
    customized = customized.replace(/fill="[^"]*"/g, (match) => {
      if (match !== 'fill="none"') {
        return `fill="${customizations.color}"`;
      }
      return match;
    });
    
    // Apply stroke width
    customized = customized.replace(/stroke-width="[^"]*"/g, `stroke-width="${customizations.strokeWidth}"`);
    
    // Apply size
    customized = customized.replace(/width="[^"]*"/g, `width="${customizations.size}"`);
    customized = customized.replace(/height="[^"]*"/g, `height="${customizations.size}"`);
    
    // Apply transformations
    let transform = '';
    if (customizations.rotate !== 0) {
      transform += `rotate(${customizations.rotate}) `;
    }
    if (customizations.flipX) {
      transform += `scale(-1, 1) `;
    }
    if (customizations.flipY) {
      transform += `scale(1, -1) `;
    }
    
    if (transform) {
      if (customized.includes('<svg')) {
        customized = customized.replace('<svg', `<svg transform="${transform.trim()}"`);
      }
    }
    
    return customized;
  };

  const updateAllIcons = () => {
    setIcons(prev => prev.map(icon => ({
      ...icon,
      customizedSvg: applyCustomizations(icon.originalSvg)
    })));
  };

  const addPredefinedIcon = (icon) => {
    const newIcon = {
      id: Date.now(),
      name: icon.name,
      originalSvg: icon.svg,
      customizedSvg: applyCustomizations(icon.svg)
    };
    setIcons(prev => [...prev, newIcon]);
  };

  const removeIcon = (id) => {
    setIcons(prev => prev.filter(icon => icon.id !== id));
  };

  const downloadIcon = (icon) => {
    const blob = new Blob([icon.customizedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${icon.name}-customized.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllIcons = () => {
    icons.forEach(icon => downloadIcon(icon));
  };

  React.useEffect(() => {
    updateAllIcons();
  }, [customizations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">SVG Icon Customizer</h1>
          <p className="text-lg text-gray-600">Batch customize SVG icons with consistent styling</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="xl:col-span-1 space-y-6">
            {/* Upload & Predefined */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Icons</h2>
              
              {/* File Upload */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors mb-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-600">Click to upload SVG icons</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".svg,image/svg+xml"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Predefined Icons */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Predefined Icons</h3>
                <div className="grid grid-cols-3 gap-2">
                  {predefinedIcons.map(icon => (
                    <button
                      key={icon.name}
                      onClick={() => addPredefinedIcon(icon)}
                      className="p-2 border border-gray-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors text-center"
                      dangerouslySetInnerHTML={{ __html: icon.svg }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Customization Controls */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customization</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="color"
                    value={customizations.color}
                    onChange={(e) => setCustomizations(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size: {customizations.size}px
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="96"
                    value={customizations.size}
                    onChange={(e) => setCustomizations(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stroke Width: {customizations.strokeWidth}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={customizations.strokeWidth}
                    onChange={(e) => setCustomizations(prev => ({ ...prev, strokeWidth: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rotate: {customizations.rotate}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={customizations.rotate}
                    onChange={(e) => setCustomizations(prev => ({ ...prev, rotate: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customizations.flipX}
                      onChange={(e) => setCustomizations(prev => ({ ...prev, flipX: e.target.checked }))}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Flip Horizontal</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customizations.flipY}
                      onChange={(e) => setCustomizations(prev => ({ ...prev, flipY: e.target.checked }))}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Flip Vertical</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Batch Actions */}
            {icons.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Batch Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={downloadAllIcons}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Download All Icons ({icons.length})
                  </button>
                  <button
                    onClick={() => setIcons([])}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Clear All Icons
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Icons Grid */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Icons ({icons.length})
                </h2>
                {icons.length > 0 && (
                  <div className="text-sm text-gray-600">
                    All icons updated in real-time
                  </div>
                )}
              </div>

              {icons.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p>Upload SVG files or select predefined icons to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {icons.map(icon => (
                    <div key={icon.id} className="border border-gray-200 rounded-lg p-4 text-center group hover:border-emerald-400 transition-colors">
                      <div 
                        className="mx-auto mb-3"
                        dangerouslySetInnerHTML={{ __html: icon.customizedSvg }}
                      />
                      <div className="text-sm font-medium text-gray-800 truncate mb-2">
                        {icon.name}
                      </div>
                      <div className="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => downloadIcon(icon)}
                          className="text-green-600 hover:text-green-800 text-xs"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => removeIcon(icon.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customization Preview */}
            {icons.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customization Preview</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {icons.slice(0, 5).map(icon => (
                      <div key={icon.id} className="text-center">
                        <div 
                          className="mx-auto"
                          dangerouslySetInnerHTML={{ __html: icon.customizedSvg }}
                        />
                        <div className="text-xs text-gray-600 mt-1">{icon.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgIconCustomizer;