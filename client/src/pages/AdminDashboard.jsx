import React, { useState } from 'react';
import { format } from 'date-fns';
import useAuthStore from '../store/authStore';
import { 
  useAdminStats, 
  useApplicationsChart, 
  useAdminUsers, 
  useAdminJobs, 
  useToggleUserStatus 
} from '../hooks/useAdmin';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import PageLoader from '../components/common/PageLoader';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuthStore();
  
  const { data: stats, isLoading: isLoadingStats } = useAdminStats();
  const { data: chartData, isLoading: isLoadingChart } = useApplicationsChart();
  const { data: users, isLoading: isLoadingUsers } = useAdminUsers();
  const { data: jobs, isLoading: isLoadingJobs } = useAdminJobs();
  const { mutate: toggleStatus } = useToggleUserStatus();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoadingStats || isLoadingChart || isLoadingUsers || isLoadingJobs) {
    return <PageLoader />;
  }

  const filteredUsers = users?.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-bg-main min-h-screen">
      {/* Sidebar */}
      <div className="w-56 bg-bg-card border-r border-border-soft flex flex-col min-h-screen">
        <div className="p-6">
          <h2 className="text-purple-light font-bold text-lg">AI Job Board</h2>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {['overview', 'users', 'jobs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left p-3 rounded-lg capitalize ${
                activeTab === tab 
                  ? 'bg-purple-muted text-purple-light' 
                  : 'text-text-muted hover:bg-bg-surface hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border-soft flex justify-between items-center">
          <span className="text-text-primary text-sm truncate max-w-[120px]">{user?.name}</span>
          <button onClick={logout} className="text-text-muted hover:text-red-400 text-xs">Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        <h1 className="text-text-primary font-bold text-2xl mb-6">Admin Dashboard</h1>

        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard icon="👥" number={stats?.totalUsers} label="Total Users" />
              <StatCard icon="💼" number={stats?.totalJobs} label="Total Jobs" />
              <StatCard icon="📋" number={stats?.totalApplications} label="Total Applications" />
              <StatCard icon="🟢" number={stats?.openJobs} label="Open Jobs" valueColor="text-green-400" />
              <StatCard icon="⚡" number={stats?.avgAIScore ?? '—'} label="Avg AI Score" valueColor="text-purple-light" />
              <StatCard icon="🏢" number={stats?.totalEmployers} label="Total Employers" />
            </div>

            <div className="grid grid-cols-5 gap-3 mb-8">
              {['applied', 'shortlisted', 'interview', 'rejected', 'hired'].map(status => (
                <div key={status} className="bg-bg-card border border-border-soft rounded-xl p-4 text-center">
                  <div className={`text-xl font-bold mb-1 ${getStatusColorText(status)}`}>
                    {stats?.applicationsByStatus?.find(s => s._id === status)?.count || 0}
                  </div>
                  <div className="text-text-muted text-xs capitalize">{status}</div>
                </div>
              ))}
            </div>

            <div className="bg-bg-card border border-border-soft rounded-xl p-5 mb-8 h-80 flex flex-col">
              <h3 className="text-text-primary font-medium mb-4">Applications (Last 14 Days)</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                    <XAxis dataKey="date" stroke="#52525B" tick={{ fill: '#71717A', fontSize: 11 }} />
                    <YAxis stroke="#52525B" tick={{ fill: '#71717A', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#18181B', border: '1px solid #27272A', borderRadius: '8px', color: '#FAFAFA' }} />
                    <Area type="monotone" dataKey="count" stroke="#7C3AED" fill="#7C3AED22" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md bg-bg-surface border border-border-soft rounded-lg px-4 py-2 focus:border-purple focus:outline-none text-text-primary text-sm"
              />
            </div>
            <div className="bg-bg-card border border-border-soft rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-bg-surface text-text-hint text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers?.map(u => (
                    <tr key={u._id} className="border-b border-border-soft hover:bg-bg-surface/50">
                      <td className="px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-muted text-purple-light flex items-center justify-center text-sm font-medium">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-text-primary text-sm font-medium">{u.name}</span>
                      </td>
                      <td className="px-4 py-3 text-text-muted text-sm">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-[10px] uppercase font-bold tracking-wider ${getRoleBadgeStyle(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${u.isVerified ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                          {u.isVerified ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-hint text-xs">
                        {format(new Date(u.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStatus(u._id)}
                          disabled={u.role === 'admin'}
                          className={`text-xs border border-border-soft rounded-lg px-3 py-1 transition-colors ${
                            u.role === 'admin' ? 'opacity-50 cursor-not-allowed' :
                            u.isVerified 
                              ? 'hover:border-red-500/40 hover:text-red-400 text-text-muted' 
                              : 'hover:border-green-500/40 hover:text-green-400 text-text-muted'
                          }`}
                        >
                          {u.isVerified ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-bg-card border border-border-soft rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-bg-surface text-text-hint text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Job Title</th>
                  <th className="px-4 py-3">Employer</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Applicants</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Posted</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs?.map(job => (
                  <tr key={job._id} className="border-b border-border-soft hover:bg-bg-surface/50">
                    <td className="px-4 py-3 text-text-primary text-sm font-medium">{job.title}</td>
                    <td className="px-4 py-3 text-text-muted text-sm">{job.employer?.companyName}</td>
                    <td className="px-4 py-3">
                      <span className="bg-bg-surface text-text-muted border border-border-soft rounded-full px-2 py-1 text-[10px] uppercase font-bold">
                        {job.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-purple-light font-medium text-sm">{job.applicantCount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getJobStatusStyle(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-hint text-xs">
                      {format(new Date(job.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`/jobs/${job._id}`} target="_blank" rel="noopener noreferrer" className="text-purple-light text-xs hover:underline">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, number, label, valueColor = "text-text-primary" }) => (
  <div className="bg-bg-card border border-border-soft rounded-xl p-5 flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-purple-muted flex items-center justify-center text-xl">
      {icon}
    </div>
    <div>
      <div className={`text-3xl font-bold ${valueColor}`}>{number}</div>
      <div className="text-text-muted text-sm">{label}</div>
    </div>
  </div>
);

const getStatusColorText = (status) => {
  const colors = {
    applied: 'text-blue-400',
    shortlisted: 'text-purple-light',
    interview: 'text-amber-400',
    rejected: 'text-red-400',
    hired: 'text-green-400',
  };
  return colors[status] || 'text-text-primary';
};

const getRoleBadgeStyle = (role) => {
  switch (role) {
    case 'admin': return 'bg-purple-muted text-purple-light border border-border-purple';
    case 'employer': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'candidate': return 'bg-bg-surface text-text-muted border border-border-soft';
    default: return '';
  }
};

const getJobStatusStyle = (status) => {
  switch (status) {
    case 'open': return 'bg-green-500/10 text-green-400 border border-green-500/20';
    case 'closed': return 'bg-red-500/10 text-red-400 border border-red-500/20';
    default: return 'bg-bg-surface text-text-muted border border-border-soft';
  }
};

export default AdminDashboard;
