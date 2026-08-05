import React from 'react';

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  variant?: 'hero' | 'section';
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  className?: string;
  style?: React.CSSProperties;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  children,
  variant = 'section',
  as,
  className = '',
  style,
  ...props
}) => {
  const Component = as || (variant === 'hero' ? 'h1' : 'h2');

  const baseStyles = 'font-black uppercase tracking-tight leading-[1.08] font-syne bg-gradient-to-b from-[#3B5000] to-[#243300] dark:from-[#CCFF00] dark:to-[#5E7800] bg-clip-text text-transparent py-1 pr-2 overflow-visible break-words [overflow-wrap:anywhere] max-w-full min-w-0';

  const sizeStyles =
    variant === 'hero'
      ? (style?.fontSize ? '' : 'text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[7.5vw]')
      : '';

  const computedStyle: React.CSSProperties = {
    ...(variant === 'section' && !style?.fontSize
      ? { fontSize: 'clamp(1.6rem, 5vw, 3.25rem)' }
      : {}),
    ...style,
  };

  return (
    <Component
      className={`${baseStyles} ${sizeStyles} ${className}`.trim()}
      style={computedStyle}
      {...props}
    >
      {children}
    </Component>
  );
};
