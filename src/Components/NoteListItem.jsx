import React from 'react';
import { FaEdit, FaStar } from "react-icons/fa"; // Import FaStar

const Note = ({ ele, onUpdateClick, onSelectChange, isSelected, select }) => {
    return (
        <div className="flex items-center bg-white p-4 my-2 rounded-lg shadow-md border border-gray-200">
            {select && (
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelectChange}
                    className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
            )}
            <div className={`flex-grow ${select ? 'ml-4' : 'ml-0'}`}>
                <h4 className="flex items-center text-lg font-semibold text-gray-800">
                    {ele.title}
                    {/* --- Conditionally render the star icon --- */}
                    {ele.isFavourate && (
                        <FaStar className="ml-2 text-yellow-500" title="Favourite" />
                    )}
                </h4>
                <p className="text-sm text-gray-600">{ele.notes}</p>
            </div>
            <button
                onClick={onUpdateClick}
                className="p-2 ml-4 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
                <FaEdit size={20} />
            </button>
        </div>
    );
};

export default Note;