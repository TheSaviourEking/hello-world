import { deployTestContract, getTestWallet } from "./test-helper";
import { waffle, run } from "hardhat";
import { expect } from "chai";
import sinon from "sinon";
import * as provider from "../lib/provider";

describe("tasks", () => {
  beforeEach(async () => {
    sinon.stub(provider, "getProvider").returns(waffle.provider);
    const wallet = getTestWallet();
    sinon.stub(process, "env").value({
      ETH_PUBLIC_KEY: wallet.address,
      ETH_PRIVATE_KEY: wallet.privateKey,
    });
  });

  describe("deploy-contract", () => {
    it("calls through and returns the transaction object", async () => {
      sinon.stub(process.stdout, "write");

      await run("deploy-contract");

      await expect(process.stdout.write).to.have.been.calledWith(
        "Contract address: 0x610178dA211FEF7D417bC0e6FeD39F05609AD788"
      );
    });
  });

  describe("mint-nft", () => {
    beforeEach(async () => {
      const deployedContract = await deployTestContract("MyNFT");
      process.env.NFT_CONTRACT_ADDRESS = deployedContract.address;
    });

    it("calls through and returns the transaction object", async () => {
      sinon.stub(process.stdout, "write");

      await run("mint-nft", { tokenUri: "https://example.com/record/4" });

      await expect(process.stdout.write).to.have.been.calledWith(
        "TX hash: 0xd1e60d34f92b18796080a7fcbcd8c2b2c009687daec12f8bb325ded6a81f5eed"
      );
    });
  });
});