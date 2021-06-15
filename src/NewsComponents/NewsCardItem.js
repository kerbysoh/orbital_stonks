import React from "react";
import './NewsCardItem.css'

function CardItem(props) {
  return (
    <>
      <li className="newscards__item">
        <div className="newscards__item__link">
          <figure className="newscards__item__pic-wrap">
            <img
              className="newscards__item__img"
              alt="Not Available"
              src={props.src}
            />
          </figure>
          <div className="newscards__item__info">
            <h3 className="newscards__item__text">{props.text}</h3>
            <h5 className="newscards__item__subtext">{props.label}</h5>
            <a className="link-to-news" target="" href={props.path}>
              {" "}
              See More{" "}
            </a>
          </div>
        </div>
      </li>
    </>
  );
}

export default CardItem;
