import React from 'react'
import {Link} from 'react-router-dom'

const Hero = ({handleLogout}) => {
    return (
        <section className = "hero">
            <nav>
                <h2>Welcome</h2>
                <button onClick = {handleLogout}>Logout</button>
            </nav>
            <button><Link to = {'/News'}>News</Link></button>
            <button><Link to = {"/Chat"}>Chat</Link></button>
            <button><Link to = {"/Trade"}>Trade</Link></button>
            <button><Link to = {"/Friends"}>Friends</Link></button>
            <button><Link to = {"/Stock"}>Watchlist</Link></button>
        </section>
    )
}
export default Hero;