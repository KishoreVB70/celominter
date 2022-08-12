import './App.css';
import {useState, useEffect} from "react";
import Web3 from 'web3';
import { newKitFromWeb3 } from '@celo/contractkit';
import abi from "./abi.json"
function App() {

  //State Variables
  let contractAddress = "0x0a89DE93dc853cbbC5D9cFaB3c683f529882F1Fe";

  const [kit,setKit] = useState();
  const [walletAddress, setWalletAddress] = useState("");
  const [nftID, setNftId] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [inputAddress, setinputAddress] = useState("");

  //Code which is used to create the contract instance everytime
  const connectToContract = async() => {
    const loanContract = new kit.web3.eth.Contract(
        abi.abi,
        contractAddress
    );

    return loanContract;
    
  }
  const getCount = async() => {
    const contract = await connectToContract();
    let count = await contract.methods.getId().call();
    setNftId(count - 1);
  }

   // connect wallet to app
   const connectWallet = async () => {
    if (window.celo) {
      // alert("⚠️ Please approve this DApp to use it.");
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const defaultAccount = accounts[0];
        kit.defaultAccount = defaultAccount;

        setKit(kit);
        setWalletAddress(defaultAccount);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert(
        "You need to install the celo wallet extension in order to use this app"
      );
    }
  };

  const getApproval = async() => {
    const contract = await connectToContract();
    await contract.methods.approve(inputAddress, inputToken).send({ from: kit.defaultAccount });
  }
  const mintNFT = async() => {
    const contract = await connectToContract();

    await contract.methods.mint().send({ from: kit.defaultAccount });
    let count = await contract.methods.getId().call();
    console.log("Minted NFT with the ID: ",count - 1);
    setNftId(count - 1);
  }

  useEffect( () => {
    connectWallet();
  },[] )

//<---------------------------------------------------------------------------------------------------------------------------------->
  //UI
  return (
    <div className="App">
      <h1>Test Minter</h1>
          <div>
            <p className='account'>User Account: {walletAddress} </p>
            <div className="addressContainer" >
              <p className='minterAddress' >Minter Contract Address: {contractAddress}</p>
            </div>
            <p >Last minted NFT Id: {nftID}</p>
            <button onClick={getCount} >Get count</button>
            <p>Click to mint your own NFT👇</p>
            <button onClick={mintNFT} className='mintButton' >Mint an NFT</button>
            <p>Click here to give approval to the Loan contract 👇</p>
            <input placeholder='token Id' value={inputToken}  onChange={(e) => setInputToken(e.target.value)} />
            <input placeholder='Contract Address' value={inputAddress}  onChange={(e) => setinputAddress(e.target.value)} />
            <button onClick={getApproval} >Give Approval</button>
          </div>
    </div>
  );
}

export default App;
