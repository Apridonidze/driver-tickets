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
                setTargetId(prev => prev + 1 > data.length - 1 ? data.length - 1 : prev + 1)
              btnRef.current.filter(btn => btn !== null).forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'))
                   
        }else {
            //add prev page
            setToggleDescAudio(false)
            setTargetId(prev => prev - 1 < 0 ? 0 : prev - 1)
            btnRef.current.filter(btn => btn !== null).forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'))
                   
        }
        }else {
            return
        }
    } //refactor


        
        const handleSave = async(data) => {

            try{

                await axios.post('http://localhost:8080/saved/post-saved-tickets' , {data} , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => {console.log(resp) ; setIsSaved(true)})

            }catch(err){
                console.log(err)
            }

            
        }

        const handleUnsave = async(id) => {

            try{

                await axios.delete(`http://localhost:8080/saved/delete-saved-tickets/${id}` , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => {console.log(resp) ; setIsSaved(false)})

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
        <div className="exam-container container d-flex flex-column justify-content-between" style={{minHeight: '100vh'}}>
            <Header />

            

            <div className="exam-body" >
                
                <div className="exam-count row mb-2">

                    <div className="count-start col d-flex">
                        <span className='fs-5'><b className='text-success'>{correct}</b> / <b className='text-danger'>{incorrect}</b></span>
                    </div>

                    <div className="count-end col d-flex justify-content-end">
                        <span className='text-primary fs-5'><b>{targetId}</b> / <b>{count}</b></span>
                    </div>
                
                </div>
                
                {isLoaded ? 
                    <div className="ticket">

                        <div className="ticket-img">
                            {img === false ? <></> : <img src={img} className='w-100'/>}
                        </div>

                        <div className="ticket-desc my-3">

                            <div className="desc-top">
                                <span><button type="button" className='btn btn-primary fs-6' onClick={() => setToggleDescAudio(prev => !prev)} >!</button> განმარტება</span>
                            </div>

                            <div class="collapse my-3" ref={collapseRef}>
                                
                                <h6>{ticket.Description}</h6>
                                <audio ref={explanationAudioRef} src={explanationAudio}></audio>
                            
                            </div>

                        </div>
                        
                        <div className="ticket-content">
                            <h5 className='text-break'>{ticket.Question}</h5>
                            <audio ref={questionAudioRef} src={questionAudio} />
                        </div>

                        <div className="ticket-answers  row my-2 gap-1 mx-auto justify-content-center">
                            {isAnswered.length === 0 ? 
                            answers.map((answer , answerId) => <button className='btn py-2 btn-primary col col-12 col-sm-5 text-break m-2' key={answerId} ref={ref => btnRef.current[answerId] = ref} onClick={() => handleAnswers({IsCorrect : answer.IsCorrect , answerId : answerId})}>{answer.Text}</button>) 
                            : answers.map((answer , answerId) => <button className='btn py-2 btn-primary col col-12 col-sm-5 text-break' key={answerId} ref={ref => btnRef.current[answerId] = ref} >{answer.Text}</button>)}
                        </div>

                    </div> : <></>}

            </div>

            <div className="buttons row border-top border-3 p-2">

                <div className="buttons-start col d-flex align-items-center fs-4">

                    {isSaved ? <i class="fa-solid fa-bookmark" onClick={() => handleUnsave(ticket.Id)} style={{cursor :'pointer'}}></i> : 
                     <i class="fa-regular fa-bookmark" onClick={() => handleSave(ticket.Id)} style={{cursor :'pointer'}}> </i>}
                    
                    <button onClick={handleReset} className='btn'><i class="fa-solid fa-arrow-rotate-right"></i></button>
                </div>
                
                <div className="buttons-end col d-flex align-items-center justify-content-end">
                        
                    <button className='btn' onClick={() => handleAnswerButton('-')}><i class="fa-solid fa-arrow-left"></i></button>
                    <button className='btn' onClick={() => handleAnswerButton('+')}><i class="fa-solid fa-arrow-right"></i></button>

                </div>

            </div>
            
        </div>
    )
}

export default Exam