import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { env } from "../lib/env";
import { getContract } from "../lib/contract";
import { getWallet } from "../lib/wallet";

task("deploy-contract", "Deploy NFT contract").setAction(async (_, hre) => {
  return hre.ethers
    .getContractFactory("MyNFT", getWallet())
    .then((contractFactory) => contractFactory.deploy())
    .then((result) => {
      process.stdout.write(`Contract address: ${result.address}`);
    });
});

task("mint-nft", "Mint an NFT")
  .addParam("tokenUri", "Your ERC721 Token URI", undefined, types.string)
  .setAction(async (tokenUri, hre) => {
    return getContract("MyNFT", hre)
      .then((contract: Contract) => {
        return contract.mintNFT(env("ETH_PUBLIC_KEY"), tokenUri, {
          gasLimit: 500_000,
        });
      })
      .then((tr: TransactionResponse) => {
        process.stdout.write(`TX hash: ${tr.hash}`);
      });
  });