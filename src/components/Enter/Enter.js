import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, Button, Paper } from "@mui/material";
import { ethers } from "ethers";
import "./Enter.css";
import lotteryABI from "../../abis/Lottery.json";
import MOKABI from "../../abis/MOKToken.json";

export default function Enter() {
  const [fee, setFee] = useState("");
  const [poolContribution, setPoolContribution] = useState("");
  const [ownerFee, setOwnerFee] = useState("");
  const [err, setErr] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");

  useEffect(() => {
    getFee();
    getPoolContribution();
    getOwnerFee();
    getAccount();
  }, []);

  const getFee = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let contract = new ethers.Contract(
      "0x7787df0E60841c29eb0FdEb19800A7ed17Cc16d1",
      lotteryABI,
      provider
    );
    setFee(parseInt((await contract.entryFee())._hex, 16));
  };

  const getPoolContribution = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let contract = new ethers.Contract(
      "0x7787df0E60841c29eb0FdEb19800A7ed17Cc16d1",
      lotteryABI,
      provider
    );
    setPoolContribution(parseInt((await contract.poolContribution())._hex, 16));
  };

  const getOwnerFee = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let contract = new ethers.Contract(
      "0x7787df0E60841c29eb0FdEb19800A7ed17Cc16d1",
      lotteryABI,
      provider
    );
    setOwnerFee(parseInt((await contract.ownerFee())._hex, 16));
  };

  async function handleApprove() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let MOKContract = new ethers.Contract(
      "0xAe52aaE37B10Ef9Adcb050A54778c5Abcf1f8632",
      MOKABI,
      signer
    );

    await MOKContract.approve(
      "0x7787df0E60841c29eb0FdEb19800A7ed17Cc16d1",
      ethers.utils.parseEther("20")
    );
  }

  async function handleEnter() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let lotteryContract = new ethers.Contract(
      "0x7787df0E60841c29eb0FdEb19800A7ed17Cc16d1",
      lotteryABI,
      signer
    );

    try {
      await lotteryContract.enter();
      setErr("");
    } catch (err) {
      setErr("You have not approved the transaction, please do that first!");
    }
  }

  const getAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const accounts = await signer.getAddress();
      setCurrentAddress(accounts);
    } catch (err) {
      console.log(err);
    }
  };

  window.ethereum.on("accountsChanged", () => {
    window.location.reload();
  });

  window.ethereum.on("disconnect", () => {
    window.location.reload();
  });

  return (
    <div className="enterContainer">
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        noValidate
        autoComplete="off"
      >
        <h1>Entry Fee: {fee}</h1>
        <h1>Pool Contribution: {poolContribution}</h1>
        <h1>Owner Fee: {ownerFee}</h1>
        {currentAddress !== "" && (
          <Button
            variant="outlined"
            style={{
              borderColor: "black",
              color: "black",
              backgroundColor: "#2ecc71"
            }}
            onClick={handleApprove}
          >
            Approve
          </Button>
        )}
        <br />
        {currentAddress !== "" && (
          <Button
            variant="outlined"
            style={{
              borderColor: "black",
              color: "black",
              backgroundColor: "#2ecc71"
            }}
            onClick={handleEnter}
          >
            Enter
          </Button>
        )}
        <h2 style={{ color: "red" }}>{err}</h2>
      </Box>
    </div>
  );
}
