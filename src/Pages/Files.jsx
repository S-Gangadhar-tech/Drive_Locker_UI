// src/components/Files.jsx
import { useEffect, useState } from 'react';
import { useFiles } from '../context/FileContext';
import FileActions from '../Components/FileActions';
import FileListItem from '../Components/FileListItem';
import UploadModal from '../Components/UploadModal';
import { toast } from 'react-toastify';

// CSS for the custom pop-up
const popupStyles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 2000,
    textAlign: 'center',
};

const backdropStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1999,
};

const Files = () => {
    const { files, loading, error, handleFileUpload, handleDeleteFiles, fetchUserFiles } = useFiles();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false); // ✅ New state for confirmation pop-up

    useEffect(() => {
        fetchUserFiles();
    }, []);

    const handleFileSelect = (publicId) => {
        setSelectedFiles((prevSelected) =>
            prevSelected.includes(publicId)
                ? prevSelected.filter((id) => id !== publicId)
                : [...prevSelected, publicId]
        );
    };

    const handleSelectAllChange = (e) => {
        if (e.target.checked) {
            const allPublicIds = files.map(file => file.publicId);
            setSelectedFiles(allPublicIds);
        } else {
            setSelectedFiles([]);
        }
    };

    // ❌ Modified to show custom pop-up instead of window.confirm
    const onDeleteSelected = () => {
        if (selectedFiles.length === 0) return;
        setShowConfirm(true);
    };

    // ✅ New function for confirming deletion
    const handleConfirmDelete = async () => {
        setShowConfirm(false); // Close the pop-up
        try {
            await handleDeleteFiles(selectedFiles);
            toast.success('Files deleted successfully!');
            setSelectedFiles([]);
        } catch (err) {
            toast.error(`Deletion failed: ${err}`);
        }
    };

    // ✅ New function for canceling deletion
    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    const handleUpload = async (file, passkey) => {
        try {
            await handleFileUpload(file, passkey);
            toast.success('File uploaded successfully!');
            setIsModalOpen(false);
        } catch (err) {
            toast.error(`Upload failed: ${err}`);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Your Files</h1>
            {loading && <p>Loading files...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error.toString()}</p>}

            <button onClick={() => setIsModalOpen((prev) => !prev)}>Upload New File</button>

            <hr style={{ margin: '20px 0' }} />

            <h2>My Files</h2>
            {files.length > 0 && (
                <FileActions
                    files={files}
                    selectedFiles={selectedFiles}
                    onSelectAllChange={handleSelectAllChange}
                    onDeleteSelected={onDeleteSelected}
                    loading={loading}
                />
            )}

            {files.length === 0 ? (
                <p>You have no files. Upload one to get started!</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {files.map((file) => (
                        <FileListItem
                            key={file.publicId}
                            file={file}
                            isSelected={selectedFiles.includes(file.publicId)}
                            onFileSelect={handleFileSelect}
                        />
                    ))}
                </ul>
            )}

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpload={handleUpload}
                loading={loading}
            />

            {/* ✅ Custom Confirmation Pop-up */}
            {showConfirm && (
                <>
                    <div style={backdropStyles} onClick={handleCancelDelete} />
                    <div style={popupStyles}>
                        <p>Are you sure you want to delete {selectedFiles.length} file(s)?</p>
                        <button onClick={handleConfirmDelete} style={{ marginRight: '10px', backgroundColor: 'red', color: 'white' }}>
                            Yes, delete
                        </button>
                        <button onClick={handleCancelDelete}>No, cancel</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Files;