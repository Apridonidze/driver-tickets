import axios from 'axios'
import { useEffect, useRef } from "react"
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


    const questionAudioRef = useRef(null)

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

        const targetTicket =  () => {


                if(data){

                    setTicket(data[targetId])
                    setImg(data[targetId].Image.slice(data[targetId].Image.length - 4 , data[targetId].Image.length) == '.jpg' ? data[targetId].Image : false)
                    setQuestionAudio(data[targetId].QuestionAudio)
                    setAnswers(data[targetId].Answers)
                    setIsLoaded(true)

                }

                return 

        }

        targetTicket();

    },[data, targetId])

    
    useEffect(() => {

        if(questionAudioRef && questionAudioRef.current){
            questionAudioRef.current.play()
        }

    },[questionAudio , questionAudioRef])

    
    return(
        <div className="exam-container container">
            <Header />

            <div className="exam-body">
                {isLoaded && 
                    <div className="ticket">
                        <div className="ticket-img">
                            {img === false ? <></> : <img src={img}/>}
                        </div>
                        <div className="ticket-desc">
                            <h6>{ticket.Description}</h6>
                        </div>
                        <div className="ticket-content">
                            <audio ref={questionAudioRef} src={questionAudio} />
                        </div>
                        <div className="ticket-answers">
                            {answers.map((answer , answerId) => <button key={answerId}>{answer.Text}</button>)}
                        </div>
                    </div> }
            </div>

            <div className="buttons row">
                <div className="buttons-start col">
                    <button>Save</button>
                </div>
                
                <div className="buttons-end col">
                        
                    <button onClick={() => setTargetId(prev => (prev - 1  < 0  ? prev : prev - 1))}>Prev</button>
                    <button onClick={() => setTargetId(prev => (prev + 1 > data.length - 1 ? prev : prev + 1))}>Next</button>

                </div>
            </div>
            
        </div>
    )
}

export default Exam