import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { availableActions } from './ActionType';

const ActionItem = ({ action, index, updateConfig, removeAction, moveAction }) => {
  const actionDef = availableActions.find(a => a.id === action.type);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'ACTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  
  const [, drop] = useDrop({
    accept: 'ACTION',
    hover: (item, monitor) => {
      if (item.index !== index) {
        moveAction(item.index, index);
        item.index = index;
      }
    }
  });
  
  return (
    <div 
      ref={(node) => drag(drop(node))} 
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="p-3 border rounded bg-gray-50 cursor-move"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{index + 1}. {action.name}</h4>
        <button 
          onClick={() => removeAction(action.id)} 
          className="text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
      
      {actionDef?.fields.map(field => (
        <div key={field.key} className="mb-2">
          <label className="block text-sm mb-1">{field.label}:</label>
          <input
            type={field.type}
            value={action.config[field.key] || ''}
            onChange={(e) => updateConfig(action.id, field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </div>
      ))}
    </div>
  );
};

export default ActionItem;