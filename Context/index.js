import { ethers } from "ethers";
import { toast } from "react-hot-toast";

import {
  toWei,
  toEth,
  parseEth,
  tokenContract,
  dappContract,
  DAPP_ERC20,
  LOAD_TOKEN_ICO,
  TOKEN_ICO_CONTRACT,
  TOKEN_ICO_ERC20,
} from "./constants";

const STAKING_DAPP_ADDRESS = process.env.NEXT_PUBLIC_STAKING_DAPP;
const DEPOSIT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const REWARD_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_REWARD_TOKEN;
const TOKEN_LOGO = process.env.NEXT_PUBLIC_TOKEN_LOGO;

const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
const notifyError = (msg) => toast.error(msg, { duration: 2000 });

// function
function CONVERT_TIMESTAMP_TO_READABLE(timestamp) {
  const date = new Date(timestamp * 1000);
  const readableTime = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return readableTime;
}

function parseErrorMsg(e) {
  //Error: invalid BigNumber string (argument="value", value="0.003", code=INVALID_ARGUMENT, version=bignumber/5.7.0)
  const json = JSON.parse(JSON.stringify(e));
  return json?.reason || json?.error?.message;
}

export const SHORTEN_ADDRESS = (address) => {
  return `${address?.slice(0, 8)}...${address?.slice(address.length - 4)}`;
};

export const copyAddress = (text) => {
  navigator.clipboard.writeText(text);
  notifySuccess("Copy successfully");
};

export async function CONTRACT_DATA(address) {
  try {
    const dappContractObj = await dappContract();

    if (address) {
      const contractOwner = await dappContractObj.owner();
      const contractAddress = await dappContractObj.address;

      //Notifications && format
      const notifications = await dappContractObj.getNotifications();

      const _notificationsArray = await Promise.all(
        notifications.map(
          async ({ poolId, user, amount, typeOf, timestamp }) => {
            return {
              poolId: poolId.toNumber(),
              user,
              amount: toEth(amount),
              typeOf,
              timestamp: CONVERT_TIMESTAMP_TO_READABLE(timestamp),
            };
          }
        )
      );

      let poolInfoArray = [];
      const poolLength = await dappContractObj.poolCount();

      const length = poolLength.toNumber();
      for (let i = 0; i < length; i++) {
        const poolInfo = await dappContractObj.poolInfos(i);

        const userInfo = await dappContractObj.userInfo(i, address);
        const userRewards = await dappContractObj.pendingRewards(i, address);

        const tokenPoolInfoA = await DAPP_ERC20(DEPOSIT_TOKEN_ADDRESS, address);
        const tokenPoolInfoB = await DAPP_ERC20(REWARD_TOKEN_ADDRESS, address);

        const pool = {
          depositTokenAddress: poolInfo.depositToken,
          rewardTokenAddress: poolInfo.rewardToken,
          depositToken: tokenPoolInfoA,
          rewardToken: tokenPoolInfoB,
          depositedAmount: toEth(poolInfo.depositedAmount.toString()),
          apy: poolInfo.apy.toString(),
          lockDays: poolInfo.lockDays.toString(),
          amount: toEth(userInfo.amount.toString()),
          userRewards: toEth(userRewards),
          lockUntil: CONVERT_TIMESTAMP_TO_READABLE(
            userInfo.lockUntil.toNumber()
          ),
          lastRewardAt: CONVERT_TIMESTAMP_TO_READABLE(
            userInfo.lastRewardAt.toNumber()
          ),
        };
        //push
        poolInfoArray.push(pool);
      }

      let totalDepositedAmount = 0;
      if (poolInfoArray.length > 0) {
        totalDepositedAmount = poolInfoArray.reduce((total, pool) => {
          return total + parseFloat(pool.depositedAmount);
        }, 0);
      }

      const depositToken = await DAPP_ERC20(DEPOSIT_TOKEN_ADDRESS, address);
      const rewardToken = await DAPP_ERC20(REWARD_TOKEN_ADDRESS, address);

      const data = {
        contractOwner: contractOwner,
        contractAddress: contractAddress,
        notifications: _notificationsArray.reverse(),
        depositToken,
        rewardToken,
        poolInfoArray,
        totalDepositedAmount,
        contractDappTokenBalance:
          depositToken.contractDappTokenBalance - totalDepositedAmount,
      };

      // console.log("CONTRACT_DATA: ", data);
      return data;
    }
  } catch (error) {
    console.log(error);
    console.log(parseErrorMsg(error));
    return parseErrorMsg(error);
  }
}

export async function deposit(poolId, amount, address) {
  try {
    notifySuccess("Calling contract...");
    const contract = await dappContract();
    const depositToken = await tokenContract();

    const amountInWei = toWei(amount);

    const currentAllowance = await depositToken.allowance(
      address,
      contract.address
    );

    if (currentAllowance.lt(amountInWei)) {
      notifySuccess("Approving token...");
      const approveTx = await depositToken.approve(
        contract.address,
        amountInWei
      );
      await approveTx.wait();
    }

    const estimateGas = await contract.estimateGas.deposit(
      Number(poolId),
      amountInWei
    );

    notifySuccess("Staking token call...");
    const depositTx = await contract.deposit(poolId, amountInWei, {
      gasLimit: estimateGas,
    });

    const receipt = await depositTx.wait();
    notifySuccess("Token take successfully");

    return receipt;
  } catch (error) {
    console.log(error);
    console.log(parseErrorMsg(error));
    return parseErrorMsg(error);
  }
}

export async function withdraw(poolId, amount) {
  try {
    if (!amount) {
      notifyError("Please provide the nessary amount");
      return "Failed by missing amount";
    }
    notifySuccess("Calling contract...");
    const contract = await dappContract();

    // const amountTowei = toWei(amount);
    const amountTowei = ethers.utils.parseUnits(amount, 18);

    const estimateGas = await contract.estimateGas.withdraw(
      Number(poolId),
      amountTowei
    );

    const tokenTx = await contract.withdraw(Number(poolId), amountTowei, {
      gasLimit: estimateGas,
    });

    const receipt = await tokenTx.wait();
    notifySuccess("Withdraw successfully completed");
    return receipt;
  } catch (error) {
    console.log(error);
    console.log(parseErrorMsg(error));
    return parseErrorMsg(error);
  }
}

export async function claimRewards(poolId) {
  try {
    notifySuccess("Calling contract...");
    const contract = await dappContract();

    const estimateGas = await contract.estimateGas.claimRewards(Number(poolId));

    const tokenTx = await contract.claimRewards(Number(poolId), {
      gasLimit: estimateGas,
    });

    const receipt = await tokenTx.wait();
    notifySuccess("Reward successfully completed");
    return receipt;
  } catch (error) {
    console.log(error);
    console.log(parseErrorMsg(error));
    return parseErrorMsg(error);
  }
}

export async function createPool(pool) {
  const { _depositToken, _rewardToken, _apy, _lockDays } = pool;
  if (!_depositToken || !_rewardToken || !_apy || !_lockDays) {
    notifyError("Please provide all the pool details");
    return "error";
  }
  notifySuccess("Calling contract...");
  const contract = await dappContract();

  const estimateGas = await contract.estimateGas.addPool(
    _depositToken,
    _rewardToken,
    Number(_apy),
    Number(_lockDays)
  );

  const addpoolTx = await contract.addPool(
    _depositToken,
    _rewardToken,
    Number(_apy),
    Number(_lockDays),
    {
      gasLimit: estimateGas,
    }
  );

  const receipt = await addpoolTx.wait();

  notifySuccess("Pool created successfully completed");
  return receipt;
}

export async function modifyPool(poolId, apy, lockDays) {
  if (!apy && !lockDays) {
    notifyError("Please provide the modifyPool details");
  }
  notifySuccess("Calling contract...");
  const contract = await dappContract();

  const estimateGas = await contract.estimateGas.modifyPool(
    Number(poolId),
    Number(apy),
    Number(lockDays)
  );

  const modifyPoolTx = await contract.modifyPool(
    Number(poolId),
    Number(apy),
    Number(lockDays),
    {
      gasLimit: estimateGas,
    }
  );

  const receipt = await modifyPoolTx.wait();
  notifySuccess("Pool modify successfully completed");
  return receipt;
}

export async function transferToken(amount, transferAddress) {
  try {
    notifySuccess("Calling contract token...");

    const depositToken = await tokenContract();

    const transferAmount = toWei(amount);

    const transferTx = await depositToken.transfer(
      transferAddress,
      transferAmount.toString()
    );

    const receipt = await transferTx.wait();
    notifySuccess("Token transfer successfully");
    return receipt;
  } catch (error) {
    console.log(error);
    console.log(parseErrorMsg(error));
    return parseErrorMsg(error);
  }
}

export async function sweep(tokenData) {
  notifySuccess("Calling contract...");
  const { token, amount } = tokenData;
  if (!token || !amount) {
    notifyError("Please provide all the nessary data");
    return "Failed by missing param";
  }

  const contract = await dappContract();

  const amountInWei = ethers.utils.parseUnits(amount, 18);

  const estimateGas = await contract.estimateGas.sweep(token, amountInWei);

  const sweepTx = await contract.sweep(token, amountInWei, {
    gasLimit: estimateGas,
  });

  const receipt = await sweepTx.wait();
  notifySuccess("Token sweep successfully completed");
  return receipt;
}

//add token metamask
export const addTokenMetaMask = async () => {
  if (window.ethereum) {
    const contract = await tokenContract();

    const tokenAddress = contract.address;
    const tokenSymbol = await contract.symbol();
    const tokenDecimals = await contract.decimals();

    const tokenImg = TOKEN_LOGO;

    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImg,
          },
        },
      });

      console.log(".........wasAdded: ", wasAdded);

      if (wasAdded) {
        notifySuccess("Token added");
      } else {
        notifyError("Failed to add token");
      }
    } catch (error) {
      console.log(error);
      console.log(parseErrorMsg(error));
      return parseErrorMsg(error);
    }
  } else {
    notifyError("MetaMask is not install");
  }
};

// ico contract
export const ico_buyToken = async (amount) => {
  try {
    notifySuccess("Calling ico contract...");
    const icoContract = await TOKEN_ICO_CONTRACT();

    const tokenDetails = await icoContract.getTokenDetails();

    const aviableSupply = parseEth(tokenDetails.supply.toString());
    if (aviableSupply > 1) {
      const tokenPrice = await icoContract.tokenSalePrice();
      //1e15 * amount(10) = 1e16
      const price =
        ethers.utils.formatEther(tokenPrice.toString()) * Number(amount);

      const payAmount = ethers.utils.parseUnits(price.toString(), "ether");
      //payAmount:  5000000000000000

      //Number(amount):  500

      //
      const transaction = await icoContract.buyToken(amount, {
        value: payAmount.toString(),
        gasLimit: ethers.utils.hexlify(8000000),
      });

      const receipt = await transaction.wait();

      notifySuccess("Token buy successfully completed");

      return receipt;
    } else {
      notifyError("Token supply is lower than expected");
      return "receipt";
    }
  } catch (error) {
    console.log(error);
    console.log(parseErrorMsg(error));
    return parseErrorMsg(error);
  }
};

export const ico_withdrawToken = async () => {
  try {
    notifySuccess("Calling ico contract...");
    const icoContract = await TOKEN_ICO_CONTRACT();

    const tokenDetails = await icoContract.getTokenDetails();

    const aviableSupply = parseEth(tokenDetails.supply.toString());
    if (aviableSupply > 1) {
      const transaction = await icoContract.withdrawAllTokens();

      const receipt = await transaction.wait();

      notifySuccess("Token withdraw successfully completed");

      return receipt;
    } else {
      notifyError("Token aviable balance is lower than expected");
      return "receipt";
    }
  } catch (error) {
    console.log(error);
    console.log(parseErrorMsg(error));
    return parseErrorMsg(error);
  }
};

export const ico_updateToken = async (address) => {
  try {
    if (!address) {
      notifyError("Data provide is missing");
    }
    notifySuccess("Calling ico contract...");
    const icoContract = await TOKEN_ICO_CONTRACT();

    const estimateGas = await icoContract.estimateGas.uodateToken(address);
    const transaction = await icoContract.uodateToken(address, {
      gasLimit: estimateGas,
    });

    const receipt = await transaction.wait();

    notifySuccess("TUpdate token successfully completed");

    return receipt;
  } catch (error) {
    console.log(error);
    console.log(parseErrorMsg(error));
    return parseErrorMsg(error);
  }
};

export const ico_updateTokenPrice = async (price) => {
  try {
    if (!price) {
      notifyError("Data provide is missing");
    }
    notifySuccess("Calling ico contract...");
    const icoContract = await TOKEN_ICO_CONTRACT();

    //TODO
    const priceWei = toWei(price.toString());

    const estimateGas = await icoContract.estimateGas.uodateTokenSalePrice(
      priceWei
    );
    console.log("updateTokenPrice-estimateGas: ", estimateGas);
    const transaction = await icoContract.uodateTokenSalePrice(priceWei, {
      gasLimit: estimateGas,
    });

    const receipt = await transaction.wait();

    notifySuccess("Update token price  successfully completed");

    return receipt;
  } catch (error) {
    console.log(error);
    console.log(parseErrorMsg(error));
    return parseErrorMsg(error);
  }
};
