import React, { useState, useRef } from 'react';

function TextToSvg() {
  const [text, setText] = useState('Hello SVG');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [fillColor, setFillColor] = useState('#000000');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [svgCode, setSvgCode] = useState('');
  const [textAlign, setTextAlign] = useState('middle');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);

  // Comprehensive font list organized by categories
  const fontCategories = {
    "Sans-Serif": [
      'Arial', 'Helvetica', 'Verdana', 'Tahoma', 'Trebuchet MS', 
      'Geneva', 'Segoe UI', 'Roboto', 'Open Sans', 'Lato',
      'Montserrat', 'Raleway', 'Poppins', 'Ubuntu', 'Oswald',
      'Source Sans Pro', 'Nunito', 'Inter', 'Futura', 'Gill Sans',
      'Avenir', 'Franklin Gothic', 'Century Gothic', 'Calibri', 'Candara'
    ],
    "Serif": [
      'Times New Roman', 'Georgia', 'Palatino', 'Garamond', 'Baskerville',
      'Bookman', 'Cambria', 'Didot', 'Bodoni', 'Copperplate',
      'Rockwell', 'Courier New', 'Playfair Display', 'Merriweather',
      'Lora', 'Crimson Text', 'Source Serif Pro', 'Libre Baskerville',
      'Alegreya', 'Vollkorn', 'Cormorant', 'Spectral', 'EB Garamond'
    ],
    "Monospace": [
      'Courier New', 'Courier', 'Lucida Console', 'Monaco', 
      'Consolas', 'Source Code Pro', 'Fira Code', 'Roboto Mono',
      'Ubuntu Mono', 'Cascadia Code', 'JetBrains Mono', 'Monaco',
      'Menlo', 'DejaVu Sans Mono', 'Liberation Mono', 'PT Mono'
    ],
    "Display & Handwritten": [
      'Brush Script MT', 'Comic Sans MS', 'Papyrus', 'Impact',
      'Arial Black', 'Copperplate Gothic', 'Bauhaus', 'Bradley Hand',
      'Lucida Handwriting', 'Mistral', 'Chalkduster', 'Marker Felt',
      'Trattatello', 'Snell Roundhand', 'Vivaldi', 'Zapfino',
      'Pacifico', 'Dancing Script', 'Great Vibes', 'Satisfy',
      'Caveat', 'Kalam', 'Cookie', 'Parisienne', 'Sacramento'
    ],
    "Modern & Geometric": [
      'Futura', 'Avenir', 'Gotham', 'Proxima Nova', 'Brandon Grotesque',
      'Circular', 'Avenir Next', 'San Francisco', 'Helvetica Neue',
      'Akzidenz-Grotesk', 'Univers', 'Eurostile', 'Avant Garde',
      'ITC Bauhaus', 'Neutraface', 'Gill Sans', 'Myriad Pro'
    ]
  };

  const generateSVG = () => {
    const svgContent = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <text 
          x="50%" 
          y="50%" 
          dominant-baseline="middle" 
          text-anchor="${textAlign}"
          font-family="${fontFamily}, sans-serif"
          font-size="${fontSize}"
          font-weight="${fontWeight}"
          font-style="${fontStyle}"
          fill="${fillColor}"
          stroke="${strokeColor}"
          stroke-width="${strokeWidth}"
          opacity="${opacity}"
          letter-spacing="${letterSpacing}px"
          word-spacing="${wordSpacing}px"
          transform="rotate(${rotation}, 200, 100)"
        >
          ${text}
        </text>
      </svg>
    `;
    setSvgCode(svgContent);
  };

  const downloadSVG = () => {
    if (!svgCode) return;
    
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-to-svg.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(svgCode);
      alert('SVG code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Load all fonts dynamically
  const loadAllFonts = () => {
    const allFonts = Object.values(fontCategories).flat();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${allFonts.map(font => font.replace(/ /g, '+')).join('&family=')}&display=swap`;
    document.head.appendChild(link);
  };

  // Load fonts on component mount
  React.useEffect(() => {
    loadAllFonts();
    generateSVG(); // Generate initial SVG
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Text to SVG Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert your text into scalable vector graphics with {Object.values(fontCategories).flat().length}+ fonts and custom styling options.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="xl:col-span-1 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customize Your Text</h2>
            
            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Content
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter your text here..."
                />
              </div>

              {/* Font Selection with Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family ({Object.values(fontCategories).flat().length}+ fonts available)
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: fontFamily }}
                >
                  {Object.entries(fontCategories).map(([category, fonts]) => (
                    <optgroup key={category} label={category}>
                      {fonts.map(font => (
                        <option 
                          key={font} 
                          value={font}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Font Size, Weight, and Style */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="120"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <select
                    value={fontWeight}
                    onChange={(e) => setFontWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="lighter">Light</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                    <option value="600">600</option>
                    <option value="700">700</option>
                    <option value="800">800</option>
                    <option value="900">900</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style
                  </label>
                  <select
                    value={fontStyle}
                    onChange={(e) => setFontStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                    <option value="oblique">Oblique</option>
                  </select>
                </div>
              </div>

              {/* Text Alignment and Spacing */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alignment
                  </label>
                  <select
                    value={textAlign}
                    onChange={(e) => setTextAlign(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="start">Left</option>
                    <option value="middle">Center</option>
                    <option value="end">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Letter Spacing: {letterSpacing}px
                  </label>
                  <input
                    type="range"
                    min="-2"
                    max="10"
                    step="0.5"
                    value={letterSpacing}
                    onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Word Spacing: {wordSpacing}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={wordSpacing}
                    onChange={(e) => setWordSpacing(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fill Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={fillColor}
                      onChange={(e) => setFillColor(e.target.value)}
                      className="w-12 h-12 cursor-pointer rounded-lg border border-gray-300"
                    />
                    <input
                      type="text"
                      value={fillColor}
                      onChange={(e) => setFillColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stroke Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-12 h-12 cursor-pointer rounded-lg border border-gray-300"
                    />
                    <input
                      type="text"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Stroke Width and Opacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stroke Width: {strokeWidth}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opacity: {opacity}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Rotation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotation: {rotation}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={generateSVG}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Generate SVG
                </button>
                <button
                  onClick={() => {
                    setText('Hello SVG');
                    setFontSize(24);
                    setFontFamily('Arial');
                    setFontWeight('normal');
                    setFontStyle('normal');
                    setFillColor('#000000');
                    setStrokeColor('#000000');
                    setStrokeWidth(0);
                    setRotation(0);
                    setOpacity(1);
                    setTextAlign('middle');
                    setLetterSpacing(0);
                    setWordSpacing(0);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>

          {/* Preview and Output */}
          <div className="xl:col-span-2 space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Live Preview</h2>
                <div className="text-sm text-gray-500">
                  Font: <span className="font-medium" style={{ fontFamily }}>{fontFamily}</span>
                </div>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-64 flex items-center justify-center bg-gray-50">
                {svgCode ? (
                  <div 
                    className="max-w-full max-h-48"
                    dangerouslySetInnerHTML={{ __html: svgCode }}
                  />
                ) : (
                  <p className="text-gray-500 text-center">
                    Your SVG preview will appear here after generation
                  </p>
                )}
              </div>
            </div>

            {/* SVG Code Output */}
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
                      Download SVG
                    </button>
                  </div>
                </div>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-64 overflow-y-auto">
                  <code>{svgCode}</code>
                </pre>
              </div>
            )}

            {/* Quick Font Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Font Preview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                {fontCategories["Sans-Serif"].slice(0, 12).map(font => (
                  <button
                    key={font}
                    onClick={() => setFontFamily(font)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      fontFamily === font 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ fontFamily }}
                  >
                    <div className="text-sm font-medium text-gray-800">{font}</div>
                    <div className="text-xs text-gray-500 mt-1">Aa</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Font Statistics */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Massive Font Collection
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
              {Object.entries(fontCategories).map(([category, fonts]) => (
                <div key={category} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{fonts.length}</div>
                  <div className="text-sm text-gray-600">{category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextToSvg;