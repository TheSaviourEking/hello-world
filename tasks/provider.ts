import { ethers } from "ethers";

export function getProvider(): ethers.providers.Provider {
  return ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
  });
}