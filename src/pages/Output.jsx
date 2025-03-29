import React, { useState, useEffect } from 'react';
import { executeAction } from '../utils/Actionexcuter';

const Output = () => {
  const [workflow, setWorkflow] = useState(null);
  const [buttonSize, setButtonSize] = useState(0);
  const [buttonColor, setButtonColor] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [outputElements, setOutputElements] = useState([]);
  
  useEffect(() => {
    // Load current workflow from localStorage
    const currentWorkflowId = localStorage.getItem('currentWorkflow');
    if (currentWorkflowId) {
      const storedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      const currentWorkflow = storedWorkflows.find(w => w.id === currentWorkflowId);
      if (currentWorkflow) {
        setWorkflow(currentWorkflow);
      }
    }
  }, []);
  
  const executeWorkflow = async () => {
    if (!workflow || !workflow.actions) return;
    
    // Clear previous outputs
    setOutputElements([]);
    
    // Execute each action in sequence
    for (let i = 0; i < workflow.actions.length; i++) {
      await executeAction(
        workflow.actions[i], 
        { 
          setOutputElements, 
          setButtonSize, 
          setButtonColor, 
          setButtonDisabled 
        }
      );
    }
  };
  
  // Handle case where no workflow is selected
  if (!workflow) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-4">Workflow Execution</h2>
        <p className="mb-4">No workflow selected. Please create and save a workflow on the Config Page.</p>
        <button 
          onClick={() => window.location.hash = '#config'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Config Page
        </button>
      </div>
    );
  }
  
  const buttonStyle = {
    fontSize: `${Math.max(16 + buttonSize, 12)}px`,
    padding: `${Math.max(8 + buttonSize/4, 6)}px ${Math.max(16 + buttonSize/2, 10)}px`,
    backgroundColor: buttonColor || '#3B82F6'
  };
  
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Workflow Execution: {workflow.name}</h2>
      
      <div className="flex justify-center mb-8">
        <button 
          onClick={executeWorkflow}
          disabled={buttonDisabled}
          style={buttonStyle}
          className={`text-white rounded transition-all ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-90'}`}
        >
          {workflow.buttonLabel || 'Click Me!'}
        </button>
      </div>
      
      {outputElements.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Output:</h3>
          <div className="space-y-4">
            {outputElements.map(element => (
              <div key={element.id} className="p-3 bg-gray-50 rounded">
                {element.type === 'text' && <p>{element.content}</p>}
                {element.type === 'image' && (
                  <img 
                    src={element.url} 
                    alt="User specified image" 
                    className="max-w-full h-auto mx-auto"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/api/placeholder/200/200';
                      setOutputElements(prev => 
                        prev.map(el => 
                          el.id === element.id 
                            ? {...el, error: 'Image failed to load'} 
                            : el
                        )
                      );
                    }}
                  />
                )}
                {element.error && <p className="text-red-500 mt-2">{element.error}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Output;