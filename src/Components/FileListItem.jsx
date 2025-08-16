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
        <li className="border border-gray-700 rounded-lg mb-4 p-4 bg-gray-800 text-gray-200">
            <div className="flex items-center space-x-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onFileSelect(file.publicId)}
                    className="accent-cyan-500 w-5 h-5 cursor-pointer"
                />
                <div className="flex flex-col">
                    <p>
                        <strong className="text-white">File Name:</strong> {file.fileName}
                    </p>
                    <p>
                        <strong className="text-white">File Type:</strong> {file.fileType}
                    </p>
                    <p>
                        <strong className="text-white">Uploaded At:</strong>{' '}
                        {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                        {/* View File Link */}
                        <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline"
                        >
                            View File
                        </a>

                        {/* Download Button */}
                        <button
                            onClick={handleDownload}
                            className="text-cyan-400 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                            aria-label={`Download ${file.fileName}`}
                            type="button"
                        >
                            Download File
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default FileListItem;
