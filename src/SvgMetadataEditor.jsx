import React, { useState } from 'react';

const SvgMetadataEditor = () => {
  const [svgCode, setSvgCode] = useState(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#3B82F6"/>
</svg>`);
  const [metadata, setMetadata] = useState({
    title: 'Blue Rectangle',
    description: 'A simple blue rectangle SVG',
    author: 'SVG Toolkit',
    created: new Date().toISOString().split('T')[0],
    keywords: 'rectangle, blue, simple',
    license: 'MIT',
    custom: []
  });
  const [customField, setCustomField] = useState({ key: '', value: '' });

  const updateMetadata = (field, value) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCustomField = () => {
    if (customField.key && customField.value) {
      setMetadata(prev => ({
        ...prev,
        custom: [...prev.custom, { ...customField }]
      }));
      setCustomField({ key: '', value: '' });
    }
  };

  const removeCustomField = (index) => {
    setMetadata(prev => ({
      ...prev,
      custom: prev.custom.filter((_, i) => i !== index)
    }));
  };

  const generateSvgWithMetadata = () => {
    let svgWithMetadata = svgCode;
    
    // Remove existing metadata if present
    svgWithMetadata = svgWithMetadata.replace(/<metadata>[\s\S]*?<\/metadata>/gi, '');
    svgWithMetadata = svgWithMetadata.replace(/<title>[\s\S]*?<\/title>/gi, '');
    svgWithMetadata = svgWithMetadata.replace(/<desc>[\s\S]*?<\/desc>/gi, '');
    
    // Build metadata content
    let metadataContent = '';
    
    // Add title
    if (metadata.title) {
      metadataContent += `\n    <title>${metadata.title}</title>`;
    }
    
    // Add description
    if (metadata.description) {
      metadataContent += `\n    <desc>${metadata.description}</desc>`;
    }
    
    // Add metadata block with custom fields
    const customFields = metadata.custom.map(field => 
      `\n    <meta key="${field.key}" value="${field.value}" />`
    ).join('');
    
    if (metadata.author || metadata.created || metadata.keywords || metadata.license || customFields) {
      metadataContent += `\n    <metadata>`;
      
      if (metadata.author) {
        metadataContent += `\n      <dc:creator>${metadata.author}</dc:creator>`;
      }
      if (metadata.created) {
        metadataContent += `\n      <dc:date>${metadata.created}</dc:date>`;
      }
      if (metadata.keywords) {
        metadataContent += `\n      <dc:subject>${metadata.keywords}</dc:subject>`;
      }
      if (metadata.license) {
        metadataContent += `\n      <dc:rights>${metadata.license}</dc:rights>`;
      }
      
      metadataContent += customFields;
      metadataContent += `\n    </metadata>`;
    }
    
    // Insert metadata after opening SVG tag
    if (metadataContent) {
      svgWithMetadata = svgWithMetadata.replace('<svg', `<svg xmlns:dc="http://purl.org/dc/elements/1.1/"`);
      const svgTagEnd = svgWithMetadata.indexOf('>') + 1;
      svgWithMetadata = svgWithMetadata.slice(0, svgTagEnd) + metadataContent + svgWithMetadata.slice(svgTagEnd);
    }
    
    return svgWithMetadata;
  };

  const svgWithMetadata = generateSvgWithMetadata();

  const extractExistingMetadata = (code) => {
    const extracted = {
      title: '',
      description: '',
      author: '',
      created: '',
      keywords: '',
      license: '',
      custom: []
    };
    
    // Extract title
    const titleMatch = code.match(/<title>([^<]*)<\/title>/);
    if (titleMatch) extracted.title = titleMatch[1];
    
    // Extract description
    const descMatch = code.match(/<desc>([^<]*)<\/desc>/);
    if (descMatch) extracted.description = descMatch[1];
    
    // Extract from metadata block
    const metadataMatch = code.match(/<metadata>([\s\S]*?)<\/metadata>/);
    if (metadataMatch) {
      const metadataContent = metadataMatch[1];
      
      const authorMatch = metadataContent.match(/<dc:creator>([^<]*)<\/dc:creator>/);
      if (authorMatch) extracted.author = authorMatch[1];
      
      const dateMatch = metadataContent.match(/<dc:date>([^<]*)<\/dc:date>/);
      if (dateMatch) extracted.created = dateMatch[1];
      
      const subjectMatch = metadataContent.match(/<dc:subject>([^<]*)<\/dc:subject>/);
      if (subjectMatch) extracted.keywords = subjectMatch[1];
      
      const rightsMatch = metadataContent.match(/<dc:rights>([^<]*)<\/dc:rights>/);
      if (rightsMatch) extracted.license = rightsMatch[1];
      
      // Extract custom meta tags
      const customMatches = metadataContent.match(/<meta key="([^"]*)" value="([^"]*)"\s*\/>/g) || [];
      extracted.custom = customMatches.map(tag => {
        const keyMatch = tag.match(/key="([^"]*)"/);
        const valueMatch = tag.match(/value="([^"]*)"/);
        return {
          key: keyMatch ? keyMatch[1] : '',
          value: valueMatch ? valueMatch[1] : ''
        };
      });
    }
    
    return extracted;
  };

  const handleLoadExisting = () => {
    const existingMetadata = extractExistingMetadata(svgCode);
    setMetadata(existingMetadata);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">SVG Metadata Editor</h1>
          <p className="text-lg text-gray-600">Add and edit metadata for better SEO and accessibility</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input & Metadata Form */}
          <div className="space-y-6">
            {/* SVG Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">SVG Input</h2>
              <textarea
                value={svgCode}
                onChange={(e) => setSvgCode(e.target.value)}
                rows="8"
                className="w-full font-mono text-sm border border-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-sky-500"
                placeholder="Paste your SVG code here..."
                spellCheck="false"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleLoadExisting}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Load Existing Metadata
                </button>
              </div>
            </div>

            {/* Metadata Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Metadata</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => updateMetadata('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    placeholder="Descriptive title for the SVG"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={metadata.description}
                    onChange={(e) => updateMetadata('description', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 resize-none"
                    placeholder="Detailed description of the SVG content"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                    <input
                      type="text"
                      value={metadata.author}
                      onChange={(e) => updateMetadata('author', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                      placeholder="Creator name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Creation Date</label>
                    <input
                      type="date"
                      value={metadata.created}
                      onChange={(e) => updateMetadata('created', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                  <input
                    type="text"
                    value={metadata.keywords}
                    onChange={(e) => updateMetadata('keywords', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    placeholder="Comma-separated keywords"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License</label>
                  <select
                    value={metadata.license}
                    onChange={(e) => updateMetadata('license', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="MIT">MIT License</option>
                    <option value="CC0">Creative Commons Zero</option>
                    <option value="CC-BY">Creative Commons Attribution</option>
                    <option value="Apache-2.0">Apache 2.0</option>
                    <option value="GPL-3.0">GPL v3</option>
                    <option value="Proprietary">Proprietary</option>
                    <option value="">No License</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Custom Metadata</h2>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customField.key}
                    onChange={(e) => setCustomField(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="Field name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={customField.value}
                    onChange={(e) => setCustomField(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Field value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={addCustomField}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {metadata.custom.map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                      <div className="text-sm">
                        <span className="font-medium text-gray-800">{field.key}:</span>
                        <span className="text-gray-600 ml-2">{field.value}</span>
                      </div>
                      <button
                        onClick={() => removeCustomField(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Output & Preview */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white min-h-64 flex items-center justify-center">
                <div dangerouslySetInnerHTML={{ __html: svgWithMetadata }} />
              </div>
            </div>

            {/* Output */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">SVG with Metadata</h2>
                <button
                  onClick={() => navigator.clipboard.writeText(svgWithMetadata)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Copy Code
                </button>
              </div>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
                <code>{svgWithMetadata}</code>
              </pre>
            </div>

            {/* Metadata Benefits */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Add Metadata?</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <strong>Accessibility:</strong> Screen readers use title and description
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <strong>SEO:</strong> Search engines index metadata for better ranking
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <strong>Organization:</strong> Easier to manage and search SVG libraries
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <strong>Copyright:</strong> Clear licensing information protects your work
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

export default SvgMetadataEditor;