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
    const [isSaved , setIsSaved] = useState()
    const [isLoaded,setIsLoaded] = useState(false)

    const explanationAudioRef = useRef(null)
    const questionAudioRef = useRef(null)
    const collapseRef = useRef(null)
    const btnRef = useRef([])

    const [count ,setCount] = useState(0)
    const [correct , setCorrect] = useState(0)
    const [incorrect , setIncorrect] = useState(0)

    const [answeredTicket , setAnsweredTicket] = useState([])
    const [isAnswered , setIsAnswered] = useState(null)

    const [toggleDescAudio , setToggleDescAudio] = useState(false)


      useEffect(() => {
        const fetchAnswered = async () => {

            try{

                await axios.get('http://localhost:8080/tickets/answered-tickets' , {headers : {Authorization  : `Bearer ${cookies.token}`}})
                .then(resp => {
                    const data = resp.data

                    setAnsweredTicket(data)
                    setTargetId(data.length === 0 ? 0 : data[data.length - 1].ticketId + 2) 
                    setCorrect(data.filter(ticket => ticket.answerId === ticket.correctId).length)
                    setIncorrect(data.filter(ticket => ticket.answerId !== ticket.correctId).length)
                    
                })

            }catch(err){
                console.log('err')
            }

        }

        fetchAnswered()

    },[])



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
                    setExplanationAudio(data[targetId].DescriptionAudio)
                    setAnswers(data[targetId].Answers)
                    setIsAnswered(answeredTicket ? answeredTicket.filter(ans => ans.ticketId === targetId) : null) 
                    setIsLoaded(true)

                } 


                return 

        }

        targetTicket();

    },[targetId , data])

  


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

    const handleAnswers = async (answer) => {

        
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

             let answeredTicketLast = answeredTicket[answeredTicket.length - 1]

                if(answeredTicketLast){
                    try{
               
                    
                    await axios.post('http://localhost:8080/tickets/post-answered-tickets' , {answeredTicketLast} , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => console.log(resp))

                }catch(err){
                console.log('internal error')
            }
                }

            setTimeout(() => {
                if(btnRef && btnRef.current && collapseRef && collapseRef.current){
                    
                    btnRef.current.filter(btn => btn !== null).forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'))
                    setTargetId(prev => prev + 1)
                    setToggleDescAudio(false)

                } else return
            }, 1000)
            
        }
    }



    useEffect(() => {

        if(btnRef && btnRef.current){
        
             if(isAnswered && isAnswered.length !== 0){
                const ticket = isAnswered[0]

                if(ticket.answerId === ticket.correctId){
                    btnRef.current[ticket.correctId].classList.add('btn-success')
                }else {
                    btnRef.current[ticket.correctId].classList.add('btn-success')
                    btnRef.current[ticket.answerId].classList.add('btn-danger')
                }
            
            }else return
            
        }
    },[isAnswered])

    
    const handleAnswerButton = (d) => {
        if(btnRef && btnRef.current){
               if(d === '+'){
                setToggleDescAudio(false)
                setTargetId(prev => prev + 1)
              btnRef.current.filter(btn => btn !== null).forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'))
                   
        }else {
            //add prev page
            setToggleDescAudio(false)
            setTargetId(prev => prev - 1)

            btnRef.current.filter(btn => btn !== null).forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'))
                   
        }
        }else {
            return
        }
    } //refactor


        
        const handleSave = async(data) => {

            try{

                await axios.post('http://localhost:8080/saved/post-saved-tickets' , {data} , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => setIsSaved(true))

            }catch(err){
                console.log(err)
            }

            
        }

        const handleUnsave = async(id) => {

            try{

                await axios.delete(`http://localhost:8080/saved/delete-saved-tickets/${id}` , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => setIsSaved(false))

            }catch(err){
                console.log(err)
            }

        }


    const handleReset = async () => {

        try{

            await axios.delete('http://localhost:8080/tickets/delete-answered-tickets' , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => window.location.reload())

        }catch(err){
            console.log(err)
        }

    }

    useEffect(() => {

        if(collapseRef && collapseRef.current){
            toggleDescAudio ? (collapseRef.current.classList.remove('collapse')) : collapseRef.current.classList.add('collapse')

        }

        return

    },[toggleDescAudio])


    useEffect(() => {

        const fetchIsSaved = async () => {

            try{

                await axios.get(`http://localhost:8080/saved/saved-tickets/${targetId + 1}` , {headers : {Authorization  : `Bearer ${cookies.token}`}}).then(resp => setIsSaved(resp.data))

            }catch(err){
                console.log(err)
            }

        }

        fetchIsSaved()

    },[isSaved , targetId])


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
                
                {isLoaded ? 
                    <div className="ticket">
                        <div className="ticket-img">
                            {img === false ? <></> : <img src={img}/>}
                        </div>
                        <div className="ticket-desc ">
                            <div className="desc-top">
                                <button type="button" onClick={() => setToggleDescAudio(prev => !prev)} >collapse</button>
                            </div>
                            <div class="collapse" ref={collapseRef}>
                                
                                <h6>{ticket.Description}</h6>
                                <audio ref={explanationAudioRef} src={explanationAudio}></audio>
                            
                            </div>
                        </div>
                        <div className="ticket-content">
                            <h5>{ticket.Question}</h5>
                            <audio ref={questionAudioRef} src={questionAudio} />
                        </div>
                        <div className="ticket-answers">
                            {isAnswered.length === 0 ? 
                            answers.map((answer , answerId) => <button className='btn btn-primary' key={answerId} ref={ref => btnRef.current[answerId] = ref} onClick={() => handleAnswers({IsCorrect : answer.IsCorrect , answerId : answerId})}>{answerId} {answer.Text}</button>) 
                            : answers.map((answer , answerId) => <button className='btn btn-primary' key={answerId} ref={ref => btnRef.current[answerId] = ref} >{answerId} {answer.Text}</button>)}
                        </div>
                    </div> : <></>}
            </div>

            <div className="buttons row">
                <div className="buttons-start col">
                    {isSaved ? <button onClick={() => handleUnsave(ticket.Id)}>Save</button> : 
                    <button onClick={() => handleSave(ticket.Id)}>Save</button>}
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