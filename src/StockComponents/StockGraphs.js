import React from 'react';
import Plot from 'react-plotly.js';
import {Link} from 'react-router-dom';
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'

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
        let StockSymbol = "AAPL"
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
            <>
                <button><Link to = '/Stocks'>Stocks</Link></button>
                <Plot
                data={[
                {
                    x: this.state.stockChartXValues,
                        y: this.state.stockChartYValues,
                        type: 'scatter',
                        mode: 'lines',
                        marker: {color: 'black'},
                    } 
                    ]}
                    layout={{width: 640, height: 440, title:'AMZN', plot_bgcolor:'transparent', paper_bgcolor: 'transparent'}}
                />

            </>
        )
                }
}

export default Stock;
