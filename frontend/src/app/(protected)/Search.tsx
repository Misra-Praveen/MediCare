"use client"
import React, { useState } from 'react'

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Search = ({value, onChange, placeholder} : SearchBarProps) => {
    
  return (
    <div className="w-full md:w-96">
      <input
        type="text"
        value={value}
        placeholder={placeholder || "Search..."}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  )
}

export default Search