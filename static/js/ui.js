function displayRecommendations(data) {
    const container = document.getElementById('recommendations');
    
    // Create new recommendations with fade-in effect
    const newContainer = document.createElement('div');
    newContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full opacity-0 transition-opacity duration-300';
    
    console.log("Displaying recommendations:", data);
    
    data.libraries.forEach(library => {
        const card = document.createElement('div');
        card.className = 'card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 w-full';
        
        card.innerHTML = `
            <div class="card-body">
                <h2 class="card-title text-xl">${library.name}</h2>
                <p class="text-sm opacity-70 mt-2">${library.description}</p>
                <div class="card-actions justify-end mt-4">
                    <span class="badge badge-primary">${library.category}</span>
                    <a href="${library.url}" target="_blank" 
                       class="btn btn-sm btn-primary">View Library</a>
                </div>
            </div>
        `;
        
        newContainer.appendChild(card);
    });
    
    // Clear and update container with full-width wrapper
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'w-full px-4 py-6';
    wrapper.appendChild(newContainer);
    container.appendChild(wrapper);
    
    // Trigger reflow and remove opacity
    requestAnimationFrame(() => {
        newContainer.classList.remove('opacity-0');
    });
}

function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loadingIndicator';
    loading.className = 'fixed top-0 left-0 w-full h-1 bg-primary';
    loading.style.animation = 'loading 2s infinite ease-in-out';
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) loading.remove();
}

function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error fixed bottom-4 right-4 p-4 rounded-lg shadow-lg';
    toast.innerHTML = `
        <div class="alert alert-error">
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

// Explicitly expose functions to global scope
window.displayRecommendations = displayRecommendations;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showError = showError; 