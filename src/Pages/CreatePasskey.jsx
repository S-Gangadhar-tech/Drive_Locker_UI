import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePasskey = () => {
    const { BackendURL } = useContext(AppContext);
    const [passkey, setPasskey] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const createKey = async () => {
        // Clear previous messages
        setMessage('');
        setError('');
        const navigate = useNavigate()

        // Define the regex pattern for validation
        const passkeyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // Frontend validation
        if (!passkeyRegex.test(passkey)) {
            setError('Passkey must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        try {
            const response = await axios.post(`${BackendURL}/user/add-passkey`, {
                passKey: passkey,
            });
            setMessage(response.data);
            setPasskey('');
            navigate("/Files")
            // Clear the input on success
        } catch (err) {
            setError(err.response?.data || 'An error occurred while setting the passkey.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
            <h1>Create Passkey</h1>
            <p>Your passkey must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.</p>
            <input
                type="password"
                placeholder="Enter your passkey"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                style={{ width: '100%', padding: '10px', margin: '10px 0' }}
            />
            <button onClick={createKey} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Set Passkey
            </button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CreatePasskey;