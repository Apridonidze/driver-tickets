import axios from "axios";
import { useCookies } from "react-cookie"; //importing react libraries

import { useEffect, useRef, useState } from "react"; //importing react hooks

import Header from "../component/Header"; //importing react compon ent

const Favorite = () => {

    const [cookies] = useCookies(['token']); //cookies

    const [saved,setSaved] = useState();
    const [ticket , setTicket] = useState();
    const [targetId , setTargetId] = useState(0);
    const [img , setImg] = useState();
    const [answers ,setAnswers] = useState([]);//states to store ticket data (saved ticket list, their img ,titles , desc , etc)
    
    const [questionAudio , setQuestionAudio] = useState();//state for question audio
    const [explanationAudio , setExplanationAudio] = useState();//state for question explanation audio

    const [toggleDescAudio , setToggleDescAudio] = useState(false);//state to toggle explanation audio
    
    const [answeredTicket , setAnsweredTicket] = useState([]);
    const [isAnswered, setIsAnswered] = useState([]);
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [count , setCount] = useState(0); //state for answered tickets , correct/incorrect/total count 

    const [isLoaded,setIsLoaded] = useState(false);//state to define if component fully fetched ticket data from server 

    const btnRef = useRef([]);
    const collapseRef = useRef(null);
    const explanationAudioRef = useRef(null);
    const questionAudioRef  = useRef(null); //refs for ticket buttons


    useEffect(() => {
        const fetchSaved = async () => {

            try{

                await axios.get('http://localhost:8080/saved/saved-tickets' , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => setSaved(resp.data)); //fetches data from api and saves in saved state

            }catch(err){
                console.log(err); //consoles error
            };

        };

        fetchSaved(); //declares function

    },[]); //function runs once every mount


    useEffect(() => {
        
        const targetTicket = () => {

            if(saved && saved.length !== 0){
                setTicket(saved[targetId]);
                setImg(saved[targetId].Image.slice(saved[targetId].Image.length - 4 , saved[targetId].Image.length) == '.jpg' ? saved[targetId].Image : false);
                setQuestionAudio(saved[targetId].QuestionAudio);
                setExplanationAudio(saved[targetId].DescriptionAudio);
                setAnswers(saved[targetId].Answers);
                setIsAnswered(answeredTicket ? answeredTicket.filter(ans => ans.ticketId === targetId) : null) ;
                setCount(saved.length);
                setIsLoaded(true);//sets ticket data to states
            }else {
                setTicket(null) ;
                setImg(null);
                setQuestionAudio(null);
                setExplanationAudio(null);
                setAnswers(null);
                setIsAnswered(null) ;
                setIsLoaded(null);
            };//sets ticket data to states as nulls to define that user has no saved tickets or internal error occured
            
            
        }

        targetTicket(); //declearing function

    },[targetId ,saved]);


    useEffect(() => {

        if(questionAudioRef && questionAudioRef.current){ //checks if ref exists 
            questionAudioRef.current.play();
        };

    },[questionAudio , questionAudioRef]); //triggering question audio once ticket is loaded

    useEffect(() => {

        if(explanationAudioRef && explanationAudioRef.current && questionAudioRef && questionAudioRef.current){
            
            if(toggleDescAudio){ //if description is toggled then

                questionAudioRef.current.pause() //question audio is paused
                explanationAudioRef.current.play() //and question explanation audio is played

            }else {//else if description is not toggled

                questionAudioRef.current.play() //question audio is played
                explanationAudioRef.current.pause() //and question explanation audio is paused

            }
        }return; //if function cant get refs then it returns nothing 

    },[toggleDescAudio , explanationAudioRef , questionAudioRef]) ; //function runs on this dependencies change


    const handleAnswers = async (answer) => {

        if(btnRef && btnRef.current){

            const correctIndex = answers.findIndex(a => a.IsCorrect); //gets correct answers id

            if(answer.IsCorrect){ //if user answer is correct 

                setCorrect(prev => prev + 1) ; //correct count increasees by one
                btnRef.current[answer.answerId].classList.add('btn-success') ; //buttonms is styled as correct
                setAnsweredTicket(prev => [...prev , {ticketId : targetId , answerId :  answer.answerId , correctId: correctIndex}]); //this question inserts into answered tickets list

            }else {//else if user ansiwer is incorrect
                setIncorrect(prev => prev + 1) ; //incorrect count increases by one
                btnRef.current[answer.answerId].classList.add('btn-danger') ; //styles user answer as wrong
                btnRef.current[correctIndex].classList.add('btn-success'); //styles correct answer to showcase which response is correct
                setAnsweredTicket(prev => [...prev , {ticketId : targetId , answerId :  answer.answerId , correctId: correctIndex}]); //question iserts into answered ticket lists
            }
   
            setTimeout(() => {
                if(btnRef && btnRef.current && collapseRef && collapseRef.current){ //defines refs 
                    
                    setTargetId(prev => prev + 1 > saved.length - 1 ? saved.length - 1 : prev + 1); //increases targetId to move to next question

                    if(targetId + 1 === saved.length) return ; //if question is last then it stays on same page and does nothing

                    btnRef.current.filter(btn => btn !== null).forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'));//else removes styles from buttons
                    setToggleDescAudio(false);//untoggles description

                } return;

            }, 1000);  //after 1 second of if/else statement trigger this timeout function tirggers 
        };
    };//function runs when one of the answer is clicked


    useEffect(() => {

        if(btnRef && btnRef.current){ //defines refs
        
             if(isAnswered && isAnswered.length !== 0){ //checks if there is any answered tickets and if so

                const ticket = isAnswered[0] //defines current ticket as answered

                if(ticket.answerId === ticket.correctId){//if user answered ticket correctly
                    btnRef.current[ticket.correctId].classList.add('btn-success');//answer btn styles as acorrect
                }else {//else iuf user answered ticket incorrectly
                    btnRef.current[ticket.correctId].classList.add('btn-success'); //correct answer styles as correct
                    btnRef.current[ticket.answerId].classList.add('btn-danger'); //user answer styles as incorrect
                };
            
            }else return; //else if there is no answered ticket returns nothing  
        };
    },[isAnswered]) ;//function runs on this dependencies change

    
    const handleAnswerButton = (d) => {
        
        if(btnRef && btnRef.current){
            if(d === '+'){ //defines if user pressed next page button

                setToggleDescAudio(false); //untoggles description aduio
                setTargetId(prev => prev + 1 > saved.length - 1 ? saved.length - 1 : prev + 1); //increases target by one (prevent user to go to next page if next page is greated than saved.length)
                btnRef.current.filter(btn => btn !== null).forEach(btn => btn.classList.remove('btn-danger' , 'btn-success'));//removes styling from buttons
                   
            }else { //defines if user pressed prev page button

                setToggleDescAudio(false); //untoggles descrtiption audio
                setTargetId(prev => prev - 1 < 0 ? 0 : prev - 1); //decreases target by one (prevents user to go to prev page if id is less than zero)
                btnRef.current.filter(btn => btn !== null).forEach(btn => btn.classList.remove('btn-danger' , 'btn-success')); //removes styling from buttons
                    
            };
        }; return;//retrusn nothing if refs are not defined
    }; //function runs on answer button click
        
    const handleUnsave = async(id) => {

        try{
            await axios.delete(`http://localhost:8080/saved/delete-saved-tickets/${id}` , {headers : {Authorization : `Bearer ${cookies.token}`}}).then(resp => setSaved(saved.filter(s => s.Id !== id))) ; //sends delete request to server and deletes form database as saved ticket, removes current ticket from state to not dispaly in time 
        }catch(err){
            console.log(err); //consoles internal error
        };
    };//function runs on unsave button click


    useEffect(() => {

        if(collapseRef && collapseRef.current){//defines refs

            toggleDescAudio ? (collapseRef.current.classList.remove('collapse')) : collapseRef.current.classList.add('collapse'); //adds styling to collapse component based on state
        }; return; //else if refs are not define returns nothing

    },[toggleDescAudio]) ; //function toggles on this dependencies change
    
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

                    </div> : <h1>No Saved Tickets.</h1>}

            </div>

            <div className="buttons row border-top border-3 p-2">

                <div className="buttons-start col col-8 d-flex align-items-center fs-4">

                    <i class="fa-solid fa-bookmark" onClick={() => handleUnsave(ticket.Id)} style={{cursor :'pointer'}}></i> 
                    
                    <button onClick={() => window.location.reload()} className='btn'><i class="fa-solid fa-arrow-rotate-right"></i></button>
                    
                    <button type="button" className='btn btn-primary fs-6' onClick={() => setToggleDescAudio(prev => !prev)} ><i class="fa-solid fa-exclamation"></i> განმარტება</button> 

                </div>
                
                <div className="buttons-end col col-4 d-flex align-items-center justify-content-end">
                        
                    <button className='btn' onClick={() => handleAnswerButton('-')}><i class="fa-solid fa-arrow-left"></i></button>
                    <button className='btn' onClick={() => handleAnswerButton('+')}><i class="fa-solid fa-arrow-right"></i></button>

                </div>

            </div>
        </div>
    );
};

document.title = 'Driver Tickets - Saved'; // adds title to page

export default Favorite; //exporting component