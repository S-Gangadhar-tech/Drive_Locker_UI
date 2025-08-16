import FileUploadForm from './FileUploadForm';

const UploadModal = ({ isOpen, onClose, onUpload, loading }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-60 z-50"
                onClick={onClose}
            />

            {/* Modal container */}
            <div className="fixed top-1/2 left-1/2 z-50 w-11/12 max-w-md p-6 bg-gray-900/90 backdrop-blur-md rounded-xl border border-gray-700 shadow-2xl transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white text-xl font-semibold">Upload a File</h2>
                    <button
                        onClick={onClose}
                        className="text-white text-2xl font-bold leading-none hover:text-red-500 transition-colors"
                        aria-label="Close upload modal"
                        type="button"
                    >
                        &times;
                    </button>
                </div>
                <FileUploadForm onUpload={onUpload} loading={loading} />
            </div>
        </>
    );
};

export default UploadModal;
