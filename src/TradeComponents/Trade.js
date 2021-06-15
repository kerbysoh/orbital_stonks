import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RiskLevel from "./RiskLevel";
import Button from "@material-ui/core/Button";
import firebase from 'firebase/app'
import fire from '../fire'
import 'firebase/firestore'
import OpenDialogue from './OpenDialogue'
import Transaction from './Transaction'

const Trade = ({ handleLogout }) => {
  const db = firebase.firestore()
  const userEmail = fire.auth().currentUser.email
  const [amount, setAmount] = useState("");
  const [placeholderamount, setPlaceholderAmount] = useState("");

  const regexp = new RegExp(/^[0-9\b]+$/);
  const [print, setPrint] = useState(false);
  const [hasrisk, setRisk] = useState(false)

  const addTransaction = () => {
    db.collection('Transaction').doc(`${userEmail}`).add({
          Ticker: "XYZ",
          Amount: 12345,
          StartDate: 211018,
          EndDate: 211119,
          ProfitAndLoss: 5,
        })
    
}

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
    /* if (amount === "" || regexp.test(amount)) { */
      setPlaceholderAmount(e.target.value);
    /* } else {
      setPlaceholderAmount("");
    } */
  };

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <div>
        <RiskLevel></RiskLevel>
        <form className="footer-subscription">
          <input
            type="number"
            name="amount"
            placeholder="Set Amount..."
            value={placeholderamount}
            onChange={onHandleAmountChange}
          />
          <h2>
            <OpenDialogue placeholderamount = {placeholderamount}></OpenDialogue>
          </h2>
          <br />
          {print & hasrisk ? (
            <header className="price-display"> Investing: ${amount}</header>
          ) : (
            <header className="price-display">
              {" "}
              Select Risk Level and Input Amount
            </header>
          )}
          <Transaction></Transaction>
        </form>
      </div>
    </>
  );
};

export default Trade;
