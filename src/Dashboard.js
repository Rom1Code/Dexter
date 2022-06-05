import { ethers } from "ethers"
import React, { Component } from 'react'
import tokenLogo from './token-logo.png'
import broTokenLogo from './brocoin-logo.jpg'
import ethLogo from './eth-logo.png'


class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    this.props.tokensList.map((token, key)=> {
      this.props.getWaitingReward(token[1])
    })
  }

  activeProposal() {

  }

  timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

progressBar(yes,total){
  const pourcentage = (yes / total) * 100
  if(pourcentage <= 25) {
  return <div className="progress-bar w-0" role="progressbar"  ></div>
  }
  else if(pourcentage <= 50) {
  return <div className="progress-bar w-25" role="progressbar"  ></div>
  }
  else if(pourcentage <= 75) {
  return <div className="progress-bar w-50" role="progressbar"  ></div>
  }
  else if(pourcentage > 75 && pourcentage < 100){
    return <div className="progress-bar w-75" role="progressbar"  ></div>
  }
  else if(pourcentage === 100) {
    return <div className="progress-bar w-100" role="progressbar"  ></div>
  }
  else {
    return <div className="progress-bar w-0" role="progressbar"  ></div>
  }
}

  render() {
console.log(this.props.hasVotedForProposal)
  return (
    <div>
      <div className="row border-top border-danger">
        <div className="col bg-dark text-danger text-center h1 shadow">
          <p>Dashboard</p>
        </div>
      </div>
        <div className="row card-body justify-content-center">
          <div className="col col-3 text-white card bg-danger rounded m-1">
            <p className="h5">Portfolio</p>
            <p><span className="fw-bold"><img src={ethLogo} height='32' alt=""/> ETH : </span><span className="text-white">{this.props.ethBalance.substring(0,6)}</span></p>
            <p><span className="fw-bold"><img src={tokenLogo} height='32' alt=""/> DAPP : </span><span className="text-white">{this.props.tokenBalance}</span></p>
            <p><span className="fw-bold"><img src={broTokenLogo} height='32' alt=""/> BRO : </span><span className="text-white">{this.props.broTokenBalance}</span></p>
          </div>
          <div className="col col-3 text-white card bg-danger rounded m-1">
            <p className="h5">Staking</p>
            <p><span className="fw-bold"><img src={tokenLogo} height='32' alt=""/> DAPP : </span><span className="text-white">{this.props.tokenStakingBalance}</span></p>
            <p><span className="fw-bold"><img src={broTokenLogo} height='32' alt=""/> BRO : </span><span className="text-white">{this.props.broTokenStakingBalance}</span></p>
          </div>
          <div className="col col-3 text-white card bg-danger rounded m-1">
            <p className="h5">Claimable Reward</p>
            <p><span className="fw-bold"><img src={tokenLogo} height='32' alt=""/> DAPP : </span><span className="text-white">{this.props.tokenWaitingReward}</span></p>
            <p><span className="fw-bold"><img src={broTokenLogo} height='32' alt=""/> BRO : </span><span className="text-white">{this.props.broTokenWaitingReward}</span></p>
          </div>
         </div>
         <div className="row text-white justify-content-center text-center">
          <p className="h5">Active Proposal</p>
            {this.props.listeProposals.map((proposal, key)=> {
              let voted
              if(this.props.hasVotedForProposal[key] === true){
                voted = "(Voted)"
              }
              if(proposal.finishAt.toString() >  Math.round(new Date()/1000)) {
                console.log(proposal.description.toString())
                return <div key={key} className="col col-6 card m-3 p-1 rounded bg-dark text-danger w-25">
                      <p  className="float-left font-weight-bold h5"> Proposal # {proposal.id.toString()} <label className="text-white">{voted}</label></p>
                      <p className="my-2 font-weight-bold h5"> {proposal.description.toString()}</p>
                      <p className="progress">
                        {this.progressBar(proposal.yes.toString(),proposal.total.toString())}
                      </p>
                   </div>
                  }
                })}
            </div>


      <div className="row card-body text-white justify-content-center">
        <div className="col col-8 card rounded bg-danger m-1">
          <p className="h5 text-center">Historique</p>
          <center><table width='100%' border="1"  >
            <thead>
            <tr>
              <th><center>Id</center></th>
              <th><center>Bought</center></th>
              <th><center>Amount bought</center></th>
              <th><center>Sold</center></th>
              <th><center>Amount sold</center></th>
              <th><center>Timestamp</center></th>
            </tr>
            </thead>
            <tbody>
            {this.props.listeTransactionsAccount.map((transaction, key)=> {
              return(
                <tr key={key}>
                  <td width='5%'><center> {transaction.id.toString()}</center></td>
                  <td width='15%'><center>{transaction.tokenBuyName.toString()}</center></td>
                  <td width='15%'><center>{transaction.tokenBuyAmount.toNumber()}</center></td>
                  <td width='15%'><center>{transaction.tokenSoldName.toString()}</center></td>
                  <td width='15%'><center>{transaction.tokenSoldAmount.toNumber()}</center></td>
                  <td width='25%'><center> {this.timeConverter(transaction.timestamps.toString())}</center></td>
                </tr>
            )}
          )}
            </tbody>
          </table></center>

        </div>
    </div>

    </div>
  );
  }
}


export default Dashboard;
