import Header from "../component/Header";
import { useEffect, useState } from "react";

import { useCookies } from "react-cookie";

import axios from "axios";
import { useResolvedPath } from "react-router-dom";

const Favorite = () => {


    const [cookies] = useCookies(['token'])

    const [saved,setSaved] = useState()
    const [targetId , setTargetId] = useState(0)
    const [ticket , setTicket] = useState()
    const [img , setImg] = useState()

    const [correct, setCorrect] = useState(0)
    const [incorrect, setInorrect] = useState(0)
    const [count , setCount] = useState(0)

    const [isLoaded,setIsLoaded] = useState(false)

    useEffect(() => {
        const fetchAnswered = async () => {

            try{

                await axios.get('http://localhost:8080/saved/saved-tickets' , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => console.log(resp))

                

            }catch(err){
                console.log(err)
            }

        }

        fetchAnswered()

    },[])

    useEffect(() => {

        const targetTicket = async() => {

            if(saved){

                setTicket(saved[targetId])
                setImg(saved[targetId].Image.slice(data[targetId].Image.length - 4 , saved[targetId].Image.length) == '.jpg' ? saved[targetId].Image : false)

            }

        }

        targetTicket()

    },[targetId , saved])

    console.log(img)



    return(
        <div className="favorite-container">
            <Header />
            <div className="saved-container">
                {isLoaded && <div className="ticket">
                    <div className="ticket-img">

                    </div>
                    <div className="ticket-desc"></div>
                    <div className="ticket-title"></div>
                    <div className="ticket-buttons"></div>
                    <div className="ticket-footer-buttons"></div>
                </div> }
            </div>
        </div>
    )    
}

export default Favorite;