import React, { Component } from 'react'
import tokenLogo from './token-logo.png'
import broTokenLogo from './brocoin-logo.jpg'

class Pool extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      input2: '',
    }
  }
  componentWillMount() {
    this.props.getWaitingReward(this.props.tokenName)
    this.props.getWaitingReward(this.props.broTokenName)
  }

  render() {
    return (
      <div>
        <div className="row border-top border-danger">
          <div className="col bg-dark text-danger text-center h1">
            <p>POOL</p>
          </div>
        </div>

        <div className="row my-2 text-white shadow justify-content-center">
          <div className="col col-4 bg-danger rounded">
            <center>Dex Balance :</center>
            <center>{this.props.dexTokenBalance} DEX</center>
          </div>
        </div>

        <div className="card mb-3 shadow" >
          <div className="card-body">
            <form onSubmit={(event) => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                console.log("stake", amount)
                this.props.stakeTokens(this.props.tokenName, amount, Math.round(new Date()/1000))
              }}>
              <div>
                <label className="float-left">
                  <p>Stake <b>1 DAPP</b> token and get <b>1 DEX</b> token</p>
                </label>
                <br/>
                <span className="float-right text-muted">
                  Balance:{this.props.tokenBalance}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  //value={this.state.input}
                  onChange={(event) => {
                    this.setState({
                      input: this.input.value.toString()
                    })
                  }}
                  ref={(input) => { this.input = input }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={tokenLogo} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; DAPP
                  </div>
                  <button type="submit" className="btn-danger ml-1 rounded">STAKE!</button>
                  <button
                    type="submit"
                    className="btn-danger ml-1 rounded"
                    onClick={(event) => {
                        console.log( this.state.input)
                      event.preventDefault()
                      let tokenAmount
                      tokenAmount = this.state.input
                      this.props.getReward(this.props.tokenName,  Math.round(new Date()/1000))
                      this.props.unstakeTokens(this.props.tokenName, tokenAmount)
                    }}>
                      UN-STAKE
                    </button>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total staked : {this.props.tokenStakingBalance} DAPP</span>
                <button
                      type="submit"
                      className="btn-danger ml-1 rounded"
                      onClick={(event) => {
                        event.preventDefault()
                        this.props.getReward(this.props.tokenName,  Math.round(new Date()/1000))
                      }}>
                        Claim Reward : {this.props.tokenWaitingReward}
                      </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card mb-3 shadow" >
          <div className="card-body">
            <form  onSubmit={(event) => {
                event.preventDefault()
                let amount2
                amount2 = this.input2.value.toString()
                this.props.stakeTokens(this.props.broTokenName, amount2, Math.round(new Date()/1000))
              }}>
              <div>
                <label className="float-left"><p>Stake <b>100 BRO</b> token and get <b>1 DEX</b> token</p></label>
                <br/>
                <span className="float-right text-muted">
                  Balance: {this.props.broTokenBalance}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  onChange={(event) => {
                    this.setState({
                      input2: this.input2.value.toString()
                    })
                  }}
                  ref={(input2) => { this.input2 = input2 }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={broTokenLogo} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; BRO
                  </div>
                  <button type="submit" className=" btn-danger ml-1 rounded">STAKE!</button>
                  <button
                    type="submit"
                    className="btn-danger ml-1 rounded"
                    onClick={(event) => {
                      event.preventDefault()

                      let broTokenAmount
                      broTokenAmount = this.state.input2
                      console.log(broTokenAmount)
                      this.props.getReward(this.props.broTokenName, Math.round(new Date()/1000))
                      this.props.unstakeTokens(this.props.broTokenName, broTokenAmount)
                    }}>
                      UN-STAKE
                    </button>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total staked : {this.props.broTokenStakingBalance} BRO</span>
                <button
                      type="submit"
                      className="btn-danger ml-1 rounded"
                      onClick={(event) => {
                        event.preventDefault()
                        this.props.getReward(this.props.broTokenName, Math.round(new Date()/1000))
                      }}>
                        Claim Reward : {this.props.broTokenWaitingReward}
                      </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default Pool;
