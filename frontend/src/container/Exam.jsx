import axios from 'axios'
import { useEffect } from "react"
import Header from "../component/Header"
import { useState } from 'react'

const Exam = () => {

    const [data ,setData] = useState()
    const [targetId , setTargetId] = useState(0)
    const [ticket , setTicket] = useState()
    const [img , setImg] = useState()
    const [questionAudio, setQuestionAudio] = useState()
    const [explanationAudio, setExplanationAudio] = useState()
    const [answers , setAnswers] = useState()
    const [isLoaded,setIsLoaded] = useState(false)

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


    useEffect(() => {

        const targetTicket = async () => {

            try{

                if(data){

                    setTicket(data[targetId])
                    setImg(data[targetId].Image)
                    setQuestionAudio(data[targetId].QuestionAudio)
                    setAnswers(data[targetId].Answers)
                    setIsLoaded(true)

                }

                return 

            }catch(err){
                console.log(err)
            }

        }

        targetTicket();

    },[data, targetId])

    return(
        <div className="exam-container container">
            <Header />

            <div className="exam-body">
                {isLoaded && 
                    <div className="ticket">
                        <div className="ticket-img">
                            <img src={img}/>
                        </div>
                        <div className="ticket-desc">
                            <h6>{ticket.Description}</h6>
                        </div>
                        <div className="ticket-content"></div>
                        <div className="ticket-answers">
                            {answers.map((answer , answerId) => <button key={answerId}>{answer.Text}</button>)}
                        </div>
                    </div> }
            </div>
            
        </div>
    )
}

export default Exam