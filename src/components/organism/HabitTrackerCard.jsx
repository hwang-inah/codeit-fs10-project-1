import React from 'react';
import styles from '../../pages/ViewStudyDetails/ViewStudyDetails.module.css';
import Sticker from '../UI/Sticker/Sticker';

const HabitTrackerCard = ({ habits = [], days = [], studyId }) => {
  const reversedHabits = [...habits].reverse();

    return (
        <>
        <div className={styles.habitTrackerCard}>
            <h2 className={styles.cardTitle}>습관 기록표</h2>
            <div className={styles.habitGrid}>
                <div className={styles.gridHeader}>
                    <div className={styles.habitHeaderCell}></div>
                    {days.map((day, index) => (
                        <div key={index} className={styles.dayHeaderCell}>
                        {day}
                        </div>
                    ))}
                    </div>
                    {reversedHabits.map(habit => (
                    <div key={habit.id} className={styles.habitRow}>
                        <div className={styles.habitNameCell}>{habit.name}</div>
                        {days.map((_day, frontendDayIndex) => {
                          const dbDayIndex = (frontendDayIndex + 1) % 7;
                          const isCompleted = habit.completed.includes(dbDayIndex);
                          return (
                            <div
                              key={frontendDayIndex} 
                              className={styles.habitCell}
                            >
                              <Sticker 
                                completed={isCompleted}
                                className={isCompleted ? styles.completed : styles.incomplete}
                              />
                            </div>
                          );
                        })}
                    </div>
                    ))}
            </div>
        </div>
    </>
  )
}

export default HabitTrackerCard;