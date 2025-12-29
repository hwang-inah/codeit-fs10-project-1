import styles from '../../styles/Input.module.css';

const InputSearch = ({ type = 'text', value, onChange, onKeyDown}) => {
  return (
    <div className={styles.container}>
      <img className={styles.iconSearch} src='/assets/images/icon/ic_search.svg' alt="search" />
      <input 
        className={`${styles.input} ${styles.inputSearch}`}
        type={type}
        placeholder="검색"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default InputSearch;