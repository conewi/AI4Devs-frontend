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
        
        // Process the direct array response (not wrapped in a 'value' property)
        if (Array.isArray(response.data)) {
            return response.data.map(candidate => ({
                id: candidate.id?.toString() || String(Math.random()),
                name: candidate.fullName,
                email: candidate.applicationId ? `Application ID: ${candidate.applicationId}` : "",
                // Store the currentInterviewStep as the currentStep
                currentStep: candidate.currentInterviewStep
            }));
        }
        return []; // Return empty array as fallback
    } catch (error) {
        console.error("Error fetching candidates:", error);
        throw new Error(`Error fetching candidates: ${error.message}`);
    }
};
