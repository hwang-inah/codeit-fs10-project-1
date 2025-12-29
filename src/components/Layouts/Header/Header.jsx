import styles from './Header.module.css';
import React from 'react';

const imgLogoForest = '/assets/images/logos/img_logo.svg';

export default function Header() {
    return (
        <div className={styles.logoForestContainer}>
            <img src={imgLogoForest} alt="logo" className={styles.logoForest} />
        </div>
    )
}