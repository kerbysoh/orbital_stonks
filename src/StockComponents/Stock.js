import React, {useState, useEffect} from 'react'
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import SearchBox from '../Search/SearchBox';
import Navbar from '../components/Navbar'
import './Stock.css'
import BasicTable from './BasicTable'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const Stock = (props) => {

  const [opensnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("")
  const {handleLogout, stock, setStock } = props
  const db = firebase.firestore()
  const userEmail = fire.auth().currentUser.email
  const [search, setSearch] = useState('')
  const API_KEY = 'TQ6LE1RSC9LBHZTL';
  const [searchOn, setSearchOn] = useState(false)

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

    const handleAddStock = (e) => {
        e.preventDefault()
        db.collection("Stocks").doc(`${userEmail}`).update({
            [search] : search
        })
    }

    const handleStockSearch = (e) => {
      e.preventDefault()
      setSearchOn(false)
        let API_Call =  `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${search}&apikey=${API_KEY}`;
          
          fetch(API_Call)
            .then(
              function(response){
                return response.json();
                
              }
            )
            .then(
              function(data){
                if(data.Symbol) {  
                  if (stock === {}) {
                    setOpenSnack(false);
                    setSearchOn(true)
                  } 
                  else {
                   if (Object.values(stock).includes(search)) {
    
                        setMessage("Stock Already Added!");
                        setOpenSnack(true);
                        setSearchOn(false);
                   } else {
                        setOpenSnack(false);
                        setSearchOn(true);

                      }
                    }
                  }
                  else {
                  setSearchOn(false)
                }
              }
            )         
    }

    useEffect (()=> {
        if (db) {
            const unsubscribe = db
            db.collection('Stocks')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setStock(doc.data())
                } 
            })
            
            return unsubscribe
        }
    }, [db])

    const removeItem = (id) => {
        db.collection("Stocks").doc(fire.auth().currentUser.email).update({
            [id]: firebase.firestore.FieldValue.delete()
        })
        db.collection('Stocks').doc(fire.auth().currentUser.email).get()
        .then((docSnapshot) => {
            if (!docSnapshot.exists) {
                db.collection('Stocks').doc(fire.auth().currentUser.email).set({})
        }
    })
};

    return (
      <div>
        <Navbar handleLogout={handleLogout} />
        <div className="page-background">
          <div class="topnav">
            <input
              className="searchbox"
              type="text"
              placeholder="Stock ticker..."
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchOn(false);
              }}
            ></input>

            <SearchIcon
              className="search2"
              onClick={(e) => {
                handleStockSearch(e);
              }}
              fontSize="large"
            />
          </div>
          {searchOn ? (
            <h2 className="suggested">
              Suggested: {search}{" "}
              <Button
                variant="contained"
                color="black"
                className="postButton"
                type="submit"
                onClick={(e) => handleAddStock(e)}
              >
                Add
              </Button>
            </h2>
          ) : null}
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={opensnack}
            autoHideDuration={3000}
            message={message}
            onClose={() => setOpenSnack(false)}
            action={
              <>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => handleCloseSnack}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            }
          />
          <BasicTable
            stock={stock}
            setStock={setStock}
            removeItem={removeItem}
          />
        </div>
      </div>
    );
}


export default Stock;