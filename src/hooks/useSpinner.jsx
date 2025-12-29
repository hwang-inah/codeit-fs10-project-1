import { useMemo, useCallback } from 'react';
import { ClipLoader } from 'react-spinners';
import styles from './useSpinner.module.css';

const useSpinner = () => {
  const Spinner = useCallback(({ size = 50, color = '#95BE2B' } = {}) => (
    <div className={styles.container}>
      <ClipLoader color={color} size={size} />
    </div>
  ), []);

  const SmallSpinner = useMemo(() => (
    <div className={styles.container}>
      <ClipLoader color="#95BE2B" size={30} />
    </div>
  ), []);

  const MediumSpinner = useMemo(() => (
    <div className={styles.container}>
      <ClipLoader color="#95BE2B" size={40} />
    </div>
  ), []);

  const LargeSpinner = useMemo(() => (
    <div className={styles.container}>
      <ClipLoader color="#95BE2B" size={60} />
    </div>
  ), []);

  return {
    Spinner,
    SmallSpinner,
    MediumSpinner,
    LargeSpinner
  };
};

export default useSpinner;

