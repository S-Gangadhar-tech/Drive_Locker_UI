import React, { useState } from 'react';

const FileUploadForm = ({ onUpload, loading }) => {
    const [fileToUpload, setFileToUpload] = useState(null);
    const [passkey, setPasskey] = useState('');

    // Passkey validation regex
    const passkeyRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const onFileChange = (e) => {
        setFileToUpload(e.target.files[0]);
    };

    const onPasskeyChange = (e) => {
        setPasskey(e.target.value);
    };

    const onUploadSubmit = (e) => {
        e.preventDefault();

        if (!fileToUpload || !passkey) {
            alert('Please select a file and enter a passkey.');
            return;
        }

        if (!passkeyRegex.test(passkey)) {
            alert(
                'Passkey must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
            );
            return;
        }

        onUpload(fileToUpload, passkey);

        setFileToUpload(null);
        setPasskey('');
    };

    return (
        <form
            onSubmit={onUploadSubmit}
            className="flex flex-col gap-4 bg-gray-900/80 p-6 rounded-lg border border-gray-700 backdrop-blur-md max-w-md mx-auto"
        >
            <input
                type="file"
                onChange={onFileChange}
                required
                className="text-gray-200 file:bg-cyan-600 file:text-white file:py-2 file:px-4 file:rounded-md file:border-0 file:cursor-pointer file:hover:bg-cyan-700"
            />
            <input
                type="password"
                placeholder="Enter passkey (min 8 chars, incl. uppercase, number, and special char)"
                value={passkey}
                onChange={onPasskeyChange}
                required
                className="rounded-md border border-gray-700 bg-gray-800 text-white p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
};

export default FileUploadForm;
