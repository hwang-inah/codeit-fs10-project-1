import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import style from '../styles/TimerPage.module.css';
import useTimerPage from '../hooks/useTimerPage';
import useToast from '../hooks/useToast';
import LoadingSpinner from '../components/UI/LoadingSpinner/LoadingSpinner';

const formatSeconds = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h === 0) {
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const parseInputToSeconds = (value) => {
  if (!value) return null;
  const parts = value.split(':').map((v) => v.trim());
  if (parts.length === 2) {
    const [mm, ss] = parts;
    const minutes = parseInt(mm, 10);
    const seconds = parseInt(ss, 10);
    if (Number.isNaN(minutes) || Number.isNaN(seconds) || minutes < 0 || seconds < 0 || seconds > 59) return null;
    return minutes * 60 + seconds;
  }
  if (parts.length === 3) {
    const [hh, mm, ss] = parts;
    const hours = parseInt(hh, 10);
    const minutes = parseInt(mm, 10);
    const seconds = parseInt(ss, 10);
    if ([hours, minutes, seconds].some((n) => Number.isNaN(n) || n < 0) || minutes > 59 || seconds > 59) return null;
    return hours * 3600 + minutes * 60 + seconds;
  }
  return null;
};

const formatSecondsToHMS = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

function Timer() {
  const { studyId } = useParams();
  const { showSuccess, showError, showInfo } = useToast();
  const { studyName, pointSum, concentrationTime, loading, updateConcentrationTime, addPoints, parseTimeToSeconds } = useTimerPage(studyId);

  const initialSecondsFromServer = useMemo(() => parseTimeToSeconds(concentrationTime), [concentrationTime, parseTimeToSeconds]);
  const [time, setTime] = useState(initialSecondsFromServer);
  const [initialSeconds, setInitialSeconds] = useState(initialSecondsFromServer);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const hasCompletedRef = useRef(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [timeInput, setTimeInput] = useState(formatSecondsToHMS(initialSecondsFromServer));
  const wasRunningRef = useRef(false);

  // 서버에서 받은 시간이 변경될 때만 초기화 (타이머가 시작되지 않았거나 완료된 경우)
  useEffect(() => {
    const sec = parseTimeToSeconds(concentrationTime);
    setInitialSeconds(sec);
    // 타이머가 한 번도 실행되지 않았거나, 완료된 경우에만 초기화
    // 일시정지 상태에서는 현재 시간을 유지
    if (!isRunning && !wasRunningRef.current && !isEditingTime) {
      setTime(sec);
      if (!isEditingTime) {
        setTimeInput(formatSecondsToHMS(sec));
      }
      hasCompletedRef.current = false;
    }
  }, [concentrationTime, parseTimeToSeconds, isEditingTime]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleComplete = useCallback(async () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    stopInterval();
    setIsRunning(false);
    wasRunningRef.current = false;
    setTime(0);

    const minutes = Math.max(1, Math.ceil(initialSeconds / 60));
    const points = minutes * 2;
    const success = await addPoints(minutes, '집중을 완료하여 포인트를 획득합니다.');

    if (success) {
      showSuccess(`집중 완료! ${points} 포인트 획득!`);
    } else {
      showError('포인트 획득 에러');
    }
  }, [addPoints, initialSeconds, showError, showSuccess, stopInterval]);

  const handleStart = useCallback(() => {
    if (isRunning || time <= 0) return;
    stopInterval();
    hasCompletedRef.current = false;
    wasRunningRef.current = true;
    setIsRunning(true);
    showInfo('집중을 시작합니다.');
    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleComplete, isRunning, showInfo, stopInterval, time]);

  const handlePause = useCallback(() => {
    if (!isRunning) return;
    stopInterval();
    setIsRunning(false);
    showInfo('집중이 중단되었습니다.');
  }, [isRunning, showInfo, stopInterval]);

  const handleReset = useCallback(() => {
    stopInterval();
    setIsRunning(false);
    wasRunningRef.current = false;
    setTime(initialSeconds);
    hasCompletedRef.current = false;
    showInfo('집중이 초기화되었습니다.');
  }, [initialSeconds, showInfo, stopInterval]);

  const handleTimeSave = useCallback(async () => {
    const seconds = parseInputToSeconds(timeInput);
    if (seconds === null) {
      showError('올바른 시간 형식으로 입력해주세요. (mm:ss 또는 hh:mm:ss)');
      return;
    }
    const formatted = formatSecondsToHMS(seconds);
    const ok = await updateConcentrationTime(formatted);
    if (ok) {
      setInitialSeconds(seconds);
      if (!isRunning) {
        setTime(seconds);
      }
      hasCompletedRef.current = false;
      showSuccess('집중 시간이 업데이트되었습니다.');
      setIsEditingTime(false);
    } else {
      showError('시간 업데이트에 실패했습니다.');
    }
  }, [isRunning, showError, showSuccess, timeInput, updateConcentrationTime]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={style.page}>
      <div className={style.head}>
        <div className={style.titleArea}>
          <div className={style.title}>{studyName || '스터디 이름 없음'}</div>
          <div className={style.pointsBox}>
            <span className={style.pointsLabel}>현재까지 획득한 포인트</span>
            <div className={style.data}>
              <img src="/assets/images/icons/ic_point.svg" alt="point" />
              {pointSum}P 획득
            </div>
          </div>
        </div>
        <div className={style.goto}>
          <Link className={style.link} to={`/todayHabit/${studyId || ''}`}>
            오늘의 습관
          </Link>
          <Link className={style.link} to="/">
            홈
          </Link>
        </div>
      </div>

      <div className={style.body}>
        <div className={style.bodyHeader}>
          <span>오늘의 집중</span>
          <div className={style.timeEditArea}>
            {isEditingTime ? (
              <>
                <input
                  className={style.timeInput}
                  type="text"
                  value={timeInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTimeInput(value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTimeSave();
                    } else if (e.key === 'Escape') {
                      setIsEditingTime(false);
                      setTimeInput(formatSecondsToHMS(initialSeconds));
                    }
                  }}
                  placeholder="00:25:00"
                  autoFocus
                  disabled={false}
                />
                <button className={style.timeSaveBtn} onClick={handleTimeSave}>저장</button>
                <button className={style.timeCancelBtn} onClick={() => { setIsEditingTime(false); setTimeInput(formatSecondsToHMS(initialSeconds)); }}>취소</button>
              </>
            ) : (
              <button className={style.timeEditBtn} onClick={() => { 
                setIsEditingTime(true); 
                setTimeInput(formatSecondsToHMS(initialSeconds)); 
              }}>시간 설정</button>
            )}
          </div>
        </div>

        <div className={style.clock} style={{ color: time <= 10 ? "#F50E0E" : time <= 0 ? "#818181" : undefined }}>
          {formatSeconds(time)}
        </div>

        <div className={style.tools}>
          {isRunning && (
            <button className={style.pause_btn} onClick={handlePause}>
              <img src="/assets/images/icons/ic_pause.svg" alt="pause" />
            </button>
          )}
          <button className={style.start_btn} onClick={handleStart} disabled={isRunning || time <= 0}>
            <img src="/assets/images/icons/ic_play.svg" alt="start" />
            Start!
          </button>
          {isRunning && (
            <button className={style.reset_btn} onClick={handleReset}>
              <img src="/assets/images/icons/ic_restart.svg" alt="reset" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Timer;