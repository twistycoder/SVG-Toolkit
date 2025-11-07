import React, { useState, useRef, useEffect } from 'react';

const SvgPathEditor = () => {
  const [pathData, setPathData] = useState('M50 50 L150 50 L100 150 Z');
  const [viewBox, setViewBox] = useState('0 0 200 200');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null);

  const pathCommands = [
    { command: 'M', name: 'Move To', description: 'Start a new sub-path' },
    { command: 'L', name: 'Line To', description: 'Draw a straight line' },
    { command: 'H', name: 'Horizontal Line', description: 'Draw a horizontal line' },
    { command: 'V', name: 'Vertical Line', description: 'Draw a vertical line' },
    { command: 'C', name: 'Curve To', description: 'Draw a cubic Bézier curve' },
    { command: 'S', name: 'Smooth Curve', description: 'Draw a smooth cubic Bézier curve' },
    { command: 'Q', name: 'Quadratic Curve', description: 'Draw a quadratic Bézier curve' },
    { command: 'T', name: 'Smooth Quadratic', description: 'Draw a smooth quadratic Bézier curve' },
    { command: 'A', name: 'Arc', description: 'Draw an elliptical arc' },
    { command: 'Z', name: 'Close Path', description: 'Close the current sub-path' },
  ];

  const parsePathData = (data) => {
    const commands = [];
    const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
    let match;
    
    while ((match = regex.exec(data)) !== null) {
      const command = match[1];
      const points = match[2].trim().split(/[\s,]+/).filter(p => p).map(parseFloat);
      commands.push({ command, points });
    }
    
    return commands;
  };

  const generatePathData = (commands) => {
    return commands.map(cmd => `${cmd.command}${cmd.points.join(' ')}`).join(' ');
  };

  const extractPoints = (commands) => {
    const points = [];
    let currentX = 0;
    let currentY = 0;

    commands.forEach(cmd => {
      const { command, points: coords } = cmd;
      const upperCommand = command.toUpperCase();

      switch (upperCommand) {
        case 'M':
        case 'L':
          if (coords.length >= 2) {
            points.push({ x: coords[0], y: coords[1], type: 'point' });
            currentX = coords[0];
            currentY = coords[1];
          }
          break;
        case 'C':
          if (coords.length >= 6) {
            points.push(
              { x: coords[0], y: coords[1], type: 'control' },
              { x: coords[2], y: coords[3], type: 'control' },
              { x: coords[4], y: coords[5], type: 'point' }
            );
            currentX = coords[4];
            currentY = coords[5];
          }
          break;
        case 'Q':
          if (coords.length >= 4) {
            points.push(
              { x: coords[0], y: coords[1], type: 'control' },
              { x: coords[2], y: coords[3], type: 'point' }
            );
            currentX = coords[2];
            currentY = coords[3];
          }
          break;
      }
    });

    return points;
  };

  const handleSvgClick = (e) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to SVG coordinate system
    const svgPoint = svgRef.current.createSVGPoint();
    svgPoint.x = x;
    svgPoint.y = y;
    const transformedPoint = svgPoint.matrixTransform(svgRef.current.getScreenCTM().inverse());

    const commands = parsePathData(pathData);
    commands.push({ command: 'L', points: [transformedPoint.x, transformedPoint.y] });
    setPathData(generatePathData(commands));
  };

  const addCommand = (command) => {
    const defaultPoints = {
      'M': [50, 50],
      'L': [100, 100],
      'C': [50, 50, 150, 50, 100, 150],
      'Q': [50, 50, 100, 150],
      'A': [50, 50, 0, 0, 1, 100, 100],
      'Z': []
    };

    const commands = parsePathData(pathData);
    commands.push({ 
      command, 
      points: defaultPoints[command] || [] 
    });
    setPathData(generatePathData(commands));
  };

  const downloadPath = () => {
    const svgContent = `<svg width="200" height="200" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
  <path d="${pathData}" fill="none" stroke="#000" stroke-width="2"/>
</svg>`;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'svg-path.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const commands = parsePathData(pathData);
  const points = extractPoints(commands);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">SVG Path Editor</h1>
          <p className="text-lg text-gray-600">Visual path manipulation and editing tool</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="xl:col-span-1 space-y-6">
            {/* Path Commands */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Path Commands</h2>
              <div className="grid grid-cols-2 gap-3">
                {pathCommands.map(cmd => (
                  <button
                    key={cmd.command}
                    onClick={() => addCommand(cmd.command)}
                    className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors text-center"
                  >
                    <div className="font-mono font-bold text-gray-800 text-lg">{cmd.command}</div>
                    <div className="text-xs text-gray-600 mt-1">{cmd.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Path Data Editor */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Path Data</h2>
              <textarea
                value={pathData}
                onChange={(e) => setPathData(e.target.value)}
                rows="6"
                className="w-full font-mono text-sm border border-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-teal-500"
                spellCheck="false"
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ViewBox
                </label>
                <input
                  type="text"
                  value={viewBox}
                  onChange={(e) => setViewBox(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setPathData('M50 50 L150 50 L100 150 Z')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Reset to Triangle
                </button>
                <button
                  onClick={downloadPath}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Download SVG
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(pathData)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Copy Path Data
                </button>
              </div>
            </div>

            {/* Path Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Path Info</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Commands:</span>
                  <span className="font-mono">{commands.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Points:</span>
                  <span className="font-mono">{points.filter(p => p.type === 'point').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Control Points:</span>
                  <span className="font-mono">{points.filter(p => p.type === 'control').length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas & Preview */}
          <div className="xl:col-span-2 space-y-6">
            {/* SVG Canvas */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Path Canvas</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                <svg
                  ref={svgRef}
                  width="100%"
                  height="400"
                  viewBox={viewBox}
                  className="cursor-crosshair bg-gray-50 rounded"
                  onClick={handleSvgClick}
                >
                  {/* Grid */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)"/>
                  
                  {/* Main Path */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Points */}
                  {points.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r={point.type === 'point' ? 4 : 3}
                      fill={point.type === 'point' ? '#EF4444' : '#10B981'}
                      stroke="#fff"
                      strokeWidth="1"
                      className="cursor-move"
                    />
                  ))}
                </svg>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Click on the canvas to add points • Red dots are path points • Green dots are control points
              </p>
            </div>

            {/* Command Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Command Breakdown</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {commands.map((cmd, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border border-gray-200 rounded">
                    <div className="font-mono font-bold text-blue-600 min-w-8">{cmd.command}</div>
                    <div className="font-mono text-sm text-gray-700 flex-1">
                      {cmd.points.join(' ')}
                    </div>
                    <button
                      onClick={() => {
                        const newCommands = commands.filter((_, i) => i !== index);
                        setPathData(generatePathData(newCommands));
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage Examples */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Common Shapes</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Triangle', path: 'M50 50 L150 50 L100 150 Z' },
                  { name: 'Square', path: 'M50 50 H150 V150 H50 Z' },
                  { name: 'Circle', path: 'M100 50 A50 50 0 1 1 100 150 A50 50 0 1 1 100 50 Z' },
                  { name: 'Heart', path: 'M100 30 C70 0 30 20 30 70 C30 110 70 140 100 170 C130 140 170 110 170 70 C170 20 130 0 100 30 Z' },
                ].map(shape => (
                  <button
                    key={shape.name}
                    onClick={() => setPathData(shape.path)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors text-center"
                  >
                    <div className="font-medium text-gray-800">{shape.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgPathEditor;