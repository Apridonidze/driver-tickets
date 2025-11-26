import { useCookies } from 'react-cookie';
import { Navigate, RouterProvider, createBrowserRouter} from 'react-router-dom';//importing react libraries


import Main from './src/container/Main';
import Favorite from './src/container/Favorite'; 
import Exam from './src/container/Exam';//importing reawct component

import '../frontend/src/index.css'; //importing css file

const App = () => {

    const [ cookies ] = useCookies(['token']) ;//cookies
    const hasToken = cookies.token && cookies.token != undefined ; //checks if user has cookies

    const router = createBrowserRouter([
    
        {path : '/'  , element : <Main />},
        {path : '/exam'  , element : hasToken ? <Exam/> : <Navigate to='/' />}, //navigates user to main page if they do not have token
        {path : '/saved-tickets'  , element : hasToken ? <Favorite/> : <Navigate to='/' />},//navigates user to main page if they do not have token
        {path : '*'  , element : <Main/>},

    ]); //routes array
    

    return (
        <RouterProvider  router={router}/>
    ); //returning routes for app
};

export default App; //exporting component