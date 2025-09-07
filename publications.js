// Publications2 Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializePublications2();
});

function initializePublications2() {
    initializeFilters();
    initializeViewToggle();
    initializePagination();
    initializePublicationActions();
    initializeSearch();
}

// Filter Functionality
function initializeFilters() {
    const yearFilter = document.getElementById('year-filter');
    const typeFilter = document.getElementById('type-filter');
    const categoryFilter = document.getElementById('category-filter');

    if (yearFilter) yearFilter.addEventListener('change', applyFilters);
    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const yearFilter = document.getElementById('year-filter')?.value || '';
    const typeFilter = document.getElementById('type-filter')?.value || '';
    const categoryFilter = document.getElementById('category-filter')?.value || '';
    
    const publicationCards = document.querySelectorAll('.publication-card');
    let visibleCount = 0;

    publicationCards.forEach(card => {
        const cardYear = card.getAttribute('data-year') || '';
        const cardType = card.getAttribute('data-type') || '';
        const cardCategory = card.getAttribute('data-category') || '';

        const yearMatch = !yearFilter || cardYear === yearFilter;
        const typeMatch = !typeFilter || cardType === typeFilter;
        const categoryMatch = !categoryFilter || cardCategory === categoryFilter;

        if (yearMatch && typeMatch && categoryMatch) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    // Update pagination based on visible results
    updatePaginationForFilters(visibleCount);
    
    // Add loading animation
    const container = document.getElementById('publications-container');
    if (container) {
        container.classList.add('loading');
        setTimeout(() => {
            container.classList.remove('loading');
        }, 300);
    }
}

// View Toggle Functionality
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const publicationsContainer = document.getElementById('publications-container');

    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewType = this.getAttribute('data-view');
            
            // Update active state
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle container class
            if (publicationsContainer) {
                if (viewType === 'list') {
                    publicationsContainer.classList.add('list-view');
                } else {
                    publicationsContainer.classList.remove('list-view');
                }
            }
        });
    });
}

// Pagination Functionality
function initializePagination() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pageNumbers = document.querySelectorAll('.pagination-number');

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (!this.disabled) {
                goToPreviousPage();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (!this.disabled) {
                goToNextPage();
            }
        });
    }

    pageNumbers.forEach(btn => {
        btn.addEventListener('click', function() {
            const pageNumber = parseInt(this.textContent);
            goToPage(pageNumber);
        });
    });
}

function goToPreviousPage() {
    const currentPage = getCurrentPage();
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

function goToNextPage() {
    const currentPage = getCurrentPage();
    const maxPages = getMaxPages();
    if (currentPage < maxPages) {
        goToPage(currentPage + 1);
    }
}

function goToPage(pageNumber) {
    // Update active page number
    document.querySelectorAll('.pagination-number').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === pageNumber) {
            btn.classList.add('active');
        }
    });

    // Update prev/next button states
    updatePaginationButtons(pageNumber);
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function getCurrentPage() {
    const activePage = document.querySelector('.pagination-number.active');
    return activePage ? parseInt(activePage.textContent) : 1;
}

function getMaxPages() {
    const pageNumbers = document.querySelectorAll('.pagination-number:not(.pagination-ellipsis)');
    return pageNumbers.length > 0 ? 
        Math.max(...Array.from(pageNumbers).map(btn => parseInt(btn.textContent))) : 1;
}

function updatePaginationButtons(currentPage) {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const maxPages = getMaxPages();

    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage >= maxPages;
    }
}

function updatePaginationForFilters(visibleCount) {
    const itemsPerPage = 6; // Assuming 6 items per page
    const totalPages = Math.ceil(visibleCount / itemsPerPage);
    
    // For now, we'll keep the pagination static, but you could dynamically update it here
    // This would require more complex logic to rebuild the pagination numbers
}

// Publication Actions
function initializePublicationActions() {
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.classList.contains('view-btn-pub')) {
            handleViewPublication(target);
        } else if (target.classList.contains('pdf-btn')) {
            handleDownloadPDF(target);
        } else if (target.classList.contains('cite-btn')) {
            handleCitePublication(target);
        } else if (target.classList.contains('share-btn')) {
            handleSharePublication(target);
        } else if (target.classList.contains('publication-title')) {
            handleViewPublication(target);
        }
    });
}

function handleViewPublication(button) {
    const card = button.closest('.publication-card');
    const title = card.querySelector('.publication-title').textContent;
    
    // Simulate opening publication detail
    showNotification(`Opening: ${title}`, 'info');
    
    // You could open a modal or navigate to a detail page here
    console.log('View publication:', title);
}

function handleDownloadPDF(button) {
    const card = button.closest('.publication-card');
    const title = card.querySelector('.publication-title').textContent;
    
    // Simulate PDF download
    showNotification(`Downloading PDF: ${title}`, 'success');
    
    // You could trigger an actual download here
    console.log('Download PDF:', title);
}

function handleCitePublication(button) {
    const card = button.closest('.publication-card');
    const title = card.querySelector('.publication-title').textContent;
    const authors = card.querySelector('.publication-authors').textContent;
    const journal = card.querySelector('.publication-journal').textContent;
    const year = card.querySelector('.publication-year').textContent;
    
    // Create citation
    const citation = `${authors} (${year}). ${title}. ${journal}.`;
    
    // Copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(citation).then(() => {
            showNotification('Citation copied to clipboard', 'success');
        }).catch(() => {
            showNotification('Failed to copy citation', 'error');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = citation;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Citation copied to clipboard', 'success');
    }
}

function handleSharePublication(button) {
    const card = button.closest('.publication-card');
    const title = card.querySelector('.publication-title').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: `Check out this publication: ${title}`,
            url: window.location.href
        }).then(() => {
            showNotification('Publication shared successfully', 'success');
        }).catch((error) => {
            console.log('Error sharing:', error);
            fallbackShare(title);
        });
    } else {
        fallbackShare(title);
    }
}

function fallbackShare(title) {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard', 'success');
        }).catch(() => {
            showNotification('Failed to copy link', 'error');
        });
    }
}

// Search Functionality (if you want to add a search box)
function initializeSearch() {
    // You could add a search input to the HTML and implement search here
    const searchInput = document.getElementById('publication-search');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 300);
        });
    }
}

function performSearch(query) {
    const publicationCards = document.querySelectorAll('.publication-card');
    
    publicationCards.forEach(card => {
        const title = card.querySelector('.publication-title').textContent.toLowerCase();
        const authors = card.querySelector('.publication-authors').textContent.toLowerCase();
        const abstract = card.querySelector('.publication-abstract').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
        
        const searchContent = `${title} ${authors} ${abstract} ${tags}`;
        
        if (query === '' || searchContent.includes(query.toLowerCase())) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Tag Filtering
function initializeTagFiltering() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tag')) {
            const tagText = e.target.textContent.toLowerCase().replace(/\s+/g, '-');
            filterByTag(tagText);
        }
    });
}

function filterByTag(tagName) {
    const publicationCards = document.querySelectorAll('.publication-card');
    
    publicationCards.forEach(card => {
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => 
            tag.textContent.toLowerCase().replace(/\s+/g, '-')
        );
        
        if (tags.includes(tagName)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Reset other filters
    document.getElementById('year-filter').value = '';
    document.getElementById('type-filter').value = '';
    document.getElementById('category-filter').value = '';
    
    showNotification(`Filtering by tag: ${tagName.replace(/-/g, ' ')}`, 'info');
}

// Initialize tag filtering
document.addEventListener('DOMContentLoaded', function() {
    initializeTagFiltering();
});

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // Escape key to clear filters
    if (e.key === 'Escape') {
        clearAllFilters();
    }
    
    // Arrow keys for pagination (when focused on pagination)
    if (document.activeElement?.closest('.pagination')) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPreviousPage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToNextPage();
        }
    }
});

function clearAllFilters() {
    document.getElementById('year-filter').value = '';
    document.getElementById('type-filter').value = '';
    document.getElementById('category-filter').value = '';
    
    const publicationCards = document.querySelectorAll('.publication-card');
    publicationCards.forEach(card => {
        card.classList.remove('hidden');
    });
    
    showNotification('All filters cleared', 'info');
}

// Intersection Observer for Animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.publication-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
}

// Initialize scroll animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeScrollAnimations, 500);
});

// Export functions for global access
window.Publications2 = {
    applyFilters,
    clearAllFilters,
    goToPage,
    showNotification,
    handleViewPublication,
    handleDownloadPDF,
    handleCitePublication,
    handleSharePublication
};