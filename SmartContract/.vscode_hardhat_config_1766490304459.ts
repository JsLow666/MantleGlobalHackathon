// import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";
import hardhatIgnitionViemPlugin from "@nomicfoundation/hardhat-ignition-viem";

export default defineConfig({
  plugins: [hardhatIgnitionViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    mantleTestnet: {
      type: "http",
      url: "https://rpc.sepolia.mantle.xyz",
      chainId: 5003,
      accounts: ["f568ffee77a1ab809a5469f35516086f597d645af63d8150fa447c95f9415d99"],
      gasPrice: 20000000000, // 20 gwei
    },
    mantleMainnet: {
      type: "http",
      url: "https://rpc.mantle.xyz",
      chainId: 5000,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000,
    },
  },
});
