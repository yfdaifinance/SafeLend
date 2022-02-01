require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.5.16",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },

  networks: {
    rinkeby: {
      accounts: [ACCOUNT_PV_KEY],
      chainId: 4,
      url: "https://rinkeby.infura.io/v3/d76286c158cc4766b7cd59098d23c3b6"
    }
  },
  etherscan: {
    apiKey: ""
  }
};
