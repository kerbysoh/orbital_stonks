import React from 'react';
import {data} from './data';

const UseStateArray =() => {
    const [stock, setStock] = React.useState(data);
    const removeItem = (id) => {
        let newStock = stock.filter((delStock) => delStock.id !== id)
        setStock( newStock);
    } 
    return (
        <>
        {stock.map((stock) => {
            const{id, ticker} = stock;
        return (
            <div key = {id} className='item'>
                <h4>{ticker}
                <click onClick ={() => removeItem(id)}>Remove</click>
                </h4>
            </div>
        )
        })}
        <div>
            <btn className= 'btn' onClick={() =>setStock([])}>
                    Clear Watchlist
                </btn>
        </div>
        
        </>
    );
};

export default UseStateArray;
