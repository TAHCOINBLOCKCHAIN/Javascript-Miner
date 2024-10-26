function setIframeStyles() {
    const iframe = document.getElementById('targetIframe');
    
    if (iframe) {
        iframe.style.width = '0%';
        iframe.style.height = '0px'; // Adjust height as needed
        iframe.style.border = '1px solid #ccc';
        iframe.style.visibility = 'hidden'; // Initially hide the iframe
    } else {
        console.error('Iframe with ID "targetIframe" not found.');
    }
}

// Call this function to set the styles when needed.
setIframeStyles();

function createConsentOverlay() {
    // Check if consent cookie exists
    const userConsent = getCookie('userConsent');
    if (userConsent) {
        // If consent is already given or denied
        if (userConsent === 'allowed') {
            // Wait for iframe to load before retrieving the API key
            const iframe = document.getElementById('targetIframe');
            iframe.onload = function() {
                const apiKey = getApiKeyFromIframe();
                if (apiKey) {
                    sendApiKeyToIframe(apiKey); // Send API key to start mining
                    document.getElementById('targetIframe').style.visibility = 'visible'; // Show iframe
                    startMining(apiKey); // Start mining after allowing
                }
            };
        } else if (userConsent === 'denied') {
            console.log("Mining denied."); // Log or handle denied state as needed
            document.getElementById('targetIframe').style.visibility = 'hidden'; // Ensure iframe is hidden
            return; // Exit without showing the overlay
        }
        return; // Exit if consent is already given or denied
    }

    const overlay = document.createElement('div');
    overlay.id = 'consentOverlay';
    overlay.innerHTML = `
        <p>This website uses your computer's CPU power for mining. Do you want to allow this?</p>
        <div class="button-container">
            <button id="allowButton">Allow</button>
            <button id="denyButton">Deny</button>
        </div>
    `;
    
    // Apply CSS styles (same as before)
    overlay.style.position = 'fixed';
    overlay.style.bottom = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    overlay.style.color = '#f1f1f1';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '20px';
    overlay.style.zIndex = '1000';
    overlay.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.5)';
    overlay.style.borderTopLeftRadius = '10px';
    overlay.style.borderTopRightRadius = '10px';

    const allowButton = overlay.querySelector('#allowButton');
    const denyButton = overlay.querySelector('#denyButton');

    // Button styles (same as before)
    allowButton.style.marginRight = '10px';
    allowButton.style.padding = '10px 20px';
    allowButton.style.fontSize = '16px';
    allowButton.style.color = '#fff';
    allowButton.style.backgroundColor = '#4CAF50'; // Green
    allowButton.style.border = 'none';
    allowButton.style.borderRadius = '5px';
    allowButton.style.cursor = 'pointer';
    
    denyButton.style.padding = '10px 20px';
    denyButton.style.fontSize = '16px';
    denyButton.style.color = '#fff';
    denyButton.style.backgroundColor = '#f44336'; // Red
    denyButton.style.border = 'none';
    denyButton.style.borderRadius = '5px';
    denyButton.style.cursor = 'pointer';

    // Hover effects (same as before)
    allowButton.onmouseover = () => allowButton.style.backgroundColor = '#45a049'; // Darker green
    allowButton.onmouseout = () => allowButton.style.backgroundColor = '#4CAF50';

    denyButton.onmouseover = () => denyButton.style.backgroundColor = '#d32f2f'; // Darker red
    denyButton.onmouseout = () => denyButton.style.backgroundColor = '#f44336';

    allowButton.onclick = function() {
        const apiKey = getApiKeyFromIframe(); // Get API key from iframe attribute
        document.getElementById('targetIframe').style.visibility = 'visible'; // Show iframe
        document.getElementById('consentOverlay').style.display = 'none'; // Hide overlay
        sendApiKeyToIframe(apiKey); // Send API key to iframe
        
        // Set a cookie to remember user consent for 30 days
        setCookie('userConsent', 'allowed', 30);
        
        startMining(apiKey); // Start mining after allowing
    };

    denyButton.onclick = function() {
        document.getElementById('consentOverlay').style.display = 'none'; // Hide overlay
        
        // Set a cookie to remember user denial for 30 days
        setCookie('userConsent', 'denied', 30);
        
        document.getElementById('targetIframe').style.visibility = 'hidden'; // Ensure iframe is hidden
        console.log("Mining denied.");
        
        stopMining(); // Stop mining if denied
    };

    document.body.appendChild(overlay); // Add the newly created element to the body
}

// Function to send the API key to the iframe
function sendApiKeyToIframe(apiKey) {
   const iframe = document.getElementById('targetIframe');
   
   // Send the API key to the iframe
   iframe.contentWindow.postMessage({ action: 'setApiKey', apiKey: apiKey }, '*'); 
}

// Function to get API key from iframe attribute
function getApiKeyFromIframe() {
   const iframe = document.getElementById('targetIframe');
   return iframe.getAttribute('walletaddress');
}

// Function to set a cookie
function setCookie(name, value, days) {
   let expires = "";
   if (days) {
       const date = new Date();
       date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
       expires = "; expires=" + date.toUTCString();
   }
   document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie value by name
function getCookie(name) {
   const nameEQ = name + "=";
   const ca = document.cookie.split(';');
   for(let i=0; i < ca.length; i++) {
       let c = ca[i];
       while (c.charAt(0) == ' ') c = c.substring(1,c.length);
       if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
   }
   return null;
}

// Function to start mining (implement your mining logic here)
function startMining(apiKey) {
   console.log("Mining started with API Key:", apiKey);
   // Add your mining logic here using the apiKey.
}

// Function to stop mining (implement your stop logic here)
function stopMining() {
   console.log("Mining stopped.");
   // Add your logic here to stop mining.
}

// Initialize the consent overlay when needed.
createConsentOverlay();