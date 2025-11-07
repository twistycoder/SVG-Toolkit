import React, { useState, useRef, useEffect } from 'react';

const SvgAnimationCreator = () => {
  const [svgCode, setSvgCode] = useState(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle id="animated-circle" cx="100" cy="100" r="30" fill="#3B82F6"/>
</svg>`);
  const [animations, setAnimations] = useState([]);
  const [selectedElement, setSelectedElement] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef(null);

  const animationTypes = [
    { id: 'translate', name: 'Move', attribute: 'transform', values: ['translate(0,0)', 'translate(50,50)'] },
    { id: 'scale', name: 'Scale', attribute: 'transform', values: ['scale(1)', 'scale(1.5)'] },
    { id: 'rotate', name: 'Rotate', attribute: 'transform', values: ['rotate(0)', 'rotate(360)'] },
    { id: 'opacity', name: 'Fade', attribute: 'opacity', values: ['1', '0'] },
    { id: 'color', name: 'Color Change', attribute: 'fill', values: ['#3B82F6', '#EF4444'] },
    { id: 'stroke', name: 'Stroke', attribute: 'stroke-width', values: ['1', '5'] },
  ];

  const addAnimation = (type) => {
    const newAnimation = {
      id: Date.now(),
      type: type.id,
      name: type.name,
      elementId: selectedElement,
      attribute: type.attribute,
      values: [...type.values],
      duration: 2,
      delay: 0,
      timing: 'ease-in-out',
      iteration: '1'
    };
    setAnimations([...animations, newAnimation]);
  };

  const updateAnimation = (id, field, value) => {
    setAnimations(animations.map(anim => 
      anim.id === id ? { ...anim, [field]: value } : anim
    ));
  };

  const removeAnimation = (id) => {
    setAnimations(animations.filter(anim => anim.id !== id));
  };

  const generateAnimatedSVG = () => {
    let animatedSvg = svgCode;
    
    animations.forEach(anim => {
      const cssAnimation = `
<style>
  @keyframes ${anim.type}-${anim.id} {
    from { ${anim.attribute}: ${anim.values[0]}; }
    to { ${anim.attribute}: ${anim.values[1]}; }
  }
  #${anim.elementId} {
    animation: ${anim.type}-${anim.id} ${anim.duration}s ${anim.timing} ${anim.delay}s ${anim.iteration};
  }
</style>`;
      
      if (!animatedSvg.includes('<style>')) {
        animatedSvg = animatedSvg.replace('</svg>', `<style>\n</style>\n</svg>`);
      }
      
      const styleEnd = animatedSvg.indexOf('</style>');
      animatedSvg = animatedSvg.slice(0, styleEnd) + cssAnimation + animatedSvg.slice(styleEnd);
    });

    return animatedSvg;
  };

  const playAnimation = () => {
    setIsPlaying(true);
    setCurrentTime(0);
    
    const maxDuration = Math.max(...animations.map(a => a.duration + a.delay));
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setCurrentTime(elapsed);
      
      if (elapsed < maxDuration) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const animatedSVG = generateAnimatedSVG();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">SVG Animation Creator</h1>
          <p className="text-lg text-gray-600">Create timeline-based SVG animations with CSS</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Animation Controls */}
          <div className="xl:col-span-1 space-y-6">
            {/* SVG Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">SVG Setup</h2>
              <textarea
                value={svgCode}
                onChange={(e) => setSvgCode(e.target.value)}
                rows="6"
                className="w-full font-mono text-sm border border-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-pink-500"
                spellCheck="false"
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Element ID to Animate
                </label>
                <input
                  type="text"
                  value={selectedElement}
                  onChange={(e) => setSelectedElement(e.target.value)}
                  placeholder="e.g., animated-circle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Animation Types */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Animation</h2>
              <div className="grid grid-cols-2 gap-3">
                {animationTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => addAnimation(type)}
                    disabled={!selectedElement}
                    className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-sm font-medium text-gray-800">{type.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Controls */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Timeline</h2>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={playAnimation}
                  disabled={isPlaying || animations.length === 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  Play
                </button>
                <button
                  onClick={stopAnimation}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Stop
                </button>
              </div>
              <div className="text-center text-sm text-gray-600">
                Time: {currentTime.toFixed(1)}s
              </div>
            </div>
          </div>

          {/* Animations List & Preview */}
          <div className="xl:col-span-2 space-y-6">
            {/* Animations List */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Animations</h2>
              <div className="space-y-4">
                {animations.map(animation => (
                  <div key={animation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-800">{animation.name}</h3>
                      <button
                        onClick={() => removeAnimation(animation.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Duration (s)</label>
                        <input
                          type="number"
                          value={animation.duration}
                          onChange={(e) => updateAnimation(animation.id, 'duration', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          min="0.1"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Delay (s)</label>
                        <input
                          type="number"
                          value={animation.delay}
                          onChange={(e) => updateAnimation(animation.id, 'delay', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Timing</label>
                        <select
                          value={animation.timing}
                          onChange={(e) => updateAnimation(animation.id, 'timing', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="ease">Ease</option>
                          <option value="ease-in">Ease In</option>
                          <option value="ease-out">Ease Out</option>
                          <option value="ease-in-out">Ease In Out</option>
                          <option value="linear">Linear</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Iteration</label>
                        <input
                          type="text"
                          value={animation.iteration}
                          onChange={(e) => updateAnimation(animation.id, 'iteration', e.target.value)}
                          placeholder="1, infinite, etc."
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs text-gray-600 mb-1">Values</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={animation.values[0]}
                          onChange={(e) => updateAnimation(animation.id, 'values', [e.target.value, animation.values[1]])}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Start value"
                        />
                        <input
                          type="text"
                          value={animation.values[1]}
                          onChange={(e) => updateAnimation(animation.id, 'values', [animation.values[0], e.target.value])}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="End value"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {animations.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No animations added yet</p>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white min-h-64 flex items-center justify-center">
                <div dangerouslySetInnerHTML={{ __html: animatedSVG }} />
              </div>
            </div>

            {/* Output */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Animated SVG Code</h2>
                <button
                  onClick={() => navigator.clipboard.writeText(animatedSVG)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Copy Code
                </button>
              </div>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-64 overflow-y-auto">
                <code>{animatedSVG}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgAnimationCreator;