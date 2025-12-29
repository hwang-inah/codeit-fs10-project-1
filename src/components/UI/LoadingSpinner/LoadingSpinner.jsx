import { ClipLoader } from 'react-spinners';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 50, color = '#95BE2B' }) => {
  return (
    <div className={styles.container}>
      <ClipLoader color={color} size={size} />
    </div>
  );
};

export default LoadingSpinner;
