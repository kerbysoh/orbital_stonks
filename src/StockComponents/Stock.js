import React from 'react';
import Plot from 'react-plotly.js';
import {Link} from 'react-router-dom';
import InputStock from './InputStock';
import UseStateArray from './UseStateArray';

class Stock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stockChartXValues: [],
            stockChartYValues: []
        }
    }

    componentDidMount() {
        this.fetchStock();
    }

    fetchStock() {
        const pointerToThis = this;
        console.log(pointerToThis);
        let StockSymbol = 'AMZN'
        const API_KEY = 'TQ6LE1RSC9LBHZTL';
        let API_Call =  `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&outputsize=compact&apikey=${API_KEY}`;
        let stockChartXValuesFunction = [];
        let stockChartYValuesFunction = [];

        fetch(API_Call)
            .then(
                function(response) {
                    return response.json();
                }
            )
            .then(
                function(data) {
                    //console.log(data);

                    for(var key in data['Time Series (Daily)']) {
                        stockChartXValuesFunction.push(key);
                        stockChartYValuesFunction.push(data['Time Series (Daily)'][key]['1. open']);
                    }
                    pointerToThis.setState({
                        stockChartXValues: stockChartXValuesFunction,
                        stockChartYValues: stockChartYValuesFunction

                    })
                }
            )
    }
        
    render() {
        return (
            <div className = "stocks_page">
                <button className = 'stocks_button'>
                    <Link to={"/"}>Home</Link>
                </button>
                <h1 className = "stocks">Stock Market Charts</h1>
                <InputStock></InputStock>
                <UseStateArray></UseStateArray>
                <div className = "all_stocks">
                    <Plot
                    data={[
                    {
                        x: this.state.stockChartXValues,
                        y: this.state.stockChartYValues,
                        type: 'scatter',
                        mode: 'lines',
                        marker: {color: 'black'},
                    } /* ,
                    {type: 'bar', x: this.state.stockChartXValues, y: this.state.stockChartYValues}, */
                    ]}
                    layout={{width: 640, height: 440, title:'AMZN', plot_bgcolor:'transparent', paper_bgcolor: 'transparent'}}
                />
                
                </div>
                
            </div>
        )
    }
}

export default Stock;

/* import React from "react";

function Stock({ data }) {
  return (
    <div className="news">
            <h2 className="news__title">{data.title}</h2>
            <img className ="news_img" src={data.urlToImage} alt = "Not Available"></img>
            <p className="news__desc">{data.description}
            </p>
    </div>
  );
}

export default Stock; */