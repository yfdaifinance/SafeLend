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
  const baseRatePerYear = 20000000000000000;
  const multiplierPerYear = 300000000000000000;
  const underlyingAddress = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";
  const initialMantissa = 200000000000000000000000000; //for usdt it will be different
  const name = "sToken";
  const symbol = "sSymbol";
  const priceOracleAddress = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";
  const priceOracleFeedAddress = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";

  // We get the contract to deploy
  const Comptroller = await hre.ethers.getContractFactory("Comptroller");

  // SERC20 Delegate
  const SERC20Delegate = await hre.ethers.getContractFactory("SErc20Delegate");
  const sERC20Delegate = await SERC20Delegate.deploy();

  await sERC20Delegate.deployed();

  console.log("sERC20Delegate deployed to:", sERC20Delegate.address);

  // Whitepaper Interest Rate Model
  const WhitePaperInterestRateModel = await hre.ethers.getContractFactory(
    "WhitePaperInterestRateModel"
  );
  const whitePaperInterestRateModel = await WhitePaperInterestRateModel.deploy(
    baseRatePerYear,
    multiplierPerYear
  );

  await whitePaperInterestRateModel.deployed();

  console.log(
    "WhitePaperInterestRateModel deployed to:",
    whitePaperInterestRateModel.address
  );

  // SERC20 Delegator
  const SERC20Delegator = await hre.ethers.getContractFactory("SERC20Delegator");
  const sERC20Delegator = await SERC20Delegator.deploy(underlyingAddress, comptrollerAddress, whitePaperInterestRateModel.address, initialMantissa, name, symbol, 8, "0x00");

  await sERC20Delegator.deployed();

  console.log("SERC20Delegator deployed to:", sERC20Delegator.address);

  // support market in comptroller
  const comptrollerProxy = await Comptroller.attach(comptrollerAddress);
  let supportMarket = comptrollerProxy._supportMarket(sERC20Delegate.address);
  console.log('%c 🎂 supportMarket: ', 'font-size:20px;background-color: #7F2B82;color:#fff;', supportMarket);

  const PriceOracle = await hre.ethers.getContractFactory("SafeLendChainLinkPriceOracle");
  const priceOracle = await PriceOracle.attach(priceOracleAddress);

  let setPricefeed = await priceOracle.setFeed(symbol, priceOracleFeedAddress);
  console.log('%c 🥠 setPricefeed: ', 'font-size:20px;background-color: #B03734;color:#fff;', setPricefeed);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
