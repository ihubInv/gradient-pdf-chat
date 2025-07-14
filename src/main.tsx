import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './services/mockApi' // Initialize mock API for development

createRoot(document.getElementById("root")!).render(<App />);
