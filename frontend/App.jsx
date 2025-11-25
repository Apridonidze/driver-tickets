import { useCookies } from 'react-cookie'
import { Navigate, RouterProvider, createBrowserRouter} from 'react-router-dom';

import Main from '../frontend/src/container/Main'
import Favorite from '../frontend/src/container/Favorite'
import Exam from '../frontend/src/container/Exam'

import '../frontend/src/index.css'



const App = () => {

    const [ cookies ] = useCookies(['token']) ;//cookies
    const hasToken = cookies.token && cookies.token != undefined ; //checks if user has cookies

    const router = createBrowserRouter([
    
        {path : '/'  , element : <Main />},
        {path : '/exam'  , element : hasToken ? <Exam/> : <Navigate to='/' />},
        {path : '/saved-tickets'  , element : hasToken ? <Favorite/> : <Navigate to='/' />},
        {path : '*'  , element : <Main/>},

    ])
    

    return (
        <RouterProvider  router={router}/>
    )
}



export default App