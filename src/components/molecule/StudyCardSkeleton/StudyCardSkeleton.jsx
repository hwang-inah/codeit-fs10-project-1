import { memo } from 'react';
import styles from '../../../styles/StudyCard.module.css';
import skeletonStyles from './StudyCardSkeleton.module.css';

const StudyCardSkeleton = memo(() => {
  return (
    <section>
      <div className={`${styles.container} ${skeletonStyles.skeleton}`}>
        <div className={styles.content}>
          <div className={styles.titleBox}>
            <div className={skeletonStyles.skeletonTitle}></div>
            <div className={skeletonStyles.skeletonBadge}></div>
          </div>
          <div className={skeletonStyles.skeletonMeta}></div>
          <div className={skeletonStyles.skeletonIntroduction}></div>
        </div>
      </div>
    </section>
  );
});

StudyCardSkeleton.displayName = 'StudyCardSkeleton';

export default StudyCardSkeleton;

