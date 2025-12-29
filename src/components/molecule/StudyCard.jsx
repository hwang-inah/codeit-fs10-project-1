import styles from '../../styles/StudyCard.module.css';
import Emoji from '../atom/Emoji';
import ThumbNail from '../atom/ThumbNail';
import day from 'dayjs';
import { Link } from 'react-router';
import { addToRecentStudyQueue } from '../../utils/recentStudyQueue';

const StudyCard = ({ id, nickName, studyName, introduction, createdAt, point, thumbNail = 0, stats = [] }) => {

  const dayDiff = (createdAt) => {
    const today = day();
    const createdDate = day(createdAt);
    const diffDays = today.diff(createdDate, 'day', false);
    const dDay = Math.floor(diffDays);
    
    return dDay
  } 

  const date = dayDiff(createdAt)
  const textColor = thumbNail > 3 ? '#fff' : '';

  const handleCardClick = () => {
    if (id) {
      addToRecentStudyQueue(id);
      // detail page로 이동할 때 session storage에 studyId 저장
      sessionStorage.setItem('current_study_id', String(id));
      window.dispatchEvent(new CustomEvent('recentStudyUpdated'));
    }
  };

  return (
    <section>
      <Link to={`/detail/${id}`} className={styles.underlineLink} onClick={handleCardClick}>
        <div className={`${styles.container} ${styles[`thumbnail${thumbNail}`]}`} > 
          <ThumbNail value={thumbNail}>
            <div className={styles.content}>
              <div className={styles.titleBox}>
                <h3 className={styles.title}>
                  {nickName && <p className={styles.nickName}>{nickName}</p>}
                  <p style={{ color: textColor }} className={styles.studyName}>
                    {nickName ? `의 ${studyName}` : studyName}
                  </p>
                </h3>
                {(point !== undefined && point !== null) && 
                <div className={styles.badge}> 
                  <img className={styles.emoji} src='/assets/images/icon/ic_point.svg' alt="Point" /> 
                  {point}P 획득 
                </div>}
              </div>
              <p style={{ color: textColor }} className={styles.meta}>{date}일째 진행 중</p>
              <p style={{ color: textColor }} className= {styles.introduction}>{introduction}</p>
            </div>
            
            <Emoji stats={stats} />
          </ThumbNail>
        </div>
      </Link>
    </section>
  );
}

export default StudyCard;
