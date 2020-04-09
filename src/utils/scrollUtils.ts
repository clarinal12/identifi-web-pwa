export const scrollToTop = (isSmooth = true) => window.scrollTo({ top: 0, behavior: isSmooth ? 'smooth' : 'auto' });
