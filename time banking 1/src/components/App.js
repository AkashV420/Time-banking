import React, { Component } from 'react'
import Web3 from 'web3'
import HSTimeToken from '../abis/HSTimeToken.json'
import LSTimeToken from '../abis/LSTimeToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import Swap from './Swap'
import './App.css'
import { Switch, Route, Link } from "react-router-dom";

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()

    // Load HSTimeToken
    const hsTokenData = HSTimeToken.networks[networkId]
    if(hsTokenData) {
      const hsToken = new web3.eth.Contract(HSTimeToken.abi, hsTokenData.address)
      this.setState({ hsToken })
      let hsTokenBalance = await hsToken.methods.balanceOf(this.state.account).call()
      this.setState({ hsTokenBalance: hsTokenBalance.toString() })
    } else {
      window.alert('HSTimeToken contract not deployed to detected network.')
    }

    // Load LSTimeToken
    const lsTokenData = LSTimeToken.networks[networkId]
    if(lsTokenData) {
      const lsToken = new web3.eth.Contract(LSTimeToken.abi, lsTokenData.address)
      this.setState({ lsToken })
      let lsTokenBalance = await lsToken.methods.balanceOf(this.state.account).call()
      this.setState({ lsTokenBalance: lsTokenBalance.toString() })
    } else {
      window.alert('LSTimeToken contract not deployed to detected network.')
    }

    // Load TokenFarm (Token Staking)
    const tokenFarmData = TokenFarm.networks[networkId]
    if(tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      this.setState({ tokenFarm })
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
    } else {
      window.alert('TokenFarm contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.hsToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  swapForLST = (amount) => {
    if(amount<=0){
      alert("Amount must be greater than 0");
    }
    else{
    this.setState({ loading: true })
    this.state.hsToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.swapForLST(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
    }
  }
  swapForHST = (amount) => {
    if(amount<=0){
      alert("Amount must be greater than 0");
    }
    else{
    this.setState({ loading: true })
    this.state.lsToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.swapForHST(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      hsToken: {},
      lsToken: {},
      tokenFarm: {},
      hsTokenBalance: '0',
      lsTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {


    const { path } = this.props.match;
    const Swaps = () => <Swap 
    hsTokenBalance={this.state.hsTokenBalance}
    lsTokenBalance={this.state.lsTokenBalance}
    swapForLST={this.swapForLST}
    swapForHST={this.swapForHST}
  />;

    const Stake = () => <Main
    hsTokenBalance={this.state.hsTokenBalance}
    lsTokenBalance={this.state.lsTokenBalance}
    stakingBalance={this.state.stakingBalance}
    stakeTokens={this.stakeTokens}
    unstakeTokens={this.unstakeTokens}
  />;
   
    
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <div>
        <div className="links">
      <Link to={`${path}`} className="link">Swap</Link>
      <Link to={`${path}/stake`} className="link">Stake</Link>
      </div>
      <div className="tabs">
      <Switch>
        <Route path={`${path}`} exact component={Swaps} />
        <Route path={`${path}/stake`} component={Stake} />
      </Switch>
      </div></div>;

    }

    return (
      <div>
  


        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
