import React from 'react';
import { FaEdit, FaStar } from "react-icons/fa";

const Note = ({ ele, onUpdateClick, onSelectChange, isSelected, select }) => {
    return (
        <div className={`flex items-center bg-gray-900/80 p-4 my-2 rounded-lg shadow-2xl border border-gray-700 backdrop-blur-md transition-colors duration-300 hover:bg-gray-800`}>
            {select && (
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelectChange}
                    className="h-5 w-5 text-cyan-500 rounded border-gray-600 focus:ring-cyan-400 cursor-pointer transition"
                />
            )}
            <div className={`flex-grow ${select ? 'ml-4' : 'ml-0'}`}>
                <h4 className="flex items-center text-lg font-semibold text-gray-200">
                    {ele.title}
                    {/* Conditionally render the star icon */}
                    {ele.isFavourate && (
                        <FaStar className="ml-2 text-yellow-400" title="Favourite" />
                    )}
                </h4>
                <p className="text-sm text-gray-300">{ele.notes}</p>
            </div>
            <button
                onClick={onUpdateClick}
                className="p-2 ml-4 text-gray-400 hover:text-cyan-400 hover:bg-gray-800 rounded-full transition-colors duration-200"
                aria-label="Edit note"
                type="button"
            >
                <FaEdit size={20} />
            </button>
        </div>
    );
};

export default Note;
