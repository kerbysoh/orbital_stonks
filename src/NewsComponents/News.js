import React, {useState, useEffect} from 'react'
import NewsArticle from "./NewsArticle"
import axios from 'axios'
import Navbar from '../components/Navbar'
import SearchBox from '../Search/SearchBox'
import SearchIcon from '@material-ui/icons/Search';
import './News.css'
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'

const News = (props) => {

  const proxyUrl = "https://boiling-ocean-19806.herokuapp.com/"
    const [search, setSearch] = useState('')
    const [data, setData] = useState("")
    const apiKey = "e76505b8c2ec4416bc462386ef1f980a"
    const {handleLogout} = props
    const db = firebase.firestore()

     useEffect (() => {
      axios
            .get(
                `${proxyUrl}https://newsapi.org/v2/everything?pageSize=100&q=stocks&domains=marketwatch.com,investing.com,seekingalpha.com,fool.co.uk,ino.com/blog,moneycontrol.com,ragingbull.com,&sortBy=popularity&apiKey=${apiKey}`
            )
            .then((response) => setData(response.data))
            .catch((error) => console.log(error));

      /* if(data) {
      db.collection("news").doc("news").update({
            news : data
        })
      } */
            
    if (db) {
            const unsubscribe = db
            db.collection("news")
            .doc("news")
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setData(doc.get("news"))
                } 
            })
            
            return unsubscribe
        }
    }, [db])
        
    const handleSearch = () => {
        axios
            .get(
                `${proxyUrl}https://newsapi.org/v2/everything?pageSize=100&q=${search}&domains=marketwatch.com,investing.com,seekingalpha.com,fool.co.uk,ino.com/blog,moneycontrol.com,ragingbull.com,&sortBy=popularity&apiKey=${apiKey}`
            )
            .then((response) => setData(response.data))
            .catch((error) => console.log(error)); 

    }
    
    return (
      <div className="news_page">
        <Navbar handleLogout={handleLogout} />
        <div class="topnav">
          <input
            className="searchbox"
            type="text"
            placeholder="Search.."
            handleChange={(e) => setSearch(e.target.value)}
          ></input>
          <SearchIcon
            className="search2"
            onClick = {() => handleSearch()}
            fontSize="large"
          />
        </div>
        <div className="all__news">
          <div></div>
          <div></div>
          <div class="topnav"></div>
          {data ? (
            data.articles.map((news) => (
              <NewsArticle data={news} key={news.url} />
            ))
          ) : (
            <div className="loader"></div>
          )}
        </div>
      </div>
    );
}
export default News;
