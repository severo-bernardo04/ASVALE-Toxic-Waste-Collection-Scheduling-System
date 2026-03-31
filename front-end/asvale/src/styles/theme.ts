export const theme = {
  colors: {
    primary: '#2B7A4B',
    secondary: '#1C4B2E',
    background: '#F5F9F6',
    white: '#FFFFFF',
    text: '#1A2F23',
    textLight: '#5C7355',
    error: '#D64545',
    success: '#34D399',
    gray: {
      light: '#E8F0EA',
      medium: '#A8B8A5',
      dark: '#4A5D4C',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(28, 75, 46, 0.1)',
    md: '0 4px 6px rgba(28, 75, 46, 0.1)',
    lg: '0 10px 15px rgba(28, 75, 46, 0.1)',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.25s ease-in-out',
    slow: '0.35s ease-in-out',
  },
  zIndex: {
    base: 1,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

export type Theme = typeof theme;

export default theme; 