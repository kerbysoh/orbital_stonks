import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RiskLevel from "./RiskLevel";
import Button from "@material-ui/core/Button";
import firebase from 'firebase/app'
import fire from '../fire'
import 'firebase/firestore'

const Trade = ({ handleLogout }) => {
  const db = firebase.firestore()
  const userEmail = fire.auth().currentUser.email
  const [amount, setAmount] = useState("");
  const [placeholderamount, setPlaceholderAmount] = useState("");

  const regexp = new RegExp(/^[0-9\b]+$/);
  const [print, setPrint] = useState(false);
  const [hasrisk, setRisk] = useState(false)

  useEffect (()=> {
        if (db) {
            const unsubscribe = db
            db.collection('Amount')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setAmount(doc.get("Amount"))
                    setPrint(true)
                } 
            })

            db.collection('RiskLevel')
            .doc(fire.auth().currentUser.email)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setRisk(true)
                } 
            })
            
            return unsubscribe
        }
    }, [db])

  const onHandleAmountChange = (e) => {
    // if value is not blank, then test the regex
    if (amount === "" || regexp.test(amount)) {
      setPlaceholderAmount(e.target.value);
    } else {
      setPlaceholderAmount("");
    }
  };

  const setPrintTrue = () => {
    setPrint(true);
  };

  const handleAddAmount = () => {
        db.collection("Amount").doc(`${userEmail}`).update({
            Amount : placeholderamount
        })
  }

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <div>
        <RiskLevel></RiskLevel>
        <form className="footer-subscription">
          <label>Type in amount : </label>
          <input
            type= "number"
            name="amount"
            placeholder="Amount..."
            value={placeholderamount}
            onChange={onHandleAmountChange}
          />
          <h2>
            <Button variant="contained" onClick={() => {setPrintTrue(); handleAddAmount()}}>
              Set Current Amount
            </Button>
          </h2>
          <br />
          {print & hasrisk ? (
            
            <header className="price-display"> Investing: ${amount}</header>
          ) : <header className="price-display"> Select Risk Level and Input Amount</header>}
        </form>
      </div>
    </>
  );
};

export default Trade;
