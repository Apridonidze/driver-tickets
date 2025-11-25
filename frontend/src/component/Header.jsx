import { Link } from "react-router-dom"

const Header = () => {
    return(
        <div className="header-container container-fluid">
            <div className="header-start">
                <h1>Driver-Tickets</h1>
            </div>
            <div className="header-end">
                <Link to='/'>Home</Link>
                <Link to='/saved-tickets'>saved</Link>
            </div>
        </div>
    )
}

export default Header