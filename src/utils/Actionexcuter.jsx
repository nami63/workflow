// Utility function to execute actions
export const executeAction = async (action, stateSetters) => {
    const { 
      setOutputElements, 
      setButtonSize, 
      setButtonColor, 
      setButtonDisabled 
    } = stateSetters;
    
    const config = action.config;
    
    switch (action.type) {
      case 'alert':
        alert(config.message || 'Alert!');
        break;
        
      case 'showText':
        setOutputElements(prev => [...prev, { 
          type: 'text', 
          id: Date.now(), 
          content: config.text || 'Text' 
        }]);
        break;
        
      case 'showImage':
        if (config.url) {
          setOutputElements(prev => [...prev, { 
            type: 'image', 
            id: Date.now(), 
            url: config.url 
          }]);
        }
        break;
        
      case 'refreshPage':
        window.location.reload();
        break;
        
      case 'setLocalStorage':
        if (config.key) {
          localStorage.setItem(config.key, config.value || '');
          setOutputElements(prev => [...prev, { 
            type: 'text', 
            id: Date.now(), 
            content: `Saved "${config.value || ''}" to key "${config.key}"` 
          }]);
        }
        break;
        
      case 'getLocalStorage':
        if (config.key) {
          const value = localStorage.getItem(config.key) || 'Key not found';
          setOutputElements(prev => [...prev, { 
            type: 'text', 
            id: Date.now(), 
            content: `${config.key}: ${value}` 
          }]);
        }
        break;
        
      case 'increaseButtonSize':
        const amount = parseInt(config.amount || 5);
        setButtonSize(prev => prev + amount);
        break;
        
      case 'closeWindow':
        window.close();
        break;
        
      case 'promptAndShow':
        const response = prompt(config.question || 'Enter something:');
        if (response !== null) {
          setOutputElements(prev => [...prev, { 
            type: 'text', 
            id: Date.now(), 
            content: `Response: ${response}` 
          }]);
        }
        break;
        
      case 'changeButtonColor':
        if (config.color) {
          setButtonColor(config.color);
        } else {
          // Random color if not specified
          const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
          setButtonColor(randomColor);
        }
        break;
        
      case 'disableButton':
        setButtonDisabled(true);
        break;
        
      default:
        console.log(`Unknown action type: ${action.type}`);
    }
    
    // Add a small delay between actions for better user experience
    return new Promise(resolve => setTimeout(resolve, 100));
  };