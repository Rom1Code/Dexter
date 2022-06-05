const { ethers, waffle  } = require("hardhat");
const { expect } = require("chai");


describe("DexterHardhat", function() {

  let token, broToken, ethSwap, tokensInfos
  let deployer, investor
  let provider, balance


  before(async () => {

    [deployer, investor] = await ethers.getSigners();
    console.log('deployer adress"', deployer.address);
    console.log('investor adress"', investor.address);

    provider = waffle.provider

    const TokensInfosFactory = await ethers.getContractFactory("TokensInfos")
    tokensInfos = await TokensInfosFactory.deploy();
    console.log("tokensInfos", tokensInfos.address)

    const TokentFactory = await ethers.getContractFactory("Token")
    token = await TokentFactory.deploy(tokensInfos.address);

    const BroTokentFactory = await ethers.getContractFactory("BroToken")
    broToken = await BroTokentFactory.deploy(tokensInfos.address);

    const EthSwapFactory = await ethers.getContractFactory("EthSwap")
    ethSwap = await EthSwapFactory.deploy(token.address, broToken.address)


    console.log("ethswap adress" , ethSwap.address)
    console.log("ethswap eth balance (wei)", await provider.getBalance(ethSwap.address))
    console.log("investor eth balance (wei) ", await provider.getBalance(investor.address))


    //let balance = await token.balanceOf(deployer.address)
    // Transfer all tokens to EthSwap (1 million)
    await token.transfer(ethSwap.address, 1000000)
    await broToken.transfer(ethSwap.address, 1000000)
  })

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      const name = await token.name()
      expect(name).to.equal('DApp Token')
    })
  })

  describe('BroToken deployment', async () => {
    it('contract has a name', async () => {
      const name = await broToken.name()
      expect(name).to.equal('Bro Token')
    })
  })

  describe('TokensInfos deployment', async () => {
    it('contract has a name', async () => {
      const name = await tokensInfos.Contractname()
      expect(name).to.equal('Tokens Infos')
    })
    it('contract has token in list', async () => {
      const list = await tokensInfos.tokensCount()
      expect(list).to.equal(2)
    })

  })

  describe('EthSwap deployment', async () => {
    it('contract has a name', async () => {
      const name = await ethSwap.name()
      expect(name).to.equal('EthSwap Instant Exchange')
    })

    it('contract has tokens', async () => {
      let balanceToken = await token.balanceOf(ethSwap.address)
      expect(balanceToken.toString()).to.equal('1000000')
      let balanceBroToken = await broToken.balanceOf(ethSwap.address)
      expect(balanceBroToken.toString()).to.equal('1000000')
    })
  })

  describe("DexterHardhat buy token", function() {

    before(async () => {
      //console.log('sender token(DAPP) balance before', await token.balanceOf(ethSwap.address))
      //console.log('receiver token(DAPP) balance before', await token.balanceOf(investor.address))
      // Purchase tokens before each example
      await ethSwap.connect(investor).buyTokens("DApp Token",{ value: ethers.utils.parseEther('1')})
      await ethSwap.connect(investor).buyTokens("broToken",{ value: ethers.utils.parseEther('1')})
      console.log("ethswap eth balance after purchase (wei)" , await provider.getBalance(ethSwap.address))
      console.log("investor eth balance after purchase (wei)", await provider.getBalance(investor.address))

    })
    it('Allows user to instantly purchase DAPP from ethSwap for a fixed price', async () => {
          //console.log('sender broToken(BRO) after before', await token.balanceOf(ethSwap.address))
          //console.log('receiver broToken(BRO)) after before', await token.balanceOf(investor.address))
          const investorBalance = await token.balanceOf(investor.address)
          expect(investorBalance).to.equal('100')
          const ethSwapBalance = await token.balanceOf(ethSwap.address)
          expect(ethSwapBalance).to.equal('999900')

    })
    it('Allows user to instantly purchase broToken from ethSwap for a fixed price', async () => {
          //console.log('sender broToken(BRO) after before', await token.balanceOf(ethSwap.address))
          //console.log('receiver broToken(BRO)) after before', await token.balanceOf(investor.address))
          const investorBalance = await broToken.balanceOf(investor.address)
          expect(investorBalance).to.equal('10000')
          const ethSwapBalance = await broToken.balanceOf(ethSwap.address)
          expect(ethSwapBalance).to.equal('990000')
    })

    it('Check ETH balance of ethSwap contract', async () => {
      balance = await provider.getBalance(ethSwap.address)
      expect(balance).to.equal(ethers.utils.parseEther('2'))
    })
 })

 describe("DexterHardhat sell token", function() {

   before(async () => {
     // Sell tokens before each example
     await token.connect(investor).approve(ethSwap.address , '100')
     await ethSwap.connect(investor).sellTokens('100', 'DApp Token')

     await broToken.connect(investor).approve(ethSwap.address , '10000')
     await ethSwap.connect(investor).sellTokens('10000', 'broToken')

     console.log("ethswap eth balance after sell (wei)" , await provider.getBalance(ethSwap.address))
     console.log("investor eth balance after sell (wei) ", await provider.getBalance(investor.address))
   })
   it('Allows user to instantly sell DAPP from ethSwap for a fixed price', async () => {
         const investorBalance = await token.balanceOf(investor.address)
         expect(investorBalance).to.equal('0')
         const ethSwapBalance = await token.balanceOf(ethSwap.address)
         expect(ethSwapBalance).to.equal('1000000')
   })

   it('Allows user to instantly sell broToken from ethSwap for a fixed price', async () => {
         const investorBalance = await broToken.balanceOf(investor.address)
         expect(investorBalance).to.equal('0')
         const ethSwapBalance = await broToken.balanceOf(ethSwap.address)
         expect(ethSwapBalance).to.equal('1000000')
   })

   it('Check ETH balance of ethSwap contract', async () => {
     balance = await provider.getBalance(ethSwap.address)
     expect(balance).to.equal('0')
   })
})
})
