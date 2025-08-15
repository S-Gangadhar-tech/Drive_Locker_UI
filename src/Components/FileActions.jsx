// src/components/FileActions.jsx
import React from 'react';

const FileActions = ({ files, selectedFiles, onSelectAllChange, onDeleteSelected, loading }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
                <input
                    type="checkbox"
                    id="selectAll"
                    checked={selectedFiles.length === files.length && files.length > 0}
                    onChange={onSelectAllChange}
                />
                <label htmlFor="selectAll" style={{ marginLeft: '5px' }}>Select All</label>
            </div>
            <button
                onClick={onDeleteSelected}
                disabled={selectedFiles.length === 0 || loading}
                style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}
            >
                Delete Selected ({selectedFiles.length})
            </button>
        </div>
    );
};

export default FileActions;