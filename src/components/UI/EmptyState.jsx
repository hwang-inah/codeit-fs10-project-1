import styles from '../../styles/Template.module.css'

const EmptyState = ({ message }) => {
  return (
    <div className={styles.msgBox}>
      <p className={styles.emptyMessage}>{message}</p>
    </div>
  );
};

export default EmptyState;