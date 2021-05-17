import React, {useContext} from 'react';
import {NewsContext} from "../NewsContext";
import NewsArticle from "./NewsArticle";
import {Link} from 'react-router-dom'

function News() {
    const {data} = useContext(NewsContext);
    console.log(data);

    return (
    <div>
      <h1 className="head__text">DAILY STONKS NEWS</h1>
      <button><Link to = {'/'}>Home</Link></button
      >
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
