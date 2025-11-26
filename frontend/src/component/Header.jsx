import { Link } from "react-router-dom" ; //importing react library

const Header = () => {
    return(
        <div className="header-container container-fluid d-flex justify-content-between align-items-center my-1 border-bottom border-3">
            <div className="header-start">
                <Link to='/' className="link link-light fs-3 link-underline-opacity-0"><i class="fa-solid fa-car"></i> Driver-Tickets</Link>
            </div>
            <div className="header-end d-flex gap-2 fs-6">
                <Link to='/exam' className="link link-light link-underline-opacity-0 link-underline-opacity-75-hover link-offset-3">Exam</Link>
                <Link to='/saved-tickets' className="link link-light link-underline-opacity-0 link-underline-opacity-75-hover link-offset-3">Saved</Link>
            </div>
        </div>
    );
};

export default Header; //exporting component