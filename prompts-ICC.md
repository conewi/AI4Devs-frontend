# Prompt 1 (Cursor Claude Sonnet 3.7 thinking) ASK mode
Detail all the steps to implement the following statements:
Create a new page to see for each position, the current interview flow.
1. Use the endpoint GET /positions/:id/interviewFlow to retrieve all information about the interview process from a certain position.
2. Use a Kanban style to display the interview flow. 
3. Each step of the interview flow should be a card that contains all candidates in this step.
  - Use the endpoint GET /positions/:id/candidates to retrieve all candidates in a certain position.
4. Make this page accessible through the url route {baseUrl}/position/id

Ask me if you have questions about this implementation.