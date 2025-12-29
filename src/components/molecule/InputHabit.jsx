import React, { useState } from 'react';
import styles from '../../pages/ViewStudyDetails/ViewStudyDetails.module.css';
import InputText from '../UI/InputText/InputText';

const InputHabit = ({ onAddHabit }) => {
    const [habitName, setHabitName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handlePlaceholderClick = () => {
        setIsAdding(true);
    };

    const handleAdd = () => {
        if (habitName.trim() && onAddHabit) {
            onAddHabit(habitName);
            setHabitName('');
            // Enter 키로 추가할 때는 입력 모드 유지 (새 입력칸 계속 표시)
            // setIsAdding(false); 제거하여 입력 모드 유지
        }
    };

    const handleAddButtonClick = () => {
        if (isAdding) {
            // 입력 중이면 현재 입력을 저장하고 새 입력칸 유지
            if (habitName.trim() && onAddHabit) {
                onAddHabit(habitName);
                setHabitName('');
                // isAdding은 true로 유지하여 새 입력칸 계속 표시
            }
        } else {
            setIsAdding(true);
        }
    };

    if (isAdding) {
        return (
            <div className={styles.habitInputForm}>
                <div className={styles.habitInputWrapper}>
                    <InputText 
                        value={habitName} 
                        onChange={(e) => setHabitName(e.target.value)} 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAdd();
                            } else if (e.key === 'Escape') {
                                setIsAdding(false);
                                setHabitName('');
                            }
                        }}
                        placeholder="습관 이름을 입력해 주세요"
                        autoFocus
                    />
                </div>
                <div className={styles.habitAddButton} onClick={handleAddButtonClick}>
                    +
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.habitAddButton} onClick={handleAddButtonClick}>
                +
            </div>
        </>
    );
}

export default InputHabit;