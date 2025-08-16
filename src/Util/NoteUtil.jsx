import React, { useContext, useState, useEffect } from "react";
import { NotesContext } from "../context/NotesContext";
import { FaSave, FaTimes, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const NoteUtil = ({ note, onClose }) => {
    const isUpdateMode = !!note;

    const [formData, setFormData] = useState({
        title: isUpdateMode ? note.title : "",
        notes: isUpdateMode ? note.notes : "",
        isFavourate: isUpdateMode ? note.isFavourate : false,
    });

    // New state for title validation error
    const [titleError, setTitleError] = useState("");

    const { createNote, updateNote } = useContext(NotesContext);

    useEffect(() => {
        if (isUpdateMode && note) {
            setFormData({
                title: note.title,
                notes: note.notes,
                isFavourate: note.isFavourate || false,
            });
        }
    }, [note, isUpdateMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newFormData = {
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        };
        setFormData(newFormData);

        // Validate title as the user types
        if (name === "title") {
            if (value.includes(" ")) {
                setTitleError("Title cannot contain spaces.");
            } else if (!value.trim()) {
                setTitleError("Title cannot be empty.");
            } else {
                setTitleError(""); // Clear the error if input is valid
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation before submission
        if (!formData.title.trim() || !formData.notes.trim()) {
            toast.warn("Title and notes cannot be empty.");
            return;
        }

        if (formData.title.includes(" ")) {
            toast.error("Title cannot contain spaces.");
            return;
        }

        // Proceed with form submission if all checks pass
        if (isUpdateMode) {
            await updateNote(note.id, formData);
        } else {
            await createNote(formData);
        }

        onClose();
    };

    return (
        <motion.div
            className="bg-gray-900/80 p-6 rounded-lg shadow-2xl max-w-md mx-auto my-8 border border-gray-700 backdrop-blur-md text-gray-200"
            initial={{ opacity: 0, scale: 0.98, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 40 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
        >
            <h3 className="text-2xl font-bold mb-4 text-white">
                {isUpdateMode ? "Update Note" : "Create New Note"}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800 text-white"
                    />
                    {/* Display the validation error here */}
                    {titleError && (
                        <p className="text-red-500 text-sm mt-1">{titleError}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Notes
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 h-32 resize-none bg-gray-800 text-white"
                    />
                </div>

                {isUpdateMode && (
                    <div className="mb-6 flex items-center">
                        <input
                            type="checkbox"
                            id="isFavourate"
                            name="isFavourate"
                            checked={formData.isFavourate}
                            onChange={handleChange}
                            className="h-4 w-4 text-yellow-400 border-gray-600 rounded focus:ring-yellow-300 cursor-pointer"
                        />
                        <label
                            htmlFor="isFavourate"
                            className="ml-2 flex items-center text-sm font-medium text-gray-300 cursor-pointer select-none"
                        >
                            <FaStar className="mr-1 text-yellow-400" />
                            Add to Favourites
                        </label>
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        type="submit"
                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-md shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition"
                    >
                        <FaSave />
                        <span>{isUpdateMode ? "Update" : "Create"}</span>
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition"
                    >
                        <FaTimes />
                        <span>Cancel</span>
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default NoteUtil;
