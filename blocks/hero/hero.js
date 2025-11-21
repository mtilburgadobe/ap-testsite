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

    // Restructure the hero block for proper overlay
    // The content is split across the hero block and the next section (hero-award)
    // We need to grab content from both and combine them

    // Extract content from hero block
    const picture = block.querySelector('picture');
    const h1 = block.querySelector('h1');

    // Get the next section which contains the paragraph and link
    const heroSection = block.closest('.section');
    const nextSection = heroSection?.nextElementSibling;
    const nextBlock = nextSection?.querySelector('.hero-award, .block');

    // Get paragraphs and links from the next section if it exists
    const paragraphs = [];
    if (nextBlock && nextBlock.classList.contains('hero-award')) {
      // This is the continuation of the hero content
      nextBlock.querySelectorAll('p').forEach((p) => {
        if (!p.querySelector('picture') && p.textContent.trim()) {
          paragraphs.push(p.cloneNode(true));
        }
      });

      // Hide the next section since we're pulling its content into the hero
      if (nextSection) {
        nextSection.style.display = 'none';
      }
    }

    // Clear the block
    block.innerHTML = '';

    // Add picture back as background
    if (picture) {
      block.appendChild(picture);
    }

    // Add h1
    if (h1) {
      const text = h1.textContent;
      // Check if this is the "Celebrating" headline
      if (text.includes('Celebrating') && text.includes('watch')) {
        h1.innerHTML = 'Celebrating <br><em>the «Iconic</em><br><em>watch» prize</em>';
      }
      block.appendChild(h1);
    }

    // Add paragraphs from the next section
    paragraphs.forEach((p) => {
      block.appendChild(p);
    });
  }
}
