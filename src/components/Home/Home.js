import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import {Button, Grid, Paper} from '@mui/material';
import { useHistory } from "react-router-dom"
import {ethers} from "ethers";
import './Home.css';
import lotteryABI from "../../abis/Lottery.json"

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));  


export default function Home() {

    const [jackpot, setJackpot] = useState("");
    const [winner, setWinner] = useState("");
    const [locked, setLocked] = useState("");
    const history = useHistory();

    useEffect(() =>{
      getJackpot();
      getWinner();
      getLocked();
    }, []);

    const getJackpot = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let contract = new ethers.Contract( "0x7787df0E60841c29eb0FdEb19800A7ed17Cc16d1" , lotteryABI , provider );
        setJackpot(parseInt((await contract.pool())._hex, 16));

    }

    const getWinner = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let contract = new ethers.Contract( "0x7787df0E60841c29eb0FdEb19800A7ed17Cc16d1" , lotteryABI , provider );
        setWinner(await contract.winner());
    }

    const getLocked = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let contract = new ethers.Contract( "0x7787df0E60841c29eb0FdEb19800A7ed17Cc16d1" , lotteryABI , provider );
        
        let unix_timestamp = parseInt(await contract.last_drawn()) + parseInt(await contract.cooldown());

        let date = new Date(unix_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = date.getFullYear();
        var month = months[date.getMonth()];
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();
        
        setLocked(date + ' ' + month + ' ' + year + ' ' + hours + ':' + minutes + ':' + seconds);
    }

    async function handleEnter() {
        try {
          history.push("/enter");
        } catch {
          console.log("Logout error");
        }
    }

    window.ethereum.on('accountsChanged', () => {
        window.location.reload();
    });
  
      window.ethereum.on('disconnect', () => {
        window.location.reload();
    });

    return(
        <div className="homeContainer">
            <Grid container spacing={10}>
                <Grid item xs={6}>
                    <Item>
                        <Button onClick={handleEnter}>ENTER</Button>
                    </Item>
                </Grid>
                <Grid item xs={6}>
                    <Item>
                        Current Jackpot: {jackpot}
                    </Item>
                </Grid>
                <Grid item xs={6}>
                    <Item>
                        Winner: 
                        {(winner !== "0x0000000000000000000000000000000000000000" && " " + winner) || "No draw yet"}
                    </Item>
                </Grid>
                <Grid item xs={6}>
                    <Item>
                        Locked until: {locked}
                    </Item>
                </Grid>
            </Grid>
        </div>    
    );
}