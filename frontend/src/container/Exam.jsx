import axios from 'axios';
import { useCookies } from 'react-cookie'; //importing react libraries

import { useEffect, useRef , useState } from "react"; //importing react hooks

import Header from "../component/Header"; //importing react components

import { BACKEND_URL } from '../../config';

const Exam = () => {


    const [cookies] = useCookies(['token']); //cookies 

    const [data ,setData] = useState([]);
    const [targetId , setTargetId] = useState(98);
    const [ticket , setTicket] = useState();
    const [img , setImg] = useState();
    const [answers , setAnswers] = useState();
    const [isSaved , setIsSaved] = useState(); //state for tickets data

    const [questionAudio, setQuestionAudio] = useState();
    const [explanationAudio, setExplanationAudio] = useState();//states for ticket audio data
    
    const [toggleDescAudio , setToggleDescAudio] = useState(false); //toggles explanation audo

    const [isLoaded,setIsLoaded] = useState(false); //state to define if data is fully fetched

    const explanationAudioRef = useRef(null);
    const questionAudioRef = useRef(null);
    const collapseRef = useRef(null);
    const btnRef = useRef([]);//state for component refs

    const [count ,setCount] = useState(0);
    const [correct , setCorrect] = useState(0);
    const [incorrect , setIncorrect] = useState(0); //states for counts

    const [answeredTicket , setAnsweredTicket] = useState([]);
    const [isAnswered , setIsAnswered] = useState(null); //states to check answered tickets

    const [offset, setOffset] = useState(0);
    const LIMIT = 100;


     const fetchAnswered = async () => {

            try{

                await axios.get(`${BACKEND_URL}/answered/answered-tickets` , {headers : {Authorization  : `Bearer ${cookies.token}`}}) //fetches data from api , sends headers to verify token
                .then(resp => {                    
                    const data = resp.data; //defines resp.data

                    setAnsweredTicket(data); //sets data in state
                    setTargetId(data.length === 0 ? 0 : data[data.length - 1].ticketId + 2) ; //gets last answered ticket id and navigates user to this ticket 
                    setCorrect(data.filter(ticket => ticket.answerId === ticket.correctId).length); //gets correct answer count from db
                    setIncorrect(data.filter(ticket => ticket.answerId !== ticket.correctId).length); //gets incorrect answer count from db
                    
                })

            }catch(err){
                console.log('err') ; //consoles error message
            };
        };//function fetches answered tickets from db

    const  fetchExams = async () => {

        try{
            await axios.get(`${BACKEND_URL}/data/${offset}`).then(resp => {console.log(resp); setData(prev => [...prev, ...resp.data.data]) ; setCount(1083); setIsLoaded(true)}); //fetchs all exams data from api
        }catch(err){console.log(err);//consoles error
        };
    };//function fetches all exams data on every mount

    useEffect(() => {

        fetchAnswered(); //declears function
        fetchExams()
    },[]); //function mounts once every mount


    useEffect(() => {

        const targetTicket =  () => {

            if(isLoaded){

                setTicket(data[targetId]); //sets ticket based on targetId
                setImg(data[targetId].Image.slice(data[targetId].Image.length - 4 , data[targetId].Image.length) == '.jpg' ? data[targetId].Image : false); //chekcs if ticket has image if so it sets in state else sets false to state
                setQuestionAudio(data[targetId].QuestionAudio);//sets question audio into state
                setExplanationAudio(data[targetId].DescriptionAudio);//sets question explanation into state
                setAnswers(data[targetId].Answers); //sets answers in state
                setIsAnswered(answeredTicket ? answeredTicket.filter(ans => ans.ticketId === targetId) : null); //checks if ticket is alreadt answered

            } return ;
        };

        targetTicket(); //declearing function

    },[targetId , data]) //function triggers on this dependencies change


    useEffect(() => {

        if(questionAudioRef && questionAudioRef.current){//defines refs
            questionAudioRef.current.play(); //plays question audio once ref is defines
        };

    },[questionAudio , questionAudioRef]); //function run on this depenencies

    useEffect(() => {

        if(explanationAudioRef && explanationAudioRef.current && questionAudioRef && questionAudioRef.current){//defines ref
            
            if(toggleDescAudio){//if description is toggles

               questionAudioRef.current.pause(); //pauses question audio
                explanationAudioRef.current.play(); //playes question explanation

            }else {
                questionAudioRef.current.play();//play question audio
                explanationAudioRef.current.pause();//pauses exlpanation audio
            };
        };return; //if refs are not defines then function returns nothing

    },[toggleDescAudio , explanationAudioRef , questionAudioRef]); //function runs on this dependencies


    const handleAnswers = async (answer) => {

        if(btnRef && btnRef.current){

             const correctIndex = answers.findIndex(a => a.IsCorrect);

            if(answer.IsCorrect){ //if user answer is correct
                setCorrect(prev => prev + 1) ; //increases correct count
                btnRef.current[answer.answerId].classList.add('btn-success') ; //styling answer as correct
                setAnsweredTicket(prev => [...prev , {ticketId : targetId , answerId :  answer.answerId , correctId: correctIndex}]); //pushes to answered ticket list state
            }else {//if user answer is incorrect
                setIncorrect(prev => prev + 1) ; //increases incorrect count
                btnRef.current[answer.answerId].classList.add('btn-danger'); //styles user answer as wrong
                btnRef.current[correctIndex].classList.add('btn-success'); //styles correct answer as correct
                setAnsweredTicket(prev => [...prev , {ticketId : targetId , answerId :  answer.answerId , correctId: correctIndex}]); //pushes to answered ticket list stae
            };
            
            let answeredTicketLast = answeredTicket?.at(-1) || null;
            
            if(answeredTicketLast && cookies?.token){ //if we have answered ticket then this statements execute
                
                try{

                    await axios.post(`${BACKEND_URL}/answered/post-answered-tickets` , {answeredTicketLast} , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => console.log(resp))//post answered ticket to server and returns response

                }catch(err){
                    console.log('internal error');//consoles error
                };
            }; 

            setTimeout(() => {

                if(btnRef && btnRef.current && collapseRef && collapseRef.current){//defines refs
                    
                    btnRef.current.filter(btn => btn !== null).forEach(btn => btn.classList.remove('btn-danger' , 'btn-success')); //removes refs that are nulls and removes style from rest
                    setTargetId(prev => prev + 1); //increases targetId
                    setToggleDescAudio(false); //untoggles description audio

                } else return; //if refs are not defined returns nothing
            }, 1000);//this function triggers after 1 seconds from when button is clicked

            return;
        };
    };//function triggers on answer button click


    useEffect(() => {

        if(btnRef && btnRef.current){//defines refs
        
             if(isAnswered && isAnswered.length !== 0){ //checks if user has already responsed for this ticket and if so
                const ticket = isAnswered[0];  //gets answered ticket

                if(ticket.answerId === ticket.correctId){//checks if user choosed correct response
                    btnRef.current[ticket.correctId].classList.add('btn-success'); //styles correct btn
                }else {
                    btnRef.current[ticket.correctId].classList.add('btn-success');//styles correct response as correct
                    btnRef.current[ticket.answerId].classList.add('btn-danger'); //styles user response as incorrect
                };
            
            }else return; //else if refs are not defines returns nothing
        };
    },[isAnswered]);//function runs on this dependencies

    
    const handleAnswerButton = (d) => {

        if(btnRef && btnRef.current){//defines ref
            if(d === '+'){ //checks if user pressed next page buttopn
                setToggleDescAudio(false); //untoggles description
                setTargetId(prev => prev + 1); //increasese targetId (state filters targetId values that are greater than data.length or less than zero)
                btnRef.current.filter(btn => btn !== null).forEach(btn => btn.classList.remove('btn-danger' , 'btn-success')); //filters button refs that are null and removes classes from rest
            }else {//checks if user pressed preev page button
                setToggleDescAudio(false); //untoggles description
                setTargetId(prev => prev - 1 < 0 ? 0 : prev - 1);//decreases targetId (state filters targetId values that are greater than data.length or less than zero)
                btnRef.current.filter(btn => btn !== null).forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'));//filters button refs that are null and removes classes from rest
            };
        }return; //if refs are not defined then function does nothing   
    };//function is triggered on answer button presses

console.log(targetId)
console.log(data)
    const handleSave = async(data) => {

        try{
    
            await axios.post(`${BACKEND_URL}/saved/post-saved-tickets` , {data} , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => {console.log(resp) ; setIsSaved(true)}); ///sends ticket data to server 
        }catch(err){
            console.log(err) ; //consoles error
        };       
    };//function triggers on save button click


    const handleUnsave = async(id) => {

        try{
        
            await axios.delete(`${BACKEND_URL}/saved/delete-saved-tickets/${id}` , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => {console.log(resp) ; setIsSaved(false)});//sends delete statement to api to remove ticket from db as saved

        }catch(err){
            console.log(err); //consoles error
        };
    }; //function trigegers on unsave button click


    const handleReset = async () => {

        try{

            await axios.delete(`${BACKEND_URL}/answered/delete-answered-tickets`, {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => window.location.reload());//reloads page when delete statement is ssended to api to show user updated version as soon as possible

        }catch(err){
            console.log(err); //consoles error
        };
    };//function triggers on reset button 

    useEffect(() => {

        if(collapseRef && collapseRef.current){ //defines refs for collapse component

            toggleDescAudio ? (collapseRef.current.classList.remove('collapse')) : collapseRef.current.classList.add('collapse') //if toggleDescAudio === true then it collapses component ,else removes collapse classlist from ref

        };

        return ; //if refs are not defined returns nothing

    },[toggleDescAudio]) ; //function mounts on toggledescaudio change


    useEffect(() => {

        const fetchIsSaved = async () => {

            try{

                await axios.get(`${BACKEND_URL}/saved/saved-tickets/${targetId + 1}` , {headers : {Authorization  : `Bearer ${cookies.token}`}}).then(resp => setIsSaved(resp.data)); //fetcches saved tickets from db and sets in state

            }catch(err){
                console.log(err); //consoles error
            };
        };

        fetchIsSaved() ; //decleares function

    },[isSaved , targetId]) ;//function mounts on this dependecines change


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
                
                {ticket ? 
                    <div className="ticket">

                        <div className="ticket-img py-2">
                            {img === false ? <></> : <img src={img} className='w-100'/>}
                        </div>
                        
                        <div className="ticket-content">
                            <h5 className='text-break'>{ticket.Question}</h5>
                            <audio ref={questionAudioRef} src={questionAudio} />
                        </div>

                        <div className="ticket-desc my-3">

                            <div class="collapse my-3" ref={collapseRef}>
                                
                                <h6>{ticket.Description}</h6>
                                <audio ref={explanationAudioRef} src={explanationAudio}></audio>
                            
                            </div>

                        </div>

                        <div className="ticket-answers  row my-2 gap-1 mx-auto justify-content-center">
                            {isAnswered.length === 0 ? 
                            answers.map((answer , answerId) => <button className='btn py-2 btn-primary col col-12 col-sm-5 text-break m-2 border border' key={answerId} ref={ref => btnRef.current[answerId] = ref} onClick={() => handleAnswers({IsCorrect : answer.IsCorrect , answerId : answerId})}>{answer.Text}</button>) 
                            : answers.map((answer , answerId) => <button className='btn py-2 btn-primary col col-12 col-sm-5 text-break border border' key={answerId} ref={ref => btnRef.current[answerId] = ref} >{answer.Text}</button>)}
                        </div>

                    </div> : <></>}

            </div>

            <div className="buttons row border-top border-3 p-2">

                <div className="buttons-start col col-8 d-flex align-items-center fs-4">

                    {isSaved ? <i class="fa-solid fa-bookmark" onClick={() => handleUnsave(ticket.Id)} style={{cursor :'pointer'}}></i> : 
                    <i class="fa-regular fa-bookmark" onClick={() => handleSave(ticket.Id)} style={{cursor :'pointer'}}> </i>}
                    
                    <button onClick={handleReset} className='btn'><i class="fa-solid fa-arrow-rotate-right"></i></button>
                    
                    <button type="button" className='btn btn-primary fs-6 border border' onClick={() => setToggleDescAudio(prev => !prev)} >! განმარტება</button> 

                </div>
                
                <div className="buttons-end col col-4 d-flex align-items-center justify-content-end">
                        
                    <button className='btn' onClick={() => handleAnswerButton('-')}><i class="fa-solid fa-arrow-left"></i></button>
                    <button className='btn' onClick={() => handleAnswerButton('+')}><i class="fa-solid fa-arrow-right"></i></button>

                </div>

            </div>
            
        </div>
    );
};

document.title = 'Driver Tickets - Exam'; //adds title to page

export default Exam; //exporting component