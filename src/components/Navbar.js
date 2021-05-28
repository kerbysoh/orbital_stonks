import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';
import '../App.css';

const Navbar = ({handleLogout}) => {

  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            STONKS
            <i class='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick} >
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to = {'/News'} className='nav-links' onClick={closeMobileMenu}>News</Link>
            </li>
            <li className='nav-item'>
              <Link to = {"/Chat"} className='nav-links'
                onClick={closeMobileMenu}>Chat</Link>
            </li>
            <li className='nav-item'>
              <Link
                to={"/Trade"}
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Trade
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to={"/Friends"}
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Friends
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to={"/Stock"}
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Watchlist
              </Link>
            </li>
            
          </ul>
          {button && <Button buttonStyle='btn--outline' onClick = {handleLogout}>LOG OUT</Button>}
        </div>
      </nav>
    </>
  );

}

export default Navbar;
