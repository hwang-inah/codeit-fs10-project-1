import React from 'react';
import styles from './Button.module.css';

const Button = React.forwardRef(({ children, onClick, className }, ref) => {
    const buttonClassName = className || styles.button;

    return (
        <button ref={ref} className={buttonClassName} onClick={onClick}>{children}</button>
    );
});

export default Button;