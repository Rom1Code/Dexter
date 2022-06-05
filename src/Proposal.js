import React, { Component } from 'react'


class Proposal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: "proposalList",
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
    let createForm
    if(this.props.dexTokenBalance >= 10000 && this.state.currentPage ==="proposalList"){
      createForm = <center><div className="rounded my-5 w-75 bg-warning">
      <p className="font-weight-bold h5 text-dark">Create Proposal</p>
      <form onSubmit={(event) => {
        event.preventDefault()
        this.props.createProposal( this.input.value.toString(), this.input2.value)
        }}>
        <div className="bg-white rounded p-1">
        <p className=""><span className="font-weight-bold">Proposal description : </span>
          <input
              type="text"
              value={this.state.input}
              ref={(input) => { this.input = input }}
              className= "ml-2 w-100"
              placeholder="Description"
              required />
        </p>
          <p className=""><span className="font-weight-bold">End date :</span>
            <input
                type="text"
                value={this.state.input}
                ref={(input2) => { this.input2 = input2 }}
                className= "ml-2"
                placeholder="Timestamp"
                required />
          </p>
          <p>
          <button type="submit" className="btn btn-block btn-lg bg-danger text-white">Create</button>
          </p>
               </div>
        </form>
      </div></center>
      }
      else {
        createForm = <div className="h5 bg-warning rounded p-1 text-center"><b>!!! Get 10000 DEX to create a proposal !!!</b></div>
      }
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

    {createForm}
    {this.props.listeProposals.reverse().map((proposal, key)=> {
      let cpt = proposal.id.toString() - 1
      let status, endDate, button
      if((proposal.finishAt.toString() >  Math.round(new Date()/1000)) && this.props.hasVotedForProposal[cpt] === false)
      {
        status = "In Progress"
        endDate = this.timeConverter(proposal.finishAt.toString())
        button = <div className="col text-end"><input onClick={(event) => {this.props.voteForProposal(proposal.id.toString(),0,this.props.dexTokenBalance)}}
                          className="btn btn-danger shadow-lg float-right mx-2" type="button" value="No" />
                       <input onClick={(event) => {this.props.voteForProposal(proposal.id.toString(),this.props.dexTokenBalance,0)}}
                          className="btn btn-danger shadow-lg" type="button" value="Yes" /></div>
      }
      else if((proposal.finishAt.toString() >  Math.round(new Date()/1000)) && this.props.hasVotedForProposal[cpt] === true)
      {
        status = "In Progress"
        endDate = this.timeConverter(proposal.finishAt.toString())
        button = <div className="col text-end"><input onClick={(event) => {this.props.voteForProposal(proposal.id.toString(),0,this.props.dexTokenBalance)}}
                          className="btn btn-danger shadow-lg mx-2" type="button" id="half" value="Already Vote" disabled /></div>
      }
      else if(proposal.yes.toString()> proposal.no.toString())
      {
        status = <span className="text-success font-weight-bold">Passed</span>
        endDate = "Finished"
        button = <div className="col text-end"><input onClick={(event) => {this.props.voteForProposal(proposal.id.toString(),0,this.props.dexTokenBalance)}}
                          className="btn btn-danger shadow-lg" type="button" value="Voting Ended" disabled /></div>
      }
      else{
        status = "Rejected"
        endDate = "Finished"
        button = <div className="col text-end"><input onClick={(event) => {this.props.voteForProposal(proposal.id.toString(),0,this.props.dexTokenBalance)}}
                          className="btn btn-danger shadow-lg" type="button" value="Voting Ended" disabled /></div>
      }

      return(
        <div  key={key} className="row justify-content-center">
        <div className="col col-5 card my-3 p-1">
          <span  className="float-left font-weight-bold h4"> Proposal # {proposal.id.toString()}</span>
          <span className="text-danger"> {status}</span>
          <span className="my-2 font-weight-bold h5"> {proposal.description.toString()}</span>
          <div className="progress">
            {this.progressBar(proposal.yes.toString(),proposal.total.toString())}
          </div>
          <span> End time : <label className="text-dark">{endDate}</label></span>
            {button}
        </div>
        </div>
        )
      }
    )}
    </div>
);
}
}

export default Proposal;
