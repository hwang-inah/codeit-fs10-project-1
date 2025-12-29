import React from 'react'
import styles from './Label.module.css'

const Label = ({ children, htmlFor, labelClassName, labelId, labelText }) => {
    return (
        <label htmlFor={htmlFor} className={labelClassName || styles.label} id={labelId}>
            {labelText && <span className={styles.labelText}>{labelText}</span>}
            {children && <span className={styles.labelChildren}>{children}</span>}
        </label>
        );
    };
export default Label;