export default function decorate(block) {
  // Check if block has an image
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Add hero-page class to body for transparent header
  const isFirstSection = block.closest('.section') === document.querySelector('main > .section');
  if (isFirstSection) {
    document.body.classList.add('hero-page');

    // Handle scroll for header transparency
    const handleScroll = () => {
      if (window.scrollY > 100) {
        document.body.classList.add('scrolled');
      } else {
        document.body.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
  }
}
