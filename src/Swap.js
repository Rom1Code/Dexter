import React, { Component } from 'react'
import { ethers } from "ethers"

import inversion2 from './inversion2.png'
import tokenLogo from './token-logo.png'
import broTokenLogo from './brocoin-logo.jpg'
import ethLogo from './eth-logo.png'

class Swap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      action: 'buy',
      tokenBalance: this.props.tokenBalance,
      tokenRate: this.props.tokenRate,
      tokenName: this.props.tokenName,
      output: '',
      input: '',
      outputLogo: 'ETH',
      inputLogo: 'DAPP',
      inputBalance: this.props.ethBalance,
      outputBalance: this.props.tokenBalance

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

inputLogo = () => {
  if (this.state.action === 'buy') {
    return <img src={ethLogo} height='32' alt=""/>
  }
  else{
    if(this.state.tokenName==="Bro Token"){
      return <img src={broTokenLogo} alt="" height='32' style={{marginRight:10}}/>
    }
    else if(this.state.tokenName==="DApp Token"){
      return <img src={tokenLogo} alt="" height='32' style={{marginRight:10}}/>
    }
  }
}

outputLogo = () => {
  if (this.state.action === 'buy') {
    if(this.state.tokenName==="Bro Token"){
      return <img src={broTokenLogo} alt="" height='32' style={{marginRight:10}}/>
    }
    else{
      return <img src={tokenLogo} alt="" height='32' style={{marginRight:10}}/>
    }
  }
  else{
      return <img src={ethLogo} height='32' alt=""/>
  }
}


listInput = () => {
  if (this.state.action === 'buy') {
    return <select name="inputList" id="input_list" onChange={(event) => {this.getInputListValue()}}>
      <option value="ETH">ETH</option>
    </select>
  }
  else {
    return <select name="inputList" id="input_list" onChange={(event) => {this.getInputListValue()}}>
      <option value="DAPP">DAPP</option>
      <option value="BRO">BRO</option>
    </select>
  }
}

listOutput = () => {
  if (this.state.action === 'buy') {
    return <select name="outputList" id="output_list" onChange={(event) => {this.getOutputListValue()}}>
      <option value="DAPP">DAPP</option>
      <option value="BRO">BRO</option>
    </select>
  }
  else {
    return <select name="outputList" id="output_list" onChange={(event) => {this.getOutputListValue()}}>
      <option value="ETH">ETH</option>
    </select>
  }
}

getInputListValue = () => {
  var select = document.getElementById("input_list")
  var choice = select.selectedIndex // Récupération de l'index du <option> choisi
  var valeur_cherchee = select.options[choice].value // Récupération du texte du <option> d'index "choice"
  this.setState({tokenName : valeur_cherchee})
  if (this.state.action === 'buy') {
    this.setState({ inputBalance: this.props.ethBalance
    })
  }
  else{
    if(valeur_cherchee==="BRO"){
      this.setState({tokenBalance : this.props.broTokenBalance,
                     tokenRate: 1 / this.props.broTokenRate,
                     tokenName: this.props.broTokenName,
                     inputBalance: this.props.broTokenBalance
      })
    }
    else {
      this.setState({tokenBalance : this.props.tokenBalance,
                     tokenRate: 1 / this.props.tokenRate,
                     tokenName: this.props.tokenName,
                     inputBalance: this.props.tokenBalance
      })
    }
  }
}

getOutputListValue = () => {
  var select = document.getElementById("output_list")
  var choice = select.selectedIndex // Récupération de l'index du <option> choisi
  var valeur_cherchee = select.options[choice].value // Récupération du texte du <option> d'index "choice"
  this.setState({tokenName : valeur_cherchee})
  if (this.state.action === 'buy') {
    if(valeur_cherchee==="BRO"){
      this.setState({//tokenBalance : this.props.broTokenBalance,
                     tokenRate: this.props.broTokenRate,
                     tokenName: this.props.broTokenName,
                     outputBalance: this.props.broTokenBalance,
                     output: this.state.input * this.props.broTokenRate
      })
    }
    else {
      this.setState({//tokenBalance : this.props.tokenBalance,
                     tokenRate: this.props.tokenRate,
                     tokenName: this.props.tokenName,
                     outputBalance: this.props.tokenBalance,
                     output: this.state.input * this.props.tokenRate
      })
    }
  }
  else{
    this.setState({ outputBalance: this.props.ethBalance
    })
  }
}

action = (tokenName, etherAmount) => {
  if(this.state.action === "buy") {
    this.props.buyTokens(tokenName, etherAmount)
  }
  else{
    this.props.sellTokens(etherAmount, tokenName)
  }
}

updateValue = (action) => {
  console.log("inversion")
  if (action === 'buy') {
    this.setState({ inputBalance: this.props.ethBalance,
                    outputBalance: this.state.inputBalance,
                    input: this.state.output,
                    output: this.state.input
    })
    if (this.state.tokenName === 'Bro Token'){
      this.setState({ tokenRate: this.props.broTokenRate})
    }
    else{
      this.setState({ tokenRate: this.props.tokenRate})
    }
  }
  else {
    console.log("sell")
    this.setState({ inputBalance: this.state.outputBalance,
                    outputBalance: this.props.ethBalance,
                    input: this.state.output,
                    output: this.state.input,
    })
    if (this.state.tokenName === 'Bro Token'){
      this.setState({ tokenRate: 1 / this.props.broTokenRate })
    }
    else{
      console.log("dapp")
      this.setState({ tokenRate: 1 / this.props.tokenRate })
    }
  }



}

  render() {
    return (
      <div>
        <div className="row border-top border-danger">
          <div className="col bg-dark text-danger text-center h1">
            <p>SWAP</p>
          </div>
        </div>
        <div className="row justify-content-center rounded" >
          <div className="col col-4 bg-danger rounded mt-5">
            <form className="mb-3 text-white" onSubmit={(event) => {
                event.preventDefault()
                let etherAmount
                etherAmount = this.input.value.toString()
                //this.props.buyTokens(this.state.tokenName,etherAmount)
                this.action(this.state.tokenName, etherAmount)
              }}>
              <div className="row text-white">
                <div className="col text-align-start"><b>From</b></div>
                  <div className="col text-align-end"><b> Balance : </b>{this.state.inputBalance}
                  <input
                    onClick={(event) => {
                         this.output.value = this.input.value.toString() * this.state.tokenRate
                        this.setState({
                          input: this.state.inputBalance,
                          output: this.state.inputBalance * this.state.tokenRate
                        })
                    }
                  }
                   className="btn btn-danger border m-1 shadow-lg" type="button" id="max" value="max" />
                  <input
                    onClick={(event) => {
                       this.setState({
                         input: this.state.inputBalance / 2,
                         output: (this.state.inputBalance / 2) * this.state.tokenRate
                                    })
                       }
                    }
                  className="btn btn-danger shadow-lg  border" type="button" id="half" value="half" />
                </div>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  value={this.state.input}
                  onChange={(event) => {
                    const etherAmount = this.input.value.toString()
                    this.setState({
                      output: etherAmount * this.state.tokenRate,
                      input: this.input.value.toString()
                    })
                  }}
                  ref={(input) => { this.input = input }}
                  className="form-control form-control-lg"
                  placeholder='0'
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                  {this.inputLogo()}
                  {this.listInput()}
                  </div>
                </div>
              </div>

              <center>
              <input
                onClick={(event) => {
                  event.preventDefault();
                  if(this.state.action==='buy'){
                this.setState({ action: 'sell' })
                this.updateValue("sell") }
                else {
                  this.setState({ action: 'buy' })
                  this.updateValue("buy")
                }
              }}
               type="image" id="image" alt="switch" width='50'
                     src={inversion2} />
              </center>

              <div className="row text-white">
                <div className="col "><b>To </b></div>
                  <div className="col text-end"> <b> Balance :</b> {this.state.outputBalance}</div>
              </div>
              <div className="input-group mb-2">
                <input
                  type="text"
                  ref={(output) => { this.output = output }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  value={this.state.output}
                  disabled
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    {this.outputLogo()}
                    {this.listOutput()}
                  </div>
                </div>
              </div>
              <div className="mb-4 text-white ">
                <span className="float-left"><label>Exchange Rate</label></span>
                <span className="float-right"><label>1 ETH = {this.state.tokenRate} {this.state.tokenName}</label></span>
              </div>
              <div className=" text-center rounded">
                <button type="submit" className="btn btn-block text-danger bg-white font-weight-bold w-100">SWAP!</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Swap;
