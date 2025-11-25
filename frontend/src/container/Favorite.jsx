import Header from "../component/Header";
import { useEffect, useRef, useState } from "react";

import { useCookies } from "react-cookie";

import axios from "axios";

const Favorite = () => {


    const [cookies] = useCookies(['token'])

    const [saved,setSaved] = useState()
    const [targetId , setTargetId] = useState(0)
    const [ticket , setTicket] = useState()
    const [img , setImg] = useState()
    const [explanationAudio , setExplanationAudio] = useState()
    const [questionAudio , setQuestionAudio] = useState()
    const [isAnswered, setIsAnswered] = useState([])
    const [answers ,setAnswers] = useState([])

    const [answeredTicket , setAnsweredTicket] = useState([])
    const [correct, setCorrect] = useState(0)
    const [incorrect, setIncorrect] = useState(0)
    const [count , setCount] = useState(0)

    const [isLoaded,setIsLoaded] = useState(false)

    const btnRef = useRef([])
    const collapseRef = useRef(null)
    const explanationAudioRef = useRef(null)
    const questionAudioRef  = useRef(null)
    const [toggleDescAudio , setToggleDescAudio] = useState(false)

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

            if(saved && saved.length !== 0){
                setTicket(saved[targetId]) 
                setImg(saved[targetId].Image.slice(saved[targetId].Image.length - 4 , saved[targetId].Image.length) == '.jpg' ? saved[targetId].Image : false)
                setQuestionAudio(saved[targetId].QuestionAudio)
                setExplanationAudio(saved[targetId].DescriptionAudio)
                setAnswers(saved[targetId].Answers)
                setIsAnswered(answeredTicket ? answeredTicket.filter(ans => ans.ticketId === targetId) : null) 
                setCount(saved.length)
                setIsLoaded(true)
            } // add else statement to handle saved data list that is empty array []

            else {
                setTicket(null) 
                setImg(null)
                setQuestionAudio(null)
                setExplanationAudio(null)
                setAnswers(null)
                setIsAnswered(null) 
                setIsLoaded(null)
            }
            
            
        }

        targetTicket()

    },[targetId ,saved])


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

                
            setTimeout(() => {
                if(btnRef && btnRef.current && collapseRef && collapseRef.current){
                    
                    setTargetId(prev => prev + 1 > saved.length - 1 ? saved.length - 1 : prev + 1)

                    if(targetId + 1 === saved.length) return 

                    btnRef.current.filter(btn => btn !== null).forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'))
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
                setTargetId(prev => prev + 1 > saved.length - 1 ? saved.length - 1 : prev + 1)
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
        
        const handleUnsave = async(id) => {

            try{
                console.log(id)

                await axios.delete(`http://localhost:8080/saved/delete-saved-tickets/${id}` , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => {console.log(resp) ; setSaved(saved.filter(s => s.Id !== id))}) 

            }catch(err){
                console.log(err)
            }

        }


    const handleReset = async () => {

        

    }

    useEffect(() => {

        if(collapseRef && collapseRef.current){
            toggleDescAudio ? (collapseRef.current.classList.remove('collapse')) : collapseRef.current.classList.add('collapse')

        }

        return

    },[toggleDescAudio])


    
    
    
    return(
        <div className="favorite-container container d-flex flex-column justify-content-between" style={{minHeight: '100vh'}}>
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

                <div className="buttons-start col col-8 d-flex align-items-center fs-4">

                    <i class="fa-solid fa-bookmark" onClick={() => handleUnsave(ticket.Id)} style={{cursor :'pointer'}}></i> 
                    
                    <button onClick={handleReset} className='btn'><i class="fa-solid fa-arrow-rotate-right"></i></button>
                    
                    <button type="button" className='btn btn-primary fs-6' onClick={() => setToggleDescAudio(prev => !prev)} ><i class="fa-solid fa-exclamation"></i> განმარტება</button> 

                </div>
                
                <div className="buttons-end col col-4 d-flex align-items-center justify-content-end">
                        
                    <button className='btn' onClick={() => handleAnswerButton('-')}><i class="fa-solid fa-arrow-left"></i></button>
                    <button className='btn' onClick={() => handleAnswerButton('+')}><i class="fa-solid fa-arrow-right"></i></button>

                </div>

            </div>
        </div>
    )    
}

export default Favorite;