import { Link } from "react-router-dom"

import { useCookies } from 'react-cookie'
import { useEffect } from "react"
import axios from "axios"


const Main = () => {

    const [cookies,setCookies] = useCookies(['token'])

    useEffect(() => {

        const handleCookies = () => {

            if(!cookies.token){
                axios.get('http://localhost:8080/cookies').then(resp => setCookies(['token'] , resp.data.token))
            }else {
                return //else validate token , if token is not provided clear setCookies state and useEffect will automatically handle user who does not  have token by gettin ne wone from above request
            }

        }

        handleCookies()

    },[cookies])



    return(
        <div className="main-container">
            <div className="title">
                <h1>Driver Tickets</h1>
            </div>

            <div className="buttons row row-cols-2">
                <Link to='/exam' className="btn btn-primary">Start Exam</Link>
                <Link to='/saved-tickets' className="btn btn-primary">Saved Tickets</Link>
            </div>

        </div>
    )
}

export default Main