import React from 'react'
import {Link} from 'react-router-dom'

const Hero = ({handleLogout}) => {
    return (
        <section className = "hero">
            <nav>
                <h2>Welcome</h2>
                <button onClick = {handleLogout}>Logout</button>
            </nav>
            <button>
                <Link to = {'/components/News'}>News</Link>
            </button>
            <button><Link to = {"/chat"}> Chat </Link></button>
        </section>
    )
}
export default Hero;