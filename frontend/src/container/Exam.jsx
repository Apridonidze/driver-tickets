import axios from 'axios'
import { useEffect, useRef } from "react"
import Header from "../component/Header"
import { useState } from 'react'

import { useCookies } from 'react-cookie'

const Exam = () => {

    const [cookies] = useCookies(['token'])

    const [data ,setData] = useState()
    const [targetId , setTargetId] = useState(0)
    const [ticket , setTicket] = useState()
    const [img , setImg] = useState()
    const [questionAudio, setQuestionAudio] = useState()
    const [explanationAudio, setExplanationAudio] = useState()
    const [answers , setAnswers] = useState()
    const [isLoaded,setIsLoaded] = useState(false)
    const [saved,setSaved] = useState([])

    const explanationAudioRef = useRef(null)
    const questionAudioRef = useRef(null)
    const btnRef = useRef([])

    const [count ,setCount] = useState(0)
    const [correct , setCorrect] = useState(0)
    const [incorrect , setIncorrect] = useState(0)

    const [answeredTicket , setAnsweredTicket] = useState([])
    const [isAnswered , setIsAnswered] = useState(null)

    const [toggleDescAudio , setToggleDescAudio] = useState(false)

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

                    setTicket(data[targetId]) //get last answered question from db and set into state || if there is not any data in db then set to 0
                    setImg(data[targetId].Image.slice(data[targetId].Image.length - 4 , data[targetId].Image.length) == '.jpg' ? data[targetId].Image : false)
                    setQuestionAudio(data[targetId].QuestionAudio)
                    setExplanationAudio(data[targetId].DescriptionAudio)
                    setAnswers(data[targetId].Answers) //send to db to save
                    setIsAnswered(answeredTicket ? answeredTicket.filter(ans => ans.ticketId === targetId) : null) //after fetcihn answers filters it and set in state
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

    useEffect(() => {

        if(explanationAudioRef && explanationAudioRef.current && questionAudioRef && questionAudioRef.current){
            
            if(toggleDescAudio){

               questionAudioRef.current.pause()
                explanationAudioRef.current.play()
            }else {
                questionAudioRef.current.play()
                explanationAudioRef.current.pause()
        }

        }        return

    },[toggleDescAudio , explanationAudioRef , questionAudioRef])

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
                if(btnRef && btnRef.current){

                    setTargetId(prev => prev + 1)
                    btnRef.current.forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'))
                    
                    setToggleDescAudio(false)
                } else return
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
            setToggleDescAudio(false)
            btnRef.current.forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'))
        }else {

            setTargetId(prev => (prev - 1  < 0  ? prev : prev - 1))
            setToggleDescAudio(false)
            btnRef.current.forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'))
        }
        }else {
            return
        }
    } //refactor


    useEffect(() => {
        
    console.log(saved) //send saved to database
    },[saved])

    useEffect(() => {

        const postAnsweredTickets = async () => {
            
            try{
                console.log(answeredTicket)
                await axios.post('http://localhost:8080/tickets/post-answered-tickets' , {answeredTicket} , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => console.log(resp))

            }catch(err){
                console.log('internal error')
            }
        }

        postAnsweredTickets()

    },[answeredTicket])


    const handleReset = () => {
        setCorrect(0)
        setIncorrect(0)
        setTargetId(0)
        setAnsweredTicket()
        setIsAnswered() //send delete request to server to reset all stats
    }
    
    return(
        <div className="exam-container container">
            <Header />

            <div className="exam-count">
                <div className="count-start">
                    <h5>{correct}</h5>
                    <h5>{incorrect}</h5>
                </div>
                <div className="count-end">
                    <h5>{count}</h5>
                    <h5 onClick={handleReset}>reset</h5>
                </div>
                
            </div>

            <div className="exam-body">
                
                {isLoaded && 
                    <div className="ticket">
                        <div className="ticket-img">
                            {img === false ? <></> : <img src={img}/>}
                        </div>
                        <div className="ticket-desc ">
                            <div className="desc-top">
                                <button type="button" data-bs-toggle="collapse" data-bs-target="#collapseId" aria-expanded='false' aria-controls="collapseId" onClick={() => setToggleDescAudio(!toggleDescAudio)}>collapse</button>
                            </div>
                            <div class="collapse" id="collapseId">
                                
                                <h6>{ticket.Description}</h6>
                                <audio ref={explanationAudioRef} src={explanationAudio}></audio>
                            
                            </div>
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