import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Framer Motion testlerde sorun çıkarabilir, mocklayalım
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));
