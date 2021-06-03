import React, {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import {useLocation} from 'react-router-dom';
import 'firebase/firestore'
import Navbar from "../components/Navbar"
import "./Stock.css";


const StockGraphs = (props) => {
  const [stockChartXValues, setStockChartXValues] = useState([]);
  const [stockChartYValues, setStockChartYValues] = useState([]);
  const [changePercent, setChangePercent] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [low, setLow] = useState("");
  const [high, setHigh] = useState("");
  const [volume, setVolume] = useState("");

  const { handleLogout } = props;
  const location = useLocation();
    
  useEffect(() => {
    const fetchStock = () => {
      const StockSymbol = location.state.name;
      const API_KEY = "TQ6LE1RSC9LBHZTL";
      let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&outputsize=compact&apikey=${API_KEY}`;
      let API_Call_2 = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${StockSymbol}&apikey=${API_KEY}`;
      let API_Call_3 = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${StockSymbol}&apikey=${API_KEY}`;

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
          setDate(data["Global Quote"]["07. latest trading day"]);
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
      <Navbar handleLogout={handleLogout} />
      <h1> Stock: {name}</h1>
      <h1> Stock Ticker: {location.state.name}</h1>
      <h1>Today's Date: {date}</h1>
      <h1>Today's Change: {changePercent}</h1>
      <h1>Current Price: {price}</h1>
      <h1>Daily High: {high}</h1>
      <h1>Daily Low: {low}</h1>
      <h1>Volume: {volume}</h1>

      <div className="footer-subscription">
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
      </div>
    </>
  );
}
export default StockGraphs;
