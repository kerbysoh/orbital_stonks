import React from "react";
import { Link } from "react-router-dom";

function CardItem(props) {
  return (
    <>
      <li className="stockcards__item">
        <h1 className="stockcards__item__link" to={props.path}>
          <figure
            className="stockcards__item__pic-wrap"
            data-category={props.label}
          ></figure>
          <div className="stockcards__item__info">
            <h5 className="stockcards__item__text">{props.text}</h5>
          </div>
        </h1>
      </li>
    </>
  );
}

export default CardItem;
