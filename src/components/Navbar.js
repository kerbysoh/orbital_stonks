import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom';
import './Navbar.css';
import '../App.css';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const Navbar = ({handleLogout}) => {
  const handleClose = () => {
    setDOpen(false);
  };
  const [dOpen, setDOpen] = useState(false)

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
              <Link to = {'/News'} className='nav-links' onClick={() => closeMobileMenu()}>News</Link>
            </li>
            <li className='nav-item'>
              <Link to = {"/Chat"} className='nav-links'
                onClick={() => closeMobileMenu()}>Chat</Link>
            </li>
            <li className='nav-item'>
              <Link
                to={"/Trade"}
                className='nav-links'
                onClick={() => closeMobileMenu()}
              >
                Trade
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to={"/Friends"}
                className='nav-links'
                onClick={() => closeMobileMenu()}
              >
                Friends
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to={"/Stock"}
                className='nav-links'
                onClick={() => closeMobileMenu()}
              >
                Watchlist
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to={"/Feed"}
                className='nav-links'
                onClick={() => closeMobileMenu()}
              >
                Feed
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to={"/myProfile"}
                className='nav-links'
                onClick={() => closeMobileMenu()}
              >
                My Profile
              </Link>
            </li> 
            <li className='nav-item'>
            <button className = 'nav-links2'
                onClick={() => {closeMobileMenu() ; setDOpen(true)}} variant = "contained" 
              >
                Log out
              </button>
            </li> 
          </ul>
          <Dialog
        open={dOpen}
        onClose={() => handleClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="Confirm Logout?">{"Confirm Logout?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your action cannot be reversed
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              handleLogout();
              handleClose();
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
        </div>
      </nav>
    </>
  );

}

export default Navbar;
