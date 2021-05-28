import React, {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import {Link, useLocation} from 'react-router-dom';
import 'firebase/firestore'
import firebase from 'firebase/app'
import fire from '../fire'
import Navbar from "../components/Navbar"

const StockGraphs = (props) => {

    const [stockChartXValues, setStockChartXValues] = useState([])
    const [stockChartYValues, setStockChartYValues] = useState([])
    const {handleLogout} = props
    const location = useLocation()
    useEffect(() => {
        fetchStock()
        console.log(props)
    }, []) 
    const fetchStock = () => {
        const StockSymbol = location.state.name
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

                    for(var key in data['Time Series (Daily)']) {
                        stockChartXValuesFunction.push(key);
                        stockChartYValuesFunction.push(data['Time Series (Daily)'][key]['1. open']);
                    }
                    setStockChartXValues(stockChartXValuesFunction)
                    setStockChartYValues(stockChartYValuesFunction)
                }
            )
    }

        return (
            <>
            <Navbar handleLogout = {handleLogout} />
                <Plot
                data={[
                {
                    x: stockChartXValues,
                        y: stockChartYValues,
                        type: 'scatter',
                        mode: 'lines',
                        marker: {color: 'black'},
                    } 
                    ]}
                    layout={{width: 640, height: 440, title: location.state.name, plot_bgcolor:'transparent', paper_bgcolor: 'transparent'}}
                />

            </>
        )
}
export default StockGraphs;
