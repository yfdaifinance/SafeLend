// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const comptrollerAddress = "0xB5AB4255cf3BBaFA5d2f2886d707604918E4D4Bf";

  // We get the contract to deploy
  const Comptroller = await hre.ethers.getContractFactory("Comptroller");
  const comptroller = await Comptroller.attach(comptrollerAddress);

  // await comptroller.deployed();

  // console.log("comptroller deployed to:", comptroller.address);

  // unitroller
  const Unitroller = await hre.ethers.getContractFactory("Unitroller");
  const unitroller = await Unitroller.deploy();

  await unitroller.deployed();

  console.log("Unitroller deployed to:", unitroller.address);

  let setPendingComptroller = await unitroller._setPendingImplementation(comptrollerAddress)
  console.log('%c 🍐 setPendingComptroller: ', 'font-size:20px;background-color: #42b983;color:#fff;', setPendingComptroller);

  let becomeComptroller = await comptroller._become(unitroller.address);
  console.log('%c 🍛 becomeComptroller: ', 'font-size:20px;background-color: #7F2B82;color:#fff;', becomeComptroller);

  // Price Oracle
  const PriceOracle = await hre.ethers.getContractFactory("SafeLendChainLinkPriceOracle");
  const priceOracle = await PriceOracle.deploy();

  await priceOracle.deployed();

  console.log("Price oracle deployed to:", priceOracle.address);

  // set price oracle in comptroller
  const comptrollerProxy = await Comptroller.attach(unitroller.address);
  let setPriceOracle = comptrollerProxy._setPriceOracle(priceOracle.address);
  console.log('%c 🥧 setPriceOracle: ', 'font-size:20px;background-color: #465975;color:#fff;', setPriceOracle);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
