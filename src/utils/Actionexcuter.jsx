// Utility function to execute actions
export const executeAction = async (action, stateSetters) => {
  const {
    setOutputElements,
    setButtonSize,
    setButtonColor,
    setButtonDisabled
  } = stateSetters;
  
  const config = action.config || {};
  
  try {
    switch (action.type) {
      case 'alert':
        // Show alert with message from config
        const alertMessage = config.message || 'Alert!';
        
        // Display the alert
        alert(alertMessage);
        
        // Optionally log the alert in the output area
        if (config.showInOutput) {
          setOutputElements(prev => [
            ...prev, 
            {
              type: 'text',
              id: `alert-message-${Date.now()}`,
              content: `Alert shown: "${alertMessage}"`,
              style: config.style || { fontStyle: 'italic', color: '#555' }
            }
          ]);
        }
        break;
        
      case 'showText':
        // Show text in the output area
        const textToShow = config.text || 'Text';
        
        setOutputElements(prev => [
          ...prev, 
          {
            type: 'text',
            id: `text-${Date.now()}`,
            content: textToShow,
            style: config.style || {}
          }
        ]);
        break;
        
      case 'showImage':
        // Display image in the output area
        const imageUrl = config.url || '';
        
        // Check if we have a valid URL
        if (imageUrl && imageUrl.trim() !== '') {
          setOutputElements(prev => [
            ...prev, 
            {
              type: 'image',
              id: `img-${Date.now()}`,
              url: imageUrl,
              alt: config.alt || 'Image',
              width: config.width,
              height: config.height,
              style: config.style || {}
            }
          ]);
          
          // Optionally show URL text below the image
          if (config.showUrl) {
            setOutputElements(prev => [
              ...prev, 
              {
                type: 'text',
                id: `img-url-${Date.now()}`,
                content: `Image URL: ${imageUrl}`,
                style: { fontSize: '0.8em', color: '#555' }
              }
            ]);
          }
        } else {
          // Show error if no image URL is provided
          setOutputElements(prev => [
            ...prev, 
            {
              type: 'text',
              id: `img-error-${Date.now()}`,
              content: 'No image URL provided',
              style: { color: 'red' }
            }
          ]);
        }
        break;
        
      case 'refreshPage':
        window.location.reload();
        break;
        
      case 'setLocalStorage':
        // Simple localStorage setting
        const storageKey = config.key;
        const storageValue = config.value || '';
        
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, storageValue);
            setOutputElements(prev => [
              ...prev, 
              {
                type: 'text',
                id: `storage-set-${Date.now()}`,
                content: `Successfully saved "${storageValue}" to key "${storageKey}"`,
                style: { color: 'green' }
              }
            ]);
          } catch (error) {
            setOutputElements(prev => [
              ...prev, 
              {
                type: 'text',
                id: `storage-error-${Date.now()}`,
                content: `Error saving to localStorage: ${error.message}`,
                style: { color: 'red' }
              }
            ]);
          }
        }
        break;
        
      case 'getLocalStorage':
        // Simple localStorage retrieval
        const keyToRetrieve = config.key;
        
        if (keyToRetrieve) {
          try {
            const value = localStorage.getItem(keyToRetrieve);
            setOutputElements(prev => [
              ...prev, 
              {
                type: 'text',
                id: `storage-get-${Date.now()}`,
                content: `${keyToRetrieve}: ${value !== null ? value : 'Key not found'}`,
                style: config.style || {}
              }
            ]);
          } catch (error) {
            setOutputElements(prev => [
              ...prev, 
              {
                type: 'text',
                id: `storage-error-${Date.now()}`,
                content: `Error retrieving from localStorage: ${error.message}`,
                style: { color: 'red' }
              }
            ]);
          }
        }
        break;
        
      case 'increaseButtonSize':
        const amount = parseInt(config.amount) || 5;
        setButtonSize(prev => prev + amount);
        break;
        
      case 'closeWindow':
        window.close();
        break;
        
      case 'promptAndShow':
        const promptMessage = config.question || 'Enter something:';
        const response = prompt(promptMessage);
        
        if (response !== null) {
          setOutputElements(prev => [
            ...prev, 
            {
              type: 'text',
              id: `prompt-response-${Date.now()}`,
              content: `Response: ${response}`,
              style: config.style || {}
            }
          ]);
        }
        break;
        
      case 'changeButtonColor':
        setButtonColor(config.color || '#ff0000');
        break;
        
      case 'disableButton':
        setButtonDisabled(true);
        
        // Optional timer to re-enable the button
        if (config.disableDuration && typeof config.disableDuration === 'number') {
          setTimeout(() => {
            setButtonDisabled(false);
          }, config.disableDuration);
        }
        break;

      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
    
    // Small delay between actions
    return new Promise(resolve => setTimeout(resolve, 200));
    
  } catch (error) {
    console.error(`Error executing action ${action.type}:`, error);
    return Promise.resolve(); // Continue execution despite errors
  }
};