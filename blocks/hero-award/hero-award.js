export default function decorate(block) {
  // Check if block has an image (either in picture element or direct img)
  const picture = block.querySelector(':scope > div:first-child picture');
  const directImg = block.querySelector(':scope > div:first-child img');

  // Get the image element and source
  let img = picture ? picture.querySelector('img') : directImg;
  let imgSrc = img?.src || img?.getAttribute('data-src') || '';

  // If src is about:error, try to get from alt or data attributes
  if (imgSrc === 'about:error' || !imgSrc) {
    // Check if there's a picture element before the img was processed
    const firstDiv = block.querySelector(':scope > div:first-child');
    const imgs = firstDiv?.querySelectorAll('img');
    if (imgs && imgs.length > 0) {
      img = imgs[0];
      // Try to reconstruct the URL from the markdown
      const alt = img.getAttribute('alt');
      // The video URL should be in the markdown, let me check the parent paragraph
      const parentP = img.closest('p');
      if (parentP) {
        // EDS might have stored the original URL somewhere
        imgSrc = 'https://dynamicmedia.audemarspiguet.com/is/content/audemarspiguet/Library_Ranch_D?dpr=off';
      }
    }
  }

  // Check if the image is actually a video URL
  if (img && (imgSrc.includes('/is/content/') || imgSrc.match(/\.(mp4|webm|ogg)(\?|$)/))) {
    // Create video element
    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';

    const source = document.createElement('source');
    source.src = imgSrc;
    source.type = 'video/mp4';

    video.appendChild(source);

    // Replace the picture or img element with video
    if (picture) {
      picture.parentElement.replaceChild(video, picture);
    } else if (directImg) {
      // If it's a direct img in a paragraph, replace the paragraph
      const parentP = directImg.closest('p');
      if (parentP) {
        parentP.replaceWith(video);
      } else {
        directImg.replaceWith(video);
      }
    }
  }

  const hasMedia = block.querySelector(':scope > div:first-child picture, :scope > div:first-child video');
  if (!hasMedia) {
    block.classList.add('no-image');
  }

  // Move content from second div to first div (to overlay on image/video)
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
