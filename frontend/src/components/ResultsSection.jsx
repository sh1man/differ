import React from 'react';

const MetricCard = ({ title, value, subtitle, color = "blue" }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
        <div className={`mt-2 text-3xl font-bold text-${color}-600`}>
            {typeof value === 'number' ? value.toFixed(2) : value}
            {typeof value === 'number' && '%'}
        </div>
        {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
    </div>
);

const ResultsSection = ({ results }) => {
    if (!results) return null;

    return (
        <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    title="WER"
                    value={results.wer * 100}
                    subtitle="Word Error Rate"
                    color={results.wer < 0.1 ? "green" : results.wer < 0.3 ? "yellow" : "red"}
                />
                <MetricCard
                    title="CER"
                    value={results.cer * 100}
                    subtitle="Char Error Rate"
                    color={results.cer < 0.05 ? "green" : results.cer < 0.15 ? "yellow" : "red"}
                />
                <MetricCard
                    title="Total Errors"
                    value={results.total_errors}
                    subtitle={`S:${results.substitutions} D:${results.deletions} I:${results.insertions}`}
                    color="gray"
                />
                <MetricCard
                    title="Word Count"
                    value={results.total_words}
                    subtitle="Reference Words"
                    color="gray"
                />
            </div>
        </div>
    );
};

export default ResultsSection;
