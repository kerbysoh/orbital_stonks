import React, {useState} from 'react'
import NewsArticle from "./NewsArticle";
import {Link} from 'react-router-dom'
import axios from 'axios'
import SearchBox from '../Search/SearchBox';

function News() {

    const [search, setSearch] = useState('')
    const [data, setData] = useState();
    const apiKey = "e76505b8c2ec4416bc462386ef1f980a";

    const handleSearch = () => {
        axios
            .get(
                `https://newsapi.org/v2/everything?q=${search}&sortBy=publishedAt&apiKey=${apiKey}`
            )
            .then((response) => setData(response.data))
            .catch((error) => console.log(error));
    }
    
    return (
      <div className="news_page">
        <button>
          <Link to={"/"}>Home</Link>
        </button>
        <h1 className="head__text">DAILY STONKS NEWS</h1>
        <SearchBox
          placeholder="Search..."
          handleChange={(e) => setSearch(e.target.value)}
        ></SearchBox>
        <click onClick={handleSearch}> Search </click>
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
