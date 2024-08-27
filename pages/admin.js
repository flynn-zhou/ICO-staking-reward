import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

//internal import
import { Header, Footer, Loader, ICOSale } from "../Components/index";
import Admin from "../Components/Admin/Admin";
import AdminHead from "../Components/Admin/AdminHead";
import UpdateAPYModel from "../Components/Admin/UpdateAPYModel";
import Auth from "../Components/Admin/Auth";

//
import {
  CONTRACT_DATA,
  transferToken,
  createPool,
  modifyPool,
  sweep,
} from "../Context/index";
import { add } from "lodash";

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;

const admin = () => {
  const { address } = useAccount();
  const [loader, setLoader] = useState(false);
  const [checkAdmin, setCheckAdmin] = useState(true);

  const [poolDetails, setPoolDetails] = useState();
  const [modifyPoolId, setModifyPoolId] = useState();

  const LOAD_DATA = async () => {
    // console.log(address);
    if (address) {
      setLoader(true);
      if (address?.toLocaleLowerCase() == ADMIN_ADDRESS.toLocaleLowerCase()) {
        setCheckAdmin(false);
        const data = await CONTRACT_DATA(address);
        // console.log("poolDetails here: ", data);
        setPoolDetails(data);
      }

      setLoader(false);
    }
  };

  useEffect(() => {
    LOAD_DATA();
  }, [address]);

  return (
    <div className="body-backgroundColor">
      <Header />
      <AdminHead />
      <Admin
        poolDetails={poolDetails}
        transferToken={transferToken}
        address={address}
        setLoader={setLoader}
        createPool={createPool}
        sweep={sweep}
        setModifyPoolId={setModifyPoolId}
      />

      <Footer />

      <UpdateAPYModel
        setLoader={setLoader}
        modifyPool={modifyPool}
        modifyPoolId={modifyPoolId}
      />

      <ICOSale setLoader={setLoader} />

      {checkAdmin && <Auth />}
      {loader && <Loader />}
    </div>
  );
};

export default admin;
