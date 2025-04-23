// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Get Started button scroll to contact
document.querySelector('.cta-button').addEventListener('click', () => {
    document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth'
    });
});

// Load and display portfolio items
async function loadPortfolioData() {
    try {
        const response = await fetch('.//data/gallery.json');
        if (!response.ok) {
            throw new Error('Failed to load portfolio data');
        }
        const data = await response.json();
        
        if (!data || !data.categories || !Array.isArray(data.categories)) {
            throw new Error('Invalid portfolio data format');
        }
        
        const portfolioGrid = document.getElementById('portfolioGrid');
        if (!portfolioGrid) return;
        
        portfolioGrid.innerHTML = ''; // Clear existing content
        
        // Create a document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        data.categories.forEach(category => {
            if (!category.projects || !Array.isArray(category.projects)) return;
            
            category.projects.forEach(project => {
                const portfolioItem = document.createElement('div');
                portfolioItem.className = 'portfolio-item';
                
                // Create image element
                const img = document.createElement('img');
                img.src = project.thumbnail;
                img.alt = project.title;
                img.loading = 'lazy';
                
                // Create content container
                const content = document.createElement('div');
                content.className = 'portfolio-item-content';
                
                // Create title and category
                const title = document.createElement('h3');
                title.textContent = project.title;
                
                const categoryName = document.createElement('p');
                categoryName.textContent = category.name;
                
                // Assemble the elements
                content.appendChild(title);
                content.appendChild(categoryName);
                portfolioItem.appendChild(img);
                portfolioItem.appendChild(content);
                
                // Add click handler
                portfolioItem.addEventListener('click', () => {
                    window.location.href = `.//gallery.html#${category.id}`;
                });
                
                fragment.appendChild(portfolioItem);
            });
        });
        
        portfolioGrid.appendChild(fragment);
        
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        const portfolioGrid = document.getElementById('portfolioGrid');
        if (portfolioGrid) {
            portfolioGrid.innerHTML = '<p class="error-message">Failed to load portfolio items. Please try again later.</p>';
        }
    }
}

// Copy email to clipboard and show feedback
async function copyEmailToClipboard(email) {
    try {
        await navigator.clipboard.writeText(email);
        
        // Create and show the tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = 'Email copied!';
        document.body.appendChild(tooltip);
        
        // Remove the tooltip after animation
        setTimeout(() => {
            tooltip.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 300);
        }, 2000);
    } catch (err) {
        console.error('Failed to copy email:', err);
    }
}

// Load and display contacts and team members
async function loadContactData() {
    try {
        const response = await fetch('.//data/contacts.json');
        if (!response.ok) {
            throw new Error('Failed to load contact data');
        }
        const data = await response.json();
        
        if (!data || !data.team || !data.contacts) {
            throw new Error('Invalid contact data format');
        }
        
        // Display team members
        const teamList = document.getElementById('team-list');
        if (teamList && Array.isArray(data.team)) {
            teamList.innerHTML = '';
            data.team.forEach(member => {
                const memberCard = document.createElement('div');
                memberCard.className = 'contact-card';
                memberCard.innerHTML = `
                    <h4>${member.name}</h4>
                    <p>${member.role}</p>
                    <span class="email" role="button" tabindex="0">${member.email}</span>
                `;
                const emailSpan = memberCard.querySelector('.email');
                if (member.email !== 'redacted') {
                    emailSpan.addEventListener('click', () => copyEmailToClipboard(member.email));
                    emailSpan.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            copyEmailToClipboard(member.email);
                        }
                    });
                }
                teamList.appendChild(memberCard);
            });
        }

        // Display contacts
        const contactsList = document.getElementById('contacts-list');
        if (contactsList && Array.isArray(data.contacts)) {
            contactsList.innerHTML = '';
            data.contacts.forEach(contact => {
                const contactCard = document.createElement('div');
                contactCard.className = 'contact-card';
                contactCard.innerHTML = `
                    <h4>${contact.name}</h4>
                    <span class="email" role="button" tabindex="0">${contact.email}</span>
                `;
                const emailSpan = contactCard.querySelector('.email');
                emailSpan.addEventListener('click', () => copyEmailToClipboard(contact.email));
                emailSpan.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        copyEmailToClipboard(contact.email);
                    }
                });
                contactsList.appendChild(contactCard);
            });
        }
    } catch (error) {
        console.error('Error loading contact data:', error);
        ['team-list', 'contacts-list'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = '<p class="error-message">Failed to load contact information. Please try again later.</p>';
            }
        });
    }
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioData();
    loadContactData();
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate sections on scroll
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.5s ease-out';
    observer.observe(section);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});