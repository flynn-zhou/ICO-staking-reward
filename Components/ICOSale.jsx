import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

import { IoMdClose } from "./ReactICON";
import { LOAD_TOKEN_ICO } from "../Context/constants";
import { ico_buyToken } from "../Context/index";

const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;

const ICOSale = ({ setLoader }) => {
  const { address } = useAccount();
  const [tokenDetails, setTokenDetails] = useState();
  const [quentity, setQuentity] = useState(0);

  useEffect(() => {
    const loadToken = async () => {
      const icoSurportToken = await LOAD_TOKEN_ICO();
      setTokenDetails(icoSurportToken);
    };
    loadToken();
  }, [address]);

  const CALL_FUNCTION_BUY_TOKEN = async (quentity) => {
    setLoader(true);
    const receipt = await ico_buyToken(quentity);
    if (receipt) {
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };

  return (
    <div
      className="modal modal--auto fade"
      id="modal-deposit1"
      tabIndex={-1}
      aria-labelledby="modal-deposit1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal__content">
            <button
              className="modal__close"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i className="ti ti-x">
                <IoMdClose />
              </i>
            </button>

            <h4 className="modal__title">{tokenDetails?.symbol} ICO Token</h4>
            <p className="modal__text">
              Participate in the <span>Ongoing ICO Token</span> sale
            </p>

            <div className="modal__form">
              <div className="form__group">
                <label className="form__label">
                  ICO Supply:{" "}
                  {`${tokenDetails?.supply} ${tokenDetails?.symbol}`}
                </label>
                <input
                  type="text"
                  className="form__input"
                  placeholder={`${tokenDetails?.symbol}: ${tokenDetails?.balance
                    .toString()
                    .slice(0, 12)}`}
                  onChange={(e) => setQuentity(e.target.value)}
                />
              </div>

              <div className="form__group">
                <label className="form__label">Pay Amount</label>
                <input
                  type="text"
                  className="form__input"
                  placeholder={`${
                    Number(tokenDetails?.tokenPrice) * quentity
                  } ${CURRENCY}`}
                  disabled
                />
              </div>

              <button
                className="form__btn"
                type="button"
                onClick={() => CALL_FUNCTION_BUY_TOKEN(quentity)}
              >
                Buy {tokenDetails?.symbol}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICOSale;
