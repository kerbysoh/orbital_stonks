import React from "react";

function NewsArticle({ data }) {
  return (
    <div className="news">
            <h2 className="news__title">{data.title}</h2>
            <img className ="news_img" src={data.urlToImage} alt = "Not Available"></img>
            <p className="news__desc">{data.description}
                <a target = "" href = {data.url}> See More </a>
            </p>
      
      {/* <span className="news__author">{data.author}</span> <br /> */}
      {/* <span className="news__published">{data.publishedAt}</span>
      <span className="news__source">{data.source.name}</span> */}
    </div>
  );
}

export default NewsArticle;