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
    const [incorrect, setInorrect] = useState(0)
    const [count , setCount] = useState(0)

    const [isLoaded,setIsLoaded] = useState(false)

    const btnRef = useRef(null)
    const collapseRef = useRef(null)
    const explanationAudioRef = useRef(null)
    const questionAudioRef  = useRef(null)

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
                setQuestionAudio(saved[targetId].QuestionAudio)
                setExplanationAudio(saved[targetId].DescriptionAudio)
                setAnswers(saved[targetId].Answers)
                setIsAnswered(answeredTicket ? answeredTicket.filter(ans => ans.ticketId === targetId) : null) 
                setIsLoaded(true)
            }
            
            
        }

        targetTicket()

    },[targetId , saved])

    
    //create unsave async function 
    //create answer handling function 
    //create next ticketId generation function
    //create btn styling remove function
    //create collapse function
    //create audio handling functions
    //create reset function
    //create isanswered function (do not relate to database)

    return(
        <div className="favorite-container">
            <Header />
            <div className="saved-container">
                {isLoaded ? <div className="ticket">
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
                            answers.map((answer , answerId) => <button className='btn btn-primary' key={answerId} ref={ref => btnRef.current[answerId] = ref}>{answerId} {answer.Text}</button>) /**add onclick function to answer question */
                            : answers.map((answer , answerId) => <button className='btn btn-primary' key={answerId} ref={ref => btnRef.current[answerId] = ref} >{answerId} {answer.Text}</button>)}
                        </div>
                    </div> : <></>}
            </div>
        </div>
    )    
}

export default Favorite;