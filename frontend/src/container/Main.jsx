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
                return
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
                <Link to='/favorites' className="btn btn-primary">Saved Tickets</Link>
            </div>

        </div>
    )
}

export default Main