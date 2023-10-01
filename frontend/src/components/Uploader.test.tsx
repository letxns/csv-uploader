import { render, screen, fireEvent } from '@testing-library/react';
import { Uploader } from './Uploader'; 
import '@testing-library/jest-dom'

test('renders upload button', () => {
  render(<Uploader />);
  const uploadButton = screen.getByText('Upload file');
  expect(uploadButton).toBeInTheDocument();
});

test('displays an error message for invalid file type', () => {
    render(<Uploader />);
    const fileInput = screen.getByLabelText('Upload file');
  
    // Simule o carregamento de um arquivo inválido
    const file = new File(['file content'], 'file.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    const errorMessage = screen.getByText('Please upload a .csv file');
    expect(errorMessage).toBeInTheDocument();
  });
  