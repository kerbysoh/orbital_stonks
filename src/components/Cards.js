import React from 'react';
import './Cards.css';
import CardItem from './CardItem';
import { Button } from './Button';
import { Link } from 'react-router-dom';

function Cards() {
  return (
    <div className='cards'>
      <h1>Check out these features!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/img-10.jpg'
              text='Chat with other users as well!'
              label='Chat'
              path='/Chat'
            />
            <CardItem
              src='images/img-9.jpg'
              text='Trade with STONKS now!'
              label='Trade'
              path='/Trade'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/img-11.jpg'
              text='Keep up with the latest stock news!'
              label='News'
              path='/News'
            />
            <CardItem
              src='images/img-13.jpg'
              text='Add others to share your trading experiences!'
              label='Friends'
              path='/Friends'
            />
            <CardItem
              src='images/img-12.jpg'
              text='Experience real-time stocks data with your watchlist'
              label='Watchlist'
              path='/Stock'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
