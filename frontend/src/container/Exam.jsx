import axios from 'axios'
import { useEffect } from "react"
import Header from "../component/Header"
import { useState } from 'react'

const Exam = () => {

    const [data ,setData] = useState()
    const [ticketId, setTicketId] = useState(0)

    useEffect(() => {

        const  fetchExams = async () => {

            try{

                axios.get('http://localhost:8080/data').then(resp => {setData(resp.data), console.log(resp)})

            }catch(err){
                console.log(err)
            }

        }

        fetchExams();

    },[])

    console.log(data && data)
    const audio = data?.[ticketId]?.QuestionAudio;
    const img = data?.[ticketId]?.Image;


    return(
        <div className="exam-container container">
            <Header />
            exam
            {img && <img src={img} />}
            {audio && <audio controls autoPlay><source src={audio} type='audio/mpeg' /></audio>}
            <button onClick={() => setTicketId(prev => prev + 1)}></button>
        </div>
    )
}

export default Exam