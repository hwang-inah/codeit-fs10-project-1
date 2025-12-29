import React, { useRef, useState, useEffect, useMemo, useCallback, memo } from 'react';
import EmojiPickerButton from '../../components/UI/EmojiPicker/EmojiPicker';

const arrowRightIcon = '/assets/images/icons/arrow_right.svg';
import Button from '../../components/UI/Button/Button';
import HabitTrackerCard from '../../components/organism/HabitTrackerCard';
import PasswordModal from '../../components/UI/PasswordModal/PasswordModal';
import Modal from '../../components/UI/Model/Modal';
import styles from './ViewStudyDetails.module.css';
import todayHabitStyles from '../../styles/TodayHabitModal.module.css';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useStudyView from '../../hooks/useStudyView';
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';

const ViewStudyDetails = memo(() => {
  const navigate = useNavigate();
  const { studyId } = useParams();
  
  const {
    viewStudyDetailTitle,
    studyIntroduction,
    habits,
    points,
    emojiMetrics,
    loading,
    shouldWrap,
    showDeleteStudyModal,
    setShowDeleteStudyModal,
    deletePassword,
    setDeletePassword,
    showEditStudyModal,
    setShowEditStudyModal,
    editPassword,
    setEditPassword,
    handleEmojiSelect,
    handleEmojiClick,
    handleDeleteStudy,
    handleEditStudy,
  } = useStudyView(studyId);
  
  const topEmojis = useMemo(() => emojiMetrics.slice(0, 3), [emojiMetrics]);
  const remainingEmojis = useMemo(() => emojiMetrics.slice(3), [emojiMetrics]);
  const hasMoreEmojis = useMemo(() => emojiMetrics.length > 3, [emojiMetrics]);

  const days = useMemo(() => ['월', '화', '수', '목', '금', '토', '일'], []);
  
  const engagementMetricsRef = useRef(null);
  const metricButtonsRef = useRef([]);
  const moreEmojisButtonRef = useRef(null);
  const [showMoreEmojisDropdown, setShowMoreEmojisDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showShareModal, setShowShareModal] = useState(false);
  
  const updateDropdownPosition = useCallback(() => {
    if (showMoreEmojisDropdown && moreEmojisButtonRef.current) {
      const rect = moreEmojisButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left
      });
    }
  }, [showMoreEmojisDropdown]);

  useEffect(() => {
    updateDropdownPosition();
  }, [updateDropdownPosition]);

  const handleClickOutside = useCallback((event) => {
      if (
        moreEmojisButtonRef.current &&
        !moreEmojisButtonRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.moreEmojisDropdown}`)
      ) {
        setShowMoreEmojisDropdown(false);
      }
  }, []);
    
  useEffect(() => {
    if (showMoreEmojisDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMoreEmojisDropdown, handleClickOutside]);

  const handleCopy = useCallback(() => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert('링크가 복사되었습니다.');
    }).catch(() => {
      alert('링크 복사에 실패했습니다.');
    });
  }, []);


  // SNS 공유 처리 함수들
  const shareToKakao = useCallback(() => {
    const currentUrl = window.location.href;
    const text = encodeURIComponent(`${viewStudyDetailTitle} - 스터디 공유`);
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(currentUrl)}&text=${text}`;
    window.open(kakaoUrl, '_blank', 'width=550,height=420');
  }, [viewStudyDetailTitle]);

  const shareToTwitter = useCallback(() => {
    const currentUrl = window.location.href;
    const text = encodeURIComponent(`${viewStudyDetailTitle} - 스터디 공유`);
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${text}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  }, [viewStudyDetailTitle]);

  const shareToFacebook = useCallback(() => {
    const currentUrl = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  }, []);

  const shareToLine = useCallback(() => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert('링크가 복사되었습니다. Line 채널이나 친구에게 붙여넣기 해주세요.');
    }).catch(() => {
      alert('링크 복사에 실패했습니다.');
    });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
    <main>
        <div className={styles.mainContainer}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div 
                      ref={engagementMetricsRef}
                      className={`${styles.engagementMetrics} ${shouldWrap ? styles.wrapEnabled : ''}`}
                    >
                        {topEmojis.map((item, index) => (
                          <Button 
                            key={item.emojiId || index} 
                            ref={(el) => metricButtonsRef.current[index] = el}
                            className={styles.metricBtn}
                            onClick={() => handleEmojiClick(item.emojiId)}
                          >
                            <span className={styles.icon}>{item.emoji}</span> 
                            <span>{item.count}</span>
                          </Button>
                        ))}
                        {hasMoreEmojis && (
                          <div style={{ position: 'relative' }} ref={moreEmojisButtonRef}>
                            <Button 
                              className={styles.metricBtn}
                              onClick={() => setShowMoreEmojisDropdown(!showMoreEmojisDropdown)}
                            >
                              <span>...</span>
                            </Button>
                            {showMoreEmojisDropdown && (
                              <div 
                                className={styles.moreEmojisDropdown}
                                style={{
                                  top: `${dropdownPosition.top}px`,
                                  left: `${dropdownPosition.left}px`
                                }}
                              >
                                {remainingEmojis.map((item, index) => (
                                  <Button
                                    key={item.emojiId || index}
                                    className={styles.metricBtn}
                                    onClick={() => {
                                      handleEmojiClick(item.emojiId);
                                    }}
                                  >
                                    <span className={styles.icon}>{item.emoji}</span>
                                    <span>{item.count}</span>
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />
                    </div>
                    <div className={styles.actionButtons}>
                        <Link to="#" className={todayHabitStyles.todayActionLink} onClick={(e) => { e.preventDefault(); setShowShareModal(true); }}>공유하기</Link>
                        <span className={styles.divider}>|</span>
                        <Link to="#" className={todayHabitStyles.todayActionLink} onClick={(e) => { e.preventDefault(); setShowEditStudyModal(true); }}>수정하기</Link>
                        <span className={styles.divider}>|</span>
                        <Link to="#" className={todayHabitStyles.todayActionLink} onClick={(e) => { e.preventDefault(); setShowDeleteStudyModal(true); }}>스터디 삭제하기</Link>
                    </div>
                </div>

                <div className={styles.titleSection}>
                    <h1 className={styles.mainTitle}>{viewStudyDetailTitle}</h1>
                    <div className={styles.navButtons}>
                        <Button className={styles.navBtn} onClick={() => navigate(`/todayHabit/${studyId}`)}>
                          <span className={styles.navBtnText}>오늘의 습관 <img src={arrowRightIcon} alt="arrow right" className={styles.arrowRightIcon} loading="lazy" /></span>
                        </Button>
                        <Button className={styles.navBtn}>
                          <span className={styles.navBtnText}><Link to={`/timer/${studyId}`} className={styles.actionLink}>오늘의 집중</Link> <img src={arrowRightIcon} alt="arrow right" className={styles.arrowRightIcon} loading="lazy" /></span>
                        </Button>
                    </div>
                </div>
                <div className={styles.contentSection}>
                    <div className={styles.introSection}>
                        <h2 className={styles.introTitle}>소개</h2>
                        <p className={styles.introText}>{studyIntroduction || '소개 내용이 없습니다.'}</p>
                    </div>
                    <div className={styles.pointsSection}>
                        <span className={styles.pointsLabel}>현재까지 획득한 포인트</span>
                        <Button className={styles.pointsBtn}>
                            <span className={styles.leafIcon}>🌱</span>
                            <span className={styles.pointsText}>{points}P 획득</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className={styles.mainContent} data-main-content>
              <HabitTrackerCard habits={habits} days={days} studyId={studyId} />
            </div>
        </div>
    </main>
    {showEditStudyModal && (
      <PasswordModal
        password={editPassword}
        onPasswordChange={(e) => setEditPassword(e.target.value)}
        onPasswordSubmit={handleEditStudy}
        buttonText="수정하러 가기"
        modalTitleText="스터디 수정"
        errorMessageText="권한이 필요합니다."
        onPasswordExit={() => setShowEditStudyModal(false)}
        onPasswordExitText="나가기"
        studyId={studyId}
      />
    )}
    {showDeleteStudyModal && (
      <PasswordModal
        password={deletePassword}
        onPasswordChange={(e) => setDeletePassword(e.target.value)}
        onPasswordSubmit={handleDeleteStudy}
        buttonText="삭제하기"
        modalTitleText="스터디 삭제"
        errorMessageText="권한이 필요합니다."
        onPasswordExit={() => setShowDeleteStudyModal(false)}
        onPasswordExitText="나가기"
        studyId={studyId}
      />
    )}
    {showShareModal && (
      <Modal
        title="공유하기"
        onClose={() => setShowShareModal(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '12px',
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            border: '1px solid #E0E0E0'
          }}>
            <span style={{ 
              flex: 1, 
              fontSize: '14px', 
              color: '#333',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {window.location.href}
            </span>
            <button
              onClick={handleCopy}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              aria-label="링크 복사"
            >
              <img 
                src="/assets/images/icons/ftcopy.svg" 
                alt="복사" 
                style={{ width: '20px', height: '20px' }}
              />
            </button>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px',
            paddingTop: '8px'
          }}>
            <button
              onClick={shareToKakao}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              aria-label="Kakao 공유"
            >
              <img 
                src="/assets/images/icons/kakao-icon.png" 
                alt="Kakao" 
                style={{ width: '40px', height: '40px' }}
              />
            </button>
            <button
              onClick={shareToFacebook}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              aria-label="Facebook 공유"
            >
              <img 
                src="/assets/images/icons/facebook-icon.png" 
                alt="Facebook" 
                style={{ width: '40px', height: '40px' }}
              />
            </button>
            <button
              onClick={shareToTwitter}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              aria-label="Twitter 공유"
            >
              <img 
                src="/assets/images/icons/twitter-icon.png" 
                alt="Twitter" 
                style={{ width: '40px', height: '40px' }}
              />
            </button>
            <button
              onClick={shareToLine}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              aria-label="Line 공유"
            >
              <img 
                src="/assets/images/icons/line-icon.png" 
                alt="Twitter" 
                style={{ width: '40px', height: '40px' }}
              />
            </button>
          </div>
        </div>
      </Modal>
    )}
  </>
  );
});

ViewStudyDetails.displayName = 'ViewStudyDetails';

export default ViewStudyDetails;

