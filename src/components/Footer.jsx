import React from 'react';
import { 
  Heart, 
  Github, 
  Twitter, 
  ExternalLink,
  Code,
  Palette,
  Zap,
SquaresSubtract
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Text to SVG', href: '#textToSvg', icon: <Code className="w-4 h-4" /> },
    { name: 'SVG Editor', href: '#svgEditor', icon: <Palette className="w-4 h-4" /> },
    { name: 'SVG Optimizer', href: '#svgOptimizer', icon: <Zap className="w-4 h-4" /> },
  ];

  const resourceLinks = [
    { name: 'SVG Documentation', href: 'https://developer.mozilla.org/en-US/docs/Web/SVG', external: true },
    { name: 'React SVG Guide', href: 'https://react-svgr.com/', external: true },
    { name: 'SVG Examples', href: 'https://svgjs.com/docs/3.0/', external: true },
  ];

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: <Github className="w-5 h-5" />, external: true },
    { name: 'Twitter', href: 'https://twitter.com', icon: <Twitter className="w-5 h-5" />, external: true },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <SquaresSubtract className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="knewave text-xl font-bold">SVG Toolkit</h3>
                <p className="knewave text-gray-400 text-sm">Create • Edit • Convert</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              A comprehensive suite of SVG tools for developers and designers. 
              Create, edit, optimize, and convert SVG graphics with ease.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Tools</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>14+ SVG Tools</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Real-time Preview</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>No Upload Required</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>100% Client-side</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>Free & Open Source</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
     <div className="border-t border-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      
      {/* Left side */}
      <div className="flex items-center space-x-2 text-gray-400 text-sm">
        <span>&copy; {currentYear} SVG Toolkit.</span>
        <span className="hidden sm:inline">Free to learn, free to build.</span>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <span className="flex items-center space-x-1">
          <span className="font-mono text-green-400 wiggle">&lt;/&gt;</span>
          <span>& Crafted with</span>
          <Heart className="w-4 h-4 text-red-500 fill-current wiggle" />
          <span>by</span>
        </span>
        <a 
          href="https://webdipo.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          Webdipo
        </a>
      </div>

    </div>
  </div>
</div>


      {/* Version Badge */}
      <div className="bg-gray-800 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-300">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>Version 1.0.0</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;