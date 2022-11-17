import { ethers, waffle } from "hardhat";
import { Contract, Wallet } from "ethers";
import { expect } from "chai";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import sinon from "sinon";
import { deployTestContract } from "./test-helper";
import * as provider from "../lib/provider";

describe("MyNFT", () => {
  const TOKEN_URI = "http://example.com/ip_records/42";
  let deployedContract: Contract;
  let wallet: Wallet;

  beforeEach(async () => {
    sinon.stub(provider, "getProvider").returns(waffle.provider);
    [wallet] = waffle.provider.getWallets();
    deployedContract = await deployTestContract("MyNFT");
  });

  async function mintNftDefault(): Promise<TransactionResponse> {
    return deployedContract.mintNFT(wallet.address, TOKEN_URI);
  }

  describe("mintNft", async () => {
    it("emits the Transfer event", async () => {
      await expect(mintNftDefault())
        .to.emit(deployedContract, "Transfer")
        .withArgs(ethers.constants.AddressZero, wallet.address, "1");
    });

    it("returns the new item ID", async () => {
      await expect(
        await deployedContract.callStatic.mintNFT(wallet.address, TOKEN_URI)
      ).to.eq("1");
    });

    it("increments the item ID", async () => {
      const STARTING_NEW_ITEM_ID = "1";
      const NEXT_NEW_ITEM_ID = "2";

      await expect(mintNftDefault())
        .to.emit(deployedContract, "Transfer")
        .withArgs(
          ethers.constants.AddressZero,
          wallet.address,
          STARTING_NEW_ITEM_ID
        );

      await expect(mintNftDefault())
        .to.emit(deployedContract, "Transfer")
        .withArgs(
          ethers.constants.AddressZero,
          wallet.address,
          NEXT_NEW_ITEM_ID
        );
    });

    it("cannot mint to address zero", async () => {
      const TX = deployedContract.mintNFT(
        ethers.constants.AddressZero,
        TOKEN_URI
      );
      await expect(TX).to.be.revertedWith("ERC721: mint to the zero address");
    });
  });

  describe("balanceOf", () => {
    it("gets the count of NFTs for this address", async () => {
      await expect(await deployedContract.balanceOf(wallet.address)).to.eq("0");

      await mintNftDefault();

      expect(await deployedContract.balanceOf(wallet.address)).to.eq("1");
    });
  });
});