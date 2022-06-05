import React, { Component } from 'react'
import tokenLogo from './token-logo.png'
import broTokenLogo from './brocoin-logo.jpg'

class Pool extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input2: '',
      value: undefined
    }
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount() {
    this.props.tokensList.map((token, key)=> {
      this.props.getWaitingReward(token[1])
    })
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div>
        <div className="row border-top border-danger">
          <div className="col bg-dark text-danger text-center h1">
            <p>POOL</p>
          </div>
        </div>

        <div className="row my-2 text-white shadow justify-content-center mb-5">
          <div className="col col-4 bg-danger rounded">
            <center>Dex Balance :</center>
            <center>{this.props.dexTokenBalance} DEX</center>
          </div>
        </div>

        {this.props.tokensList.map((token, key)=> {
          let balance, balanceStaking, waitingReward, logo
          if(token[1]==="DApp Token"){
            balance =  this.props.tokenBalance
            balanceStaking = this.props.tokenStakingBalance
            waitingReward = this.props.tokenWaitingReward
            logo = <img src={tokenLogo} height='32' alt=""/>
          }
          else{
            balance =  this.props.broTokenBalance
            balanceStaking = this.props.broTokenStakingBalance
            waitingReward = this.props.broTokenWaitingReward
            logo = <img src={broTokenLogo} height='32' alt=""/>
          }

          return <center key={key}>
          <div className="row card mb-3 shadow w-25" >
            <div className="card-body">
              <form  onSubmit={(event) => {
                }}>
                <div>
                  <label className=""><p>Stake <b>{token[3].toNumber()} {token[2]}</b> token and get <b>1 DEX</b> token</p></label>
                  <br/>
                  <span className="">
                    Balance : {balance}
                  </span>
                </div>
                <div className="input-group mb-4">
                  <input
                    type="text"
                    onChange={(event) => {
                      this.handleChange(event)
                    }}
                    ref={(input2) => { this.input2 = input2 }}
                    className="form-control form-control-lg"
                    placeholder="0"
                    required />
                  <div className="input-group-append">
                    <div className="input-group-text">
                    {logo}
                      &nbsp;&nbsp;&nbsp; {token[2]}
                    </div>
                    <button
                      type="submit" className=" btn-danger ml-1 rounded"
                      onClick={(event) => {
                        event.preventDefault()
                        this.props.stakeTokens(token[1], this.state.value, Math.round(new Date()/1000))
                      }}>
                        STAKE!</button>
                    <button
                      type="submit"
                      className="btn-danger ml-1 rounded"
                      onClick={(event) => {
                        event.preventDefault()
                        this.props.getReward(token[1], Math.round(new Date()/1000))
                        this.props.unstakeTokens(token[1], this.state.value)
                      }}>
                        UN-STAKE
                      </button>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total staked : {balanceStaking} {token[2]}</span>
                  <button
                        type="submit"
                        className="btn-danger ml-1 rounded"
                        onClick={(event) => {
                          event.preventDefault()
                          this.props.getReward(token[1], Math.round(new Date()/1000))
                        }}>
                          Claim Reward : {waitingReward}
                        </button>
                </div>
              </form>
            </div>
          </div>
          </center>
        })
      }
      </div>
    );
  }
}
export default Pool;
