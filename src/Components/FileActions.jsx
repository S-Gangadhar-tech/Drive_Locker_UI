import React from 'react';

const FileActions = ({ files, selectedFiles, onSelectAllChange, onDeleteSelected, loading }) => {
    const allSelected = selectedFiles.length === files.length && files.length > 0;

    return (
        <div className="flex justify-between items-center mb-4 bg-gray-800/70 backdrop-blur-md p-4 rounded-lg border border-gray-700 shadow-md">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="selectAll"
                    checked={allSelected}
                    onChange={onSelectAllChange}
                    className="accent-cyan-500 w-5 h-5 cursor-pointer"
                />
                <label
                    htmlFor="selectAll"
                    className="ml-2 text-gray-300 select-none cursor-pointer"
                >
                    Select All
                </label>
            </div>
            <button
                onClick={onDeleteSelected}
                disabled={selectedFiles.length === 0 || loading}
                className={`px-4 py-2 rounded-lg font-semibold transition ${selectedFiles.length === 0 || loading
                        ? 'bg-red-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 cursor-pointer'
                    } text-white`}
            >
                Delete Selected ({selectedFiles.length})
            </button>
        </div>
    );
};

export default FileActions;
