import { ethers } from "ethers"
import React, { Component } from 'react'
import TokenAbi from './contractsData/token.json'
import TokenAddress from './contractsData/token-address.json'
import BroTokenAbi from './contractsData/broToken.json'
import BroTokenAddress from './contractsData/broToken-address.json'
import DexTokenAbi from './contractsData/dexToken.json'
import DexTokenAddress from './contractsData/dexToken-address.json'
import EthSwapAbi from './contractsData/ethSwap.json'
import EthSwapAddress from './contractsData/ethSwap-address.json'
import PoolLiquidityAbi from './contractsData/poolLiquidity.json'
import PoolLiquidityAddress from './contractsData/poolLiquidity-address.json'
import GouvernanceAbi from './contractsData/gouvernance.json'
import GouvernanceAddress from './contractsData/gouvernance-address.json'

import { NoWalletDetected } from "./NoWalletDetected"
import { ConnectWallet } from "./ConnectWallet"
import Swap from './Swap'
import Pool from './Pool'
import Dashboard from './Dashboard'
import Background from "./background-dexter2.jpg";
const HARDHAT_NETWORK_ID = '31337';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      signer: undefined,
      tokenContract: undefined,
      tokenName: undefined,
      tokenSymbol: undefined,
      tokenBalance: 0,
      tokenRate: undefined,
      tokenStakingBalance: 0,
      tokenDepositTime: undefined,

      rewardTime: 0,
      tokenNextReward: undefined,
      broTokenNextReward: undefined,

      broTokenContract: undefined,
      broTokenName: undefined,
      broTokenSymbol: undefined,
      broTokenBalance: 0,
      broTokenRate: undefined,
      broTokenStakingBalance: 0,
      broTokenDepositTime: undefined,

      poolLiquidityContract: undefined,
      gouvernanceContract: undefined,

      ethSwapContract : undefined,
      selectedAddress: undefined,
      ethBalance: 0,

      currentForm: 'dashboard',

      listeProposals: [],
      listeVotes: [],
      hasVotedForProposal: [],

      listeTransactionsAccount : [],
      listeTransactionsTotal: [],
      transactionCount : undefined,

      loading: true,

    }
}



async componentWillMount() {
  await this.loadWeb3()
}

async loadWeb3() {
  if (window.ethereum === undefined) {
    window.alert("No Ethereum wallet was detected, please install metamask (http://metamask.io)");
  }
  else if(!this.state.selectedAddress){
    this._connectWallet()
  }
}

async loadBlockchainData(provider, account) {
  const signer = provider.getSigner()
  this.loadTokenContract(signer)
  this.loadBroTokenContract(signer)
  this.loadDexTokenContract(signer)
  this.loadEthSwapContract(signer)
  this.loadPoolLiquidityContract(signer, account)
  this.loadGouvernanceContract(signer, account)
  this.setState({ loading: false,
                  signer: signer})

}

loadTokenContract = async (signer) => {
  let contract = new ethers.Contract(TokenAddress.address, TokenAbi.abi, signer)
  let name = await contract.name();
  let symbol = await contract.symbol();
  let balance = await contract.balanceOf(await signer.getAddress())
  this.setState({tokenContract: contract,
                 tokenBalance: balance.toString(),
                 tokenName:  name,
                 tokenSymbol: symbol})
}

loadBroTokenContract = async (signer) => {
  let contract = new ethers.Contract(BroTokenAddress.address, BroTokenAbi.abi, signer)
  let name = await contract.name();
  let symbol = await contract.symbol();
  let balance = await contract.balanceOf(await signer.getAddress())
  this.setState({broTokenContract: contract,
                 broTokenBalance: balance.toString(),
                 broTokenName:  name,
                 broTokenSymbol: symbol})
}

loadDexTokenContract = async (signer) => {
  let contract = new ethers.Contract(DexTokenAddress.address, DexTokenAbi.abi, signer)
  let balance = await contract.balanceOf(await signer.getAddress())
  this.setState({dexTokenBalance: balance.toString()})
}


loadEthSwapContract = async (signer) => {
  let contract = new ethers.Contract(EthSwapAddress.address, EthSwapAbi.abi, signer)
  let tokenRate = await contract.tokenRate();
  let broTokenRate = await contract.broTokenRate();
  let transactionCount = await contract.transactionCount()
  this.setState({ethSwapContract: contract,
                tokenRate: tokenRate.toString(),
                broTokenRate: broTokenRate.toNumber(),
                transactionCount: transactionCount.toNumber()})
  for(var i=1; i <= transactionCount.toNumber();i++){
      let transactionToAccount = await contract.transactionToAccount(i)
      let transaction = await contract.transactions(i)
      this.setState({
        listeTransactionsTotal: [...this.state.listeTransactionsTotal, transaction],
          })
      if(ethers.utils.getAddress(transactionToAccount)===ethers.utils.getAddress(this.state.selectedAddress)){
         this.setState({
           listeTransactionsAccount: [...this.state.listeTransactionsAccount, transaction],
           })
      }
    }
}

loadPoolLiquidityContract = async (signer, account) => {
  console.log(account)
  let contract = new ethers.Contract(PoolLiquidityAddress.address, PoolLiquidityAbi.abi, signer)
  let tokenStakingBalance = await contract.tokenStakingBalance(account)
  let broTokenStakingBalance = await contract.broTokenStakingBalance(account)
  let tokenDepositTime = await contract.tokenDepositTime(account)
  let broTokenDepositTime = await contract.broTokenDepositTime(account)
  let rewardTime = await contract.rewardTime()

  this.setState({poolLiquidityContract: contract,
                 tokenStakingBalance : tokenStakingBalance.toNumber(),
                 broTokenStakingBalance : broTokenStakingBalance.toNumber(),
                 tokenDepositTime : tokenDepositTime,
                 broTokenDepositTime : broTokenDepositTime,
                 rewardTime: rewardTime,
                 tokenNextReward: (parseFloat(tokenDepositTime)) + parseFloat(rewardTime),
                 broTokenNextReward: (parseFloat(broTokenDepositTime)) + parseFloat(rewardTime)
              })
}

loadGouvernanceContract = async (signer, account) => {
  let contract = new ethers.Contract(GouvernanceAddress.address, GouvernanceAbi.abi, signer)
  let nbProposal = await contract.nbProposal()
  this.setState({ gouvernanceContract: contract })

  for(var i = 1; i <= nbProposal; i++) {
    let proposal = await contract.proposals(i)
    let hasVotedForProposal = await contract.hasVotedForProposal(i, account).call()
    this.setState({ listeProposals : [...this.state.listeProposals, proposal],
                    hasVotedForProposal: [...this.state.hasVotedForProposal, hasVotedForProposal]
      })
  }

  let nbVote = await contract.nbVote()
  for(var i2 = 1; i2 <= nbVote; i2++) {
    let vote = await contract.votes(i2)
    this.setState({ listeVotes : [...this.state.listeVotes, vote],
    })
  }

}
_connectWallet = async () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    let account = await provider.send("eth_requestAccounts")
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      let balance = await provider.getBalance(account.toString())
      this.setState({ selectedAddress: account.toString(),
                    ethBalance: ethers.utils.formatEther(balance)})
      await this.loadBlockchainData(provider, account.toString())
  }
  else{
      window.alert('Please connect Metamask to Localhost:8545')
  }
}

buyTokens = async (tokenName, etherAmount) => {
  console.log(tokenName, etherAmount)
  let value = ethers.utils.parseEther(etherAmount)
  this.setState({ loading: true })
  await this.state.ethSwapContract.connect(this.state.signer).buyTokens(tokenName, { value: value.toString()})
  this.setState({ loading: false })
    //console.log(this.state.transactionCount.toNumber())
  
}

sellTokens = async (tokenAmount, tokenName) => {
  console.log(tokenAmount, tokenName)
  if(tokenName ==="DApp Token") {
    this.setState({ loading: true })
    let tx = await this.state.tokenContract.connect(this.state.signer).approve(this.state.ethSwapContract.address, tokenAmount)
    await tx.wait()
    await this.state.ethSwapContract.connect(this.state.signer).sellTokens(tokenAmount, tokenName)
    this.setState({ loading: false })
  }
  else{
      this.setState({ loading: true })
      this.state.broToken.connect(this.state.signer).approve(this.state.ethSwap.address, tokenAmount).on('transactionHash', (hash) => delayedCallback(this, hash))
      function delayedCallback(obj, hash) {
            console.log('in delay', obj.state.account)
            window.setTimeout(() => { console.log('approval', hash)
              obj.state.ethSwap.methods.connect(this.state.signer).sellTokens(tokenAmount, tokenName).on('transactionHash', (hash) => {
                obj.setState({ loading: false })
              })
            }, 1000)
          }
  }
   window.location.reload();
}

stakeTokens = async (tokenName, amount, timestamp) => {
  console.log("stake token", tokenName, amount, timestamp)
  if(tokenName ==="DApp Token") {
    this.setState({ loading: true })
    let tx = await this.state.tokenContract.connect(this.state.signer).approve(this.state.poolLiquidityContract.address, amount)
    await tx.wait()
    await this.state.poolLiquidityContract.connect(this.state.signer).stakeTokens(tokenName, amount, timestamp)
    this.setState({ loading: false })
    }
  else{
    this.setState({ loading: true })
    let tx = await this.state.broTokenContract.approve(this.state.poolLiquidityContract.address, amount)
    await tx.wait()
    await this.state.poolLiquidityContract.stakeTokens(tokenName, amount, timestamp)
    this.setState({ loading: false })
  }
}

unstakeTokens = async (tokenName, amount) => {
  console.log("unstake", tokenName, amount)
  this.setState({ loading: true })
  this.state.poolLiquidityContract.connect(this.state.signer).unstakeTokens(tokenName, amount)
    this.setState({ loading: false })
}

 getReward = (tokenName, timestamp) => {
   console.log("get reward", tokenName, timestamp)
    this.state.poolLiquidityContract.connect(this.state.signer).issueTokens(tokenName, timestamp)
}

getWaitingReward = (tokenName) => {
  let balance = 0
  let total = 0
  let time = 0
  if(tokenName==="DApp Token"){
    balance = this.state.tokenStakingBalance
    time = parseFloat(this.state.tokenDepositTime) + parseFloat(this.state.rewardTime)
    if(balance > 0) {
      while(Math.round(time) < Math.round(new Date()/1000)) {
        total = parseFloat(total) + parseFloat(balance.toString())
        time = parseFloat(Math.round(time)) + parseFloat(this.state.rewardTime.toNumber());
      }
      this.setState({ tokenWaitingReward: total.toString()})
      return this.state.tokenWaitingReward
    }
    else {return 0}
  }
  else{
    balance = this.state.broTokenStakingBalance / 100
    time = parseFloat(this.state.broTokenDepositTime) + parseFloat(this.state.rewardTime)
    if(balance > 0) {
      while(Math.round(time) < Math.round(new Date()/1000)) {
        total = (parseFloat(total) + parseFloat(balance.toString()))
        time = parseFloat(Math.round(time)) + parseFloat(this.state.rewardTime.toNumber())
      }
      this.setState({ broTokenWaitingReward: total.toString()})
      return this.state.broTokenWaitingReward
    }
    else {return 0}
  }
}

  render() {
    let wallet
    if(!this.state.selectedAddress){
      wallet =        <button
                  className="btn btn-warning m-1"
                  type="button"
                  onClick={this._connectWallet}
                >
                  Connect Wallet
                </button>

    }
    else {
      wallet = <div className=" col-3 text-left text-white">{this.state.selectedAddress}</div>
    }
    let content
    if(this.state.loading) {
      content = <p style={{color:'white'}}id="loader" className="text-center">Loading...</p>
    }
    else if(this.state.currentForm==='dashboard'){
      content = <Dashboard
        ethBalance = {this.state.ethBalance}
        tokenBalance = {this.state.tokenBalance}
        tokenStakingBalance = {this.state.tokenStakingBalance}
        broTokenBalance = {this.state.broTokenBalance}
        broTokenStakingBalance = {this.state.broTokenStakingBalance}
        listeTransactionsAccount={this.state.listeTransactionsAccount}
      />
    }
    else if(this.state.currentForm==='swap'){
      content = <Swap
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        tokenRate={this.state.tokenRate}
        tokenName={this.state.tokenName}
        broTokenRate={this.state.broTokenRate}
        broTokenBalance={this.state.broTokenBalance}
        broTokenName={this.state.broTokenName}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
        listeTransactionsAccount={this.state.listeTransactionsAccount}
      />
    }
    else if(this.state.currentForm==='pool'){
      content = <Pool
        dexTokenBalance={this.state.dexTokenBalance}
        tokenBalance={this.state.tokenBalance}
        tokenName={this.state.tokenName}
        broTokenBalance={this.state.broTokenBalance}
        broTokenName={this.state.broTokenName}
        tokenStakingBalance={this.state.tokenStakingBalance}
        broTokenStakingBalance={this.state.broTokenStakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
        getReward={this.getReward}
        getWaitingReward={this.getWaitingReward}
        tokenWaitingReward={this.state.tokenWaitingReward}
        broTokenWaitingReward={this.state.broTokenWaitingReward}
      />
    }



  return (
    <div className="container-fluid bg-image" style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', height:1000}}>
      <div className="row bg-dark bg-gradient">
        <nav className="navbar navbar-dark bg-dark flex-md-nowrap shadow">
          <div className=" col-9 text-center ml-5">
          <button className="btn btn-outline-danger m-2"
                  onClick={(event) => {
                          this.setState({ currentForm: 'dashboard' })
                        }}>
                      Dashboard
          </button>
            <button className="btn btn-outline-danger m-2"
                    onClick={(event) => {
                            this.setState({ currentForm: 'swap' })
                          }}>
                        Swap
            </button>
            <button className="btn btn-outline-danger m-2"
                    onClick={(event) => {
                            this.setState({ currentForm: 'pool' })
                          }}
                        >
                        Pool
            </button>
            <button className="btn btn-outline-danger m-2"
                    onClick={(event) => {
                            this.setState({ currentForm: 'gouvernance' })
                          }}>
                        Gouvernance
            </button>
          </div>
            {wallet}
        </nav>
      </div>
      {content}
    </div>
  );
  }
}


export default App;
