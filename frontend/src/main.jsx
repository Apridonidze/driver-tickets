import { createRoot } from 'react-dom/client'
import './index.css'
import { CookiesProvider } from 'react-cookie'
import { RouterProvider, createBrowserRouter  } from 'react-router-dom'
import Main from './container/Main'

const router = createBrowserRouter([
  {path : '/'  , element : <Main />},

])

createRoot(document.getElementById('root')).render(
  <CookiesProvider>

    <RouterProvider router={router}>
    
    
    </RouterProvider>
  
  </CookiesProvider>
)
