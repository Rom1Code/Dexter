const fs = require('fs');
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const TokensInfos = await ethers.getContractFactory("TokensInfos");
  const tokensInfos = await TokensInfos.deploy();
  console.log("TokensInfos address:", tokensInfos.address);

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(tokensInfos.address);
  console.log("Token address:", token.address);

  const BroToken = await ethers.getContractFactory("BroToken")
  broToken = await BroToken.deploy(tokensInfos.address);
  console.log("BroToken address:", broToken.address);

  const DexToken = await ethers.getContractFactory("DexToken")
  dexToken = await DexToken.deploy();
  console.log("DexToken address:", dexToken.address);

  const EthSwap = await ethers.getContractFactory("EthSwap")
  ethSwap = await EthSwap.deploy(token.address, broToken.address)
  console.log("EthSwap address:", ethSwap.address);

  const PoolLiquidity = await ethers.getContractFactory("PoolLiquidity")
  poolLiquidity = await PoolLiquidity.deploy(dexToken.address, token.address, broToken.address, 60)
  console.log("PoolLiquidity address:", poolLiquidity.address);

  const Gouvernance = await ethers.getContractFactory("Gouvernance")
  gouvernance = await Gouvernance.deploy(dexToken.address)
  console.log("Gouvernance address:", gouvernance.address);

  // Transfer all tokens to EthSwap (1 million)
  await token.transfer(ethSwap.address, '1000000')
  await broToken.transfer(ethSwap.address, '1000000')

  // Transfer all tokens to PoolLiquidity (1 million)
  await dexToken.transfer(poolLiquidity.address, '1000000')

  // Save contract address file in project
   const contractsDir = __dirname +  "\\..\\src\\contractsData";
   if (!fs.existsSync(contractsDir)) {
     fs.mkdirSync(contractsDir,{recursive:true});
   }

   //TokensInfos
   fs.writeFileSync(
     contractsDir + `\\tokensInfos-address.json`,
     JSON.stringify({ address: tokensInfos.address }, undefined, 2)
   );
   const contractArtifact = artifacts.readArtifactSync("TokensInfos");
   fs.writeFileSync(
     contractsDir + `\\tokensInfos.json`,
     JSON.stringify(contractArtifact, null, 2)
   );
   console.log("TokensInfos deployed to:", tokensInfos.address);

   //Token
   fs.writeFileSync(
     contractsDir + `\\token-address.json`,
     JSON.stringify({ address: token.address }, undefined, 2)
   );
   const contractArtifact1 = artifacts.readArtifactSync("Token");
   fs.writeFileSync(
     contractsDir + `\\token.json`,
     JSON.stringify(contractArtifact1, null, 2)
   );
   console.log("Token deployed to:", token.address);

   //broToken
   fs.writeFileSync(
     contractsDir + `\\broToken-address.json`,
     JSON.stringify({ address: broToken.address }, undefined, 2)
   );
   const contractArtifact2 = artifacts.readArtifactSync("BroToken");
   fs.writeFileSync(
     contractsDir + `\\broToken.json`,
     JSON.stringify(contractArtifact2, null, 2)
   );
   console.log("BroToken deployed to:", broToken.address);

   //dexToken
   fs.writeFileSync(
     contractsDir + `\\dexToken-address.json`,
     JSON.stringify({ address: dexToken.address }, undefined, 2)
   );
   const contractArtifact3 = artifacts.readArtifactSync("DexToken");
   fs.writeFileSync(
     contractsDir + `\\dexToken.json`,
     JSON.stringify(contractArtifact3, null, 2)
   );
   console.log("DexToken deployed to:", dexToken.address);

   //ethSwap
   fs.writeFileSync(
     contractsDir + `\\ethSwap-address.json`,
     JSON.stringify({ address: ethSwap.address }, undefined, 2)
   );
   const contractArtifact4 = artifacts.readArtifactSync("EthSwap");
   fs.writeFileSync(
     contractsDir + `\\ethSwap.json`,
     JSON.stringify(contractArtifact4, null, 2)
   );
   console.log("EthSwap deployed to:", ethSwap.address);

   //poolLiquidity
   fs.writeFileSync(
     contractsDir + `\\poolLiquidity-address.json`,
     JSON.stringify({ address: poolLiquidity.address }, undefined, 2)
   );
   const contractArtifact5 = artifacts.readArtifactSync("PoolLiquidity");
   fs.writeFileSync(
     contractsDir + `\\poolLiquidity.json`,
     JSON.stringify(contractArtifact5, null, 2)
   );
   console.log("PoolLiquidity deployed to:", poolLiquidity.address);

   //gouvernance
   fs.writeFileSync(
     contractsDir + `\\gouvernance-address.json`,
     JSON.stringify({ address: gouvernance.address }, undefined, 2)
   );
   const contractArtifact6 = artifacts.readArtifactSync("Gouvernance");
   fs.writeFileSync(
     contractsDir + `\\gouvernance.json`,
     JSON.stringify(contractArtifact6, null, 2)
   );
   console.log("Gouvernance deployed to:", gouvernance.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
