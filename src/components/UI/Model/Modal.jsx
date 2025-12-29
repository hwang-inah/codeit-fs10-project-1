import React from 'react'
import styles from './Modal.module.css'

const Modal = ({ children, title, footer, onClose }) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    return (
        <div className={styles.modalContainer} onClick={handleBackdropClick}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {title && (
                    <div className={styles.modalHeader}>
                        <h2 className={styles.modalTitle}>{title}</h2>
                        {onClose && (
                            <button 
                                className={styles.modalCloseButton}
                                onClick={onClose}
                                aria-label="닫기"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
                <div className={styles.modalBody}>
                    {children}
                </div>
                {footer && <div className={styles.modalFooter}>{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;