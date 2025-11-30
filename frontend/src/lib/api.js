import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const compareTexts = async (referenceText, hypothesisText) => {
    try {
        const response = await api.post('/compare', {
            reference_text: referenceText,
            hypothesis_text: hypothesisText,
        });
        return response.data;
    } catch (error) {
        console.error('Error comparing texts:', error);
        throw error;
    }
};
