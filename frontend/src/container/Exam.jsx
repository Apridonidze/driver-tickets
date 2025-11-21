import axios from 'axios'
import { useEffect } from "react"
import Header from "../component/Header"

const Exam = () => {

    useEffect(() => {

        const  fetchExams = async () => {

            try{

                axios.get('http://localhost:8080/data').then(resp => console.log(resp))

            }catch(err){
                console.log(err)
            }

        }

        fetchExams();

    },[])

    return(
        <div className="exam-container container">
            <Header />
            exam
        </div>
    )
}

export default Exam