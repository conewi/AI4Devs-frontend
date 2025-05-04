import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { getInterviewFlow, getPositionCandidates } from '../services/positionService';
import './PositionInterviewFlow.css'; // Add this import

type InterviewStep = {
  id: string;
  name: string;
  order: number;
};

type Candidate = {
  id: string;
  name: string;
  email: string;
  currentStep: string; // ID of the current interview step
};

const PositionInterviewFlow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interviewFlow, setInterviewFlow] = useState<InterviewStep[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both interview flow and candidates in parallel
        const [flowData, candidatesData] = await Promise.all([
          getInterviewFlow(id),
          getPositionCandidates(id)
        ]);
        
        setInterviewFlow(flowData);
        setCandidates(candidatesData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Interview Flow</h2>
      
      <div className="kanban-board">
        {Array.isArray(interviewFlow) && interviewFlow.length > 0 ? (
          interviewFlow.sort((a, b) => a.order - b.order).map((step) => {
            // Filter candidates in this step
            const stepCandidates = candidates.filter(
              (candidate) => candidate.currentStep === step.id
            );
            
            return (
              <div key={step.id} className="kanban-column">
                <Card className="h-100"> {/* Use full height */}
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">{step.name}</h5>
                    <span className="badge bg-light text-dark">
                      {stepCandidates.length} candidates
                    </span>
                  </Card.Header>
                  <Card.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {stepCandidates.length === 0 ? (
                      <p className="text-muted">No candidates in this step</p>
                    ) : (
                      <div className="candidate-list">
                        {stepCandidates.map((candidate) => (
                          <Card key={candidate.id} className="candidate-card mb-2">
                            <Card.Body>
                              <Card.Title>{candidate.name}</Card.Title>
                              <Card.Text>{candidate.email}</Card.Text>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            );
          })
        ) : (
          <Alert variant="warning">No interview steps found</Alert>
        )}
      </div>
    </Container>
  );
};

export default PositionInterviewFlow; 