// Load and distribute haircut images dynamically
async function loadHaircutImages() {
    try {
        const response = await fetch('./src/imgs/cortes/images.json');
        const images = await response.json();
        
        const classicsScroll = document.getElementById('classicsScroll');
        const modernsScroll = document.getElementById('modernsScroll');
        
        // Calculate split point (half of total images)
        const midpoint = Math.ceil(images.length / 2);
        const classicsImages = images.slice(0, midpoint);
        const modernsImages = images.slice(midpoint);
        
        // Function to create and append card elements
        function appendCards(container, imageList) {
            imageList.forEach((imageName, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                const img = document.createElement('img');
                img.src = `./src/imgs/cortes/${imageName}`;
                img.alt = `Corte ${index + 1}`;
                card.appendChild(img);
                container.appendChild(card);
            });
        }
        
        appendCards(classicsScroll, classicsImages);
        appendCards(modernsScroll, modernsImages);
    } catch (error) {
        console.error('Error loading haircut images:', error);
    }
}

// Load images when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHaircutImages);
} else {
    loadHaircutImages();
}

// Slider functionality with radio buttons
const radioButtons = document.querySelectorAll('.slider-radio');
const slidesContainer = document.querySelector('.slides-container');

// Optional: Auto-rotate slides every 5 seconds
let currentSlide = 1;

setInterval(() => {
    const nextSlide = currentSlide === 2 ? 1 : currentSlide + 1;
    document.getElementById(`slide${nextSlide}`).checked = true;
    currentSlide = nextSlide;
}, 18000);

// Drag-to-navigate for slides container
let isDown = false;
let startX;
let dragThreshold = 50; // minimum drag distance to trigger slide change

slidesContainer.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // left button only
    isDown = true;
    slidesContainer.classList.add('dragging');
    startX = e.pageX;
    document.body.style.userSelect = 'none';
    e.preventDefault();
});

slidesContainer.addEventListener('mouseleave', () => {
    isDown = false;
    slidesContainer.classList.remove('dragging');
});

slidesContainer.addEventListener('mouseup', (e) => {
    if (!isDown) return;
    isDown = false;
    slidesContainer.classList.remove('dragging');
    
    const endX = e.pageX;
    const dragDistance = startX - endX;
    
    // Drag right (negative distance) = previous slide
    // Drag left (positive distance) = next slide
    if (Math.abs(dragDistance) > dragThreshold) {
        if (dragDistance > 0) {
            // Dragged left, show next slide
            const nextSlide = currentSlide === 2 ? 1 : currentSlide + 1;
            document.getElementById(`slide${nextSlide}`).checked = true;
            currentSlide = nextSlide;
        } else {
            // Dragged right, show previous slide
            const prevSlide = currentSlide === 1 ? 2 : currentSlide - 1;
            document.getElementById(`slide${prevSlide}`).checked = true;
            currentSlide = prevSlide;
        }
    }
});

['mouseup', 'mouseleave'].forEach(evt => {
    slidesContainer.addEventListener(evt, () => {
        document.body.style.userSelect = '';
    });
});
// Card Modal Functionality
const modal = document.getElementById('cardModal');
const modalImage = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.modal-prev');
const nextBtn = document.querySelector('.modal-next');

let currentIndex = 0;
let allCards = [];

function updateCardsList() {
    allCards = Array.from(document.querySelectorAll('.card'));
}

function openModal(index){
    if (allCards.length === 0) return;
    const img = allCards[index].querySelector('img');
    modalImage.src = img.src;
    modalImage.style.width = "50rem"
    modalImage.style.height = "50rem"
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    currentIndex = index;
}

function closeModal(){
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

// Event delegation for dynamically created cards
document.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) {
        updateCardsList();
        const index = allCards.indexOf(card);
        if (index !== -1) {
            openModal(index);
        }
    }
});

closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

prevBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + allCards.length) % allCards.length;
    openModal(currentIndex);
});

nextBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % allCards.length;
    openModal(currentIndex);
});

// keyboard navigation
document.addEventListener('keydown', (e)=>{
    if (!modal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'Escape') closeModal();
});

// Drag-to-scroll for .scrollX containers (mouse)
const scrollContainers = document.querySelectorAll('.scrollX');
scrollContainers.forEach(container => {
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // left button only
        isDown = true;
        container.classList.add('dragging');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        // prevent text selection while dragging
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    container.addEventListener('mouseleave', ()=>{
        isDown = false; container.classList.remove('dragging');
    });
    container.addEventListener('mouseup', ()=>{
        isDown = false; container.classList.remove('dragging');
    });

    container.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        // drag multiplier for easier dragging
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;
    });

    // restore userSelect when drag ends
    ['mouseup','mouseleave'].forEach(evt => {
        container.addEventListener(evt, ()=>{ document.body.style.userSelect = ''; });
    });
});