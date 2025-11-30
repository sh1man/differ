/**
 * Calculates a word-level diff between two strings.
 * Returns an array of objects representing the diff.
 * Each object has:
 * - type: 'equal' | 'insert' | 'delete' | 'replace'
 * - value: string (the word or words)
 * - oldValue: string (for replace, the original word)
 */
export const calculateDiff = (reference, hypothesis) => {
    const refWords = reference.split(/\s+/);
    const hypWords = hypothesis.split(/\s+/);

    // Simple LCS-based diff implementation for visualization
    // Note: This is a simplified version. For production, we might want a more robust library
    // or rely on the backend if it provided alignment.
    // Since the backend uses jiwer, we can try to mimic its alignment or just use a simple diff.

    // Let's use a simple approach: find LCS
    const matrix = Array(refWords.length + 1).fill(null).map(() => Array(hypWords.length + 1).fill(0));

    for (let i = 1; i <= refWords.length; i++) {
        for (let j = 1; j <= hypWords.length; j++) {
            if (refWords[i - 1] === hypWords[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1] + 1;
            } else {
                matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
            }
        }
    }

    const diff = [];
    let i = refWords.length;
    let j = hypWords.length;

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && refWords[i - 1] === hypWords[j - 1]) {
            diff.unshift({ type: 'equal', value: refWords[i - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
            diff.unshift({ type: 'insert', value: hypWords[j - 1] });
            j--;
        } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
            diff.unshift({ type: 'delete', value: refWords[i - 1] });
            i--;
        }
    }

    // Post-processing to group adjacent inserts/deletes into replacements if possible
    // This is a heuristic to make it look like substitutions
    const refinedDiff = [];
    let k = 0;
    while (k < diff.length) {
        const current = diff[k];
        const next = diff[k + 1];

        if (current.type === 'delete' && next && next.type === 'insert') {
            refinedDiff.push({ type: 'replace', value: next.value, oldValue: current.value });
            k += 2;
        } else if (current.type === 'insert' && next && next.type === 'delete') {
            // This order (insert then delete) usually doesn't happen with the above LCS backtracking 
            // unless we prioritize inserts. But let's handle it just in case or for future robustness.
            refinedDiff.push({ type: 'replace', value: current.value, oldValue: next.value });
            k += 2;
        } else {
            refinedDiff.push(current);
            k++;
        }
    }

    return refinedDiff;
};
