import React, { useMemo } from 'react';
import { calculateDiff } from '../lib/diff';

const DiffViewer = ({ reference, hypothesis }) => {
    const diff = useMemo(() => calculateDiff(reference, hypothesis), [reference, hypothesis]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="font-semibold text-gray-900">Visual Diff</h2>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></span>
                        <span className="text-gray-600">Insertion</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></span>
                        <span className="text-gray-600">Deletion</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300"></span>
                        <span className="text-gray-600">Substitution</span>
                    </div>
                </div>
            </div>

            <div className="p-6 font-mono text-base leading-relaxed break-words">
                {diff.map((part, index) => {
                    if (part.type === 'equal') {
                        return <span key={index} className="text-gray-700">{part.value} </span>;
                    } else if (part.type === 'insert') {
                        return (
                            <span key={index} className="bg-green-100 text-green-800 px-1 rounded mx-0.5 border-b-2 border-green-300" title="Inserted">
                                {part.value}
                            </span>
                        );
                    } else if (part.type === 'delete') {
                        return (
                            <span key={index} className="bg-red-100 text-red-800 px-1 rounded mx-0.5 border-b-2 border-red-300 line-through decoration-red-500" title="Deleted">
                                {part.value}
                            </span>
                        );
                    } else if (part.type === 'replace') {
                        return (
                            <span key={index} className="bg-yellow-100 text-yellow-800 px-1 rounded mx-0.5 border-b-2 border-yellow-300 group relative cursor-help">
                                {part.value}
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    Was: {part.oldValue}
                                </span>
                            </span>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default DiffViewer;
