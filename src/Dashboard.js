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

  render() {
  return (
    <div>
      <div className="row border-top border-danger">
        <div className="col bg-dark text-danger text-center h1 shadow">
          <p>Dashboard</p>
        </div>
      </div>
        <div className="row card-body justify-content-left">
          <div className="col col-4 card  bg-warning rounded m-1">
            <p className="h5">Portfolio</p>
            <p><span className="text-dark"><img src={ethLogo} height='32' alt=""/> ETH : <span className="text-white">{this.props.ethBalance}</span> </span></p>
            <p><span className="text-dark"><img src={tokenLogo} height='32' alt=""/> DAPP : <span className="text-white">{this.props.tokenBalance}</span> </span></p>
            <p><span className="text-dark"><img src={broTokenLogo} height='32' alt=""/> BRO : <span className="text-white">{this.props.broTokenBalance}</span> </span></p>
          </div>
          <div className="col col-4 card bg-warning rounded m-1">
            <p className="h5">Staking</p>
            <p><span className="text-dark"><img src={tokenLogo} height='32' alt=""/> DAPP : <span className="text-white">{this.props.tokenStakingBalance}</span> </span></p>
            <p><span className="text-dark"><img src={broTokenLogo} height='32' alt=""/> BRO : <span className="text-white">{this.props.broTokenStakingBalance}</span> </span></p>
          </div>
        </div>
        <div className="row card-body justify-content-left">
          <div className="col col-8 card rounded bg-warning m-1">
            <p className="h5">Gouvernance</p>
          </div>
      </div>
      <div className="row card-body justify-content-left">
        <div className="col col-8 card rounded bg-warning m-1">
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
