import React, { useState } from "react";

import { IoMdClose } from "../ReactICON";

const UpdateAPYModel = ({ setLoader, modifyPool, modifyPoolId }) => {
  const [amount, setAmount] = useState();

  const CALL_FUNCTION_MODIFY_POOL = async (modifyPoolId, amount) => {
    setLoader(true);
    const receipt = await modifyPool(modifyPoolId, amount, 0);
    if (receipt) {
      // console.log("receipt:", receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };

  return (
    <div
      className="modal modal--auto fade"
      id="modal-apool"
      tabIndex={-1}
      aria-labelledby="modal-apool"
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

            <h4 className="modal__title">Invest</h4>
            <p className="modal__text">
              Update staking pool #00-{modifyPoolId} APY %
            </p>

            <div className="modal__form">
              <label htmlFor="amount2" className="form__label">
                Enter Amount
              </label>
              <input
                type="text"
                id="amount2"
                className="apool__input"
                style={{
                  backgroundColor: "transparent",
                }}
                placeholder="amount in %"
                onChange={(e) => setAmount(e.target.value)}
              />

              <button
                onClick={() => CALL_FUNCTION_MODIFY_POOL(modifyPoolId, amount)}
                className="form__btn"
              >
                Update APY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAPYModel;
