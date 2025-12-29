import ThumbNail, { images } from '../atom/ThumbNail';
import styles from '../../styles/Input.module.css';
import selectIcon from '/public/assets/images/icon/ic_bg_selected.svg'

const ThumbNailSelect = ({ selectedThumbNail, onSelectThumbNail }) => {
  
  return (
    <div>
      <p className={styles.label}>배경을 선택해주세요</p>
      <div className={styles.thumbNailSelect}>
        {Object.keys(images).map((key) => {
          const isSelected = selectedThumbNail === key;
          
          return (
            <div 
              className={styles.selectBox} 
              key={key}
              onClick={() => onSelectThumbNail(key)}
            >
              <ThumbNail 
                value={key}
                selected={isSelected}
              />
              {isSelected && (
                <img 
                  className={styles.selectIcon}
                  src={selectIcon}
                  alt="선택됨"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default ThumbNailSelect;