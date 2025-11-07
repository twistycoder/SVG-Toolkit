import React, { useState, useRef } from 'react';

const SvgToCode = () => {
  const [svgFile, setSvgFile] = useState(null);
  const [svgCode, setSvgCode] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [optimization, setOptimization] = useState({
    removeComments: true,
    minify: true,
    prettify: false,
    removeMetadata: true
  });
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleFileUpload = (file) => {
    if (!file || !file.type.includes('svg')) {
      alert('Please upload a valid SVG file');
      return;
    }

    setSvgFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const reader = new FileReader();
    reader.onload = (e) => {
      let code = e.target.result;
      code = optimizeSVGCode(code, optimization);
      setSvgCode(code);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const optimizeSVGCode = (code, options) => {
    let optimizedCode = code;

    if (options.removeComments) {
      optimizedCode = optimizedCode.replace(/<!--[\s\S]*?-->/g, '');
    }

    if (options.removeMetadata) {
      optimizedCode = optimizedCode.replace(/<metadata>[\s\S]*?<\/metadata>/gi, '');
    }

    if (options.minify) {
      optimizedCode = optimizedCode
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+\/>/g, '/>')
        .trim();
    }

    if (options.prettify) {
      optimizedCode = prettifySVG(optimizedCode);
    }

    return optimizedCode;
  };

const prettifySVG = (code) => {
  // Simple prettifying - in a real app you might want to use a proper XML formatter
  return code
    .replace(/></g, '>\n<')   // Corrected regex here
    .replace(/>/g, '>\n')
    .replace(/</g, '\n<')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .join('\n');
};

  const handleOptimizationChange = (option) => {
    const newOptimization = {
      ...optimization,
      [option]: !optimization[option]
    };
    setOptimization(newOptimization);
    
    if (svgCode) {
      const reader = new FileReader();
      reader.onload = (e) => {
        let code = e.target.result;
        code = optimizeSVGCode(code, newOptimization);
        setSvgCode(code);
      };
      reader.readAsText(svgFile);
    }
  };

  const copyToClipboard = async () => {
    if (!svgCode) return;
    
    try {
      await navigator.clipboard.writeText(svgCode);
      alert('SVG code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      
      // Fallback for older browsers
      textareaRef.current.select();
      document.execCommand('copy');
      alert('SVG code copied to clipboard!');
    }
  };

  const downloadSVG = () => {
    if (!svgCode) return;
    
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = svgFile ? `optimized-${svgFile.name}` : 'optimized-svg.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setSvgFile(null);
    setSvgCode('');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeSVG = () => {
    if (!svgCode) return {};

    const analysis = {
      elements: 0,
      hasPaths: false,
      hasShapes: false,
      hasText: false,
      hasGradients: false,
      hasFilters: false,
      size: svgCode.length,
      dimensions: { width: 'unknown', height: 'unknown' }
    };

    // Count elements
    analysis.elements = (svgCode.match(/<(\w+)/g) || []).length;

    // Check for specific elements
    analysis.hasPaths = svgCode.includes('<path');
    analysis.hasShapes = /<(rect|circle|ellipse|line|polygon|polyline)/.test(svgCode);
    analysis.hasText = svgCode.includes('<text');
    analysis.hasGradients = svgCode.includes('<linearGradient') || svgCode.includes('<radialGradient');
    analysis.hasFilters = svgCode.includes('<filter');

    // Extract dimensions
    const widthMatch = svgCode.match(/width="([^"]*)"/);
    const heightMatch = svgCode.match(/height="([^"]*)"/);
    if (widthMatch) analysis.dimensions.width = widthMatch[1];
    if (heightMatch) analysis.dimensions.height = heightMatch[1];

    return analysis;
  };

  const analysis = analyzeSVG();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            SVG to Code Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload SVG files and extract clean, optimized code. Perfect for developers and designers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload & Preview Section */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload SVG</h2>
              
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drop your SVG file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports .svg files only
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {svgFile && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-800">{svgFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(svgFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearAll}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview</h2>
                <div className="border-2 border-gray-200 rounded-lg p-6 bg-white flex items-center justify-center min-h-64">
                  <img 
                    src={previewUrl} 
                    alt="SVG Preview" 
                    className="max-w-full max-h-48 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="text-center text-gray-500" style={{ display: 'none' }}>
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Preview not available</p>
                  </div>
                </div>
              </div>
            )}

            {/* SVG Analysis */}
            {svgCode && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">SVG Analysis</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analysis.elements}</div>
                    <div className="text-sm text-gray-600">Elements</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analysis.size} bytes</div>
                    <div className="text-sm text-gray-600">File Size</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm font-bold text-purple-600">
                      {analysis.dimensions.width} × {analysis.dimensions.height}
                    </div>
                    <div className="text-sm text-gray-600">Dimensions</div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {analysis.hasPaths && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Paths</span>
                  )}
                  {analysis.hasShapes && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Shapes</span>
                  )}
                  {analysis.hasText && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Text</span>
                  )}
                  {analysis.hasGradients && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Gradients</span>
                  )}
                  {analysis.hasFilters && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Filters</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Code Output & Options */}
          <div className="space-y-6">
            {/* Optimization Options */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Optimization Options</h2>
              <div className="space-y-3">
                {[
                  { key: 'minify', label: 'Minify Code', description: 'Remove unnecessary whitespace' },
                  { key: 'removeComments', label: 'Remove Comments', description: 'Strip all comment tags' },
                  { key: 'removeMetadata', label: 'Remove Metadata', description: 'Remove metadata tags' },
                  { key: 'prettify', label: 'Prettify Code', description: 'Format code for readability' }
                ].map(option => (
                  <label key={option.key} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={optimization[option.key]}
                      onChange={() => handleOptimizationChange(option.key)}
                      className="mt-1 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Code Output */}
            {svgCode && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">SVG Code</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Code
                    </button>
                    <button
                      onClick={downloadSVG}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={svgCode}
                    onChange={(e) => setSvgCode(e.target.value)}
                    className="w-full h-64 font-mono text-sm bg-gray-800 text-green-400 p-4 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    spellCheck="false"
                  />
                  <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">
                    {svgCode.length} chars
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800">Drag & Drop</h3>
                    <p className="text-sm text-gray-600">Easy file upload with drag and drop support</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800">Code Optimization</h3>
                    <p className="text-sm text-gray-600">Clean and optimize your SVG code</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800">Live Preview</h3>
                    <p className="text-sm text-gray-600">See your SVG before extracting code</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800">SVG Analysis</h3>
                    <p className="text-sm text-gray-600">Get detailed insights about your SVG</p>
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

export default SvgToCode;