import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

// Mock axios to avoid actual API calls during tests
jest.mock('axios');

test('should submit form data', async () => {
  // Mock the axios.post method to resolve with a mock response
  axios.post.mockResolvedValue({ data: { success: true, message: "Employee added successfully" } });
  
  render(<App />);
  
  // Fill out the form (this is a simplified example)
  fireEvent.change(screen.getByLabelText(/employee id/i), { target: { value: '123' } });
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
  
  // Submit the form
  fireEvent.click(screen.getByText(/submit/i));
  
  // Wait for the success message to appear
  await waitFor(() => screen.getByText(/employee added successfully/i));
  
  // Verify that the success message is in the document
  expect(screen.getByText(/employee added successfully/i)).toBeInTheDocument();
});


