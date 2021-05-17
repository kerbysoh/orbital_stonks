import axios from 'axios';
import React, {createContext, useState, useEffect} from 'react';

export const NewsContext = createContext()

export const NewsContextProvider = (props) => {
    const [data, setData] = useState();
    const apiKey = "d8bd6fe4da3242c7be58cd2d54e2bd84";

    useEffect(() => {
        axios
            .get(
                `https://newsapi.org/v2/everything?q=stockmarket&sortBy=publishedAt&apiKey=${apiKey}`
            )
            .then((response) => setData(response.data))
            .catch((error) => console.log(error));
    }, []);

    return (
        <NewsContext.Provider value = {{data}}>
            {props.children}
        </NewsContext.Provider>
    );
    
};
