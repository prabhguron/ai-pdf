import React, { useEffect, useRef } from "react";
export interface AlertBoxProps {
  boxId?:string;
  isOpen?: boolean;
  title?: string;
  description?: string;
  btnLabel?: string;
  btnClass?: string;
  btnCloseLbl?: string;
  btnCloseClass?: string;
  customBtnLabel?: string;
  customBtnClass?: string;
  zIndexCustom?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  onCustomBtn?: () => void;
}


const Alert = (props:AlertBoxProps) => {
  const {
    boxId,
    isOpen,
    zIndexCustom,
    title,
    description,
    btnLabel,
    btnClass,
    btnCloseLbl,
    btnCloseClass,
    customBtnLabel,
    customBtnClass,
    onClose,
    onCustomBtn,
    onConfirm,
  } = props;
  const alertRef = useRef<HTMLDivElement>(null);;

  useEffect(() => {
    if (isOpen) {
      window.$('#alertModalOpenBtn').trigger('click');
      if(zIndexCustom){
        window.$('.modal-backdrop').addClass('alertBackdropZIndex');
      }else{
        window.$('.modal-backdrop').removeClass('alertBackdropZIndex');
      }
    } else {
      window.$('#alertModalCloseBtn').trigger('click');
    }
    
  }, [isOpen]);

  const alertBoxId = boxId ? boxId :'alertConfirmBox';

  return (
    <>
      <button
        type="button"
        id="alertModalOpenBtn"
        className="d-none"
        data-bs-toggle="modal"
        data-bs-target={`#${alertBoxId}`}

      >confirm</button>
      <div
        ref={alertRef}
        className={`modal fade ${zIndexCustom ? 'alertCustomZIndex' : ''}`}
        id={alertBoxId}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="alertConfirmBoxLabel"
        aria-hidden={!isOpen}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold" id="alertConfirmBoxLabel">
                {title}
              </h5>
              <button
                id="alertModalCloseBtn"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body fw-bold">{description}</div>
            <div className="modal-footer">
              <button
                type="button"
                className={`${btnCloseClass || 'btn btn-secondary'}`}
                data-bs-dismiss="modal"
                onClick={onClose}
              >
              { btnCloseLbl || "Close"}
              </button>

              {customBtnLabel && (
                <button
                  type="button"
                  className={`${customBtnClass || 'btn-style-two btn-xs'}`}
                  data-bs-dismiss="modal"
                  onClick={onCustomBtn}
                >
                {customBtnLabel}
                </button>
              )}

              <button
                type="button"
                className={`${btnClass || 'btn btn-danger'}`}
                onClick={onConfirm}
                data-bs-dismiss="modal"
              >
                {btnLabel || "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alert;
