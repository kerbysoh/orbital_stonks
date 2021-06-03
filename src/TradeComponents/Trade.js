import React ,{useState} from 'react'
import Navbar from '../components/Navbar'


const Trade = ({handleLogout}) => {
    const[amount, setAmount] = useState('')
    const regexp = new RegExp(/^[0-9\b]+$/)
    const[print, setPrint] = useState(false)
    
    const onHandleAmountChange = (e) => {
        setAmount(e.target.value)

        // if value is not blank, then test the regex
        if (amount === '' || regexp.test(amount)) {
            setAmount(e.target.value)
        }
    };

    const setPrintTrue = () => {
      setPrint(true)
    }

    const setPrintFalse = () => {
      setPrint(false)
    }

        return (
            <>
            <Navbar handleLogout = {handleLogout} />  
            <div>
                < label >Type in amount : </ label >
                < input
                    type="amount" name="amount" placeholder="Amount..."
                    value={amount}
                    onChange= {onHandleAmountChange} onClick={setPrintFalse}
                />
                <btn onClick={setPrintTrue}>Set Current Amount</btn>
                {
                  print?
                  <header className="price-display">Investing: ${amount}</header> : null
                }
                
            </div>
            
            </>
        );
     
}



    
export default Trade;
