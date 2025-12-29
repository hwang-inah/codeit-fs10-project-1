import { useMemo } from 'react';
import styles from './useSkeleton.module.css';

const useSkeleton = () => {
  const ViewStudyDetailsSkeleton = useMemo(() => {
    return (
      <main>
        <div className={styles.viewStudyDetailsContainer}>
          <div className={styles.viewStudyDetailsHeaderTop}>
            <div className={`${styles.skeletonBase} ${styles.viewStudyDetailsEngagementMetrics}`}></div>
            <div className={`${styles.skeletonBase} ${styles.viewStudyDetailsActionButtons}`}></div>
          </div>
          <div className={styles.viewStudyDetailsTitleSection}>
            <div className={`${styles.skeletonBase} ${styles.viewStudyDetailsTitle}`}></div>
            <div className={`${styles.skeletonBase} ${styles.viewStudyDetailsNavButtons}`}></div>
          </div>
          <div>
            <div className={`${styles.skeletonBase} ${styles.viewStudyDetailsSubTitle}`}></div>
            <div className={`${styles.skeletonBase} ${styles.viewStudyDetailsText}`}></div>
            <div className={`${styles.skeletonBase} ${styles.viewStudyDetailsLabel}`}></div>
            <div className={`${styles.skeletonBase} ${styles.viewStudyDetailsButton}`}></div>
          </div>
          <div className={`${styles.skeletonBase} ${styles.viewStudyDetailsHabitTracker}`}></div>
        </div>
      </main>
    );
  }, []);

  const TimerPageSkeleton = useMemo(() => {
    return (
      <main className={styles.timerPageMain}>
        <div className={styles.timerPageContainer}>
          <header className={styles.timerPageHeader}>
            <div className={`${styles.skeletonBase} ${styles.timerPageTitle}`}></div>
            <div className={`${styles.skeletonBase} ${styles.timerPageNavButtons}`}></div>
          </header>
          <section className={styles.timerPagePointsSection}>
            <div className={`${styles.skeletonBase} ${styles.timerPageLabel}`}></div>
            <div className={`${styles.skeletonBase} ${styles.timerPageButton}`}></div>
          </section>
        </div>
        <section className={styles.timerPageTimerSection}>
          <div className={`${styles.skeletonBase} ${styles.timerPageSubTitle}`}></div>
          <div className={`${styles.skeletonBase} ${styles.timerPageTimer}`}></div>
          <div className={`${styles.skeletonBase} ${styles.timerPageTimerDisplay}`}></div>
          <div className={`${styles.skeletonBase} ${styles.timerPageControls}`}></div>
        </section>
      </main>
    );
  }, []);

  const TodayHabitSkeleton = useMemo(() => {
    return (
      <div>
        <section className={styles.todayHabitTitleSection}>
          <div className={`${styles.skeletonBase} ${styles.todayHabitTitle}`}></div>
          <div className={`${styles.skeletonBase} ${styles.todayHabitNavButtons}`}></div>
        </section>
        <section>
          <div style={{ marginBottom: '16px' }}></div>
          <div className={styles.todayHabitPointsSection}>
            <div className={`${styles.skeletonBase} ${styles.todayHabitLabel}`}></div>
            <div className={`${styles.skeletonBase} ${styles.todayHabitButton}`}></div>
          </div>
        </section>
        <section className={styles.todayHabitCardSection}>
          <div className={styles.todayHabitCard}>
            <div className={`${styles.skeletonBase} ${styles.todayHabitCardHeader}`}></div>
            <div className={styles.todayHabitList}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={`${styles.skeletonBase} ${styles.todayHabitItem}`}></div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }, []);

  const EditFormSkeleton = useMemo(() => {
    return (
      <section>
        <div className={`${styles.skeletonBase} ${styles.editFormTitle}`}></div>
        <form>
          <div>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${styles.skeletonBase} ${styles.editFormInputField}`}></div>
            ))}
          </div>
          <div className={`${styles.skeletonBase} ${styles.editFormThumbNailSelect}`}></div>
          <div className={styles.editFormButtonContainer}>
            <div className={`${styles.skeletonBase} ${styles.editFormButton}`}></div>
            <div className={`${styles.skeletonBase} ${styles.editFormButton}`}></div>
          </div>
        </form>
      </section>
    );
  }, []);

  return {
    ViewStudyDetailsSkeleton,
    TimerPageSkeleton,
    TodayHabitSkeleton,
    EditFormSkeleton
  };
};

export default useSkeleton;

