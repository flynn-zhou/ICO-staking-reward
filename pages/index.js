import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

import {
  Header,
  ICOSale,
  HeroSection,
  Loader,
  Footer,
  Pools,
  PoolsModel,
  WithdrawModal,
  Withdraw,
  Partners,
  Statistics,
  Token,
  Notification,
  Ask,
  Contact,
} from "../Components/index";

import {
  CONTRACT_DATA,
  deposit,
  withdraw,
  claimRewards,
  addTokenMetaMask,
} from "../Context/index";

const index = () => {
  const { address } = useAccount();
  const [loader, setLoader] = useState(false);
  const [contactUs, setContactUs] = useState(false);
  const [poolId, setPoolId] = useState();
  const [withdrawPoolId, setWithdrawPoolId] = useState();

  const [poolDetails, setPoolDetails] = useState();
  const [selectedPool, setSelectedPool] = useState();
  const [selectedToken, setSelectedToken] = useState();

  const LOAD_DATA = async () => {
    // if (address) {

    // }
    setLoader(true);
    const data = await CONTRACT_DATA(address);
    setPoolDetails(data);
    setLoader(false);
  };

  useEffect(() => {
    LOAD_DATA();
  }, [address]);

  // console.log("poolDetails: ", poolDetails);

  return (
    <div className="body-backgroundColor">
      <Header />
      <HeroSection addTokenMetaMask={addTokenMetaMask} />
      <Statistics poolDetails={poolDetails} />

      <Pools
        setPoolId={setPoolId}
        poolDetails={poolDetails}
        setSelectedPool={setSelectedPool}
        setSelectedToken={setSelectedToken}
      />

      <Token poolDetails={poolDetails} />

      <Withdraw
        poolDetails={poolDetails}
        setWithdrawPoolId={setWithdrawPoolId}
      />

      <Notification poolDetails={poolDetails} />

      <Partners />

      <Ask setContactUs={setContactUs} />

      <Footer />

      {/* MODAL */}
      <PoolsModel
        deposit={deposit}
        poolId={poolId}
        address={address}
        selectedPool={selectedPool}
        selectedToken={selectedToken}
        setLoader={setLoader}
      />
      <WithdrawModal
        withdraw={withdraw}
        withdrawPoolId={withdrawPoolId}
        address={address}
        setLoader={setLoader}
        claimRewards={claimRewards}
      />

      <ICOSale setLoader={setLoader} />

      {contactUs && <Contact setContactUs={setContactUs} />}
      {loader && <Loader />}
    </div>
  );
};

export default index;
