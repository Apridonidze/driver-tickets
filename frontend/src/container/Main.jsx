import axios from "axios";
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie'; //importing react libraries

import { useEffect } from "react"; //importing react hook

import { BACKEND_URL } from "../../config";

const Main = () => {

    const [ cookies , setCookies, removeCookie ] = useCookies(['token']); //cookies

    console.log(BACKEND_URL)
    
    useEffect(() => {

        const handleCookies = () => {

            if(!cookies.token){
                axios.get(`${BACKEND_URL}/cookies`).then(resp => setCookies(['token'] , resp.data.token));
            };

            return;
        }; //checks if user has token , if user has no token function sends request to backend, which generates token for user and sends to frontend , then function saves token as a cookie 

        handleCookies();//declearing function

    },[cookies]);//mounts on this dependencies change

    return(
        <div className="main-container container d-flex flex-column justify-content-between" style={{minHeight : '100vh'}}>
            <div className="title text-center align-items center p-5">
                <h1 className="pb-4"><i class="fa-solid fa-car"></i> Driver Tickets</h1>
                <h4>Welcome to Driver Tickets, where you can practice for upcoming theoretical driving exam.</h4>
                <h5 className="pt-3">This platform is voice-assisted — all tickets, answers, and explanations are read aloud so you can learn by listening or read along.</h5>
            </div>

            <div className="buttons row row-cols-1 gap-3 d-flex flex-column align-items-center my-5">
                <Link to='/exam' className="btn btn-primary fs-3 w-50 border border-3">Start Exam</Link>
                <Link to='/saved-tickets' className="btn btn-primary fs-3 w-50 border border-3">Saved Tickets</Link>
            </div>

            <div className="footer row border-top border-3 p-2 mt-5">
                <div className="col col-12 col-sm-4 border-end p-2">
                    <h5>© 2025 Driver Tickets. All rights reserved.</h5>
                    <h6>This platform is for educational purposes and is not an official government exam.</h6>
                </div>

                <div className="col col-12 col-sm-4 border-end pt-1">
                    <h5>Feedback & Support</h5>
                    <h6>Have suggestions or found an issue?</h6>
                    <h6>Contact : <i class="fa-regular fa-envelope"></i> <a href="mailto:giorgiapridonidze08@gmail.com">giorgiapridonidze08@gmail.com</a></h6>
                </div>

                <div className="col p-2">
                    <h5>Created By Giorgi Aphridonidze.</h5>
                </div>

            </div>

        </div>
    );
};


document.title = 'Driver Tickets'; //adding title to page

export default Main; //exporting component