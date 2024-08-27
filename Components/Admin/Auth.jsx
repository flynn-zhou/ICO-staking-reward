import React from "react";

const Auth = () => {
  return (
    <div className="new-loader-wrapper-admin">
      <div className="modal--auto">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal__content">
              <div className="modal__title">Notic</div>
              <p className="modal__text">
                Sorry you are <span>not authorized to</span> access admin panel
              </p>
              <div className="modal__form">
                <a href="/" className="form__btn" type="button">
                  Go Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
