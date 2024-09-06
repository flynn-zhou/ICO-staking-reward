import { ethers } from "ethers";

import CustomToken_ABI from "./ERC20.json";
import StakingDapp_ABI from "./StakingDapp.json";
import TokenICO_ABI from "./TokenICO.json";

//contract address
const STAKING_DAPP_ADDRESS = process.env.NEXT_PUBLIC_STAKING_DAPP;
const TOLEN_ICO_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ICO;

//token
const DEPOSIT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const ZERO_ADDRESS = process.env.PUBLIC_ZERO_ADDRESS;

export function toWei(amount, decimals = 18) {
  const wei = ethers.utils.parseUnits(amount.toString(), decimals);
  return wei.toString();
}

export function toEth(amount, decimals = 18) {
  const eth = ethers.utils.formatUnits(amount.toString(), decimals);
  return eth.toString();
}

export function parseEth(amount) {
  const eth = ethers.utils.formatEther(amount.toString());
  return eth.toString();
}

export const tokenContract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;

  if (ethereum) {
    const signer = provider.getSigner();

    const contractObject = await new ethers.Contract(
      DEPOSIT_TOKEN_ADDRESS,
      CustomToken_ABI.abi,
      signer
    );
    return contractObject;
  }
};

export const dappContract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  if (window.ethereum) {
    const signer = provider.getSigner();

    const contractObject = new ethers.Contract(
      STAKING_DAPP_ADDRESS,
      StakingDapp_ABI.abi,
      signer
    );
    return contractObject;
  }
};

//user's ERC20
export const DAPP_ERC20 = async (tokenAddress, userAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  if (window.ethereum) {
    const signer = provider.getSigner();

    const contractObject = new ethers.Contract(
      tokenAddress,
      CustomToken_ABI.abi,
      signer
    );

    const contractAddress = contractObject.address;

    const name = await contractObject.name();
    const symbol = await contractObject.symbol();
    const decimals = await contractObject.decimals();
    const totalSupply = await contractObject.totalSupply();

    //user
    let userBalance = 0;
    if (userAddress && userAddress.length > 0) {
      userBalance = await contractObject.balanceOf(userAddress);
    }

    //dapp
    const contractDappTokenBalance = await contractObject.balanceOf(
      STAKING_DAPP_ADDRESS
    );

    const token = {
      name,
      symbol,
      decimals,
      totalSupply: toEth(totalSupply),
      userBalance: toEth(userBalance),
      contractDappTokenBalance: toEth(contractDappTokenBalance),
      contractAddress: contractAddress,
    };
    return token;
  }
};

// TOKEN ICO CONTRACT
export const LOAD_TOKEN_ICO = async () => {
  try {
    const tokenICO = await TOKEN_ICO_CONTRACT();
    const tokenAddress = await tokenICO.tokenAddress();
    if (tokenAddress != ZERO_ADDRESS) {
      const tokenDetails = await tokenICO.getTokenDetails();
      const contractOwner = await tokenICO.owner();
      const soldTokens = await tokenICO.soldTokens();

      const ICO_TOKEN = await TOKEN_ICO_ERC20();

      const token = {
        name: tokenDetails.name,
        symbol: tokenDetails.symbol,
        balance: parseEth(tokenDetails.balance),
        supply: parseEth(tokenDetails.supply),
        tokenPrice: parseEth(tokenDetails.tokenPrice),
        tokenAddress,
        owner: contractOwner.toLowerCase(),
        soldTokens: soldTokens.toNumber(),
        token: ICO_TOKEN,
      };
      return token;
    } else {
      console.log(" print zero address: ", tokenAddress);
    }
  } catch (error) {
    console.log(error);
  }
};

export const TOKEN_ICO_CONTRACT = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  if (window.ethereum) {
    const signer = provider.getSigner();
    const contractObject = new ethers.Contract(
      TOLEN_ICO_ADDRESS,
      TokenICO_ABI.abi,
      signer
    );
    return contractObject;
  }
};

export const TOKEN_ICO_ERC20 = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  try {
    if (window.ethereum) {
      const signer = provider.getSigner();

      const contractObject = new ethers.Contract(
        DEPOSIT_TOKEN_ADDRESS,
        CustomToken_ABI.abi,
        signer
      );

      //user address
      const userAddress = await signer.getAddress();
      const nativeBalance = await signer.getBalance();
      const userBalance = await contractObject.balanceOf(userAddress);

      const contractAddress = await contractObject.address;

      const name = await contractObject.name();
      const symbol = await contractObject.symbol();
      const decimals = await contractObject.decimals();
      const totalSupply = await contractObject.totalSupply();

      //dapp
      const contractICOTokenBalance = await contractObject.balanceOf(
        TOLEN_ICO_ADDRESS
      );

      const token = {
        tokenAddress: contractAddress,
        name,
        symbol,
        decimals,
        supply: toEth(totalSupply),
        userBalance: toEth(userBalance),
        nativeBalance: toEth(nativeBalance.toString()),
      };

      return token;
    }
  } catch (error) {
    console.log(error);
  }
};
