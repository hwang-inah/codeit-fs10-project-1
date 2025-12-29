import styles from '../../styles/Input.module.css';

const LoadMoreButton = ({ onClick }) => {
  return (
    <>
      <button className={`${styles.input} ${styles.LoadMoreButton}`} onClick={onClick}>더보기</button>
    </>
  );
};

export default LoadMoreButton;