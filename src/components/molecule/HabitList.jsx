import React from 'react';
import styles from '../../pages/ViewStudyDetails/ViewStudyDetails.module.css';
import InputHabit from './InputHabit';
import icDelete from '/public/assets/images/icons/ic_delete.svg';

const HabitList = ({ habits = [], onDeleteHabit, onCancelHabit, onAddHabit, onUpdateHabit }) => {
  const [editingHabits, setEditingHabits] = React.useState({});

  const handleNameChange = (habitId, newName) => {
    if (onUpdateHabit) {
      onUpdateHabit(habitId, newName);
    }
  };

  const handleEditStart = (habitId) => {
    setEditingHabits(prev => ({ ...prev, [habitId]: true }));
  };

  const handleEditEnd = (habitId) => {
    setEditingHabits(prev => ({ ...prev, [habitId]: false }));
  };

  return (
    <div className={styles.inputHabit}>
      <div className={styles.habitListContainer}>
        {habits.map(habit => (
          <div key={habit.id || habit.habit_pk} className={styles.habitItemWrapper}>
            <div className={styles.habitListItem}>
              {editingHabits[habit.id || habit.habit_pk] ? (
                <input
                  type="text"
                  className={styles.habitNameInput}
                  defaultValue={habit.name}
                  onBlur={(e) => {
                    handleNameChange(habit.id || habit.habit_pk, e.target.value);
                    handleEditEnd(habit.id || habit.habit_pk);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNameChange(habit.id || habit.habit_pk, e.target.value);
                      handleEditEnd(habit.id || habit.habit_pk);
                    } else if (e.key === 'Escape') {
                      handleEditEnd(habit.id || habit.habit_pk);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <span 
                  className={styles.habitName}
                  onClick={() => handleEditStart(habit.id || habit.habit_pk)}
                  style={{ cursor: 'pointer' }}
                >
                  {habit.name}
                </span>
              )}
            </div>
            <div className={styles.deleteIconContainer}>
              <img
                src={icDelete}
                alt="delete"
                className={styles.deleteIcon}
                onClick={() => onDeleteHabit && onDeleteHabit(habit.id || habit.habit_pk)} />
            </div>
          </div>
        ))}
        <InputHabit onAddHabit={onAddHabit} />
      </div>
    </div>
  );
};

export default HabitList;