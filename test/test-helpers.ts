import sinon from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";
import { ethers as hardhatEthers, waffle } from "hardhat";
import { Contract, Wallet } from "ethers";

chai.use(sinonChai);

afterEach(() => {
  sinon.restore();
});

export function deployTestContract(name: string): Promise<Contract> {
  return hardhatEthers
    .getContractFactory(name, getTestWallet())
    .then((contractFactory) => contractFactory.deploy());
}

export function getTestWallet(): Wallet {
  return waffle.provider.getWallets()[0];
}