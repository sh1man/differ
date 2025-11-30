import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import DiffViewer from './components/DiffViewer';
import { compareTexts } from './lib/api';

function App() {
    const [reference, setReference] = useState('');
    const [hypothesis, setHypothesis] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCompare = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await compareTexts(reference, hypothesis);
            setResults(data);
        } catch (err) {
            setError('Failed to compare texts. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <InputSection
                    reference={reference}
                    setReference={setReference}
                    hypothesis={hypothesis}
                    setHypothesis={setHypothesis}
                    onCompare={handleCompare}
                    loading={loading}
                />

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {results && (
                    <div className="space-y-8 animate-fade-in">
                        <ResultsSection results={results} />

                        <div className="grid grid-cols-1 gap-8">
                            <DiffViewer
                                reference={results.reference_normalized}
                                hypothesis={results.hypothesis_normalized}
                            />
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    ASR Differ Tool &copy; {new Date().getFullYear()}
                </div>
            </footer>
        </div>
    );
}

export default App;
