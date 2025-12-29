import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import Button from '../Button/Button';
import styles from './EmojiPicker.module.css';

const EmojiPickerButton = ({ onEmojiSelect }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: 0, right: 0, left: 'auto' });
  const emojiPickerRef = useRef(null);
  const addButtonRef = useRef(null);

  const handleAddEmoji = () => {
    if (!showEmojiPicker && addButtonRef.current) {
      const rect = addButtonRef.current.getBoundingClientRect();
      
      const mainContent = document.querySelector('[data-main-content]');
      const mainContentRect = mainContent ? mainContent.getBoundingClientRect() : null;
      const leftPosition = mainContentRect ? mainContentRect.left + window.scrollX + 16 : rect.left + window.scrollX;
      const topPosition = rect.bottom + window.scrollY + 8;
      setEmojiPickerPosition({ top: topPosition, left: leftPosition, right: 'auto' });
    }
    setShowEmojiPicker(!showEmojiPicker);
  }

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    onEmojiSelect(emoji);
    setShowEmojiPicker(false);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        addButtonRef.current &&
        !addButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    }
  }, [showEmojiPicker]);

  return (
    <div className={styles.emojiPickerContainer}>
      <Button 
        ref={addButtonRef}
        className={styles.addBtn}
        onClick={handleAddEmoji}
      >
        <span className={styles.icon}>+</span>
        <span>추가</span>
      </Button>
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef} 
          className={styles.emojiPickerWrapper}
          style={{
            top: `${emojiPickerPosition.top}px`,
            right: emojiPickerPosition.right === 'auto' ? 'auto' : `${emojiPickerPosition.right}px`,
            left: emojiPickerPosition.left === 'auto' ? 'auto' : `${emojiPickerPosition.left}px`
          }}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            searchPlaceHolder={styles.searchPlaceHolder}
            width="100%"
            height="400px"
            style={{ maxHeight: 'calc(100vh - 32px)' }}
          />
        </div>
      )}
    </div>
  )
}

export default EmojiPickerButton

