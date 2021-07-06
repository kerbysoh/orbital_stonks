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

const Stock = (props) => {
  const {handleLogout, stock, setStock } = props
    const db = firebase.firestore()
    const userEmail = fire.auth().currentUser.email
    const [search, setSearch] = useState('')
    const API_KEY = 'TQ6LE1RSC9LBHZTL';
    const [searchOn, setSearchOn] = useState(false)

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
        <div className = "page-background">
          <div class="topnav">
            <SearchBox
              className ='searchbox' type="text"
              placeholder="Stock ticker..."
                    handleChange={(e) => {
                      setSearch(e.target.value);
                      setSearchOn(false);
              }}
            ></SearchBox>
            <SearchIcon className = 'search2' onClick={handleStockSearch} fontSize = 'large'/>
            {searchOn ? (
                    <h2 className="suggested">
                      Suggested: {search}
                      {" "}
                      <Button
                        variant="contained"
                        color="black"
                        className="postButton"
                        type="submit"
                        onClick={handleAddStock}
                      >
                        Add
                      </Button>
                    </h2>
                  ) : null}            
            </div>
          <BasicTable stock = {stock} setStock = {setStock} removeItem = {removeItem}/>
        </div>
      </div>
    );
}


export default Stock;