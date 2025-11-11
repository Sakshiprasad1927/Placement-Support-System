import React, { useEffect, useState } from 'react'
import Table from '../components/Table'

export default function StudentApplications(){
  const [apps, setApps] = useState(null)

  useEffect(()=>{ load() },[])

  async function load(){
    const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api/students/applications', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    const data = await res.json();
    setApps(data || []);
  }

  if(!apps) return <div>Loading...</div>

  const cols = [
    { label: 'Job', key: 'jobId', render: r => r.jobId?.title || '-' },
    { label: 'Company', key: 'jobId', render: r => r.jobId?.companyId?.profile?.companyName || r.jobId?.companyId?.email || '-' },
    { label: 'Applied At', key: 'appliedAt', render: r => new Date(r.appliedAt).toLocaleString() },
    { label: 'Status', key: 'status', render: r => <span className={`px-2 py-1 rounded text-sm ${r.status === 'Selected' ? 'bg-green-100 text-green-700' : r.status === 'Shortlisted' ? 'bg-yellow-100 text-yellow-700' : r.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{r.status}</span> }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Applications</h1>
      <div className="bg-white p-4 rounded shadow">
        <Table columns={cols} data={apps} />
      </div>
    </div>
  )
}
