import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Table from '../components/Table'
import Button from '../components/Button'
import { getJobApplications, updateApplicationStatus } from '../lib/api'

export default function CompanyJobApplications(){
  const { jobId } = useParams()
  const [apps, setApps] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ load() },[jobId])

  async function load(){
    setLoading(true)
    const data = await getJobApplications(jobId)
    setApps(data || [])
    setLoading(false)
  }

  async function changeStatus(appId, status){
    setLoading(true)
    await updateApplicationStatus(appId, status)
    await load()
    setLoading(false)
  }

  if(!apps) return <div>Loading...</div>

  const cols = [
    { label: 'Student', key: 'studentId', render: r => r.studentId?.email || r.studentId },
    { label: 'Applied At', key: 'appliedAt', render: r => new Date(r.appliedAt).toLocaleString() },
    { label: 'Status', key: 'status', render: r => <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-700">{r.status}</span> },
    { label: 'Resume', key: 'resume', render: r => r.resumeSnapshotPath ? <a className="text-blue-600" href={`${(import.meta.env.VITE_API_BASE || 'http://localhost:4000')}/uploads/${r.resumeSnapshotPath}`} target="_blank" rel="noreferrer">Download</a> : 'No resume' },
    { label: 'Actions', key: 'actions', render: r => (
      <div className="flex items-center space-x-2">
        <Button className="bg-yellow-500 text-white" onClick={()=>changeStatus(r._id, 'Shortlisted')}>Shortlist</Button>
        <Button className="bg-red-500 text-white" onClick={()=>changeStatus(r._id, 'Rejected')}>Reject</Button>
        <Button className="bg-green-600 text-white" onClick={()=>changeStatus(r._id, 'Selected')}>Select</Button>
      </div>
    ) }
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Applications for Job</h1>
      <div className="bg-white p-4 rounded shadow">
        {loading ? <div>Updating...</div> : <Table columns={cols} data={apps} />}
      </div>
    </div>
  )
}
