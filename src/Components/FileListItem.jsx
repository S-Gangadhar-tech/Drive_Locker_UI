// src/components/FileListItem.jsx
import React from 'react';

const FileListItem = ({ file, isSelected, onFileSelect }) => {

    const handleDownload = async () => {
        try {
            // Fetch the file data as a blob
            const response = await fetch(file.fileUrl);
            const blob = await response.blob();

            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(new Blob([blob]));

            // Create a hidden anchor tag to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.fileName);
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up: remove the link and revoke the URL
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download the file.');
        }
    };

    return (
        <li key={file.publicId} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onFileSelect(file.publicId)}
                    style={{ marginRight: '10px' }}
                />
                <div>
                    <p><strong>File Name:</strong> {file.fileName}</p>
                    <p><strong>File Type:</strong> {file.fileType}</p>
                    <p><strong>Uploaded At:</strong> {new Date(file.createdAt).toLocaleDateString()}</p>
                    {/* Add a "View File" link that opens in a new tab */}
                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>
                        View File
                    </a>
                    {/* Use a button to trigger the programmatic download */}
                    <button onClick={handleDownload} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                        Download File
                    </button>
                </div>
            </div>
        </li>
    );
};

export default FileListItem;