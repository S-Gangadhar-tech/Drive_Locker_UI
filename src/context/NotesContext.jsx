import { createContext, useState, useCallback, useContext } from "react";
import { AppContext } from "./AppContext";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const { BackendURL } = useContext(AppContext);
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    /**
     * A reusable function to handle API errors consistently.
     * It displays the specific error message from the server and
     * redirects to the email verification page on a 401 Unauthorized error.
     * @param {Error} error - The error object from the catch block.
     * @param {string} defaultMessage - A fallback message to display if the server provides no specific message.
     */
    const handleApiError = useCallback((error, defaultMessage) => {
        console.error(defaultMessage, error);
        // Use optional chaining (?.) to safely access nested properties
        const message = error.response?.data?.message || defaultMessage;
        toast.error(message);

        if (error.response?.status === 401) {
            setTimeout(() => {
                navigate("/email-verify");
            }, 5000);
        }
    }, [navigate]);

    const fetchNotes = useCallback(async () => {
        try {
            const response = await axios.get(`${BackendURL}/notes/get-notes`);
            setNotes(response.data);
        } catch (error) {
            if (error.response?.status === 404) {
                setNotes([]);
                toast.info("No notes found. Create a new one!");
            } else {
                handleApiError(error, "Error fetching notes.");
            }
        }
    }, [BackendURL, handleApiError]);

    const createNote = useCallback(async (newNote) => {
        try {
            const response = await axios.post(`${BackendURL}/notes/create-notes`, newNote);
            setNotes(prevNotes => [...prevNotes, response.data]);
            toast.success("Note created successfully! 📝");
        } catch (error) {
            handleApiError(error, "Failed to create note.");
        }
    }, [BackendURL, handleApiError]);

    const updateNote = useCallback(async (id, updatedData) => {
        try {
            const noteToUpdate = { ...updatedData, id };
            const response = await axios.put(`${BackendURL}/notes/update-notes`, noteToUpdate);
            setNotes(prevNotes => prevNotes.map(note =>
                note.id === id ? response.data : note
            ));
            toast.success("Note updated successfully!");
        } catch (error) {
            handleApiError(error, "Failed to update note.");
        }
    }, [BackendURL, handleApiError]);

    const deleteNotes = useCallback(async (idsToDelete) => {
        try {
            const idsAsString = idsToDelete.map(id => String(id));
            await axios.delete(`${BackendURL}/notes/delete-notes`, {
                data: idsAsString
            });
            await fetchNotes(); // Re-fetch notes from server to ensure UI is in sync
            toast.success("Selected notes deleted successfully! ✔️");
        } catch (error) {
            handleApiError(error, "Failed to delete notes.");
        }
    }, [BackendURL, fetchNotes, handleApiError]);

    const value = {
        notes,
        fetchNotes,
        createNote,
        updateNote,
        deleteNotes,
    };

    return (
        <NotesContext.Provider value={value}>
            {children}
        </NotesContext.Provider>
    );
};