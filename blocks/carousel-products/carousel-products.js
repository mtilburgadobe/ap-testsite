// Simplified carousel for products - no dependencies needed

function updateNavigationButtons(block) {
  const slidesContainer = block.querySelector('.carousel-products-slides');
  const prevButton = block.querySelector('.slide-prev');
  const nextButton = block.querySelector('.slide-next');

  if (!slidesContainer || !prevButton || !nextButton) return;

  const isAtStart = slidesContainer.scrollLeft <= 0;
  const isAtEnd = slidesContainer.scrollLeft + slidesContainer.clientWidth >= slidesContainer.scrollWidth - 1;

  prevButton.disabled = isAtStart;
  nextButton.disabled = isAtEnd;
}

function scrollCarousel(block, direction) {
  const slidesContainer = block.querySelector('.carousel-products-slides');
  if (!slidesContainer) return;

  const slideWidth = slidesContainer.querySelector('.carousel-products-slide')?.offsetWidth || 200;
  const gap = 10;
  const scrollAmount = (slideWidth + gap) * 3; // Scroll 3 items at a time

  const currentScroll = slidesContainer.scrollLeft;
  const targetScroll = direction === 'next'
    ? currentScroll + scrollAmount
    : currentScroll - scrollAmount;

  slidesContainer.scrollTo({
    left: targetScroll,
    behavior: 'smooth',
  });

  setTimeout(() => updateNavigationButtons(block), 300);
}

function bindEvents(block) {
  const prevButton = block.querySelector('.slide-prev');
  const nextButton = block.querySelector('.slide-next');
  const slidesContainer = block.querySelector('.carousel-products-slides');

  if (!prevButton || !nextButton || !slidesContainer) return;

  prevButton.addEventListener('click', () => {
    scrollCarousel(block, 'prev');
  });

  nextButton.addEventListener('click', () => {
    scrollCarousel(block, 'next');
  });

  // Update button states on scroll
  slidesContainer.addEventListener('scroll', () => {
    updateNavigationButtons(block);
  });

  // Update button states on window resize
  window.addEventListener('resize', () => {
    updateNavigationButtons(block);
  });

  // Initial button state
  updateNavigationButtons(block);
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-products-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-products-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-products-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-products-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Product Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-products-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-products-slides');

  // Create navigation buttons
  if (!isSingleSlide) {
    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-products-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="Previous Slide"></button>
      <button type="button" class="slide-next" aria-label="Next Slide"></button>
    `;
    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);
    row.remove();
  });

  container.append(slidesWrapper);
  block.append(container);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}
