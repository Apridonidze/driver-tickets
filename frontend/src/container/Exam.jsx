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
    const [saved,setSaved] = useState([])

    const questionAudioRef = useRef(null)
    const btnRef = useRef([])

    const [count ,setCount] = useState(0)
    const [correct , setCorrect] = useState(0)
    const [incorrect , setIncorrect] = useState(0)

    const [answeredTicket , setAnsweredTicket] = useState([])
    const [isAnswered , setIsAnswered] = useState(null)

    useEffect(() => {

        const  fetchExams = async () => {

            try{

                axios.get('http://localhost:8080/data').then(resp => {setData(resp.data), setCount(resp.data.length), console.log(resp)})

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
                    setAnswers(data[targetId].Answers) //send to db to save
                    setIsAnswered(answeredTicket.filter(ans => ans.ticketId === targetId)) //after fetcihn answers filters it and set in state
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


    const handleAnswers = (answer) => {

        
        if(btnRef && btnRef.current){

             const correctIndex = answers.findIndex(a => a.IsCorrect);

            if(answer.IsCorrect){

                setCorrect(prev => prev + 1) ;
                btnRef.current[answer.answerId].classList.add('btn-success') ;
                setAnsweredTicket(prev => [...prev , {ticketId : targetId , answerId :  answer.answerId , correctId: correctIndex}])

            }else {
                setIncorrect(prev => prev + 1) ;
                btnRef.current[answer.answerId].classList.add('btn-danger') ;
                btnRef.current[correctIndex].classList.add('btn-success')
                setAnsweredTicket(prev => [...prev , {ticketId : targetId , answerId :  answer.answerId , correctId: correctIndex}])
            }

            setTimeout(() => {
                setTargetId(prev => prev + 1)
                btnRef.current.forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'))
            }, 1000)
            
        }
    }

    useEffect(() => {
        if(isAnswered && isAnswered[0]){  //get from database isAnswered variable
            if(btnRef && btnRef.current){
                
                if(isAnswered[0].correctId === isAnswered[0].answerId){
                    
                    btnRef.current[isAnswered[0].correctId].classList.add('btn-success')
                }else {
                    btnRef.current[isAnswered[0].answerId].classList.add('btn-danger')
                    btnRef.current[isAnswered[0].correctId].classList.add('btn-success')
                }

            }
        }else {
            return
        }
    },[isAnswered])

    const handleAnswerButton = (d) => {
        if(btnRef && btnRef.current){
               if(d === '+'){
            setTargetId(prev => (prev + 1 > data.length - 1 ? prev : prev + 1))
            btnRef.current.forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'))
        }else {

            setTargetId(prev => (prev - 1  < 0  ? prev : prev - 1))
            btnRef.current.forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'))
        }
        }else {
            return
        }
    } //refactor


    console.log(saved)

    
    return(
        <div className="exam-container container">
            <Header />

            <div className="exam-body">
                {correct}
                {incorrect}
                <h1>reset</h1>
                {isLoaded && 
                    <div className="ticket">
                        <div className="ticket-img">
                            {img === false ? <></> : <img src={img}/>}
                        </div>
                        <div className="ticket-desc ">
                            <h6>{ticket.Description}</h6>
                        </div>
                        <div className="ticket-content">
                            <h5>{ticket.Question}</h5>
                            <audio ref={questionAudioRef} src={questionAudio} />
                        </div>
                        <div className="ticket-answers">
                            {isAnswered && !isAnswered[0]? 
                            answers.map((answer , answerId) => <button className='btn btn-primary' key={answerId} ref={ref => btnRef.current[answerId] = ref} onClick={() => handleAnswers({IsCorrect : answer.IsCorrect , answerId : answerId})}>{answerId} {answer.Text}</button>) 
                            : answers.map((answer , answerId) => <button className='btn btn-primary' key={answerId} ref={ref => btnRef.current[answerId] = ref} >{answerId} {answer.Text}</button>)}
                        </div>
                    </div> }
            </div>

            <div className="buttons row">
                <div className="buttons-start col">
                    <button onClick={() => setSaved(prev => [...prev, {id : targetId}])}>Save</button>
                </div>
                
                <div className="buttons-end col">
                        
                    <button onClick={() => handleAnswerButton('-')}>Prev</button>
                    <button onClick={() => handleAnswerButton('+')}>Next</button>

                </div>
            </div>
            
        </div>
    )
}

export default Exam