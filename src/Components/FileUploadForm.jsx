// src/components/FileUploadForm.jsx (Updated with more robust validation)
import React, { useState } from 'react';

const FileUploadForm = ({ onUpload, loading }) => {
    const [fileToUpload, setFileToUpload] = useState(null);
    const [passkey, setPasskey] = useState('');

    const onFileChange = (e) => {
        setFileToUpload(e.target.files[0]);
    };

    const onPasskeyChange = (e) => {
        setPasskey(e.target.value);
    };

    const onUploadSubmit = (e) => {
        e.preventDefault();

        // More complex passkey validation regex
        const passkeyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!fileToUpload || !passkey) {
            alert('Please select a file and enter a passkey.');
            return;
        }

        if (!passkeyRegex.test(passkey)) {
            alert('Passkey must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        onUpload(fileToUpload, passkey);

        setFileToUpload(null);
        setPasskey('');
    };

    return (
        <form onSubmit={onUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="file" onChange={onFileChange} required />
            <input
                type="password"
                placeholder="Enter passkey (min 8 chars, incl. uppercase, number, and special char)"
                value={passkey}
                onChange={onPasskeyChange}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
};

export default FileUploadForm;