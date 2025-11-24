import Header from "../component/Header";
import { useEffect, useState } from "react";

import { useCookies } from "react-cookie";

import axios from "axios";

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
        const fetchSaved = async () => {

            try{

                await axios.get('http://localhost:8080/saved/saved-tickets' , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => setSaved(resp.data))


            }catch(err){
                console.log(err)
            }

        }

        fetchSaved()

    },[])


    useEffect(() => {
        
        const targetTicket = () => {

            if(saved){
                setTicket(saved[targetId])
                setImg(saved[targetId].Image.slice(saved[targetId].Image.length - 4 , saved[targetId].Image.length) == '.jpg' ? saved[targetId].Image : false)
                setIsLoaded(true)
            }
            
            
        }

        targetTicket()

    },[targetId , saved])

    



    return(
        <div className="favorite-container">
            <Header />
            <div className="saved-container">
                {isLoaded && <div className="ticket">
                    <div className="ticket-img">
                        {img ? <img src={img} /> : <h1>img</h1>}
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