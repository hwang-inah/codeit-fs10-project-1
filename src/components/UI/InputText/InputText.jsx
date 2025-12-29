import React from 'react'
import styles from './InputText.module.css'

const InputText = ({ value, onChange, placeholder, className = '', inputTextClassName = '', type = 'text', id, onKeyDown, autoFocus }) => {
    return (
        <div className={styles.inputTextContainer}>
            <input 
                id={id} 
                type={type} 
                value={value} 
                onChange={onChange} 
                onKeyDown={onKeyDown}
                placeholder={placeholder} 
                className={className || styles.inputText}
                autoFocus={autoFocus}
            />
        </div>
    )
}
export default InputText