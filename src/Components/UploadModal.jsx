// src/components/UploadModal.jsx
import FileUploadForm from './FileUploadForm';

const modalStyles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    width: '90%',
    maxWidth: '400px',
};

const backdropStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
};

const UploadModal = ({ isOpen, onClose, onUpload, loading }) => {
    if (!isOpen) return null;

    return (
        <>
            <div style={backdropStyles} onClick={onClose} />
            <div style={modalStyles}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Upload a File</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer' }}>
                        &times;
                    </button>
                </div>
                <FileUploadForm onUpload={onUpload} loading={loading} />
            </div>
        </>
    );
};

export default UploadModal;