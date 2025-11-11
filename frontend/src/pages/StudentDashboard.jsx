import React, { useEffect, useState } from 'react'
import { getMe, uploadResume, submitProfileEditRequest, getMyProfileEditRequests } from '../lib/api'
import FormField from '../components/FormField'
import Button from '../components/Button'
import Table from '../components/Table'
import { fileIsValid } from '../utils/validate'
import { useNavigate } from 'react-router-dom'

export default function StudentDashboard(){
  const [me, setMe] = useState(null)
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [editMsg, setEditMsg] = useState(null)
  const [editRequests, setEditRequests] = useState([])
  const [showRequests, setShowRequests] = useState(false)
  const [activeTab, setActiveTab] = useState('jobs') // 'jobs' or 'applications'

  useEffect(()=>{
    async function load(){
      const data = await getMe();
      setMe(data);
      setEditForm({
        name: data?.profile?.name || '',
        rollNumber: data?.profile?.rollNumber || '',
        branch: data?.profile?.branch || '',
        cgpa: data?.profile?.cgpa || '',
        phone: data?.profile?.phone || '',
        skills: (data?.profile?.skills || []).join(', ')
      });
      
      // Load edit requests
      const requests = await getMyProfileEditRequests();
      setEditRequests(requests || []);
    }
    load();
  },[])

  const navigate = useNavigate();

  async function handleUpload(e){
    e.preventDefault();
    if(!file) return setMsg('Select a file');
    const ok = fileIsValid(file);
    if(!ok.ok){ setMsg(ok.error); return }
    setMsg('Uploading...')
    const res = await uploadResume(file);
    setMsg(res?.msg || 'done')
    // refresh profile
    const data = await getMe();
    setMe(data);
  }

  async function handleEditSubmit(e){
    e.preventDefault();
    setEditMsg('Submitting...');
    const payload = {
      name: editForm.name,
      rollNumber: editForm.rollNumber,
      branch: editForm.branch,
      cgpa: Number(editForm.cgpa) || 0,
      phone: editForm.phone,
      skills: editForm.skills.split(',').map(s=>s.trim()).filter(Boolean)
    };
    const res = await submitProfileEditRequest(payload);
    setEditMsg(res?.msg || 'Request submitted');
    setShowEditForm(false);
    // Reload requests
    const requests = await getMyProfileEditRequests();
    setEditRequests(requests || []);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-6">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600">Welcome back! Manage your profile and explore job opportunities.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-6">
              {me ? (
                <div className="space-y-6">
                  {/* Avatar and Name */}
                  <div className="text-center pb-6 border-b border-gray-200">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
                      {me?.profile?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                      {me.profile?.name || 'Student'}
                    </h2>
                    <p className="text-sm text-gray-500">{me.email}</p>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Roll Number</div>
                        <div className="text-base font-medium text-gray-800">{me.profile?.rollNumber || '-'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Branch</div>
                        <div className="text-base font-medium text-gray-800">{me.profile?.branch || '-'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">CGPA</div>
                        <div className="text-base font-medium text-gray-800">{me.profile?.cgpa ?? '-'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Resume</div>
                        <div className="text-base font-medium">
                          {me.profile?.resumePath ? 
                            <a className="text-blue-600 hover:text-blue-700 font-semibold underline flex items-center gap-1" href={`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/uploads/${me.profile.resumePath}`} target="_blank" rel="noreferrer">
                              Download
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </a> : 
                            <span className="text-gray-400">Not uploaded</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-6 border-t border-gray-200">
                    <button 
                      onClick={()=>{setActiveTab('applications'); setShowEditForm(false); setShowRequests(false);}} 
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      My Applications
                    </button>
                    <button 
                      onClick={()=>{setShowEditForm(!showEditForm); setShowRequests(false); setActiveTab('jobs');}} 
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                    <button 
                      onClick={()=>{setShowRequests(!showRequests); setShowEditForm(false); setActiveTab('jobs');}} 
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Edit Requests ({editRequests.length})
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Edit Profile Form */}
            {showEditForm && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Edit Profile Request</h2>
                    <p className="text-sm text-gray-500 mt-1">Submit changes for admin approval</p>
                  </div>
                  <button onClick={()=>setShowEditForm(false)} className="text-gray-400 hover:text-gray-600 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {editMsg && <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {editMsg}
                </div>}
                
                {/* Resume Upload Section */}
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Resume
                  </h3>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 hover:border-blue-500 transition bg-white">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={e=>setFile(e.target.files[0])} 
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:font-semibold file:cursor-pointer cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl">
                      Upload Resume
                    </Button>
                    {msg && (
                      <div className="text-sm text-center p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                        {msg}
                      </div>
                    )}
                  </form>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField label="Full Name">
                      <input 
                        value={editForm.name} 
                        onChange={e=>setEditForm(f=>({...f, name: e.target.value}))} 
                        className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                        placeholder="Enter your full name"
                      />
                    </FormField>
                    <FormField label="Roll Number">
                      <input 
                        value={editForm.rollNumber} 
                        onChange={e=>setEditForm(f=>({...f, rollNumber: e.target.value}))} 
                        className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                        placeholder="Enter roll number"
                      />
                    </FormField>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <FormField label="Branch">
                      <input 
                        value={editForm.branch} 
                        onChange={e=>setEditForm(f=>({...f, branch: e.target.value}))} 
                        className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                        placeholder="e.g., CSE"
                      />
                    </FormField>
                    <FormField label="CGPA">
                      <input 
                        value={editForm.cgpa} 
                        onChange={e=>setEditForm(f=>({...f, cgpa: e.target.value}))} 
                        className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                        placeholder="e.g., 8.5"
                      />
                    </FormField>
                    <FormField label="Phone">
                      <input 
                        value={editForm.phone} 
                        onChange={e=>setEditForm(f=>({...f, phone: e.target.value}))} 
                        className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                        placeholder="Enter phone number"
                      />
                    </FormField>
                  </div>
                  <FormField label="Skills (comma separated)">
                    <input 
                      value={editForm.skills} 
                      onChange={e=>setEditForm(f=>({...f, skills: e.target.value}))} 
                      className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                      placeholder="e.g., JavaScript, React, Node.js, Python"
                    />
                  </FormField>
                  <div className="flex gap-4 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl">
                      Submit for Approval
                    </Button>
                    <button type="button" onClick={()=>setShowEditForm(false)} className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Requests View */}
            {showRequests && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Edit Requests</h2>
                    <p className="text-sm text-gray-500 mt-1">Track your profile edit submissions</p>
                  </div>
                  <button onClick={()=>setShowRequests(false)} className="text-gray-400 hover:text-gray-600 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {editRequests.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-lg font-medium">No edit requests submitted yet</div>
                    <p className="text-sm mt-2">Click "Edit Profile" to submit your first request</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editRequests.map(req => (
                      <div key={req._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${
                              req.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                              req.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                              'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}>
                              {req.status === 'approved' ? 'Approved' : req.status === 'rejected' ? 'Rejected' : 'Pending'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(req.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-20">Name:</span>
                            <span className="text-gray-600">{req.requestedChanges.name}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-20">Roll:</span>
                            <span className="text-gray-600">{req.requestedChanges.rollNumber}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-20">Branch:</span>
                            <span className="text-gray-600">{req.requestedChanges.branch}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-20">CGPA:</span>
                            <span className="text-gray-600">{req.requestedChanges.cgpa}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-20">Phone:</span>
                            <span className="text-gray-600">{req.requestedChanges.phone}</span>
                          </div>
                          <div className="flex items-start gap-2 md:col-span-2">
                            <span className="font-semibold text-gray-700 min-w-20">Skills:</span>
                            <span className="text-gray-600">{(req.requestedChanges.skills || []).join(', ')}</span>
                          </div>
                        </div>
                        {req.adminComments && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <div className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                              </svg>
                              Admin Comments
                            </div>
                            <div className="text-sm text-gray-700 leading-relaxed">{req.adminComments}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{activeTab === 'jobs' ? 'Available Jobs' : 'My Applications'}</h2>
                  <p className="text-sm text-gray-500 mt-1">{activeTab === 'jobs' ? 'Explore and apply to job opportunities' : 'Track your application status'}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {activeTab === 'jobs' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    )}
                  </svg>
                </div>
              </div>
              {activeTab === 'jobs' ? <AllJobs me={me} /> : <MyApplications />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AllJobs({ me }){
  const [jobs, setJobs] = useState(null)
  const [appsMap, setAppsMap] = useState({})
  const [applyingMap, setApplyingMap] = useState({})
  const [modalJob, setModalJob] = useState(null)

  useEffect(()=>{
    async function load(){
      const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000')
      const res = await fetch(base + '/api/companies', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      const companies = await res.json();
      // flatten jobs with company info - only active jobs
      const all = [];
      (companies || []).forEach(entry => {
        const company = entry.company;
        const jobs = entry.jobs || [];
        jobs.forEach(j => {
          // Only show active jobs
          if(j.recruitmentStatus === 'active' || !j.recruitmentStatus) {
            all.push(Object.assign({}, j, { companyId: company._id, companyEmail: company.email, companyName: company.profile?.companyName }))
          }
        })
      })
      setJobs(all);

      // load my applications
      const ares = await fetch(base + '/api/students/applications', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      const apps = await ares.json();
      const map = {};
      (apps || []).forEach(a => { if(a.jobId) map[a.jobId] = a })
      setAppsMap(map);
    }
    load();
  },[])

  if(!jobs) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div></div>
  if(jobs.length === 0) return <div className="text-center py-16 text-gray-500">
    <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
    <div className="text-xl font-medium text-gray-700">No jobs available at the moment</div>
    <p className="text-sm mt-2">Check back later for new opportunities</p>
  </div>

  async function apply(jobId){
    const role = localStorage.getItem('role');
    if(role !== 'student'){
      alert('Please login as a student to apply');
      return;
    }
    const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000')
    // set applying state
    setApplyingMap(m=>({ ...m, [jobId]: true }))
    try{
      const res = await fetch(base + `/api/students/apply/${jobId}`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json().catch(()=>({}));
      if(!res.ok){
        alert(data.error || data.msg || `Apply failed (${res.status})`);
      }
      // refresh apps
      const ares = await fetch(base + '/api/students/applications', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      const apps = await ares.json();
      const map = {};
      (apps || []).forEach(a => { if(a.jobId) map[a.jobId] = a })
      setAppsMap(map);
      return data;
    }catch(err){
      console.error('Apply failed', err);
      alert('Apply failed: ' + (err.message || err));
    }finally{
      setApplyingMap(m=>({ ...m, [jobId]: false }))
    }
  }

  const meCgpa = me?.profile?.cgpa || 0;
  const meBranch = me?.profile?.branch;

  return (
    <div className="mt-3">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Role</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Company</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Location</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">CTC</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Eligible</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Action</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Details</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j, idx) => {
              const eligible = (Number(j.cgpaCutoff || 0) <= Number(meCgpa || 0)) && (!j.eligibleBranches || j.eligibleBranches.length === 0 || j.eligibleBranches.includes(meBranch));
              const app = appsMap[j._id];
              return (
                <tr key={j._id} className="border-b border-gray-100 hover:bg-blue-50/50 transition">
                  <td className="px-4 py-4 text-sm text-gray-700 align-top">
                    <div className="font-semibold text-gray-900">{j.title}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 align-top">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-2">
                        {(j.companyName || j.companyEmail).charAt(0).toUpperCase()}
                      </div>
                      <div>{j.companyName || j.companyEmail}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 align-top">{j.location || '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 align-top">
                    <span className="font-semibold text-green-600">{j.ctc || '-'}</span>
                  </td>
                  <td className="px-4 py-4 text-sm align-top">
                    {eligible ? 
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Eligible
                      </span> : 
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Not eligible
                      </span>
                    }
                  </td>
                  <td className="px-4 py-4 text-sm align-top">
                    <button
                      title={!eligible ? 'You are not eligible for this job' : app ? 'You have already applied' : 'Apply'}
                      disabled={!eligible || !!app || applyingMap[j._id]}
                      onClick={async ()=>{ if(!eligible || app) return; await apply(j._id); }}
                      className={`${(!eligible || app) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : (applyingMap[j._id] ? 'bg-yellow-500 text-white' : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700')} px-4 py-2 rounded-lg font-medium transition shadow-sm`}
                    >
                      {applyingMap[j._id] ? 'Applying…' : 'Apply'}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm align-top">
                    {app ? 
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {app.status}
                      </span> : 
                      <span className="text-gray-400">-</span>
                    }
                  </td>
                  <td className="px-4 py-4 text-sm align-top">
                    <button onClick={()=>setModalJob(j)} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                      View Details
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={()=>setModalJob(null)} />
          <div className="relative bg-white w-11/12 max-w-2xl rounded shadow-lg p-6 z-10">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">{modalJob.title}</h3>
                <div className="text-sm text-gray-600">{modalJob.companyName || modalJob.companyEmail} • {modalJob.location || '-' } • CTC: {modalJob.ctc || '-'}</div>
              </div>
              <button onClick={()=>setModalJob(null)} className="text-gray-500">Close</button>
            </div>
            <div className="mt-4">
              <h4 className="font-medium">Description</h4>
              <p className="text-sm text-gray-700 mt-2">{modalJob.description || 'No description provided.'}</p>
              <h4 className="font-medium mt-4">Requirements</h4>
              <p className="text-sm text-gray-700 mt-2">{(modalJob.requiredSkills || []).join(', ') || 'Not specified'}</p>
            </div>
            <div className="mt-6 text-right">
              <button onClick={()=>setModalJob(null)} className="bg-gray-200 px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MyApplications(){
  const [apps, setApps] = useState(null)

  useEffect(()=>{ load() },[])

  async function load(){
    const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api/students/applications', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    const data = await res.json();
    setApps(data || []);
  }

  if(!apps) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
    </div>
  )

  if(apps.length === 0) return (
    <div className="text-center py-16 text-gray-500">
      <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <div className="text-xl font-medium text-gray-700">No applications yet</div>
      <p className="text-sm mt-2">Apply to jobs to see them here</p>
    </div>
  )

  return (
    <div className="space-y-4">
      {apps.map(app => (
        <div key={app._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  {app.jobId?.title?.charAt(0) || 'J'}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{app.jobId?.title || 'Job Position'}</h3>
                  <p className="text-sm text-gray-600">
                    {app.jobId?.companyId?.profile?.companyName || app.jobId?.companyId?.email || 'Company Name Not Available'}
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Applied: <span className="font-semibold text-gray-800">{new Date(app.appliedAt).toLocaleDateString()}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Time: <span className="font-semibold text-gray-800">{new Date(app.appliedAt).toLocaleTimeString()}</span></span>
                </div>
              </div>

              {app.jobId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-2 font-medium text-gray-800">{app.jobId.location || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">CTC:</span>
                      <span className="ml-2 font-medium text-gray-800">{app.jobId.ctc || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="ml-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${
                app.status === 'Selected' ? 'bg-green-100 text-green-800 border border-green-200' :
                app.status === 'Shortlisted' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                app.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {app.status || 'Pending'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

