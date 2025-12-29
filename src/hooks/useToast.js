import { toast } from 'react-toastify';

const TOAST_COLORS = {
  SUCCESS: {
    backgroundColor: '#99C08E',
    progressColor: '#41643a',
  },
  ERROR: {
    backgroundColor: '#F50E0E',
    progressColor: '#CC0B0B',
  },
  INFO: {
    backgroundColor: '#87CEEB',
    progressColor: '#6BB6D6',
  },
  WARNING: {
    backgroundColor: '#FFA500',
    progressColor: '#FF8C00',
  },
};

const DEFAULT_OPTIONS = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const useToast = () => {
  const showSuccess = (message, options = {}) => {
    toast.success(message, {
      ...DEFAULT_OPTIONS,
      ...options,
      style: {
        backgroundColor: TOAST_COLORS.SUCCESS.backgroundColor,
        color: '#fff',
        ...options.style,
      },
      progressStyle: {
        backgroundColor: TOAST_COLORS.SUCCESS.progressColor,
        ...options.progressStyle,
      },
    });
  };

  const showError = (message, options = {}) => {
    toast.error(message, {
      ...DEFAULT_OPTIONS,
      ...options,
      style: {
        backgroundColor: TOAST_COLORS.ERROR.backgroundColor,
        color: '#fff',
        ...options.style,
      },
      progressStyle: {
        backgroundColor: TOAST_COLORS.ERROR.progressColor,
        ...options.progressStyle,
      },
    });
  };

  const showInfo = (message, options = {}) => {
    toast.info(message, {
      ...DEFAULT_OPTIONS,
      ...options,
      style: {
        backgroundColor: TOAST_COLORS.INFO.backgroundColor,
        color: '#fff',
        ...options.style,
      },
      progressStyle: {
        backgroundColor: TOAST_COLORS.INFO.progressColor,
        ...options.progressStyle,
      },
    });
  };

  const showWarning = (message, options = {}) => {
    toast.warning(message, {
      ...DEFAULT_OPTIONS,
      ...options,
      style: {
        backgroundColor: TOAST_COLORS.WARNING.backgroundColor,
        color: '#fff',
        ...options.style,
      },
      progressStyle: {
        backgroundColor: TOAST_COLORS.WARNING.progressColor,
        ...options.progressStyle,
      },
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};

export default useToast;

