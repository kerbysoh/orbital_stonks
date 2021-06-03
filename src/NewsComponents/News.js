import React, {useState} from 'react'
import NewsArticle from "./NewsArticle"
import axios from 'axios'
import Navbar from '../components/Navbar'
import SearchBox from '../Search/SearchBox'
import './News.css'

const News = (props) => {

    const [search, setSearch] = useState('')
    const [data, setData] = useState()
    const apiKey = "e76505b8c2ec4416bc462386ef1f980a"
    const {handleLogout} = props

    

    const handleSearch = () => {
        axios
            .get(
                `https://newsapi.org/v2/everything?pageSize=100&q=${search}&domains=marketwatch.com,investing.com,seekingalpha.com,fool.co.uk,ino.com/blog,moneycontrol.com,ragingbull.com,bbc.com,&sortBy=popularity&apiKey=${apiKey}`
            )
            .then((response) => setData(response.data))
            .catch((error) => console.log(error));
    }
    
    return (
      
      <div className="news_page">
        <Navbar handleLogout = {handleLogout} />
        <h1 className="head__text">DAILY STONKS NEWS</h1>
        <SearchBox
          placeholder="Search..."
          handleChange={(e) => setSearch(e.target.value)}
        ></SearchBox>
        <clickfriends onClick={handleSearch}> Search </clickfriends>
        <div className="all__news">
          {data
            ? data.articles.map((news) => (
                <NewsArticle data={news} key={news.url} />
              ))
            : "Loading"}
        </div>
      </div>
    );
}
export default News;
