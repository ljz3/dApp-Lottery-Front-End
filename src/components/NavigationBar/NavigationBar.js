import React, { useState, useEffect } from "react";
import {Button} from '@mui/material';
import {ethers} from "ethers";
import './NavigationBar.css';
 

export default function NavigationBar() {

  const [currentAddress, setCurrentAddress] = useState("");

  async function connectMetamask() {

    if(!window.ethereum){
      console.log("no eth wallet");
    }else{
      const address = await window.ethereum.send("eth_requestAccounts");
      setCurrentAddress(address.result[0]);
      // console.log(currentAddress);
    }
  }

  useEffect(() =>{
    getAccount();
  }, []);

  const getAccount = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try{
      const accounts = await signer.getAddress();
      setCurrentAddress(accounts);

    } catch(err) {
      console.log(err);
    }
  }

  window.ethereum.on('accountsChanged', () => {
    window.location.reload();
  });

  window.ethereum.on('disconnect', () => {
    window.location.reload();
  });

  return(
    <div className="navbar">
      <Button variant="outlined" style={{borderColor: "#FFFFFF", color: '#FFFFFF'}} href="/">Home</Button>
      <Button variant="outlined" style={{borderColor: "#FFFFFF", color: '#FFFFFF'}} href="https://rinkeby.etherscan.io/address/0xAe52aaE37B10Ef9Adcb050A54778c5Abcf1f8632">Token Etherscan</Button>
      <Button variant="outlined" style={{borderColor: "#FFFFFF", color: '#FFFFFF'}} href="https://rinkeby.etherscan.io/address/0x7787df0E60841c29eb0FdEb19800A7ed17Cc16d1">Lottery Etherscan</Button>
      {currentAddress === "" && <Button variant="outlined" style={{borderColor: "#FFFFFF", color: '#FFFFFF'}} onClick={connectMetamask}>Connect with MetaMask</Button>}
      {currentAddress !== "" && <Button variant="outlined" style={{borderColor: "#FFFFFF", color: '#FFFFFF'}}>{currentAddress.substring(0,10)} ...</Button>}
    </div>    
  );
}
