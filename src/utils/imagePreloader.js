export const preloadImage = (src) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

export const preloadImages = (srcs) => {
  srcs.forEach(src => preloadImage(src));
};

export const preloadBackgroundImage = (src) => {
  const img = new Image();
  img.src = src;
};

export const preloadFrameImages = () => {
  const frameImages = [
    '/assets/images/frame/frame00.png',
    '/assets/images/frame/frame01.png',
    '/assets/images/frame/frame02.png',
    '/assets/images/frame/frame03.png',
    '/assets/images/frame/frame04.png',
    '/assets/images/frame/frame05.png',
    '/assets/images/frame/frame06.png',
    '/assets/images/frame/frame07.png',
  ];
  
  frameImages.forEach(src => preloadBackgroundImage(src));
};

