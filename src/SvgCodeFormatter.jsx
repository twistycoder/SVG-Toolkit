import React, { useState } from 'react';

const SvgCodeFormatter = () => {
  const [inputCode, setInputCode] = useState(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" fill="red" stroke="black" stroke-width="2"/><circle cx="50" cy="50" r="30" fill="blue"/></svg>`);
  const [formattedCode, setFormattedCode] = useState('');
  const [formatOptions, setFormatOptions] = useState({
    indentSize: 2,
    indentChar: 'space',
    wrapAttributes: 'preserve',
    sortAttributes: false,
    removeComments: true,
    removeEmptyAttributes: false,
    maxLineLength: 80
  });

  const formatSVG = () => {
    let formatted = inputCode.trim();
    
    // Remove comments if enabled
    if (formatOptions.removeComments) {
      formatted = formatted.replace(/<!--[\s\S]*?-->/g, '');
    }
    
    // Remove empty attributes if enabled
    if (formatOptions.removeEmptyAttributes) {
      formatted = formatted.replace(/\s+(\w+)=""/g, '');
    }
    
    // Basic formatting - this is a simplified version
    // In a real application, you might want to use a proper XML formatter
    formatted = formatted
      .replace(/><(\w)/g, '>\n<$1')
      .replace(/(<\/\w+>)(<\w)/g, '$1\n$2')
      .replace(/(>)(<)/g, '$1\n$2');
    
    // Indentation
    const indentChar = formatOptions.indentChar === 'tab' ? '\t' : ' ';
    const indentSize = formatOptions.indentChar === 'tab' ? 1 : formatOptions.indentSize;
    const indent = indentChar.repeat(indentSize);
    
    let level = 0;
    const lines = formatted.split('\n');
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.startsWith('</')) {
        level--;
      }
      
      const indentedLine = indent.repeat(level) + trimmed;
      
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
        level++;
      }
      
      return indentedLine;
    });
    
    formatted = formattedLines.filter(line => line !== '').join('\n');
    
    // Sort attributes if enabled
    if (formatOptions.sortAttributes) {
      formatted = formatted.replace(/<(\w+)([^>]*)>/g, (match, tag, attrs) => {
        const attributes = attrs.match(/\s+(\w+)="([^"]*)"/g) || [];
        const sortedAttributes = attributes.sort((a, b) => {
          const aName = a.match(/\s+(\w+)=/)[1];
          const bName = b.match(/\s+(\w+)=/)[1];
          return aName.localeCompare(bName);
        });
        return `<${tag}${sortedAttributes.join('')}>`;
      });
    }
    
    setFormattedCode(formatted);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const analyzeCode = () => {
    const analysis = {
      lines: formattedCode.split('\n').length,
      characters: formattedCode.length,
      elements: (formattedCode.match(/<\w+/g) || []).length,
      attributes: (formattedCode.match(/\w+="[^"]*"/g) || []).length,
      fileSize: new Blob([formattedCode]).size
    };
    return analysis;
  };

  const analysis = formattedCode ? analyzeCode() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">SVG Code Formatter</h1>
          <p className="text-lg text-gray-600">Format and beautify your SVG code with consistent styling</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input & Options */}
          <div className="space-y-6">
            {/* Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Input SVG</h2>
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                rows="12"
                className="w-full font-mono text-sm border border-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-violet-500"
                placeholder="Paste your unformatted SVG code here..."
                spellCheck="false"
              />
              <button
                onClick={formatSVG}
                className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Format SVG Code
              </button>
            </div>

            {/* Format Options */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Formatting Options</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Indent Size</label>
                  <select
                    value={formatOptions.indentSize}
                    onChange={(e) => setFormatOptions(prev => ({ ...prev, indentSize: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                    <option value={8}>8 spaces</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Indent Character</label>
                  <select
                    value={formatOptions.indentChar}
                    onChange={(e) => setFormatOptions(prev => ({ ...prev, indentChar: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="space">Spaces</option>
                    <option value="tab">Tabs</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formatOptions.sortAttributes}
                    onChange={(e) => setFormatOptions(prev => ({ ...prev, sortAttributes: e.target.checked }))}
                    className="text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Sort attributes alphabetically</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formatOptions.removeComments}
                    onChange={(e) => setFormatOptions(prev => ({ ...prev, removeComments: e.target.checked }))}
                    className="text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Remove comments</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formatOptions.removeEmptyAttributes}
                    onChange={(e) => setFormatOptions(prev => ({ ...prev, removeEmptyAttributes: e.target.checked }))}
                    className="text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Remove empty attributes</span>
                </label>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Templates</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Minified', code: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" fill="red"/></svg>' },
                  { name: 'Complex', code: '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="red"/><stop offset="100%" stop-color="blue"/></linearGradient></defs><rect x="10" y="10" width="180" height="180" fill="url(#grad1)" stroke="black" stroke-width="2"/></svg>' },
                ].map(template => (
                  <button
                    key={template.name}
                    onClick={() => setInputCode(template.code)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-violet-400 hover:bg-violet-50 transition-colors text-center"
                  >
                    <div className="text-sm font-medium text-gray-800">{template.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output & Analysis */}
          <div className="space-y-6">
            {/* Output */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Formatted SVG</h2>
                {formattedCode && (
                  <button
                    onClick={() => copyToClipboard(formattedCode)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Copy Code
                  </button>
                )}
              </div>
              
              {formattedCode ? (
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
                  <code>{formattedCode}</code>
                </pre>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                  Formatted code will appear here
                </div>
              )}
            </div>

            {/* Analysis */}
            {analysis && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Code Analysis</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analysis.lines}</div>
                    <div className="text-sm text-gray-600">Lines</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analysis.elements}</div>
                    <div className="text-sm text-gray-600">Elements</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{analysis.attributes}</div>
                    <div className="text-sm text-gray-600">Attributes</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{analysis.characters}</div>
                    <div className="text-sm text-gray-600">Characters</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{analysis.fileSize}</div>
                    <div className="text-sm text-gray-600">Bytes</div>
                  </div>
                </div>
              </div>
            )}

            {/* Code Standards */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">SVG Best Practices</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>Use meaningful element IDs and class names</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>Remove unused attributes and elements</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>Use consistent indentation and formatting</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>Optimize path data when possible</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>Include proper XML namespace declaration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgCodeFormatter;