import React from 'react';
import { Activity } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">ASR Differ</h1>
                </div>
                <div className="text-sm text-gray-500">
                    Compare Reference vs Hypothesis
                </div>
            </div>
        </header>
    );
};

export default Header;
