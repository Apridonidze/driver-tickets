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
        <div className="main-container container d-flex flex-column justify-content-between" style={{minHeight : '100vh'}}>
            <div className="title">
                <h1>Driver Tickets</h1>
                <h4>Welcome to Driver Tickets, where you can practice for upcoming theoretical driving exam</h4>
            </div>

            <div className="buttons row row-cols-2">
                <Link to='/exam' className="btn btn-primary">Start Exam</Link>
                <Link to='/saved-tickets' className="btn btn-primary">Saved Tickets</Link>
            </div>

            <div className="footer row border-top border-3 p-2">
                <div className="col border-end p-2">
                    <h5>© 2025 Driver Tickets. All rights reserved.</h5>
                    <h6>This platform is for educational purposes and is not an official government exam.</h6>
                </div>

                <div className="col border-end p-2">
                    <h5>Feedback & Support</h5>
                    <h6>Have suggestions or found an issue?</h6>
                    <h6>Contact : <i class="fa-regular fa-envelope"></i> <a href="mailto:giorgiapridonidze08@gmail.com">giorgiapridonidze08@gmail.com</a></h6>
                </div>

                <div className="col p-2">
                    <h5>Created By Giorgi Aphridonidze.</h5>
                </div>

            </div>

        </div>
    )
}

export default Main