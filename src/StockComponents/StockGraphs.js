import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { useLocation } from "react-router-dom";
import "firebase/firestore";
import Navbar from "../components/Navbar";
import "./Stock.css";
import "./StockCardItem.css";
import CardItem from "./StockCardItem";
import "./StockGraphs.css";
import axios from "axios";
import NewsArticle from "../NewsComponents/NewsArticle";

const StockGraphs = (props) => {
  const [stockChartXValues, setStockChartXValues] = useState([]);
  const [stockChartYValues, setStockChartYValues] = useState([]);
  const [changePercent, setChangePercent] = useState("");

  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [low, setLow] = useState("");
  const [high, setHigh] = useState("");
  const [volume, setVolume] = useState("");
  const { handleLogout, stock, setStock } = props;
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .get(
        `https://newsapi.org/v2/everything?pageSize=2&q=${stock}&domains=marketwatch.com,investing.com,seekingalpha.com,fool.co.uk,ino.com/blog,moneycontrol.com,ragingbull.com,bbc.com,&sortBy=popularity&apiKey=e76505b8c2ec4416bc462386ef1f980a`
      )
      .then((response) => setData(response.data))
      .catch((error) => console.log(error));

    const fetchStock = () => {
      const API_KEY = "TQ6LE1RSC9LBHZTL";
      let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stock}&outputsize=compact&apikey=${API_KEY}`;
      let API_Call_2 = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${API_KEY}`;
      let API_Call_3 = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock}&apikey=${API_KEY}`;

      let stockChartXValuesFunction = [];
      let stockChartYValuesFunction = [];

      fetch(API_Call)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          for (var key in data["Time Series (Daily)"]) {
            stockChartXValuesFunction.push(key);
            stockChartYValuesFunction.push(
              data["Time Series (Daily)"][key]["1. open"]
            );
          }
          setStockChartXValues(stockChartXValuesFunction);
          setStockChartYValues(stockChartYValuesFunction);
        });

      fetch(API_Call_2)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          setChangePercent(data["Global Quote"]["10. change percent"]);
          setPrice(data["Global Quote"]["05. price"]);
          setHigh(data["Global Quote"]["03. high"]);
          setLow(data["Global Quote"]["04. low"]);
          setVolume(data["Global Quote"]["06. volume"]);
        });
      fetch(API_Call_3)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          setName(data["Name"]);
        });
    };
    fetchStock();
  }, []);

  return (
    <>
      <head></head>
      <Navbar handleLogout={handleLogout} />
      <div className="grid-pattern">
        <div className="sidebarstock">
          <div className="cards">
            <div className="cards__container">
              <div className="cards__wrapper">
                <CardItem text={name} label="Stock" />
                <CardItem text={stock} label="Stock Ticker" />
                <ul className="cards__items">
                  <Plot
                    data={[
                      {
                        x: stockChartXValues,
                        y: stockChartYValues,
                        type: "scatter",
                        mode: "lines",
                        marker: { color: "black" },
                      },
                    ]}
                    layout={{
                      width: 640,
                      height: 440,
                      /* title: location.state.name, */
                      plot_bgcolor: "transparent",
                      paper_bgcolor: "transparent",
                    }}
                  />
                </ul>
                <ul className="cards__items">
                  <CardItem text={price} label="Current Price" />
                </ul>
                <ul className="cards__items">
                  <CardItem text={changePercent} label="Today's Change" />
                  <CardItem text={high} label="Daily High" />
                  <CardItem text={low} label="Daily Low" />
                  <CardItem text={volume} label="Volume" />
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="contentstock">
          {data
            ? data.articles.map((news) => (
                <NewsArticle data={news} key={news.url} />
              ))
            : null}
        </div>
      </div>
    </>
  );
};
export default StockGraphs;
