import { useContext, useState, useEffect } from "react";
import { NotesContext } from "../context/NotesContext";
import Note from "../Components/NoteListItem";
import CustomButton from "../Util/Button";
import NoteUtil from "../Util/NoteUtil";

const NotesService = () => {
    // State to manage the visibility of the create/update form
    const [showNoteForm, setShowNoteForm] = useState(false);
    // State to hold the note currently being edited
    const [editingNote, setEditingNote] = useState(null);
    // State to hold the IDs of notes selected for deletion
    const [selectedNoteIds, setSelectedNoteIds] = useState([]);

    const { notes, fetchNotes, deleteNotes } = useContext(NotesContext);

    const [select, setSelect] = useState(false);

    // Fetch notes when the component first mounts
    useEffect(() => {
        fetchNotes();
    }, []);

    // Handlers for UI actions
    const handleCreateClick = () => {
        setEditingNote(null);
        setShowNoteForm(true);
    };

    const handleUpdateClick = (note) => {
        setEditingNote(note);
        setShowNoteForm(true);
    };

    const handleFormClose = () => {
        setShowNoteForm(false);
        setEditingNote(null);
    };

    const handleDeleteSelected = async () => {
        if (selectedNoteIds.length > 0) {
            await deleteNotes(selectedNoteIds); // This call already handles fetching the new list
            setSelectedNoteIds([]); // Clear selection after deletion
        }
    };

    const handleNoteSelect = (id) => {
        setSelectedNoteIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((noteId) => noteId !== id)
                : [...prevSelected, id]
        );
    };

    const toggleSelectMode = () => {
        if (select) {
            setSelectedNoteIds([]);
        }
        setSelect(!select);
    };

    return (
        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700 p-8 max-w-4xl mx-auto min-h-[30vh] text-gray-200">
            <h1 className="text-3xl font-bold mb-6 text-white">Notes</h1>

            <div className="space-y-4 mb-6">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <Note
                            key={note.id}
                            ele={note}
                            onUpdateClick={() => handleUpdateClick(note)}
                            onSelectChange={() => handleNoteSelect(note.id)}
                            isSelected={selectedNoteIds.includes(note.id)}
                            select={select}
                        />
                    ))
                ) : (
                    <p className="text-gray-400">No notes found. Create one!</p>
                )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                <CustomButton text="Create New Note" handleOnclick={handleCreateClick} />

                {select && (
                    <CustomButton
                        text={`Delete Selected (${selectedNoteIds.length})`}
                        handleOnclick={handleDeleteSelected}
                        disabled={selectedNoteIds.length === 0}
                    />
                )}

                <CustomButton text={select ? "Deselect" : "Select Notes"} handleOnclick={toggleSelectMode} />
            </div>

            {showNoteForm && (
                <NoteUtil
                    note={editingNote} // Pass the note data for editing
                    onClose={handleFormClose} // Function to close the form
                />
            )}
        </div>
    );
};

export default NotesService;
