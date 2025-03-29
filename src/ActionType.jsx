// Available actions with their configuration fields
export const availableActions = [
    { id: 'alert', name: 'Alert', fields: [
      { key: 'message', label: 'Message', type: 'text', placeholder: 'Enter alert message' }
    ]},
    { id: 'showText', name: 'Show Text', fields: [
      { key: 'text', label: 'Text', type: 'text', placeholder: 'Enter text to display' }
    ]},
    { id: 'showImage', name: 'Show Image', fields: [
      { key: 'url', label: 'Image URL', type: 'text', placeholder: 'Enter image URL' }
    ]},
    { id: 'refreshPage', name: 'Refresh Page', fields: [] },
    { id: 'setLocalStorage', name: 'Set LocalStorage', fields: [
      { key: 'key', label: 'Key', type: 'text', placeholder: 'Enter storage key' },
      { key: 'value', label: 'Value', type: 'text', placeholder: 'Enter storage value' }
    ]},
    { id: 'getLocalStorage', name: 'Get LocalStorage', fields: [
      { key: 'key', label: 'Key', type: 'text', placeholder: 'Enter key to retrieve' }
    ]},
    { id: 'increaseButtonSize', name: 'Increase Button Size', fields: [
      { key: 'amount', label: 'Amount (px)', type: 'number', placeholder: '5', defaultValue: 5 }
    ]},
    { id: 'closeWindow', name: 'Close Window', fields: [] },
    { id: 'promptAndShow', name: 'Prompt and Show', fields: [
      { key: 'question', label: 'Question', type: 'text', placeholder: 'Enter prompt question' }
    ]},
    { id: 'changeButtonColor', name: 'Change Button Color', fields: [
      { key: 'color', label: 'Color', type: 'color', defaultValue: '#ff0000' }
    ]},
    { id: 'disableButton', name: 'Disable Button', fields: [] }
  ];