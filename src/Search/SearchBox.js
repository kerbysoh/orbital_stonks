import React from 'react'
import '../components/Footer.css';
import './SearchBox.css'
const SearchBox = ({placeholder,handleChange}) =>{
    return(
        <section className = 'stock-search'>
        <div className='input-areas'>
          <form>
            <input
              className='footer-input'
              name='stock'
              type='stock'
              placeholder={placeholder}
            onChange = {handleChange}
            />
          </form>
        </div>
        </section>
    )
}

export default SearchBox;
