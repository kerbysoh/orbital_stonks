import React from 'react'

import Navbar from './components/Navbar';
import './App.css';
import Cards from './components/Cards';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';



const Hero = ({handleLogout}) => {
    return (
        <>
            <Navbar handleLogout = {handleLogout} />
            <HeroSection />
            <Cards />
            <Footer />
        </>
        
    )
}
export default Hero;