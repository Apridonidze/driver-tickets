import axios from 'axios'
import { useEffect } from "react"
import Header from "../component/Header"
import { useState } from 'react'

const Exam = () => {

    const [data ,setData] = useState()

    useEffect(() => {

        const  fetchExams = async () => {

            try{

                axios.get('http://localhost:8080/data').then(resp => setData(resp.data))

            }catch(err){
                console.log(err)
            }

        }

        fetchExams();

    },[])

    console.log(data && data)
    const audio = data?.[0]?.QuestionAudio;
    const img = data?.[0]?.Image;


    return(
        <div className="exam-container container">
            <Header />
            exam
            {img && <img src={img} />}
            {audio && <audio controls><source src={audio} type='audio/mpeg' /></audio>}
        </div>
    )
}

export default Exam