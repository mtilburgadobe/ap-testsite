export default function decorate(block) {
  // Check if block has an image
  const hasImage = block.querySelector(':scope > div:first-child picture');
  if (!hasImage) {
    block.classList.add('no-image');
  }

  // Move content from second div to first div (to overlay on image)
  const firstDiv = block.querySelector(':scope > div:first-child > div');
  const secondDiv = block.querySelector(':scope > div:nth-child(2) > div');

  if (firstDiv && secondDiv) {
    // Move all children from second div to first div
    while (secondDiv.firstChild) {
      firstDiv.appendChild(secondDiv.firstChild);
    }
    // Remove the now-empty second div container
    const secondContainer = block.querySelector(':scope > div:nth-child(2)');
    if (secondContainer) {
      secondContainer.remove();
    }
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
