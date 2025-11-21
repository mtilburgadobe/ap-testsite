export default function decorate(block) {
  // Check if this hero block is in the first section
  const isFirstSection = block.closest('.section') === document.querySelector('main > .section');

  if (isFirstSection) {
    // Add hero-page class to body for transparent header
    document.body.classList.add('hero-page');

    // Handle scroll for header background
    const handleScroll = () => {
      if (window.scrollY > 100) {
        document.body.classList.add('scrolled');
      } else {
        document.body.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state
  }
}
