import React, { useState, useRef } from 'react';

const SvgEditor = () => {
  const [svgCode, setSvgCode] = useState(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="100" height="100" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2"/>
  <circle cx="100" cy="100" r="40" fill="#EF4444" opacity="0.8"/>
</svg>`);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null);

  const basicShapes = [
    { name: 'Rectangle', code: '<rect x="50" y="50" width="100" height="50" fill="#3B82F6"/>' },
    { name: 'Circle', code: '<circle cx="100" cy="100" r="40" fill="#EF4444"/>' },
    { name: 'Ellipse', code: '<ellipse cx="100" cy="100" rx="60" ry="30" fill="#10B981"/>' },
    { name: 'Line', code: '<line x1="50" y1="50" x2="150" y2="150" stroke="#8B5CF6" stroke-width="2"/>' },
    { name: 'Polygon', code: '<polygon points="100,20 40,180 160,180" fill="#F59E0B"/>' },
    { name: 'Path', code: '<path d="M50 150 Q 100 50 150 150" stroke="#EC4899" stroke-width="2" fill="none"/>' },
  ];

  const addShape = (shapeCode) => {
    setSvgCode(prev => prev.replace('</svg>', `${shapeCode}\n</svg>`));
  };

  const handleSvgClick = (e) => {
    if (e.target !== e.currentTarget) {
      setSelectedElement(e.target);
    } else {
      setSelectedElement(null);
    }
  };

  const updateElementAttribute = (attribute, value) => {
    if (!selectedElement) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const elements = doc.getElementsByTagName('*');
    
    for (let element of elements) {
      if (element === selectedElement) {
        element.setAttribute(attribute, value);
        break;
      }
    }
    
    setSvgCode(new XMLSerializer().serializeToString(doc));
  };

  const clearCanvas = () => {
    setSvgCode('<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">\n</svg>');
    setSelectedElement(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">SVG Editor</h1>
          <p className="text-lg text-gray-600">Visual SVG editor with drag-and-drop shapes and real-time editing</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Tools Panel */}
          <div className="xl:col-span-1 space-y-6">
            {/* Basic Shapes */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Shapes</h2>
              <div className="grid grid-cols-2 gap-3">
                {basicShapes.map((shape, index) => (
                  <button
                    key={index}
                    onClick={() => addShape(shape.code)}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-center"
                  >
                    <div className="text-sm font-medium text-gray-800 mb-2">{shape.name}</div>
                    <div className="text-xs text-gray-500">Click to add</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Element Properties */}
            {selectedElement && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Element Properties</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fill Color</label>
                    <input
                      type="color"
                      value={selectedElement.getAttribute('fill') || '#000000'}
                      onChange={(e) => updateElementAttribute('fill', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stroke Color</label>
                    <input
                      type="color"
                      value={selectedElement.getAttribute('stroke') || '#000000'}
                      onChange={(e) => updateElementAttribute('stroke', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stroke Width</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={selectedElement.getAttribute('stroke-width') || 0}
                      onChange={(e) => updateElementAttribute('stroke-width', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opacity</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedElement.getAttribute('opacity') || 1}
                      onChange={(e) => updateElementAttribute('opacity', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={clearCanvas}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Clear Canvas
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(svgCode)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Copy SVG Code
                </button>
              </div>
            </div>
          </div>

          {/* Editor and Preview */}
          <div className="xl:col-span-2 space-y-6">
            {/* SVG Canvas */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">SVG Canvas</h2>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white min-h-96 flex items-center justify-center"
                onClick={handleSvgClick}
              >
                <div 
                  ref={svgRef}
                  dangerouslySetInnerHTML={{ __html: svgCode }}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">SVG Code</h2>
              <textarea
                value={svgCode}
                onChange={(e) => setSvgCode(e.target.value)}
                rows="8"
                className="w-full font-mono text-sm bg-gray-800 text-green-400 p-4 rounded-lg resize-none focus:ring-2 focus:ring-purple-500"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgEditor;