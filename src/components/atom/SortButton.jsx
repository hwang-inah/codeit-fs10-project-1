import styles from '../../styles/Input.module.css';

const SortButton = ({ value = '최근 순', onChange }) => {

  return (
    <div className={styles.container} >
      <select 
        className={`${styles.input} ${styles.sortButton}`}
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
      >
        <option>최근 순</option>
        <option>오래된 순</option>
        <option>많은 포인트 순</option>
        <option>적은 포인트 순</option>
      </select>
    </div>
  );
};

export default SortButton;