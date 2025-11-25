import { Link } from "react-router-dom"

const Header = () => {
    return(
        <div className="header-container container-fluid d-flex justify-content-between align-items-center my-1 border-bottom border-3">
            <div className="header-start">
                <h3><i class="fa-solid fa-car"></i> Driver-Tickets</h3>
            </div>
            <div className="header-end d-flex gap-2 fs-6">
                <Link to='/' className="link link-dark link-underline-opacity-0 link-underline-opacity-75-hover link-offset-3">Home</Link>
                <Link to='/exam' className="link link-dark link-underline-opacity-0 link-underline-opacity-75-hover link-offset-3">Exam</Link>
                <Link to='/saved-tickets' className="link link-dark link-underline-opacity-0 link-underline-opacity-75-hover link-offset-3">Saved</Link>
            </div>
        </div>
    )
}

export default Header