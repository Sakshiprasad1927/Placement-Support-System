import React, { useEffect, useState } from 'react'

/**
 * Notifications dropdown
 * - Polls the backend for notifications for the current user and displays them in a small dropdown
 * - This is intentionally lightweight; it can be improved to support mark-as-read and keyboard navigation
 */
export default function Notifications(){
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])

  async function load(){
    try{
      const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api/students/notifications', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      setItems(data || []);
    }catch(e){ console.error(e) }
  }

  useEffect(()=>{
    load();
    const id = setInterval(load, 20000); // poll every 20s
    return ()=> clearInterval(id);
  },[])

  const unread = items.filter(i=>!i.read).length

  return (
    <div className="relative">
      <button onClick={()=>setOpen(v=>!v)} className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" /></svg>
        {unread > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
          <div className="p-3">
            <div className="font-medium">Notifications</div>
            <div className="mt-2 space-y-2 max-h-64 overflow-auto">
              {items.length === 0 && <div className="text-sm text-gray-500">No notifications</div>}
              {items.map(it=> (
                <div key={it._id} className={`p-2 rounded ${!it.read ? 'bg-blue-50' : ''}`}>
                  <div className="text-sm font-medium">{it.title}</div>
                  <div className="text-xs text-gray-600">{it.message}</div>
                  <div className="text-xs text-gray-400">{new Date(it.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
