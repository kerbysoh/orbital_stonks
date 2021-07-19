import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import firebase from "firebase/app";
import fire from "../fire";
import "firebase/firestore";
import Transaction from "./Transaction";
import Inputs from "./InputsTrade";
import "./Trade.css";

const Trade = ({ handleLogout }) => {
  const db = firebase.firestore();
  const userEmail = fire.auth().currentUser.email;
  const [amount, setAmount] = useState("");
  const [placeholderamount, setPlaceholderAmount] = useState("");

  const regexp = new RegExp(/^[0-9\b]+$/);
  const [print, setPrint] = useState(false);
  const [hasrisk, setRisk] = useState(false);

  useEffect(() => {
    if (db) {
      const unsubscribe = db;
      db.collection("Amount")
        .doc(fire.auth().currentUser.email)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setAmount(doc.get("Amount"));
            setPrint(true);
          }
        });

      db.collection("RiskLevel")
        .doc(fire.auth().currentUser.email)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setRisk(true);
          }
        });

      return unsubscribe;
    }
  }, [db]);

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
        <form className="footer-subscription">
          <Inputs></Inputs>
          <Transaction></Transaction>
        </form>
      </div>
    </>
  );
};

export default Trade;
