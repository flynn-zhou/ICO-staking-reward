import React, { useState } from "react";

import { IoMdClose } from "./ReactICON";
import PopUpInputField from "./Admin/RegularComp/PopUpInputField";
import PupUpButton from "./Admin/RegularComp/PupUpButton";

const WithdrawModal = ({
  withdraw,
  withdrawPoolId,
  address,
  setLoader,
  claimRewards,
}) => {
  const [amount, setAmount] = useState();

  const CALL_FUNCTION = async (withdrawPoolId, amount) => {
    setLoader(true);
    const receipt = await withdraw(withdrawPoolId, amount);
    if (receipt) {
      // console.log("receipt:", receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };
  const CALL_FUNCTION_CLAIM = async (withdrawPoolId) => {
    setLoader(true);
    const receipt = await claimRewards(withdrawPoolId);
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
      id="modal-node"
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

            <h4 className="modal__title">Withdraw Token</h4>
            <p className="modal__text">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Autipsa,corrupti repellat asperiores.
            </p>

            <div className="modal__form">
              <PopUpInputField
                title={`Amount`}
                placeholder="Amount"
                handleChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <PupUpButton
              title={"Withdraw"}
              handleClick={() => CALL_FUNCTION(withdrawPoolId, amount)}
            />

            <PupUpButton
              title={"Claim Reward"}
              handleClick={() => CALL_FUNCTION_CLAIM(withdrawPoolId)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
