import React, { useState } from "react";
import Navbar from "../components/Navbar";
import RiskLevel from "./RiskLevel";
import Button from "@material-ui/core/Button";

const Trade = ({ handleLogout }) => {
  const [amount, setAmount] = useState("");
  const regexp = new RegExp(/^[0-9\b]+$/);
  const [print, setPrint] = useState(false);

  const onHandleAmountChange = (e) => {
    // if value is not blank, then test the regex
    if (amount === "" || regexp.test(amount)) {
      setAmount(e.target.value);
    } else {
      setAmount("");
    }
  };

  const setPrintTrue = () => {
    setPrint(true);
  };

  const setPrintFalse = () => {
    setPrint(false);
  };

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <div>
        <RiskLevel></RiskLevel>
        <form className="footer-subscription">
          <label>Type in amount : </label>
          <input
            type="amount"
            name="amount"
            placeholder="Amount..."
            value={amount}
            onChange={onHandleAmountChange}
            onClick={setPrintFalse}
          />
          <h2>
            <Button variant="contained" onClick={setPrintTrue}>
              Set Current Amount
            </Button>
          </h2>
          <br />
          {print ? (
            <header className="price-display"> Investing: ${amount}</header>
          ) : null}
        </form>
      </div>
    </>
  );
};

export default Trade;
