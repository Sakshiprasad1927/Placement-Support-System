import React from 'react'

export default function Button({ children, className = '', disabled = false, ...props }){
  const base = "inline-flex items-center justify-center px-4 py-2 rounded text-sm font-medium shadow-sm";
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  return (
    <button {...props} disabled={disabled} className={`${base} ${disabledClass} ${className}`}>
      {children}
    </button>
  )
}
