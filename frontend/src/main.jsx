import { createRoot } from 'react-dom/client'
import './index.css'
import { CookiesProvider } from 'react-cookie'
import { RouterProvider, createBrowserRouter  } from 'react-router-dom'
import Main from './container/Main'
import Exam from './container/Exam'
import Favorite from './container/Favorite'

const router = createBrowserRouter([
  
  {path : '/'  , element : <Main />},
  {path : '/exam'  , element : <Exam/>}, /// add cookeis validation
  {path : '/saved-tickets'  , element : <Favorite/>},
  {path : '*'  , element : <Main/>},

])

createRoot(document.getElementById('root')).render(
  <CookiesProvider>

    <RouterProvider router={router} />
  
  </CookiesProvider>
)
