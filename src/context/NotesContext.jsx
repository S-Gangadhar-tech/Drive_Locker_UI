// src/context/NotesContext.js
import { createContext, useState, useCallback, useContext } from "react";
import notesService from "../services/NotesService";
import { AppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    // This is the correct place to use the hook
    const { BackendURL } = useContext(AppContext);
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    // The rest of your context logic remains the same...
    const handleGlobalApiError = useCallback((error) => {
        // ...
    }, [navigate]);

    const fetchNotes = useCallback(async () => {
        try {
            // Pass BackendURL as an argument
            const fetchedNotes = await notesService.fetchNotes(BackendURL);
            setNotes(fetchedNotes);
        } catch (error) {
            handleGlobalApiError(error);
        }
    }, [BackendURL, handleGlobalApiError]);

    const createNote = useCallback(async (newNote) => {
        try {
            // Pass BackendURL as an argument
            const createdNote = await notesService.createNote(BackendURL, newNote);
            setNotes(prevNotes => [...prevNotes, createdNote]);
        } catch (error) {
            handleGlobalApiError(error);
        }
    }, [BackendURL, handleGlobalApiError]);

    const updateNote = useCallback(async (id, updatedData) => {
        try {
            // Pass BackendURL as an argument
            const updatedNote = await notesService.updateNote(BackendURL, id, updatedData);
            setNotes(prevNotes => prevNotes.map(note =>
                note.id === id ? updatedNote : note
            ));
        } catch (error) {
            handleGlobalApiError(error);
        }
    }, [BackendURL, handleGlobalApiError]);

    const deleteNotes = useCallback(async (idsToDelete) => {
        try {
            // Pass BackendURL as an argument
            await notesService.deleteNotes(BackendURL, idsToDelete);
            await fetchNotes();
        } catch (error) {
            handleGlobalApiError(error);
        }
    }, [BackendURL, fetchNotes, handleGlobalApiError]);

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