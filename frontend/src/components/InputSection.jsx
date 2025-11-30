import React from 'react';

const InputSection = ({ reference, setReference, hypothesis, setHypothesis, onCompare, loading }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
                <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                    Reference Text (Ground Truth)
                </label>
                <textarea
                    id="reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full h-48 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                    placeholder="Enter the correct reference text here..."
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="hypothesis" className="block text-sm font-medium text-gray-700">
                    Hypothesis Text (ASR Output)
                </label>
                <textarea
                    id="hypothesis"
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                    className="w-full h-48 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                    placeholder="Enter the ASR output text here..."
                />
            </div>

            <div className="md:col-span-2 flex justify-center">
                <button
                    onClick={onCompare}
                    disabled={loading || !reference || !hypothesis}
                    className={`
            px-8 py-3 rounded-lg font-semibold text-white shadow-md transition-all
            ${loading || !reference || !hypothesis
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95'}
          `}
                >
                    {loading ? 'Comparing...' : 'Compare Texts'}
                </button>
            </div>
        </div>
    );
};

export default InputSection;
