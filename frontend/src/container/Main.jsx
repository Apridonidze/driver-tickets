import { Link } from "react-router-dom"

const Main = () => {
    return(
        <div className="main-container">
            <div className="title">
                <h1>Driver Tickets</h1>
            </div>

            <div className="buttons row row-cols-2">
                <Link to='/' className="btn btn-primary">Start Exam</Link>
                <Link to='/' className="btn btn-primary">Saved Tickets</Link>
            </div>

        </div>
    )
}

export default Main