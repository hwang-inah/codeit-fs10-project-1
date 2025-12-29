import styles from '../styles/Template.module.css';
import TodayHabit from '../components/organism/TodayHabit';

const TodayHabitTemplate = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <TodayHabit />
      </div>
    </div>
  );
};

export default TodayHabitTemplate;