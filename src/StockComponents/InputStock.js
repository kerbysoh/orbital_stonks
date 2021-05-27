import React ,{useState, useRef, useEffect} from 'react'
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import SearchBox from '../Search/SearchBox';

function InputStock() {
    const db = firebase.firestore()
    const [stocks, setStocks] = useState([])
    const userEmail = fire.auth().currentUser.email
    const [search, setSearch] = useState('')
    const API_KEY = 'TQ6LE1RSC9LBHZTL';
    const [currSearch, setCurrSearch] = useState({})
    const [searchOn, setSearchOn] = useState(false)


    const handleAddStock = () => {
        
        db.collection("Stocks").doc(`${userEmail}`).update({
            [search] : search
        })
    }

    const handleStockSearch = () => {
        setSearchOn(false)
        var stock = new String()
          
          let API_Call =  `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${search}&apikey=${API_KEY}`;
          
          fetch(API_Call)
            .then(
              function(response){
                return response.json();
                
              }
            )
            .then(
              function(data){
                console.log(data)
                if(data.Symbol) {
                  stock = search
                  setSearchOn(true)
                  setCurrSearch(stock)
                } else {
                  setSearchOn(false)
                }
              }
            )         
        
    }

    return (
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
        <>
        
        
        </>
    </div>
    )
}

export default InputStock;
