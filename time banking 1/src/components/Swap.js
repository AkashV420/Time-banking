import React, { Component } from 'react'
import dai from '../dai.png'

class Swap extends Component {

  render() {
    return (
      <div id="content" className="mt-3">
<div className="text-center" >
  Current SWAP ratio : 1 HST = 2 LST
  <br/>
</div>
<div className="card mb-4" >

<br/>
<div className="card-body">

  <form className="mb-3" onSubmit={(event) => {
      event.preventDefault()
      let amount
      amount = this.input1.value.toString()
      amount = window.web3.utils.toWei(amount, 'Ether')
      this.props.swapForLST(amount)
    }}>
    <div>
      <label className="float-left"><b>Swap Tokens - HST to LST</b></label>
      
      <span className="float-right text-muted">
        Balance: {window.web3.utils.fromWei(this.props.hsTokenBalance, 'Ether')}
      </span>
    </div>
    <div className="input-group mb-4">
      <input
        type="text"
        ref={(input) => { this.input1 = input }}
        className="form-control form-control-lg"
        placeholder="0"
        required />
      <div className="input-group-append">
        <div className="input-group-text">
          <img src={dai} height='32' alt=""/>
          &nbsp;&nbsp;&nbsp; 
              HST
        </div>
      </div>
    </div>
    <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP for LST</button>
  </form>

  <form className="mb-3" onSubmit={(event) => {
      event.preventDefault()
      let amount
      amount = this.input2.value.toString()
      amount = window.web3.utils.toWei(amount, 'Ether')
      this.props.swapForHST(amount)
    }}>
    <div>
      <label className="float-left"><b>Swap Tokens - LST to HST</b></label>
      <span className="float-right text-muted">
        Balance: {window.web3.utils.fromWei(this.props.lsTokenBalance, 'Ether')}
      </span>
    </div>
    <div className="input-group mb-4">
      <input
        type="text"
        ref={(input) => { this.input2 = input }}
        className="form-control form-control-lg"
        placeholder="0"
        required />
      <div className="input-group-append">
        <div className="input-group-text">
          <img src={dai} height='32' alt=""/>
          &nbsp;&nbsp;&nbsp; 
              LST
        </div>
      </div>
    </div>
    <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP for HST</button>
  </form>
</div>
</div>


      </div>
    );
  }
}

export default Swap;
