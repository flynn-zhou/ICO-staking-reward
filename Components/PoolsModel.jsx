import React, { useState } from "react";

import { IoMdClose } from "./ReactICON";
import PopUpInputField from "./Admin/RegularComp/PopUpInputField";
import PupUpButton from "./Admin/RegularComp/PupUpButton";
import InputRatio from "./Admin/RegularComp/InputRatio";

const PoolsModel = ({
  deposit,
  poolId,
  address,
  selectedPool,
  selectedToken,
  setLoader,
}) => {
  const [amount, setAmount] = useState();

  const CALL_FUNCTION = async (poolId, amount, address) => {
    setLoader(true);
    const receipt = await deposit(poolId, amount, address);
    if (receipt) {
      console.log("receipt:", receipt);
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
              Welcome to crypto King, stake your{" "}
              {selectedPool?.depositToken.name} token to earn reward.
            </p>

            <div className="modal__form">
              <PopUpInputField
                title={`Stake ${selectedPool?.depositToken.name}`}
                placeholder="Amount"
                handleChange={(e) => setAmount(e.target.value)}
              />

              <div className="form__group">
                <label htmlFor="" className="form__label">
                  Pool Details:
                </label>
                <ul className="form__radio">
                  <InputRatio
                    index={1}
                    value={`Your Deposited: ${selectedPool?.amount || 0} 
                    ${selectedPool?.depositToken.symbol}`}
                  />

                  <InputRatio
                    index={1}
                    value={`Total Deposited: ${
                      selectedPool?.depositedTotalAmount || 0
                    } 
                    ${selectedPool?.depositToken.symbol}`}
                  />

                  <InputRatio
                    index={1}
                    value={`My Balance: ${
                      selectedPool?.depositToken.userBalance.slice(0, 8) || 0
                    } ${selectedPool?.depositToken.symbol}`}
                  />
                </ul>
              </div>

              <PupUpButton
                title={"Proceed"}
                handleClick={() => CALL_FUNCTION(poolId, amount, address)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolsModel;
