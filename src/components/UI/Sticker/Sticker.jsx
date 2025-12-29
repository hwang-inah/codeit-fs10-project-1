import React from 'react';
import icStickerGreen from '/assets/images/icons/ic_sticker_green.svg';
import icIncomplete from '/assets/images/icons/ic_incomplete.svg';
import styles from './Sticker.module.css';

const Sticker = ({ completed, className, onClick }) => {
    return (
        <img 
            src={completed ? icStickerGreen : icIncomplete} 
            alt={completed ? 'completed' : 'incomplete'} 
            className={className || styles.stickerIcon}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        />
    );
};
export default Sticker;
