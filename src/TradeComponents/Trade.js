import React ,{useState, useRef, Component} from 'react'
import {Link} from 'react-router-dom'

class Trade extends Component {
    constructor(props) {
        super(props);
        this.onHandleAmountChange = this.onHandleAmountChange.bind(this);  
        this.state = {
            amount: '',
            regexp : /^[0-9\b]+$/,
            print: false
        }   
    }
    

    onHandleAmountChange = e => {
        let amount = e.target.value;

        // if value is not blank, then test the regex
        if (amount === '' || this.state.regexp.test(amount)) {
            this.setState({ [e.target.name]: amount })
        }
    };

    setPrintTrue = () => {
      this.setState({print: true})
    }

    setPrintFalse = () => {
      this.setState({print: false})
    }

    render() {
        return (
            <>
            <div className="chatPage">
              <button><Link to = '/'>Home</Link></button>
                < label >Type in amount : </ label >
                < input
                    type="amount" name="amount" placeholder="Amount..."
                    value={this.state.amount}
                    onChange={this.onHandleAmountChange} onClick={this.setPrintFalse}
                />
                <btn onClick={this.setPrintTrue}>Set Current Amount</btn>
                {
                  this.state.print?
                  <header className="price-display">Investing: ${this.state.amount}</header> : null
                }
                
            </div>
            
            </>
        );
    }
}
export default Trade;
