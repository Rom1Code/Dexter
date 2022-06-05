// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.3;
import "hardhat/console.sol";


contract TokensInfos {
  string public Contractname = "Tokens Infos";

  struct Tokens {
    uint id;
    string tokenName;
    string tokenSymbol;
    uint tokenRate;
  }

  mapping (uint => Tokens) public tokensList;
  uint public tokensCount = 0;

  function addToken(string memory tokenName, string memory tokenSymbol, uint tokenRate) public {
    tokensCount++;
    tokensList[tokensCount] = Tokens(tokensCount, tokenName, tokenSymbol, tokenRate);
  }
}
