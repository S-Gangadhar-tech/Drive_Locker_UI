// src/context/FileContext.jsx
import { createContext, useState, useContext } from 'react'; // ❌ Remove useEffect import
import FileService from "../services/FileService";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'; // Add axios import
import { AppContext } from './AppContext';

// Create a context
const FileContext = createContext();

export const useFiles = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { BackendURL } = useContext(AppContext)
    const navigate = useNavigate()

    // ❌ Remove this useEffect block
    // useEffect(() => {
    //     fetchUserFiles();
    // }, []);

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BackendURL}/auth/send-otp`)

            if (res.status === 200) {
                navigate("/email-verify")
                toast.success("otp sent success")
            } else {
                toast.error("unable to send otp")
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || "failed to send otp")
        }
    }

    const fetchUserFiles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await FileService.getUserFiles();
            setFiles(data);
        } catch (err) {
            if (err.status === 401) {
                toast("verify your email to use this service")
                await sendVerificationOtp()
            }
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file, passkey) => {
        setLoading(true);
        setError(null);
        try {
            const response = await FileService.fileUpload(file, passkey);
            console.log(response);
            await fetchUserFiles();
            return response;
        } catch (err) {
            console.log(err);
            if (err.status === 401) {
                toast("verify your email to use this service")
                await sendVerificationOtp()
            }
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFiles = async (publicIds) => {
        setLoading(true);
        setError(null);
        try {
            const response = await FileService.deleteFiles(publicIds);
            console.log(response);
            setFiles(currentFiles =>
                currentFiles.filter(file => !publicIds.includes(file.publicId))
            );
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        files,
        loading,
        error,
        fetchUserFiles,
        handleFileUpload,
        handleDeleteFiles,
    };

    return (
        <FileContext.Provider value={value}>
            {children}
        </FileContext.Provider>
    );
};