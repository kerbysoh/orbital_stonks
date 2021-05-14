import React from 'react'

const Stonks = ({handleLogout}) => {
    return (
        <section className = "Hero">
            <nav>
                <h2>Stonks</h2>
                <button onClick = {handleLogout}>Logout</button>
        
            </nav>

        </section>
    )
}
export default Stonks