import { memo } from 'react';
import TodayHabitTemplate from '../template/TodayHabitTemplate';

const TodayHabitPage = memo(() => {
  return (
    <TodayHabitTemplate />
  );
});

TodayHabitPage.displayName = 'TodayHabitPage';

export default TodayHabitPage;