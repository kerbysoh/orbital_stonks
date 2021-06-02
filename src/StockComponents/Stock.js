import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import SearchBox from '../Search/SearchBox';
import Navbar from '../components/Navbar'
import {Button} from '../components/Button'
import './Stock.css'

const Stock = ({handleLogout}) => {
    const db = firebase.firestore()
    const userEmail = fire.auth().currentUser.email
    const [search, setSearch] = useState('')
    const API_KEY = 'TQ6LE1RSC9LBHZTL';
    const [searchOn, setSearchOn] = useState(false)
    const [stock, setStock] = useState([])

    const handleAddStock = () => {
        
        db.collection("Stocks").doc(`${userEmail}`).update({
            [search] : search
        })
    }

    const handleStockSearch = () => {
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
                  setSearchOn(true)
                } else {
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
        <div>
          {/* <video src='/videos/video-2.mp4' autoPlay loop muted /> */}
          <h1>My Watchlist</h1>
          <div className="footer-subscription">
            <form>
              <SearchBox
                placeholder="Stock ticker..."
                handleChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOn(false);
                }}
              ></SearchBox>
              <clickfriends
                buttonStyle="btn--outline"
                onClick={handleStockSearch}
              >
                {" "}
                Search for Stock{" "}
              </clickfriends>
              {searchOn ? (
                <h2 className="suggested">
                  Suggested: {search}
                  <clickfriends onClick={handleAddStock}>
                    Add to Watchlist
                  </clickfriends>
                </h2>
              ) : null}
            </form>
          </div>
        </div>

        {Object.values(stock).map((key, i) => {
          return (
            <div>
              <h1 key={i}>
                Stock: {key}
                <Button onClick={() => removeItem(key)}>Remove</Button>
              </h1>

              <Button key={key}>
                <Link
                  to={{
                    pathname: "/StockGraphs",
                    state: {
                      name: key,
                    },
                  }}
                >
                  View stock data
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    );
}


export default Stock;

/* return (
        
        <div className = "stocks_page">
        <Navbar handleLogout = {handleLogout} />  
            <button className = 'stocks_button'>
                </button>
                <h1 className = "stocks">My Watchlist</h1>
                <div className="InputStock">
                <SearchBox className = "friendSearch"
                    placeholder="Stock ticker..."
                    handleChange={(e) => {setSearch(e.target.value); {setSearchOn(false)}}}></SearchBox>
                <clickfriends onClick={handleStockSearch} > Search for Stock </clickfriends>
                    {
                        searchOn ?
                        <h3> 
                            Suggested: {search} 
                            <clickfriends onClick = {handleAddStock}>Add to Watchlist</clickfriends>
                        </h3> : null
                    }
                </div>
                {Object.values(stock).map((key, i) => {
                return (
                    <div>
                    <h1 key = {i}>
                        Stock: {key}
                        <button onClick ={() => removeItem(key)}>Remove</button>
                    </h1>
            
                    <h2 key = {key}><Link to = {{ pathname:'/StockGraphs', state: {
                        name: key
                    }}}>View stock data</Link></h2>
                    </div>
            
                )
                
            })}
        </div>
        ) */