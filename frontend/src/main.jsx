import { createRoot } from 'react-dom/client'
import './index.css'
import { CookiesProvider } from 'react-cookie'
import { RouterProvider, createBrowserRouter  } from 'react-router-dom'
import App from './App'

const router = createBrowserRouter([
  {path : '/'  , element : <App />}
])

createRoot(document.getElementById('root')).render(
  <CookiesProvider>

    <RouterProvider router={router}>
    
    
    </RouterProvider>
  
  </CookiesProvider>
)
