import React, { useState, useEffect } from 'react';
import ActionItem from '../Action';
import { availableActions } from '../ActionType';
import './config.css';

const ConfigPage = () => {
  const [buttonLabel, setButtonLabel] = useState('Click Me!');
  const [actions, setActions] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [currentWorkflow, setCurrentWorkflow] = useState('');
  
  useEffect(() => {
    // Load saved workflows from localStorage on refresh
    const storedWorkflows = localStorage.getItem('workflows');
    const savedCurrentWorkflow = localStorage.getItem('currentWorkflow');
    
    if (storedWorkflows) {
      const parsedWorkflows = JSON.parse(storedWorkflows);
      setWorkflows(parsedWorkflows);

      // Automatically load the last used workflow
      if (savedCurrentWorkflow) {
        const workflow = parsedWorkflows.find(w => w.id === savedCurrentWorkflow);
        if (workflow) {
          loadWorkflow(savedCurrentWorkflow);
        }
      }
    }
  }, []);
  
  const addAction = (actionType) => {
    const action = availableActions.find(a => a.id === actionType);
    if (!action) return;
    
    const newAction = {
      id: `${actionType}_${Date.now()}`,
      type: actionType,
      name: action.name,
      config: {}
    };
    
    action.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        newAction.config[field.key] = field.defaultValue;
      }
    });
    
    setActions([...actions, newAction]);
  };
  
  const updateActionConfig = (actionId, key, value) => {
    setActions(actions.map(action => 
      action.id === actionId 
        ? { ...action, config: { ...action.config, [key]: value } } 
        : action
    ));
  };
  
  const removeAction = (actionId) => {
    setActions(actions.filter(action => action.id !== actionId));
  };
  
  const moveAction = (fromIndex, toIndex) => {
    const updatedActions = [...actions];
    const [movedItem] = updatedActions.splice(fromIndex, 1);
    updatedActions.splice(toIndex, 0, movedItem);
    setActions(updatedActions);
  };
  
  const saveWorkflow = () => {
    if (!buttonLabel) {
      alert('Please provide a button label');
      return;
    }

    // If saving for the first time or creating a new workflow, ask for the name
    let workflowName = '';

    if (!currentWorkflow) {
      workflowName = prompt('Enter a name for this workflow:');
      if (!workflowName) return;
    } else {
      // If updating an existing workflow, use its current name
      const existingWorkflow = workflows.find(w => w.id === currentWorkflow);
      workflowName = existingWorkflow ? existingWorkflow.name : 'Unnamed Workflow';
    }

    const newWorkflow = {
      id: currentWorkflow || Date.now().toString(),
      name: workflowName,
      buttonLabel,
      actions
    };
    
    const updatedWorkflows = currentWorkflow
      ? workflows.map(w => (w.id === currentWorkflow ? newWorkflow : w))  // Update existing
      : [...workflows, newWorkflow];  // Add new workflow

    setWorkflows(updatedWorkflows);
    localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));
    localStorage.setItem('currentWorkflow', newWorkflow.id);
    setCurrentWorkflow(newWorkflow.id);

    alert(`Workflow "${workflowName}" saved!`);
  };
  
  const loadWorkflow = (workflowId) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      setButtonLabel(workflow.buttonLabel);
      setActions(workflow.actions);
      setCurrentWorkflow(workflow.id);
      localStorage.setItem('currentWorkflow', workflow.id);
    }
  };
  
  const deleteWorkflow = (workflowId) => {
    const confirmed = window.confirm('Are you sure you want to delete this workflow?');
    if (!confirmed) return;
    
    const updatedWorkflows = workflows.filter(w => w.id !== workflowId);
    setWorkflows(updatedWorkflows);
    localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));
    
    if (currentWorkflow === workflowId) {
      setButtonLabel('Click Me!');
      setActions([]);
      setCurrentWorkflow('');
      localStorage.removeItem('currentWorkflow');
    }
  };

  const createNewWorkflow = () => {
    setCurrentWorkflow('');
    setButtonLabel('Click Me!');
    setActions([]);
    alert('You are creating a new workflow. Please provide a name when saving.');
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Workflow Configuration</h2>
        
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Button Label:</label>
          <input
            type="text"
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter button label"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Actions:</label>
          {actions.length === 0 ? (
            <p className="text-gray-500 italic">No actions added yet. Add actions from the sidebar.</p>
          ) : (
            <div className="space-y-3">
              {actions.map((action, index) => (
                <ActionItem 
                  key={action.id} 
                  action={action} 
                  index={index}
                  updateConfig={updateActionConfig}
                  removeAction={removeAction}
                  moveAction={moveAction}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={saveWorkflow}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Workflow
          </button>

          <button 
            onClick={createNewWorkflow}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            New Workflow
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded shadow">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Available Actions</h3>
          <div className="space-y-2">
            {availableActions.map(action => (
              <button
                key={action.id}
                onClick={() => addAction(action.id)}
                className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
              >
                {action.name}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Saved Workflows</h3>
          {workflows.length === 0 ? (
            <p className="text-gray-500 italic">No saved workflows yet.</p>
          ) : (
            <div className="space-y-2">
              {workflows.map(workflow => (
                <div key={workflow.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <span className="mr-2">{workflow.name}</span>
                  <div>
                    <button 
                      onClick={() => loadWorkflow(workflow.id)}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded mr-1"
                    >
                      Load
                    </button>
                    <button 
                      onClick={() => deleteWorkflow(workflow.id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;
