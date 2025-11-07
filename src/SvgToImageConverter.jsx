import React, { useState, useRef } from 'react';

const SvgToImageConverter = () => {
  const [svgCode, setSvgCode] = useState(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#3B82F6" stroke="#1D4ED8" stroke-width="4"/>
  <text x="100" y="110" text-anchor="middle" fill="white" font-family="Arial" font-size="16">SVG</text>
</svg>`);
  const [convertedImage, setConvertedImage] = useState('');
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(0.92);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [scale, setScale] = useState(2);
  const canvasRef = useRef(null);

  const convertToImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Create a blob from SVG
    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const img = new Image();
    img.onload = function() {
      // Set canvas size
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw SVG
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL(`image/${format}`, quality);
      setConvertedImage(dataUrl);
      
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  const downloadImage = () => {
    if (!convertedImage) return;
    
    const link = document.createElement('a');
    link.download = `converted-image.${format}`;
    link.href = convertedImage;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!convertedImage) return;
    
    try {
      // For PNG/JPEG, we need to fetch the image and use the Clipboard API
      const response = await fetch(convertedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      alert('Image copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy image: ', err);
      alert('Failed to copy image to clipboard. Please download instead.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">SVG to Image Converter</h1>
          <p className="text-lg text-gray-600">Convert SVG files to PNG, JPEG, and other raster formats</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input & Controls */}
          <div className="space-y-6">
            {/* SVG Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">SVG Input</h2>
              <textarea
                value={svgCode}
                onChange={(e) => setSvgCode(e.target.value)}
                rows="10"
                className="w-full font-mono text-sm border border-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-amber-500"
                placeholder="Paste your SVG code here..."
                spellCheck="false"
              />
              <button
                onClick={convertToImage}
                className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Convert to Image
              </button>
            </div>

            {/* Conversion Settings */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Conversion Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="png">PNG (Lossless)</option>
                    <option value="jpeg">JPEG (Compressed)</option>
                    <option value="webp">WebP (Modern)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scale: {scale}x
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Higher scale = better quality for high-DPI displays
                  </div>
                </div>

                {format === 'jpeg' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality: {Math.round(quality * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-300"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Applies to formats with transparency (PNG, WebP) when needed
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Templates</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Simple Circle', svg: '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80" fill="#3B82F6"/></svg>' },
                  { name: 'Square Icon', svg: '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="160" x="20" y="20" fill="#10B981" rx="20"/></svg>' },
                  { name: 'Star', svg: '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><polygon points="100,20 120,80 180,80 130,110 150,170 100,140 50,170 70,110 20,80 80,80" fill="#F59E0B"/></svg>' },
                  { name: 'Text Logo', svg: '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><text x="100" y="110" text-anchor="middle" fill="#EC4899" font-family="Arial" font-size="24" font-weight="bold">LOGO</text></svg>' },
                ].map(template => (
                  <button
                    key={template.name}
                    onClick={() => setSvgCode(template.svg)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors text-center"
                  >
                    <div className="text-sm font-medium text-gray-800">{template.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output & Preview */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white min-h-64 flex items-center justify-center">
                {convertedImage ? (
                  <div className="text-center">
                    <img 
                      src={convertedImage} 
                      alt="Converted" 
                      className="max-w-full max-h-48 mx-auto mb-4"
                    />
                    <div className="text-sm text-gray-600">
                      Format: {format.toUpperCase()} • Scale: {scale}x
                      {format === 'jpeg' && ` • Quality: ${Math.round(quality * 100)}%`}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Converted image will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Output Actions */}
            {convertedImage && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Export</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={downloadImage}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}

            {/* Format Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Format Guide</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <strong>PNG</strong> - Lossless format, supports transparency. Best for graphics, logos, and images with text.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <strong>JPEG</strong> - Lossy compression, smaller file sizes. Best for photographs and complex images.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-purple-600 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <strong>WebP</strong> - Modern format, excellent compression. Good balance of quality and file size.
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgToImageConverter;