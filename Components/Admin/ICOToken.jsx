import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { LOAD_TOKEN_ICO } from "../../Context/constants";
import {
  ico_updateToken,
  ico_updateTokenPrice,
  ico_withdrawToken,
} from "../../Context/index";

import ButtonCmp from "./RegularComp/ButtonCmp";
import InputField from "./RegularComp/InputField";
import ClickButton from "./RegularComp/ClickButton";
import Title from "./RegularComp/Title";

const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;

const ICOToken = ({ setLoader }) => {
  const { address } = useAccount();
  const [tokenDetails, setTokenDetails] = useState();
  const [updateToken, setUpdateToken] = useState();
  const [updateTokenPrice, setUpdateTokenPrice] = useState();

  useEffect(() => {
    const loadToken = async () => {
      const icoSurportToken = await LOAD_TOKEN_ICO();
      setTokenDetails(icoSurportToken);
      // console.log("icoSurportToken: ", icoSurportToken);
    };
    loadToken();
  }, [address]);

  const CALL_FUNCTION_UPDATETOKEN = async (updateToken) => {
    setLoader(true);
    const receipt = await ico_updateToken(updateToken);
    if (receipt) {
      // console.log("receipt:", receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };
  const CALL_FUNCTION_TOKENWITHDRAW = async () => {
    setLoader(true);
    const receipt = await ico_withdrawToken();
    if (receipt) {
      // console.log("receipt:", receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };

  const CALL_FUNCTION_UPDATETOKEN_PRICE = async (updatePrice) => {
    setLoader(true);
    const receipt = await ico_updateTokenPrice(updatePrice);
    if (receipt) {
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };

  return (
    <div className="tab-pane fade" id="tab-6" role="tabpanel">
      <div className="row">
        <div className="col-12">
          <div className="profile">
            <ul
              className="nav nav-tabs section__tabs section__tabs--left"
              id="section__profile-tabs2"
              role="tablist"
            >
              <ButtonCmp name={"Update Token"} tab={"f9"} styleClass="active" />
              <ButtonCmp name={"Update Token Price"} tab={"f10"} />
              <ButtonCmp name={"Withdraw Token"} tab={"f11"} />
            </ul>

            <div className="tab-content">
              {/* 1 */}
              <div
                className="tab-pane fade show active"
                id="tab-f9"
                role="tabpanel"
              >
                <div className="row">
                  <Title title={"Update Token Address in ICO Contract"} />
                  <InputField
                    size={"12"}
                    type={"text"}
                    title={"Address"}
                    name={"crypto"}
                    placeHolder={`${tokenDetails?.symbol} ${tokenDetails?.name}`}
                    handleChange={(e) => setUpdateToken(e.target.value)}
                  />

                  <ClickButton
                    name={"Update Token"}
                    handleClick={() => CALL_FUNCTION_UPDATETOKEN(updateToken)}
                  />
                </div>
              </div>

              {/* 2 */}
              <div className="tab-pane fade" id="tab-f10" role="tabpanel">
                <div className="row">
                  <Title title={"Update Token Price in ICO Contract"} />
                  <InputField
                    size={"12"}
                    type={"text"}
                    title={"Price"}
                    name={"price1"}
                    placeHolder={`${tokenDetails?.tokenPrice} ${CURRENCY}`}
                    handleChange={(e) => setUpdateTokenPrice(e.target.value)}
                  />

                  <ClickButton
                    name={"Update Token Price"}
                    handleClick={() =>
                      CALL_FUNCTION_UPDATETOKEN_PRICE(updateTokenPrice)
                    }
                  />
                </div>
              </div>

              {/* 3 */}
              <div className="tab-pane fade" id="tab-f11" role="tabpanel">
                <div className="row">
                  <Title title={"Withdraw Token from ICO"} />

                  <ClickButton
                    name={"Withdraw All Token"}
                    handleClick={() => CALL_FUNCTION_TOKENWITHDRAW()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICOToken;
