import { Children, cloneElement } from 'react';

export default function Stagger({ children, className = '', staggerDelay = 0.1, direction = 'up' }) {
  const dirStyles = {
    up: 'translateY(20px)',
    down: 'translateY(-20px)',
    left: 'translateX(-20px)',
    right: 'translateX(20px)',
    none: 'translateY(0)',
  };

  return (
    <div className={className}>
      {Children.map(children, (child, i) =>
        cloneElement(child, {
          style: {
            opacity: 0,
            transform: dirStyles[direction],
            animation: `slideUp 0.5s ease-out ${i * staggerDelay}s forwards`,
            ...child.props.style,
          },
        })
      )}
    </div>
  );
}
