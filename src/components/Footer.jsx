import React from 'react';
import { Heart } from 'lucide-react';
const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Section */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                            <span className="text-xl font-bold text-emerald-600">Clarity</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            Your personal stuttering therapy companion
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center">
                        <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center md:text-right">
                        <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>Get in touch for support</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 mt-8 pt-6 text-center">
                    <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by Clarity Team
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        © {new Date().getFullYear()} Clarity. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
