import { useState, useEffect, useRef } from 'react';
import { useLazyLoad } from '../../utils/performance';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

const LazyImage = ({ src, alt, className = '', placeholder }: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const isVisible = useLazyLoad(imgRef);

  useEffect(() => {
    if (!isVisible) return;

    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
    img.src = src;
  }, [src, isVisible]);

  if (!isVisible) {
    return (
      <div
        ref={imgRef}
        className={`${className} bg-gray-200 animate-pulse`}
        style={{ aspectRatio: '16/9' }}
      />
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={loaded ? src : placeholder}
      alt={alt}
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      loading="lazy"
    />
  );
};

export default LazyImage;