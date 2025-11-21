import { useEffect } from "react"
import Header from "../component/Header"

const Exam = () => {

    useEffect(() => {

        const fetchExams = () => {
            console.log('fetch exams')
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