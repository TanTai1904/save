import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to apply a 3D tilt effect on hover based on mouse movement.
 * @param {Object} options - Custom configuration for the tilt effect
 * @param {number} options.max - Maximum rotation angle in degrees (default: 10)
 * @param {number} options.perspective - Perspective depth in pixels (default: 1000)
 * @param {number} options.scale - Scale on hover (default: 1.02)
 * @param {number} options.speed - Speed of transitions in ms when mouse leaves (default: 300)
 * @returns {[React.RefObject, Object]} A ref to attach to the target element and the style object containing transform rules
 */
export default function use3DTilt(options = {}) {
  const { max = 10, perspective = 1000, scale = 1.02, speed = 300 } = options;
  const [style, setStyle] = useState({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: `transform ${speed}ms cubic-bezier(0.25, 1, 0.5, 1)`,
  });
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // X position within element
      const y = e.clientY - rect.top;  // Y position within element
      
      const width = rect.width;
      const height = rect.height;

      // Compute normalized values between -0.5 and 0.5
      const xc = (x / width) - 0.5;
      const yc = (y / height) - 0.5;

      // Calculate rotation (rotateY is linked to horizontal, rotateX to vertical)
      const rotateX = -yc * max;
      const rotateY = xc * max;

      setStyle({
        transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: 'transform 100ms cubic-bezier(0.25, 1, 0.5, 1)',
        willChange: 'transform',
      });
    };

    const handleMouseLeave = () => {
      setStyle({
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transition: `transform ${speed}ms cubic-bezier(0.25, 1, 0.5, 1)`,
        willChange: 'transform',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [max, perspective, scale, speed]);

  return [ref, style];
}
