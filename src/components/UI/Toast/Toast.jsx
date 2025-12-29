import React from 'react';
import { useState, useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type = 'info', duration = 3000, onDismiss }) => {


    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
    };   

    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            onDismiss && onDismiss();
        }, duration);
    };

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(handleDismiss, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, handleDismiss, duration]);

    if (!isVisible) return null;
    
    return (
        <div className={styles.toastContainer}>
            <div className={styles.toastIcon}><img src={icons[type] || icons.info} alt={type} /></div>
            <div className={styles.toastMessage}>{message}</div>
            <button className={styles.toastClose} onClick={handleDismiss}>
                <img src={closeIcon} alt="close" />
            </button>
        </div>
    );
};
export default Toast;