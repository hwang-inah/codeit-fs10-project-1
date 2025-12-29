import styles from '../../styles/StudyCard.module.css';

const Emoji = ({ stats = [] }) => {
  return (
    <div className={styles.stats}>
      {stats.map((stat, index) => (
        <div className={styles.stat} key={index}>
          {stat.icon} {stat.value}
        </div> 
      ))}
    </div>
  );
};

export default Emoji;
