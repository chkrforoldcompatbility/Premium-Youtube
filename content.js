/**
 * Applies the Premium logo style by completely replacing the original logo link
 * with a new custom anchor tag. This avoids interference from YouTube's
 * event listeners attached to the original logo element.
 */
function applyPremiumLogoStyle() {
    const originalLogoContainer = document.getElementById('logo');
    const customLinkId = 'custom-premium-logo-link'; // Unique ID for our new link

    // Check if our custom link *already exists*. If so, we're done.
    // This prevents adding multiple links if the MutationObserver fires rapidly.
    if (document.getElementById(customLinkId)) {
        // We should also ensure the original is hidden if it somehow reappeared
        if (originalLogoContainer && originalLogoContainer.style.display !== 'none') {
             originalLogoContainer.style.display = 'none';
        }
        return;
    }

    // Only proceed if the original logo container exists and we haven't added our link yet
    if (originalLogoContainer && originalLogoContainer.parentElement) {
        try {
            // --- 1. Create our new anchor element ---
            const customLink = document.createElement('a');
            customLink.id = customLinkId;
            customLink.href = '/'; // Link to the homepage
            customLink.setAttribute('aria-label', 'YouTube Home'); // Accessibility
            customLink.setAttribute('title', 'YouTube Home'); // Tooltip

            // --- 2. Style our new link ---
            // Get the URL for the extension's image file
            // ** IMPORTANT: Make sure this path matches your image file! **
            const premiumLogoURL = chrome.runtime.getURL('images/premium_logo.svg'); // Or premium_logo.png

            // Apply necessary styles to make it look like the logo
            customLink.style.backgroundImage = `url('${premiumLogoURL}')`;
            customLink.style.backgroundRepeat = 'no-repeat';
            customLink.style.backgroundPosition = 'center left';
            customLink.style.backgroundSize = 'contain';
            customLink.style.display = 'block'; // Use 'block' or 'inline-block'
            customLink.style.width = '120px';    // Adjust width as needed
            customLink.style.height = '56px';   // Adjust height (match header or logo aspect ratio)
            customLink.style.minWidth = '100px'; // Ensure it doesn't collapse too small
            // ** Crucial: Try to copy margin/padding from original for layout **
            // Example (inspect original #logo element to find correct values):
            // customLink.style.marginLeft = '16px';
            // customLink.style.padding = '18px 14px 18px 16px'; // Example padding
            customLink.style.outline = 'none'; // Remove focus outline if desired


            // --- 3. Insert the new link into the DOM ---
            // Place it right before the original logo element
            originalLogoContainer.parentElement.insertBefore(customLink, originalLogoContainer);

            // --- 4. Hide the original logo container ---
            // Now that our link is in place, hide the problematic original one.
            originalLogoContainer.style.display = 'none';

            // console.log('Custom Premium logo link created and replaced original.'); // Debugging

        } catch (error) {
            console.error('Error creating/replacing Premium logo link:', error);
        }
    } else {
        // console.log('Original logo container or its parent not found yet.'); // Debugging
    }
}

// --- MutationObserver Setup (Remains the same) ---
// Watches for changes and calls applyPremiumLogoStyle to ensure
// our link is present and the original remains hidden.
function observeLogoChanges() {
    const targetNode = document.getElementById('masthead-container') || document.body;
    const config = { childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
        // Re-run the function on any change to ensure our state persists
        applyPremiumLogoStyle();
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    // console.log('MutationObserver started for YouTube logo replacement.'); // Debugging
}

// --- Main Execution (Remains the same) ---
// Run once on load, then let the observer handle subsequent changes.
applyPremiumLogoStyle();
observeLogoChanges();