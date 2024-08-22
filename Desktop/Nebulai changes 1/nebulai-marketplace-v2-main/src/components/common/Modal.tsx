"use client"
import React, { RefObject } from 'react'

interface ModalProps {
  modalTitle: string;
  modalType ?: string;
  modalRef: RefObject<HTMLDivElement> | null;
  modalId: string;
  fullScreen?: boolean;
  customDialog?: boolean;
  children: React.ReactNode
}

const Modal = ({modalTitle, modalType="modal-lg", fullScreen, customDialog, modalRef, modalId, children}: ModalProps) => {

  return (
    <div
    ref={modalRef}
    className={`modal fade`}
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabIndex={-1}
    aria-labelledby={`${modalId}Label`}
    aria-hidden="true"
    id={modalId}
  >
    <div className={`modal-dialog ${customDialog?'modal-dialog-custom':''} ${modalType} ${fullScreen ? 'modal-fullscreen' : ''}`} style={{
      width: '1300px !important'
    }}>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title fw-bold" id={`${modalId}Label`}>
            {modalTitle}
          </h5>
          <button
            type="button"
            className="btn-close modalCloseBtn"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
            {children}
        </div>
        <div className="modal-footer d-none">
        </div>
      </div>
    </div>
  </div>
  )
}

export default Modal