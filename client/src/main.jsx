import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import EmsIndex from './pages/ems-index.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth-context.jsx';
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <EmsIndex />
      </AuthProvider>
  </BrowserRouter>,
)
