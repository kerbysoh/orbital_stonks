import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container'>
      <video src='/videos/video-1.mp4' autoPlay loop muted />
      <h1>TRADE WITHOUT EMOTIONS</h1>
      <p>What are you waiting for?</p>
    </div>
  );
}

export default HeroSection;
