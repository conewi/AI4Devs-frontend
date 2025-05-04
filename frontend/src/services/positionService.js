import axios from 'axios';

// Get interview flow for a position
export const getInterviewFlow = async (positionId) => {
    try {
        const response = await axios.get(`http://localhost:3010/position/${positionId}/interviewflow`);
        
        // Extract the array from the nested structure
        if (response.data?.interviewFlow?.interviewFlow?.interviewSteps) {
            return response.data.interviewFlow.interviewFlow.interviewSteps.map(step => ({
                id: step.id.toString(),
                name: step.name,
                order: step.orderIndex
            }));
        }
        return []; // Return empty array if path doesn't exist
    } catch (error) {
        throw new Error(`Error fetching interview flow: ${error.message}`);
    }
};

// Get candidates for a position
export const getPositionCandidates = async (positionId) => {
    try {
        const response = await axios.get(`http://localhost:3010/position/${positionId}/candidates`);
        
        // Extract candidates array and transform to expected format
        if (response.data?.value && Array.isArray(response.data.value)) {
            return response.data.value.map(candidate => ({
                id: candidate.id.toString(),
                name: candidate.fullName,
                email: candidate.applicationId ? `Application ID: ${candidate.applicationId}` : "",
                currentStep: mapInterviewStepToId(candidate.currentInterviewStep)
            }));
        }
        return []; // Return empty array as fallback
    } catch (error) {
        throw new Error(`Error fetching candidates: ${error.message}`);
    }
}; 
// Helper function to map interview step names to IDs
function mapInterviewStepToId(stepName) {
    const stepMap = {
        'Initial Screening': '1',
        'Technical Interview': '2',
        'Manager Interview': '3'
    };
    
    return stepMap[stepName] || '1'; // Default to first step if unknown
}