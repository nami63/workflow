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
        alert(config.message || 'Alert!');
        break;
        
      case 'showText':
        setOutputElements(prev => [
          ...prev, 
          {
            type: 'text',
            id: `text-${Date.now()}`,
            content: config.text || 'Text',
            style: config.style || {}
          }
        ]);
        break;
        
      case 'showImage':
        if (config.url) {
          setOutputElements(prev => [
            ...prev, 
            {
              type: 'image',
              id: `img-${Date.now()}`,
              url: config.url,
              alt: config.alt || 'Image',
              width: config.width,
              height: config.height
            }
          ]);
        } else {
          console.warn('Image URL is required for showImage action');
        }
        break;
        
      case 'refreshPage':
        if (config.confirmFirst) {
          if (window.confirm('Are you sure you want to refresh the page?')) {
            window.location.reload();
          }
        } else {
          window.location.reload();
        }
        break;
        
      case 'setLocalStorage':
        if (config.key) {
          try {
            localStorage.setItem(config.key, config.value || '');
            setOutputElements(prev => [
              ...prev, 
              {
                type: 'text',
                id: `storage-set-${Date.now()}`,
                content: `Successfully saved "${config.value || ''}" to key "${config.key}"`
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
        } else {
          console.error('Key is required for setLocalStorage action');
        }
        break;
        
      case 'getLocalStorage':
        if (config.key) {
          try {
            const value = localStorage.getItem(config.key);
            setOutputElements(prev => [
              ...prev, 
              {
                type: 'text',
                id: `storage-get-${Date.now()}`,
                content: `${config.key}: ${value !== null ? value : 'Key not found'}`,
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
        } else {
          console.error('Key is required for getLocalStorage action');
        }
        break;
        
      case 'increaseButtonSize':
        const amount = parseInt(config.amount) || 5;
        setButtonSize(prev => {
          const newSize = prev + amount;
          // Optionally add max size limit
          return config.maxSize ? Math.min(newSize, config.maxSize) : newSize;
        });
        break;
        
      case 'closeWindow':
        if (config.confirmFirst) {
          if (window.confirm('Are you sure you want to close this window?')) {
            window.close();
          }
        } else {
          window.close();
        }
        break;
        
      case 'promptAndShow':
        const promptMessage = config.question || 'Enter something:';
        const defaultValue = config.defaultValue || '';
        const response = prompt(promptMessage, defaultValue);
        
        if (response !== null) {
          setOutputElements(prev => [
            ...prev, 
            {
              type: 'text',
              id: `prompt-response-${Date.now()}`,
              content: config.displayFormat 
                ? config.displayFormat.replace('{response}', response)
                : `Response: ${response}`,
              style: config.style || {}
            }
          ]);
          
          // Optionally save to state or call callback
          if (config.saveToKey && config.saveToKey.trim() !== '') {
            try {
              localStorage.setItem(config.saveToKey, response);
            } catch (error) {
              console.error('Error saving prompt response to localStorage:', error);
            }
          }
        }
        break;
        
      case 'changeButtonColor':
        if (config.color) {
          setButtonColor(config.color);
        } else if (config.random) {
          // Better random color generation with proper hex padding
          const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
          setButtonColor(randomColor);
        }
        break;
        
      case 'disableButton':
        setButtonDisabled(!!config.disabled);
        
        // Optional timer to re-enable the button
        if (config.disableDuration && typeof config.disableDuration === 'number') {
          setTimeout(() => {
            setButtonDisabled(false);
          }, config.disableDuration);
        }
        break;

      case 'delay':
        // Add explicit delay action
        const delayTime = parseInt(config.duration) || 1000;
        await new Promise(resolve => setTimeout(resolve, delayTime));
        break;
        
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
    
    // Configurable delay between actions
    const actionDelay = config.actionDelay !== undefined ? parseInt(config.actionDelay) : 100;
    return new Promise(resolve => setTimeout(resolve, actionDelay));
    
  } catch (error) {
    console.error(`Error executing action ${action.type}:`, error);
    // Optionally display error in UI
    if (config.showErrors) {
      setOutputElements(prev => [
        ...prev, 
        {
          type: 'text',
          id: `error-${Date.now()}`,
          content: `Error: ${error.message}`,
          style: { color: 'red' }
        }
      ]);
    }
    return Promise.resolve(); // Continue execution despite errors
  }
};