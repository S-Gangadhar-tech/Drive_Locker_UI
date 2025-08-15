import { useContext, useState, useEffect } from "react";
import { NotesContext } from "../context/NotesContext";
import { FaSave, FaTimes, FaStar } from "react-icons/fa";
import { toast } from 'react-toastify';

const NoteUtil = ({ note, onClose }) => {
    // Determine if we're in "update" mode based on if a note prop is provided
    const isUpdateMode = !!note;

    // Initialize state with note data for update, or empty for create
    const [formData, setFormData] = useState({
        title: isUpdateMode ? note.title : "",
        notes: isUpdateMode ? note.notes : "",
        isFavourate: isUpdateMode ? note.isFavourate : false
    });

    // Destructure context methods
    const { createNote, updateNote } = useContext(NotesContext);

    // Update form data if the note prop changes (e.g., when editing a different note)
    useEffect(() => {
        if (isUpdateMode && note) {
            setFormData({
                title: note.title,
                notes: note.notes,
                isFavourate: note.isFavourate || false // Default to false if undefined
            });
        }
    }, [note, isUpdateMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            // Handle checkbox input differently from text input
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Handle empty form data
        if (!formData.title.trim() || !formData.notes.trim()) {
            toast.warn("Title and notes cannot be empty.");
            return;
        }

        if (isUpdateMode) {
            // The isFavourate property is now included in formData
            await updateNote(note.id, formData);
        } else {
            await createNote(formData);
        }

        // Close the form
        onClose();
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md mx-auto my-8 border border-gray-300">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {isUpdateMode ? "Update Note" : "Create New Note"}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                    />
                </div>

                {/* --- Add to Favourites Checkbox (only in update mode) --- */}
                {isUpdateMode && (
                    <div className="mb-6 flex items-center">
                        <input
                            type="checkbox"
                            id="isFavourate"
                            name="isFavourate"
                            checked={formData.isFavourate}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isFavourate" className="ml-2 flex items-center text-sm font-medium text-gray-700">
                            <FaStar className="mr-1 text-yellow-500" />
                            Add to Favourites
                        </label>
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        type="submit"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <FaSave />
                        <span>{isUpdateMode ? "Update" : "Create"}</span>
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    >
                        <FaTimes />
                        <span>Cancel</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoteUtil;