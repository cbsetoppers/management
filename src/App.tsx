import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Settings, LogOut, Search,
    ShieldAlert, Calendar, TrendingUp, Activity,
    Shield, Plus, Trash2, Pencil, Eye, EyeOff, ChevronRight, ChevronUp, ChevronDown,
    Zap, BarChart3, CheckCircle2, XCircle, Github,
    RefreshCw, MessageSquare, Crown, Star, Lock, Sun, Moon, BookOpen, Download,
    ShoppingBag, Package, Image as ImageIcon,
    Loader2, UploadCloud, Code
} from 'lucide-react';
import {
    fetchAdminStats, fetchAllStudents, fetchMaintenanceSettings,
    updateMaintenanceSettings, signInOperator, signOutOperator,
    fetchAllOperators, createOperator, deleteOperator,
    Operator, OperatorRole,
    fetchSubjects, createSubject, deleteSubject, updateSubject,
    fetchFolders, createFolder, deleteFolder, updateFolder,
    fetchMaterials, createMaterial, deleteMaterial, updateMaterial,
    fetchStoreProducts, createStoreProduct, deleteStoreProduct, updateStoreProduct,
    fetchStoreBanners, createStoreBanner, deleteStoreBanner,
    fetchSubscriptionPlans, updateSubscriptionPlan,
    Subject, Folder, Material, SubjectCategory, MaterialType, StoreProduct, StoreBanner, SubscriptionPlan
} from './services/supabase';

type View = 'dashboard' | 'students' | 'content' | 'settings' | 'operators' | 'store' | 'subscriptions';

const LOGO_URL = "https://i.ibb.co/vC4MYFFk/1770137585956.png";

// Custom Icon system migrated to ImgBB

const ROLE_CONFIG: Record<OperatorRole, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    founder: {
        label: 'Founder',
        color: 'text-amber-400',
        bg: 'bg-amber-400/10 border-amber-400/20',
        icon: <Crown size={12} />,
    },
    ceo: {
        label: 'CEO',
        color: 'text-violet-400',
        bg: 'bg-violet-400/10 border-violet-400/20',
        icon: <Star size={12} />,
    },
    owner: {
        label: 'Owner',
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10 border-cyan-400/20',
        icon: <Shield size={12} />,
    },
    supervisor: {
        label: 'Supervisor',
        color: 'text-slate-400',
        bg: 'bg-slate-400/10 border-slate-400/20',
        icon: <Zap size={12} />,
    },
    mentor: {
        label: 'Mentor',
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10 border-emerald-400/20',
        icon: <BookOpen size={12} />,
    },
    'co-founder': {
        label: 'Co-Founder',
        color: 'text-fuchsia-400',
        bg: 'bg-fuchsia-400/10 border-fuchsia-400/20',
        icon: <Crown size={12} />,
    },
    developer: {
        label: 'Developer',
        color: 'text-amber-400',
        bg: 'bg-amber-400/10 border-amber-400/20',
        icon: <Code size={12} />,
    },
};

// ─────────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────
const LoginPage: React.FC<{ onLogin: (op: Operator) => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) { setError('Enter both email and password.'); return; }
        setLoading(true);
        setError('');
        try {
            const op = await signInOperator(email, password);
            if (op) onLogin(op);
        } catch (err: any) {
            setError(err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-slate-50 dark:bg-[#050510] flex flex-col items-center justify-center p-8 relative overflow-hidden"
        >
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-700/5 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-[400px] z-10"
            >
                {/* Brand - Direct on screen */}
                <div className="flex flex-col items-center gap-6 mb-12">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-violet-600/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative w-24 h-24 rounded-[1.75rem] overflow-hidden shadow-2xl shadow-violet-900/40 border border-slate-900/10 dark:border-white/10 transform transition-transform duration-500 hover:scale-105 active:scale-95">
                            <img src={LOGO_URL} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg border border-violet-500/30">
                            <Lock size={14} className="text-slate-900 dark:text-white" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">CBSE TOPPERS</h1>
                        <p className="text-[11px] font-black text-violet-400 uppercase tracking-[0.5em] mt-3 opacity-60">Admin Terminal</p>
                    </div>
                </div>

                {/* Form - Minimal & Smooth */}
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-[0.2em] ml-1">Operator Access</label>
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-slate-900/[0.03] dark:bg-white/[0.03] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900/10 dark:placeholder:text-white/10 outline-none focus:border-violet-500/40 focus:bg-slate-900/[0.05] dark:focus:bg-white/[0.05] transition-all duration-300"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            autoComplete="email"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="Security Key"
                                className="w-full bg-slate-900/[0.03] dark:bg-white/[0.03] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl px-5 py-4 pr-14 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900/10 dark:placeholder:text-white/10 outline-none focus:border-violet-500/40 focus:bg-slate-900/[0.05] dark:focus:bg-white/[0.05] transition-all duration-300"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            />
                            <button
                                type="button"
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-900/10 dark:text-white/10 hover:text-slate-900/40 dark:hover:text-white/40 transition-colors"
                                onClick={() => setShowPass(!showPass)}
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl animate-shake"
                        >
                            <XCircle size={18} className="text-red-500 shrink-0" />
                            <p className="text-red-500 text-[11px] font-bold">{error}</p>
                        </motion.div>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-4.5 bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-violet-500 hover:text-slate-900 dark:hover:text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-xl transition-all duration-500 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? (
                            <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Authenticating...</>
                        ) : (
                            <><Shield size={16} /> Enter Terminal</>
                        )}
                    </button>
                </div>

                <p className="text-center text-[9px] text-slate-900/10 dark:text-white/10 font-black uppercase tracking-[0.3em] mt-16">
                    Restricted Access · v3.0 Final
                </p>
            </motion.div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// SIDEBAR ITEM
// ─────────────────────────────────────────────────────────────────────
const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: number }> = ({ icon, label, active, onClick, badge }) => (
    <motion.button
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all group relative ${active
            ? 'text-violet-400'
            : 'text-slate-900/30 dark:text-white/30 hover:text-slate-900/60 dark:hover:text-white/60 hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.04]'
            }`}
    >
        {active && (
            <motion.div
                layoutId="active-bg"
                className="absolute inset-0 bg-violet-600/10 border border-violet-500/20 rounded-xl"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            />
        )}
        <span className={`relative transition-all ${active ? 'text-violet-400' : 'text-slate-900/25 dark:text-white/25 group-hover:text-slate-900/50 dark:group-hover:text-white/50'}`}>{icon}</span>
        <span className="relative">{label}</span>
        {badge !== undefined && badge > 0 && (
            <span className="relative ml-auto bg-violet-500 text-slate-900 dark:text-white text-[8px] font-black px-2 py-0.5 rounded-full">{badge}</span>
        )}
        {active && <ChevronRight size={12} className="relative ml-auto text-violet-500" />}
    </motion.button>
);

// ─────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; sub: string; color: string }> = ({ label, value, icon, sub, color }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-slate-900/[0.03] dark:bg-white/[0.03] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl p-6 hover:border-slate-900/[0.12] dark:hover:border-white/[0.12] hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.05] transition-all group cursor-default shadow-sm hover:shadow-xl hover:shadow-violet-500/5"
    >
        <div className="flex items-start justify-between mb-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-current/10`} style={{ backgroundColor: 'color-mix(in srgb, currentColor 10%, transparent)' }}>
                <div className="[&>*]:w-5 [&>*]:h-5">{icon}</div>
            </div>
            <Activity size={14} className="text-slate-900/10 dark:text-white/10 group-hover:text-slate-900/20 dark:group-hover:text-white/20 transition-colors" />
        </div>
        <p className={`text-3xl font-black ${color} tracking-tighter mb-1`}>{value}</p>
        <p className="text-[11px] font-black text-slate-900/20 dark:text-white/20 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-[10px] text-slate-900/15 dark:text-white/15 font-medium">{sub}</p>
    </motion.div>
);

// ─────────────────────────────────────────────────────────────────────
// DASHBOARD VIEW
// ─────────────────────────────────────────────────────────────────────
const DashboardView: React.FC<{ stats: any; operator: Operator; onRefresh: () => void; loading: boolean; setView: (v: View) => void }> = ({ stats, operator, onRefresh, loading, setView }) => {
    const roleConf = ROLE_CONFIG[operator.role];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border mb-3 ${roleConf.bg} ${roleConf.color}`}>
                        {roleConf.icon} {roleConf.label}
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Command Center</h1>
                    <p className="text-slate-900/30 dark:text-white/30 text-sm font-medium mt-1">Welcome back, {operator.name.split(' ')[0]}. Here's your platform overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setView('content')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 border border-violet-500 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-violet-700 transition-all shadow-lg shadow-violet-900/20"
                    >
                        <Settings size={13} /> Open Content Manager
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl text-[10px] font-black text-slate-900/40 dark:text-white/40 uppercase tracking-widest hover:text-slate-900/60 dark:hover:text-white/60 hover:bg-slate-900/[0.08] dark:hover:bg-white/[0.08] transition-all"
                    >
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
                    </motion.button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-8">
                <StatCard
                    label="Students" value={stats?.studentCount ?? '—'} sub="Verified toppers"
                    icon={<Users className="text-violet-400" />} color="text-violet-400"
                />
                <StatCard
                    label="Quizzes" value={stats?.quizCount ?? '—'} sub="Total attempts"
                    icon={<Zap className="text-amber-400" />} color="text-amber-400"
                />
                <StatCard
                    label="Accuracy" value={`${stats?.accuracy ?? 0}%`} sub="Platform average"
                    icon={<BarChart3 className="text-cyan-400" />} color="text-cyan-400"
                />
                <StatCard
                    label="Status" value="Online" sub="All systems running"
                    icon={<CheckCircle2 className="text-emerald-400" />} color="text-emerald-400"
                />
            </div>

            {/* Recent Results */}
            <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-900/[0.06] dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Live Assessment Feed</h3>
                    </div>
                    <span className="text-[9px] font-black text-slate-900/20 dark:text-white/20 uppercase tracking-widest">Last 10 Results</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                                <div className="w-9 h-9 bg-slate-900/5 dark:bg-white/5 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-slate-900/5 dark:bg-white/5 rounded w-1/3" />
                                    <div className="h-2 bg-slate-900/3 dark:bg-white/3 rounded w-1/4" />
                                </div>
                            </div>
                        ))
                    ) : (stats?.recentResults || []).map((res: any, i: number) => {
                        const pct = Math.round((res.score / res.total) * 100);
                        return (
                            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-900/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                                <div className="w-9 h-9 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-sm">🎓</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{res.students?.name || 'Anonymous'}</p>
                                    <p className="text-[10px] font-bold text-slate-900/30 dark:text-white/30 uppercase tracking-wider">{res.subject} · {res.score}/{res.total}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black${pct >= 70 ? 'bg-emerald-400/10 text-emerald-400' : pct >= 50 ? 'bg-amber-400/10 text-amber-400' : 'bg-red-400/10 text-red-400'}`}>
                                        {pct}%
                                    </div>
                                    <p className="text-[9px] text-slate-900/20 dark:text-white/20 mt-1">{new Date(res.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        );
                    })}
                    {!loading && (!stats?.recentResults || stats.recentResults.length === 0) && (
                        <div className="px-6 py-12 text-center">
                            <p className="text-slate-900/20 dark:text-white/20 text-sm font-bold">No activity yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// STUDENTS VIEW
// ─────────────────────────────────────────────────────────────────────
const StudentsView: React.FC<{ students: any[]; loading: boolean }> = ({ students, loading }) => {
    const [search, setSearch] = useState('');
    const filtered = students.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.student_id?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Student Base</h1>
                    <p className="text-slate-900/30 dark:text-white/30 text-sm font-medium mt-1">{students.length} registered toppers</p>
                </div>
                <div className="relative w-full xl:w-[500px]">
                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900/25 dark:text-white/25" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or email..."
                        className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900/20 dark:placeholder:text-white/20 outline-none focus:border-violet-500/50 transition-all"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden w-full">
                {/* Desktop View Table */}
                <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-900/[0.06] dark:border-white/[0.06]">
                                {['Student ID', 'Name', 'Class & Stream', 'Email', 'Status'].map(h => (
                                    <th key={h} className="px-6 py-4 text-left text-[9px] font-black text-slate-900/20 dark:text-white/20 uppercase tracking-[0.2em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {loading ? [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(5)].map((__, j) => (
                                        <td key={j} className="px-6 py-5">
                                            <div className="h-3 bg-slate-900/5 dark:bg-white/5 rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            )) : filtered.map((s: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-6 py-4">
                                        <code className="text-[11px] font-black text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2.5 py-1 rounded-lg">{s.student_id}</code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{s.name}</p>
                                        <p className="text-[10px] text-slate-900/30 dark:text-white/30 uppercase tracking-widest">{s.gender}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-900/60 dark:text-white/60 font-medium">{s.class}</p>
                                        {s.stream && <p className="text-[10px] text-violet-400/70 uppercase tracking-wider">{s.stream}</p>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-900/30 dark:text-white/30 font-medium italic">{s.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                            <span className="text-[10px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest">Active</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Cards */}
                <div className="xl:hidden divide-y divide-white/[0.04]">
                    {loading ? [...Array(3)].map((_, i) => (
                        <div key={i} className="p-6 space-y-4 animate-pulse">
                            <div className="h-4 bg-slate-900/5 dark:bg-white/5 rounded w-1/3" />
                            <div className="h-3 bg-slate-900/5 dark:bg-white/5 rounded w-1/2" />
                            <div className="h-3 bg-slate-900/5 dark:bg-white/5 rounded w-1/4" />
                        </div>
                    )) : filtered.map((s: any, i: number) => (
                        <div key={i} className="p-5 space-y-4 hover:bg-slate-900/[0.01] dark:hover:bg-white/[0.01] transition-all">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white text-base leading-tight">{s.name}</p>
                                    <p className="text-[10px] font-bold text-slate-900/30 dark:text-white/30 uppercase tracking-widest mt-1">{s.gender} · {s.class} {s.stream && `· ${s.stream}`}</p>
                                </div>
                                <code className="text-[9px] font-black text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-md">{s.student_id}</code>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-900/[0.03] dark:border-white/[0.03]">
                                <p className="text-[11px] text-slate-900/40 dark:text-white/40 font-medium truncate max-w-[200px]">{s.email}</p>
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-lg">
                                    <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && filtered.length === 0 && (
                    <div className="py-16 text-center">
                        <p className="text-slate-900/20 dark:text-white/20 font-bold">No students found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// OPERATORS VIEW
// ─────────────────────────────────────────────────────────────────────
const OperatorsView: React.FC<{ currentOperator: Operator }> = ({ currentOperator }) => {
    const [operators, setOperators] = useState<Operator[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ email: '', name: '', role: 'founder' as OperatorRole, password: '' });
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        try { setOperators(await fetchAllOperators()); } catch (_) { }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleAdd = async () => {
        if (!form.email || !form.name || !form.password) { setError('All fields are required.'); return; }
        setAdding(true); setError(''); setSuccess('');
        try {
            await createOperator(form);
            setSuccess(`${form.name} has been added as ${form.role}.`);
            setForm({ email: '', name: '', role: 'founder', password: '' });
            setShowAdd(false);
            await load();
        } catch (e: any) {
            setError(e.message || 'Failed to add operator.');
        } finally { setAdding(false); }
    };

    const handleDelete = async (op: Operator) => {
        if (op.id === currentOperator.id) { setError("You can't remove yourself."); return; }
        if (!confirm(`Remove ${op.name} (${op.role})?`)) return;
        try {
            await deleteOperator(op.id);
            await load();
        } catch (_) { setError('Failed to remove operator.'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Operators</h1>
                    <p className="text-slate-900/30 dark:text-white/30 text-sm font-medium mt-1">Manage platform access · CEO · Founder · Owner only</p>
                </div>
                <button
                    onClick={() => { setShowAdd(true); setError(''); setSuccess(''); }}
                    className="flex items-center gap-2 px-5 py-3 bg-violet-600/80 hover:bg-violet-600 border border-violet-500/30 text-slate-900 dark:text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-violet-900/20"
                >
                    <Plus size={14} /> Add Operator
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <XCircle size={16} className="text-red-400 shrink-0" />
                    <p className="text-red-400 text-xs font-bold">{error}</p>
                    <button onClick={() => setError('')} className="ml-auto text-red-400/60 hover:text-red-400"><XCircle size={14} /></button>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <p className="text-emerald-400 text-xs font-bold">{success}</p>
                </div>
            )}

            {/* Add Form Modal */}
            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowAdd(false)} />
                    <div className="relative bg-white dark:bg-[#0a0a1a] border border-slate-900/10 dark:border-white/10 rounded-3xl p-8 w-full max-w-md z-10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-violet-600/20 text-violet-400 rounded-xl flex items-center justify-center">
                                <Plus size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">New Operator</h3>
                                <p className="text-[10px] text-slate-900/30 dark:text-white/30 font-bold uppercase tracking-widest">Grant platform access</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
                                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'operator@domain.com' },
                                { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">{f.label}</label>
                                    <input
                                        type={f.type} placeholder={f.placeholder}
                                        className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900/20 dark:placeholder:text-white/20 outline-none focus:border-violet-500/50 transition-all"
                                        value={(form as any)[f.key]}
                                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Role</label>
                                <select
                                    className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all"
                                    value={form.role}
                                    onChange={e => setForm(p => ({ ...p, role: e.target.value as OperatorRole }))}
                                >
                                    <option value="founder">Founder</option>
                                    <option value="ceo">CEO</option>
                                    <option value="owner">Owner</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowAdd(false)} className="flex-1 py-3 border border-slate-900/10 dark:border-white/10 text-slate-900/40 dark:text-white/40 font-black uppercase text-[10px] tracking-widest rounded-xl hover:border-slate-900/20 dark:hover:border-white/20 hover:text-slate-900/60 dark:hover:text-white/60 transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={adding}
                                className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-slate-900 dark:text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {adding ? <div className="w-4 h-4 border-2 border-slate-900/30 dark:border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={14} />}
                                {adding ? 'Adding...' : 'Add Operator'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Operators Table */}
            <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="divide-y divide-white/[0.04]">
                    {loading ? [...Array(3)].map((_, i) => (
                        <div key={i} className="px-6 py-5 flex items-center gap-4 animate-pulse">
                            <div className="w-10 h-10 bg-slate-900/5 dark:bg-white/5 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-slate-900/5 dark:bg-white/5 rounded w-1/4" />
                                <div className="h-2 bg-slate-900/3 dark:bg-white/3 rounded w-1/3" />
                            </div>
                        </div>
                    )) : operators.map(op => {
                        const rc = ROLE_CONFIG[op.role];
                        const isYou = op.id === currentOperator.id;
                        return (
                            <div key={op.id} className="px-6 py-5 flex items-center gap-4 hover:bg-slate-900/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                <div className="w-10 h-10 bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/20 rounded-xl flex items-center justify-center text-lg font-black text-violet-400">
                                    {op.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{op.name}</p>
                                        {isYou && <span className="text-[8px] font-black text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-full uppercase tracking-widest">You</span>}
                                    </div>
                                    <p className="text-[11px] text-slate-900/30 dark:text-white/30 font-medium">{op.email}</p>
                                    {op.student_id && (
                                        <p className="text-[9px] text-cyan-400/60 font-bold uppercase tracking-widest mt-0.5">🔗 Linked to Student: {op.student_id}</p>
                                    )}
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border${rc.bg}${rc.color}`}>
                                    {rc.icon} {rc.label}
                                </div>
                                <p className="text-[10px] text-slate-900/20 dark:text-white/20 hidden md:block">{new Date(op.created_at).toLocaleDateString('en-IN')}</p>
                                {!isYou && (
                                    <button
                                        onClick={() => handleDelete(op)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-900/20 dark:text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    {!loading && operators.length === 0 && (
                        <div className="py-16 text-center"><p className="text-slate-900/20 dark:text-white/20 font-bold">No operators found</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// CONTENT MANAGER VIEW (IFRAME)
// ─────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────
// CONTENT MANAGER VIEW (NATIVE)
// ─────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────
// CONTENT MANAGER VIEW (STRICT REBUILD)
// ─────────────────────────────────────────────────────────────────────
const ContentView: React.FC = () => {
    const [view, setView] = useState<'subjects' | 'folders'>('subjects');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
    const [path, setPath] = useState<Folder[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [downloading, setDownloading] = useState<string | null>(null);
    const [subSearch, setSubSearch] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [filterStream, setFilterStream] = useState('');
    const [filterExam, setFilterExam] = useState('');
    const [creationStep, setCreationStep] = useState(0); // 0: Select Target, 1: Form
    const [targetType, setTargetType] = useState<string>(''); // 'JEE', 'CUET', 'NEET', 'CBSE'

    const handleDownload = async (url: string, title: string) => {
        if (downloading) return;
        setDownloading(url);
        try {
            // Google Drive direct download link replacement
            let downloadUrl = url;
            if (url.includes('drive.google.com')) {
                downloadUrl = url.replace(/\/preview$/, '/view').replace(/\/view(\?.*)?$/, '/view?export=download');
            }

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${title}.pdf`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error('Download failed', e);
        } finally {
            setDownloading(null);
        }
    };
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [subForm, setSubForm] = useState<Partial<Subject>>({
        category: 'Core',
        target_classes: [],
        target_streams: [],
        target_exams: [],
        icon_url: '/assets/subjects/relativity.png'
    });
    const [folderForm, setFolderForm] = useState({ name: '' });
    const [materialForm, setMaterialForm] = useState<Partial<Material>>({ type: 'pdf', title: '', url: '' });
    const [addType, setAddType] = useState<'subfolder' | 'pdf' | 'image' | 'video'>('subfolder');

    const classes = ['IX', 'X', 'XI', 'XII', 'XII+'];
    const streams = ['PCM', 'PCB', 'PCBM'];
    const exams = ['JEE', 'CUET', 'NEET'];

    const loadSubjects = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchSubjects();
            setSubjects(data);
        } catch (_) { }
        setLoading(false);
    }, []);

    const loadFolderContent = useCallback(async (subjectId: string, parentId: string | null) => {
        setLoading(true);
        try {
            const [f, m] = await Promise.all([
                fetchFolders(subjectId, parentId),
                fetchMaterials(subjectId, parentId)
            ]);
            setFolders(f);
            setMaterials(m);
        } catch (_) { }
        setLoading(false);
    }, []);

    useEffect(() => { loadSubjects(); }, [loadSubjects]);

    const handleAddSubject = async () => {
        if (!subForm.name || !subForm.code) return alert('Name and Code required');
        
        const hasClasses = subForm.target_classes && subForm.target_classes.length > 0;
        const hasExams = subForm.target_exams && subForm.target_exams.length > 0;
        
        if (!hasClasses && !hasExams) return alert('Target selection mandatory: Select at least one school class or competitive exam');

        const hasHigher = subForm.target_classes?.some(c => ['XI', 'XII', 'XII+'].includes(c));

        if (subForm.category === 'Core' && !hasExams) {
            if (hasHigher && (!subForm.target_streams || subForm.target_streams.length === 0)) {
                return alert('Stream is mandatory for Class XI/XII Core subjects');
            }
        }

        const finalData = { ...subForm };
        if (subForm.category === 'Additional') {
            finalData.target_stream = undefined;
            finalData.target_streams = [];
        }

        try {
            if (isEditing && editingId) {
                await updateSubject(editingId, finalData);
            } else {
                await createSubject({ ...finalData, order_index: subjects.length });
            }
            setIsAdding(false);
            setIsEditing(false);
            setEditingId(null);
            loadSubjects();
        } catch (e: any) { alert(e.message || 'Error saving subject'); }
    };

    const handleAddFolder = async () => {
        if (!folderForm.name || !currentSubject) return;
        try {
            if (isEditing && editingId) {
                await updateFolder(editingId, { name: folderForm.name });
            } else {
                await createFolder({
                    subject_id: currentSubject.id,
                    parent_id: path[path.length - 1]?.id || null,
                    name: folderForm.name,
                    order_index: folders.length
                });
            }
            setFolderForm({ name: '' });
            setIsAdding(false);
            setIsEditing(false);
            setEditingId(null);
            loadFolderContent(currentSubject.id, path[path.length - 1]?.id || null);
        } catch (_) { alert('Error saving folder'); }
    };

    const handleAddMaterial = async () => {
        const parentFolder = path[path.length - 1];
        if (!currentSubject || !materialForm.title || !materialForm.url) return alert('Fill all fields');

        let finalUrl = materialForm.url;
        if (finalUrl.includes('drive.google.com')) {
            finalUrl = finalUrl.replace(/\/view(\?.*)?$/, '/preview');
            if (finalUrl.includes('/d/')) {
                const parts = finalUrl.split('/d/');
                if (parts[1] && !parts[1].includes('/preview')) {
                    const fileId = parts[1].split('/')[0];
                    finalUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                }
            }
        }

        try {
            if (isEditing && editingId) {
                await updateMaterial(editingId, { ...materialForm, url: finalUrl });
            } else {
                await createMaterial({
                    ...materialForm,
                    url: finalUrl,
                    subject_id: currentSubject.id,
                    folder_id: parentFolder?.id || null,
                    order_index: materials.length
                });
            }
            setMaterialForm({ type: 'pdf', title: '', url: '' });
            setIsAdding(false);
            setIsEditing(false);
            setEditingId(null);
            loadFolderContent(currentSubject.id, parentFolder?.id || null);
        } catch (_) { alert('Error saving material'); }
    };

    const startEditSubject = (s: Subject) => {
        setSubForm(s);
        setEditingId(s.id);
        setIsEditing(true);
        // Determine targetType from metadata
        const hasExams = s.target_exams && s.target_exams.length > 0;
        setTargetType(hasExams ? (s.target_exams?.[0] || '') : 'CBSE');
        setCreationStep(1);
        setIsAdding(true);
    };

    const startEditFolder = (f: Folder) => {
        setFolderForm({ name: f.name });
        setEditingId(f.id);
        setAddType('subfolder');
        setIsEditing(true);
        setIsAdding(true);
    };

    const startEditMaterial = (m: Material) => {
        setMaterialForm({ title: m.title, url: m.url, type: m.type });
        setEditingId(m.id);
        setAddType(m.type as any);
        setIsEditing(true);
        setIsAdding(true);
    };

    const handleReorder = async (type: 'subject' | 'folder' | 'material', direction: 'up' | 'down', item: any) => {
        let list: any[] = [];
        if (type === 'subject') list = subjects;
        else if (type === 'folder') list = folders;
        else list = materials;

        const idx = list.findIndex(i => i.id === item.id);
        if (direction === 'up' && idx === 0) return;
        if (direction === 'down' && idx === list.length - 1) return;

        const otherIdx = direction === 'up' ? idx - 1 : idx + 1;
        const otherItem = list[otherIdx];

        const tempIndex = item.order_index;
        const newItemOrder = otherItem.order_index;
        const newOtherOrder = tempIndex;

        try {
            if (type === 'subject') {
                await Promise.all([updateSubject(item.id, { order_index: newItemOrder }), updateSubject(otherItem.id, { order_index: newOtherOrder })]);
                loadSubjects();
            } else if (type === 'folder') {
                await Promise.all([updateFolder(item.id, { order_index: newItemOrder }), updateFolder(otherItem.id, { order_index: newOtherOrder })]);
                loadFolderContent(currentSubject!.id, path[path.length - 1]?.id || null);
            } else {
                await Promise.all([updateMaterial(item.id, { order_index: newItemOrder }), updateMaterial(otherItem.id, { order_index: newOtherOrder })]);
                loadFolderContent(currentSubject!.id, path[path.length - 1]?.id || null);
            }
        } catch (_) { alert('Ordering Failed'); }
    };

    const drillDownSubject = (s: Subject) => {
        setCurrentSubject(s);
        setPath([]);
        setView('folders');
        loadFolderContent(s.id, null);
    };

    const drillDownFolder = (f: Folder) => {
        setPath([...path, f]);
        loadFolderContent(currentSubject!.id, f.id);
    };

    const navigateTo = (f: Folder, idx: number) => {
        const newPath = path.slice(0, idx + 1);
        setPath(newPath);
        loadFolderContent(currentSubject!.id, f.id);
    };

    const navigateRoot = () => {
        setPath([]);
        loadFolderContent(currentSubject!.id, null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        {view === 'subjects' ? 'Subjects Portal' : currentSubject?.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        {view === 'folders' && (
                            <button onClick={() => { setView('subjects'); setCurrentSubject(null); }} className="text-[10px] font-black text-violet-500 uppercase flex items-center gap-1 hover:underline">
                                <ChevronRight size={12} className="rotate-180" /> Subjects
                            </button>
                        )}
                        <p className="text-slate-900/30 dark:text-white/30 text-sm font-medium">
                            {view === 'subjects' ? 'Define core and additional project structures.' : 'Manage folders and materials hierarchy.'}
                        </p>
                    </div>
                </div>
                {view === 'subjects' ? (
                    <button onClick={() => { 
                        setIsEditing(false); 
                        setEditingId(null); 
                        setCreationStep(0);
                        setTargetType('');
                        setSubForm({ 
                            name: '', 
                            code: '', 
                            category: 'Core', 
                            target_classes: [], 
                            target_streams: [], 
                            target_exams: [], 
                            icon_url: '' 
                        }); 
                        setIsAdding(true); 
                    }} className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                        <Plus size={14} /> New Subject
                    </button>
                ) : (
                    <button onClick={() => { setIsEditing(false); setEditingId(null); setAddType('subfolder'); setFolderForm({ name: '' }); setMaterialForm({ type: 'pdf', title: '', url: '' }); setIsAdding(true); }} className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                        <Plus size={14} /> Add Content
                    </button>
                )}
            </div>

            {/* Path / Breadcrumbs for Folders */}
            {view === 'folders' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/[0.03] dark:bg-white/[0.03] rounded-xl overflow-x-auto no-scrollbar">
                    <button onClick={navigateRoot} className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${path.length === 0 ? 'text-violet-500' : 'text-slate-400'}`}>Roots</button>
                    {path.map((f, i) => (
                        <React.Fragment key={f.id}>
                            <ChevronRight size={10} className="text-slate-300 shrink-0" />
                            <button onClick={() => navigateTo(f, i)} className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${i === path.length - 1 ? 'text-violet-500' : 'text-slate-400'}`}>{f.name}</button>
                        </React.Fragment>
                    ))}
                </div>
            )}

            {view === 'subjects' && (
                <div className="space-y-4">
                    <div className="relative group">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Filter subjects by name or reference code..." 
                            className="w-full bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl pl-11 pr-4 py-3.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-400/60 focus:bg-white dark:focus:bg-white/[0.05] focus:border-violet-500/50 transition-all outline-none shadow-sm"
                            value={subSearch}
                            onChange={e => setSubSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/[0.03] dark:bg-white/[0.03] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-xl">
                            <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest border-r border-slate-400/20 pr-1.5 mr-0.5 whitespace-nowrap">Filter</label>
                            
                            <select className="bg-transparent border-none text-[10px] font-black text-slate-600 dark:text-slate-300 outline-none uppercase cursor-pointer" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                                <option value="" className="bg-slate-900 text-white">Class: All</option>
                                {['IX', 'X', 'XI', 'XII', 'XII+'].map(c => <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>)}
                            </select>

                            <span className="w-1 h-1 rounded-full bg-slate-400/20 mx-1.5"></span>

                            <select className="bg-transparent border-none text-[10px] font-black text-slate-600 dark:text-slate-300 outline-none uppercase cursor-pointer" value={filterStream} onChange={e => setFilterStream(e.target.value)}>
                                <option value="" className="bg-slate-900 text-white">Stream: All</option>
                                {streams.map(s => <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>)}
                            </select>
                            
                            <span className="w-1 h-1 rounded-full bg-slate-400/20 mx-1.5"></span>

                            <select className="bg-transparent border-none text-[10px] font-black text-slate-600 dark:text-slate-300 outline-none uppercase cursor-pointer" value={filterExam} onChange={e => setFilterExam(e.target.value)}>
                                <option value="" className="bg-slate-900 text-white">Exam: All</option>
                                {exams.map(ex => <option key={ex} value={ex} className="bg-slate-900 text-white">{ex}</option>)}
                            </select>
                        </div>
                        
                        {(filterClass || filterStream || filterExam || subSearch) && (
                            <button onClick={() => { setFilterClass(''); setFilterStream(''); setFilterExam(''); setSubSearch(''); }} className="px-3 py-1.5 text-[9px] font-black uppercase text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-1.5">
                                <RefreshCw size={10} /> Reset
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Forms Overlay */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-[#0c0c14] border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white shadow-sm">
                                {isEditing ? 'Modify Content Node' : (view === 'subjects' ? 'Direct Subject Creation' : 'Structure / Content Node')}
                            </h2>

                            {view === 'subjects' ? (
                                <>
                                    {!isEditing && creationStep === 0 ? (
                                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Step 1: Choose Primary Target Context</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                {['CBSE', 'JEE', 'NEET', 'CUET'].map(target => (
                                                    <button
                                                        key={target}
                                                        onClick={() => {
                                                            setTargetType(target);
                                                            setCreationStep(1);
                                                            if (target !== 'CBSE') {
                                                                setSubForm({
                                                                    ...subForm,
                                                                    category: 'Core',
                                                                    code: `${target}-MAIN`,
                                                                    target_exams: [target],
                                                                    target_classes: []  // Competitive exams only appear in exam sections, not in class sections
                                                                });
                                                            } else {
                                                                setSubForm({
                                                                    ...subForm,
                                                                    category: 'Core',
                                                                    code: '',
                                                                    target_exams: [],
                                                                    target_classes: []
                                                                });
                                                            }
                                                        }}
                                                        className="group relative h-32 rounded-2xl border-2 border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] hover:bg-violet-600 hover:border-violet-500 transition-all flex flex-col items-center justify-center gap-3 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-900/40"
                                                    >
                                                        <div className="text-2xl font-black italic tracking-tighter opacity-20 group-hover:opacity-100 transition-all scale-150 absolute -right-2 -bottom-2 group-hover:scale-110">
                                                            {target}
                                                        </div>
                                                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                                                            {target === 'CBSE' ? <BookOpen className="text-violet-500 group-hover:text-white" /> : <TrendingUp className="text-violet-500 group-hover:text-white" />}
                                                        </div>
                                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-white">{target} FLOW</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-5 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="flex items-center gap-3 p-3 bg-violet-600/10 border border-violet-500/20 rounded-2xl">
                                                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-black text-white text-[10px] italic">{targetType || 'META'}</div>
                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase text-violet-500 tracking-widest">Selected Context</h4>
                                                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Building for {targetType} Ecosystem</p>
                                                </div>
                                                {!isEditing && (
                                                    <button onClick={() => setCreationStep(0)} className="ml-auto p-2 hover:bg-violet-600/20 rounded-lg transition-all text-violet-500">
                                                        <XCircle size={14} />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    {targetType === 'CBSE' && (
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Type</label>
                                                            <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={subForm.category} onChange={e => setSubForm({ ...subForm, category: e.target.value as SubjectCategory })}>
                                                                <option value="Core">Core Subject</option>
                                                                <option value="Additional">Additional Subject</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                    {targetType === 'CBSE' && (
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Ref Code</label>
                                                            <input type="text" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={subForm.code} onChange={e => setSubForm({ ...subForm, code: e.target.value })} placeholder="e.g. MAT-041" />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Display Name</label>
                                                    <input type="text" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={subForm.name} onChange={e => setSubForm({ ...subForm, name: e.target.value })} placeholder={targetType === 'CBSE' ? "e.g. Physics" : "e.g. JEE Physics Mastery"} />
                                                </div>

                                                {/* ImgBB Custom Icon Upload */}
                                                <div className="space-y-3 p-5 bg-slate-900/[0.03] dark:bg-white/[0.03] rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                                                    <label className="text-[9px] font-black uppercase text-violet-500 ml-1 flex items-center gap-1.5"><ImageIcon size={10} /> Brand Representation Icon</label>
                                                    <div className="flex gap-4">
                                                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                                                            {subForm.icon_url ? (
                                                                <img src={subForm.icon_url} alt="Icon" className="w-full h-full object-contain" />
                                                            ) : (
                                                                <ImageIcon size={24} className="text-slate-300 dark:text-white/10" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="relative group cursor-pointer">
                                                                <input 
                                                                    type="file" 
                                                                    accept="image/*"
                                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (!file) return;
                                                                        try {
                                                                            const formData = new FormData();
                                                                            formData.append('image', file);
                                                                            const res = await fetch(`https://api.imgbb.com/1/upload?key=af5ca570bb7a1562dae8ef0c7f01a585`, {
                                                                                method: 'POST',
                                                                                body: formData
                                                                            });
                                                                            const data = await res.json();
                                                                            if (data.data?.url) setSubForm({ ...subForm, icon_url: data.data.url });
                                                                        } catch (_) { alert('Icon upload failed'); }
                                                                    }}
                                                                />
                                                                <div className="w-full py-2.5 px-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase text-center text-slate-500 group-hover:border-violet-500 transition-all flex items-center justify-center gap-2">
                                                                    <UploadCloud size={14} className="text-violet-500" /> Upload New Graphic
                                                                </div>
                                                            </div>
                                                            <p className="text-[8px] italic text-slate-400 px-1">ImgBB Host Enabled. Best size: 512x512 PNG.</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {targetType === 'CBSE' && (
                                                    <>
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Target Classes</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {classes.map(c => {
                                                                    const isSelected = subForm.target_classes?.includes(c);
                                                                    return (
                                                                        <button key={c} type="button" onClick={() => setSubForm(prev => {
                                                                            const current = prev.target_classes || [];
                                                                            const next = isSelected ? current.filter((x: string) => x !== c) : [...current, c];
                                                                            return { ...prev, target_classes: next };
                                                                        })} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${isSelected ? 'bg-violet-600 border-violet-500 text-white shadow-lg' : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-400 opacity-60'}`}>{c}</button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {subForm.target_classes?.some(c => ['XI', 'XII', 'XII+'].includes(c)) && (
                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Target Streams</label>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {streams.map(s => {
                                                                        const isSelected = subForm.target_streams?.includes(s);
                                                                        return (
                                                                            <button key={s} type="button" onClick={() => setSubForm(prev => {
                                                                                const current = prev.target_streams || [];
                                                                                const next = isSelected ? current.filter((x: string) => x !== s) : [...current, s];
                                                                                return { ...prev, target_streams: next };
                                                                            })} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${isSelected ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg' : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-400 opacity-60'}`}>{s}</button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            <button onClick={handleAddSubject} className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all mt-4">{isEditing ? 'Sync Content Node' : 'Initialize Subject Hierarchy'}</button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Content Type</label>
                                        <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={addType} onChange={e => {
                                            const t = e.target.value as 'subfolder' | 'pdf' | 'image' | 'video';
                                            setAddType(t);
                                            if (t !== 'subfolder') setMaterialForm({ ...materialForm, type: t as MaterialType });
                                        }}>
                                            <option value="subfolder">Subfolder</option>
                                            <option value="pdf">PDF Document</option>
                                            <option value="image">Image File</option>
                                            <option value="video">YouTube Video</option>
                                        </select>
                                    </div>

                                    {addType === 'subfolder' ? (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Folder Name</label>
                                                <input type="text" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={folderForm.name} onChange={e => setFolderForm({ name: e.target.value })} placeholder="e.g. Notes, Videos, Practice" />
                                            </div>
                                            <button onClick={handleAddFolder} className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">{isEditing ? 'Update Folder' : 'Create Subfolder'}</button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Title</label>
                                                <input type="text" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={materialForm.title} onChange={e => setMaterialForm({ ...materialForm, title: e.target.value })} placeholder="e.g. Chapter 1 Summary" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">{addType === 'video' ? 'YouTube URL' : 'File Direct URL'}</label>
                                                <input type="text" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={materialForm.url} onChange={e => setMaterialForm({ ...materialForm, url: e.target.value })} placeholder="https://..." />
                                            </div>
                                            <button onClick={handleAddMaterial} className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">{isEditing ? 'Save Changes' : 'Publish Content'}</button>
                                        </>
                                    )}
                                </div>
                            )}

                            <button onClick={() => { setIsAdding(false); setIsEditing(false); setEditingId(null); setMaterialForm({ type: 'pdf', title: '', url: '' }); }} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-400 transition-colors">Dismiss</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Content List */}
            <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-3xl overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="p-12 flex flex-col items-center gap-4">
                        <RefreshCw className="animate-spin text-violet-500" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refreshing Data Store...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-900/[0.04] dark:divide-white/[0.04]">
                                 {view === 'subjects' ? (
                            subjects.length === 0 ? (
                                <div className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">Empty Data Store</div>
                            ) : subjects.filter(s => {
                                const name = s.name.toLowerCase();
                                const code = s.code.toLowerCase();
                                const query = subSearch.toLowerCase();
                                const matchesSearch = name.includes(query) || code.includes(query);
                                const matchesClass = !filterClass || s.target_classes?.includes(filterClass);
                                const matchesStream = !filterStream || s.target_streams?.includes(filterStream);
                                const matchesExam = !filterExam || s.target_exams?.includes(filterExam);
                                return matchesSearch && matchesClass && matchesStream && matchesExam;
                            }).map(s => (
                                <div key={s.id} onClick={() => drillDownSubject(s)} className="p-6 flex items-center justify-between hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.03] transition-all cursor-pointer group border-l-4 border-transparent hover:border-violet-500">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-white/5 dark:bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform overflow-hidden shadow-sm">
                                            <img src={s.icon_url || '/assets/subjects/relativity.png'} className="w-full h-full object-contain filter drop-shadow-sm" onError={(e) => (e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/3426/3426653.png')} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[8px] font-black bg-slate-900/10 dark:bg-white/10 text-slate-500 px-2 py-0.5 rounded uppercase">{s.code}</span>
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${s.category === 'Core' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'}`}>{s.category}</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {s.target_classes?.map(c => <span key={c} className="text-[7px] font-black border border-slate-500/20 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded uppercase">{c}</span>)}
                                                    {s.target_streams?.map(st => <span key={st} className="text-[7px] font-black border border-cyan-500/20 text-cyan-500 px-1.5 py-0.5 rounded uppercase">{st}</span>)}
                                                    {s.target_exams?.map(ex => <span key={ex} className="text-[7px] font-black border border-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded uppercase">{ex}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col gap-1 mr-2">
                                            <button onClick={(e) => { e.stopPropagation(); handleReorder('subject', 'up', s); }} className="p-1 text-slate-300 hover:text-violet-500 transition-colors"><ChevronUp size={12} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleReorder('subject', 'down', s); }} className="p-1 text-slate-300 hover:text-violet-500 transition-colors"><ChevronDown size={12} /></button>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); startEditSubject(s); }} className="p-2 text-slate-300 hover:text-violet-500 transition-colors opacity-0 group-hover:opacity-100"><Pencil size={16} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteSubject(s.id).then(loadSubjects); }} className="p-2 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="divide-y divide-slate-900/[0.04] dark:divide-white/[0.04]">
                                {folders.map((f, i) => (
                                    <div key={f.id} onClick={() => drillDownFolder(f)} className="p-6 flex items-center justify-between hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-violet-600/10 rounded-xl flex items-center justify-center text-violet-600 transition-transform group-hover:scale-110">📂</div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{f.name}</h4>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Subfolder</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => { e.stopPropagation(); handleReorder('folder', 'up', f); }} className="p-1 text-slate-300 hover:text-violet-500 transition-colors"><ChevronUp size={12} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleReorder('folder', 'down', f); }} className="p-1 text-slate-300 hover:text-violet-500 transition-colors"><ChevronDown size={12} /></button>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); startEditFolder(f); }} className="p-2 text-slate-300 hover:text-violet-500 transition-colors opacity-0 group-hover:opacity-100"><Pencil size={16} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); deleteFolder(f.id).then(() => loadFolderContent(currentSubject!.id, path[path.length - 1]?.id || null)); }} className="p-2 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                                {materials.map((m, i) => (
                                    <div key={m.id} className="p-6 flex items-center justify-between hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.03] transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${m.type === 'pdf' ? 'bg-blue-600/10 text-blue-600' : m.type === 'video' ? 'bg-red-600/10 text-red-600' : 'bg-green-600/10 text-green-600'}`}>
                                                {m.type === 'pdf' ? <Download size={20} /> : m.type === 'video' ? <Eye size={20} /> : <BookOpen size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{m.title}</h4>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{m.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => { e.stopPropagation(); handleReorder('material', 'up', m); }} className="p-1 text-slate-300 hover:text-violet-500 transition-colors"><ChevronUp size={12} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleReorder('material', 'down', m); }} className="p-1 text-slate-300 hover:text-violet-500 transition-colors"><ChevronDown size={12} /></button>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); startEditMaterial(m); }} className="p-2 text-slate-300 hover:text-violet-500 transition-colors opacity-0 group-hover:opacity-100"><Pencil size={16} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); deleteMaterial(m.id).then(() => loadFolderContent(currentSubject!.id, path[path.length - 1]?.id || null)); }} className="p-2 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                                {folders.length === 0 && materials.length === 0 && (
                                    <div className="py-20 text-center text-slate-400 text-xs font-bold">This node is empty.</div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// SETTINGS VIEW
// ─────────────────────────────────────────────────────────────────────
const SettingsView: React.FC = () => {
    const [maintenance, setMaintenance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchMaintenanceSettings().then(d => { setMaintenance(d); setLoading(false); });
    }, []);

    const toggle = async () => {
        if (!maintenance) return;
        const newState = !maintenance.maintenance_enabled;
        try {
            await updateMaintenanceSettings({ ...maintenance, maintenance_enabled: newState });
            setMaintenance((p: any) => ({ ...p, maintenance_enabled: newState }));
            setMsg({ type: 'success', text: newState ? 'Maintenance mode activated.' : 'Platform is now live!' });
        } catch (_) {
            setMsg({ type: 'error', text: 'Failed to toggle maintenance.' });
        }
        setTimeout(() => setMsg(null), 3000);
    };

    const save = async () => {
        if (!maintenance) return;
        setSaving(true);
        try {
            await updateMaintenanceSettings(maintenance);
            setMsg({ type: 'success', text: 'Settings pushed to platform successfully! ✅' });
        } catch (e: any) {
            console.error('Save settings error:', e);
            setMsg({ type: 'error', text: 'Failed to save. Check permission.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMsg(null), 3000);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Platform Settings</h1>
                <p className="text-slate-900/30 dark:text-white/30 text-sm font-medium mt-1">Control maintenance mode and global system variables.</p>
            </div>

            {msg && (
                <div className={`flex items-center gap-3 p-4 rounded-xl border${msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    {msg.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-red-400" />}
                    <p className={`text-xs font-bold${msg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Toggle Card */}
                <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all${maintenance?.maintenance_enabled ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Maintenance Mode</h3>
                            <p className="text-[10px] text-slate-900/30 dark:text-white/30 font-medium">Toggle platform access.</p>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center gap-3${maintenance?.maintenance_enabled ? 'bg-red-500/5 border-red-500/15' : 'bg-emerald-500/5 border-emerald-500/15'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full${maintenance?.maintenance_enabled ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest${maintenance?.maintenance_enabled ? 'text-red-400' : 'text-emerald-400'}`}>
                            {loading ? 'Loading...' : maintenance?.maintenance_enabled ? 'Emergency Shutdown Active' : 'Normal Operations'}
                        </span>
                    </div>

                    <button
                        onClick={toggle}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 border${maintenance?.maintenance_enabled
                            ? 'bg-slate-900/5 dark:bg-white/5 border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-900/10 dark:hover:bg-white/10'
                            : 'bg-gradient-to-r from-red-600/80 to-rose-600/80 border-red-500/20 text-slate-900 dark:text-white hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-900/20'
                            }`}
                    >
                        {maintenance?.maintenance_enabled ? '✅ Restore Platform Access' : '🔴 Emergency Grid Shutdown'}
                    </button>
                </div>

                {/* Message & Schedule Card */}
                <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl p-6 space-y-5">
                    <div className="flex items-center gap-3">
                        <MessageSquare size={18} className="text-violet-400" />
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Smart Scheduling</h3>
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-2 block">Maintenance Message</label>
                        <textarea
                            className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900/20 dark:placeholder:text-white/20 outline-none focus:border-violet-500/50 transition-all min-h-[90px] resize-none"
                            placeholder="We'll be back soon..."
                            value={maintenance?.maintenance_message || ''}
                            onChange={e => setMaintenance((p: any) => ({ ...p, maintenance_message: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-2 block">Auto Re-Open Time</label>
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900/25 dark:text-white/25" />
                            <input
                                type="datetime-local"
                                className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all [color-scheme:dark]"
                                value={maintenance?.maintenance_opening_date
                                    ? new Date(new Date(maintenance.maintenance_opening_date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
                                    : ''}
                                onChange={e => setMaintenance((p: any) => ({ ...p, maintenance_opening_date: e.target.value || null }))}
                            />
                        </div>
                        <p className="text-[8px] text-violet-400/50 font-bold uppercase tracking-widest ml-1 mt-1.5">✨ App auto-activates at this time.</p>
                    </div>

                    <button
                        onClick={save}
                        disabled={saving || loading}
                        className="w-full py-3.5 bg-violet-600/80 hover:bg-violet-600 border border-violet-500/20 text-slate-900 dark:text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20"
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-slate-900/30 dark:border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={14} />}
                        {saving ? 'Pushing...' : 'Push to Platform'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// BANNER MANAGER
// ─────────────────────────────────────────────────────────────────────
const BannerManager: React.FC = () => {
    const [banners, setBanners] = useState<StoreBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const loadBanners = async () => {
        setLoading(true);
        try { const data = await fetchStoreBanners(); setBanners(data); } catch (_) { }
        setLoading(false);
    };

    useEffect(() => { loadBanners(); }, []);

    const handleAdd = async () => {
        if (!url) return;
        try {
            await createStoreBanner({ image_url: url, order_index: banners.length });
            setUrl('');
            loadBanners();
        } catch (e: any) { alert(e.message); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this banner?')) return;
        try { await deleteStoreBanner(id); loadBanners(); } catch (_) { alert('Error deleting banner'); }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('image', file);
        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=af5ca570bb7a1562dae8ef0c7f01a585`, { method: 'POST', body: fd });
            const result = await res.json();
            if (result.success) setUrl(result.data.url);
        } catch (_) { }
        setUploading(false);
    };

    return (
        <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl p-6 space-y-4 mb-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ImageIcon size={18} className="text-violet-400" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Store Promotional Banners</h3>
                </div>
                <p className="text-[10px] text-slate-900/30 dark:text-white/30 font-bold uppercase tracking-widest">Auto-looping Slide Show</p>
            </div>

            <div className="flex gap-3">
                <input
                    className="flex-1 bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all font-mono"
                    placeholder="Enter Banner Image URL..."
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                />
                <label className="shrink-0">
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                    <div className="h-[46px] px-4 rounded-xl border border-dashed border-violet-500/30 flex items-center justify-center cursor-pointer hover:bg-violet-600/5 text-violet-400">
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                    </div>
                </label>
                <button
                    onClick={handleAdd}
                    className="px-6 py-3 bg-violet-600 border border-violet-500/30 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    disabled={!url || uploading}
                >
                    Add
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {banners.map(b => (
                    <div key={b.id} className="group relative rounded-xl overflow-hidden aspect-[16/9] border border-slate-900/10 dark:border-white/10 shadow-sm transition-all hover:scale-[1.02] bg-slate-900/10">
                        <img src={b.image_url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => handleDelete(b.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all scale-75 group-hover:scale-100">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                {loading && [1, 2, 3].map(i => <div key={i} className="aspect-[16/9] bg-slate-100 dark:bg-white/5 animate-pulse rounded-xl" />)}
                {!loading && banners.length === 0 && (
                    <div className="col-span-full py-8 border border-dashed border-slate-900/10 dark:border-white/10 rounded-xl flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon size={24} className="opacity-20 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">No Banners Added</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// STORE VIEW
// ─────────────────────────────────────────────────────────────────────
const StoreView: React.FC = () => {
    const [products, setProducts] = useState<StoreProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const [form, setForm] = useState<Partial<StoreProduct>>({
        name: '',
        description: '',
        image_url: '',
        image_urls: [],
        file_url: '',
        preview_url: '',
        mrp: 0,
        selling_price: 0,
        stock_status: 'In Stock',
        category: 'CBSE',
    });

    const [uploadingIdx, setUploadingIdx] = useState<number | 'main' | null>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingIdx(target);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=af5ca570bb7a1562dae8ef0c7f01a585`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (result.success) {
                if (target === 'main') {
                    setForm(p => ({ ...p, image_url: result.data.url }));
                } else {
                    const next = [...(form.image_urls || [])];
                    next[target] = result.data.url;
                    setForm(p => ({ ...p, image_urls: next }));
                }
            } else {
                alert('Upload failed: ' + (result.error?.message || 'Unknown error'));
            }
        } catch (err) {
            alert('Image upload error. Please check your connection.');
        } finally {
            setUploadingIdx(null);
        }
    };

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchStoreProducts();
            setProducts(data);
        } catch (_) { }
        setLoading(false);
    }, []);

    useEffect(() => { loadProducts(); }, [loadProducts]);

    const handleSave = async () => {
        if (!form.name || !form.selling_price) return alert('Name and Selling Price are required');
        try {
            if (isEditing && editingId) {
                await updateStoreProduct(editingId, form);
            } else {
                await createStoreProduct({ ...form, order_index: products.length });
            }
            setIsAdding(false);
            setIsEditing(false);
            setEditingId(null);
            setForm({ name: '', description: '', image_url: '', image_urls: [], file_url: '', preview_url: '', mrp: 0, selling_price: 0, stock_status: 'In Stock', category: 'CBSE' });

            loadProducts();
        } catch (e: any) { alert(e.message || 'Error saving product'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteStoreProduct(id);
            loadProducts();
        } catch (_) { alert('Error deleting product'); }
    };

    const startEdit = (p: StoreProduct) => {
        setForm(p);
        setEditingId(p.id);
        setIsEditing(true);
        setIsAdding(true);
    };

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Toppers Store</h1>
                    <p className="text-slate-900/30 dark:text-white/30 text-sm font-medium mt-1">Manage physical and digital products for students.</p>
                </div>
                <button
                    onClick={() => { setIsAdding(true); setIsEditing(false); setForm({ name: '', description: '', image_url: '', image_urls: [], file_url: '', preview_url: '', mrp: 0, selling_price: 0, stock_status: 'In Stock', category: 'CBSE' }); }}

                    className="flex items-center gap-2 px-5 py-3 bg-violet-600/80 hover:bg-violet-600 border border-violet-500/30 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-violet-900/20"
                >
                    <Plus size={14} /> Add Product
                </button>
            </div>

            <BannerManager />

            <div className="relative w-full">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900/25 dark:text-white/25" />
                <input
                    type="text"
                    placeholder="Search products by name or category..."
                    className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900/20 dark:placeholder:text-white/20 outline-none focus:border-violet-500/50 transition-all"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                    <div className="relative bg-white dark:bg-[#0a0a1a] border border-slate-900/10 dark:border-white/10 rounded-3xl p-8 w-full max-w-2xl z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-violet-600/20 text-violet-400 rounded-xl flex items-center justify-center">
                                {isEditing ? <Pencil size={18} /> : <Plus size={18} />}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{isEditing ? 'Edit Product' : 'New Product'}</h3>
                                <p className="text-[10px] text-slate-900/30 dark:text-white/30 font-bold uppercase tracking-widest">Toppers Store Inventory</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Product Name</label>
                                    <input
                                        className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all"
                                        placeholder="NCERT Physics Volume 1"
                                        value={form.name}
                                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Category</label>
                                    <input
                                        className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all"
                                        placeholder="Books, Notes, etc."
                                        value={form.category}
                                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Product Image</label>
                                    <div className="flex gap-3">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all"
                                                placeholder="Paste URL or Upload ->"
                                                value={form.image_url}
                                                onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                                            />
                                            <div className="flex items-center gap-2">
                                                <label className="flex-1">
                                                    <input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e, 'main')} disabled={uploadingIdx !== null} />
                                                    <div className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed transition-all cursor-pointer ${uploadingIdx === 'main' ? 'bg-slate-900/10 border-slate-900/20 text-slate-400' : 'bg-violet-600/5 border-violet-500/30 text-violet-400 hover:bg-violet-600/10'}`}>
                                                        {uploadingIdx === 'main' ? <Loader2 className="animate-spin" size={12} /> : <UploadCloud size={12} />}
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{uploadingIdx === 'main' ? 'Uploading...' : 'Upload Local Image'}</span>
                                                    </div>
                                                </label>
                                                {form.image_url && (
                                                    <button onClick={() => setForm(p => ({ ...p, image_url: '' }))} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-900/10 dark:border-white/10 shrink-0 bg-slate-900/[0.05] dark:bg-white/[0.05] flex items-center justify-center relative group">
                                            {form.image_url ? (
                                                <img src={form.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            ) : (
                                                <ImageIcon size={32} className="text-slate-300 dark:text-white/10" />
                                            )}
                                            {uploadingIdx === 'main' && (
                                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                                    <Loader2 className="animate-spin text-white" size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">MRP (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all"
                                            placeholder="499"
                                            value={form.mrp}
                                            onChange={e => setForm(p => ({ ...p, mrp: parseFloat(e.target.value) || 0 }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Selling Price (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all"
                                            placeholder="399"
                                            value={form.selling_price}
                                            onChange={e => setForm(p => ({ ...p, selling_price: parseFloat(e.target.value) || 0 }))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Description</label>
                                    <textarea
                                        className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all min-h-[140px] resize-none"
                                        placeholder="Describe the product details..."
                                        value={form.description}
                                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Category</label>
                                    <select
                                        className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all appearance-none"
                                        value={form.category || 'CBSE'}
                                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                    >
                                          <option value="CBSE">CBSE</option>
                                        <option value="JEE">JEE</option>
                                        <option value="NEET">NEET</option>
                                        <option value="CUET">CUET</option>
                                        <option value="PREMIUM">PREMIUM</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Availability</label>
                                    <select
                                        className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all appearance-none"
                                        value={form.stock_status}
                                        onChange={e => setForm(p => ({ ...p, stock_status: e.target.value as any }))}
                                    >
                                        <option value="In Stock">In Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-4 pt-4 border-t border-slate-900/10 dark:border-white/10">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Purchase File URL (GDrive)</label>
                                        <input
                                            className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all font-mono"
                                            placeholder="https://drive.google.com/open?id=..."
                                            value={form.file_url || ''}
                                            onChange={e => setForm(p => ({ ...p, file_url: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Preview PDF URL (Optional)</label>
                                        <input
                                            className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all font-mono"
                                            placeholder="https://drive.google.com/file/d/.../preview"
                                            value={form.preview_url || ''}
                                            onChange={e => setForm(p => ({ ...p, preview_url: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-4 pt-6 mt-2 border-t border-slate-900/10 dark:border-white/10">
                                <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Additional Product Photos</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(form.image_urls || []).map((url, idx) => (
                                        <div key={idx} className="p-3 bg-slate-900/[0.03] dark:bg-white/[0.03] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-2xl space-y-3">
                                            <div className="flex gap-2">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-900/10 dark:border-white/10 shrink-0 bg-white dark:bg-slate-900 flex items-center justify-center relative">
                                                    {url ? (
                                                        <img src={url} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon size={16} className="text-slate-300 dark:text-white/10" />
                                                    )}
                                                    {uploadingIdx === idx && (
                                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                                                            <Loader2 className="animate-spin text-white" size={14} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-1.5">
                                                    <input
                                                        className="w-full bg-transparent border-none p-0 text-[10px] font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-900/20 dark:placeholder:text-white/20"
                                                        value={url}
                                                        placeholder="Photo URL or Upload ->"
                                                        onChange={e => {
                                                            const next = [...(form.image_urls || [])];
                                                            next[idx] = e.target.value;
                                                            setForm({ ...form, image_urls: next });
                                                        }}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <label className="flex-1 h-6">
                                                            <input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e, idx)} disabled={uploadingIdx !== null} />
                                                            <div className={`flex items-center justify-center gap-1.5 h-full rounded-md border border-dashed transition-all cursor-pointer ${uploadingIdx === idx ? 'bg-slate-900/10 border-slate-900/20 text-slate-400' : 'bg-violet-600/5 border-violet-500/30 text-violet-400 hover:bg-violet-600/10'}`}>
                                                                {uploadingIdx === idx ? <Loader2 className="animate-spin" size={8} /> : <UploadCloud size={8} />}
                                                                <span className="text-[7px] font-black uppercase tracking-widest">{uploadingIdx === idx ? '...' : 'Upload'}</span>
                                                            </div>
                                                        </label>
                                                        <button onClick={() => {
                                                            const next = (form.image_urls || []).filter((_, i) => i !== idx);
                                                            setForm({ ...form, image_urls: next });
                                                        }} className="p-1 text-red-400 hover:bg-red-400/10 rounded-md">
                                                            <Trash2 size={10} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => setForm({ ...form, image_urls: [...(form.image_urls || []), ''] })}
                                        className="col-span-1 md:col-span-2 py-4 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:text-violet-500 hover:border-violet-500/50 transition-all bg-slate-900/[0.02] dark:bg-white/[0.01]"
                                    >
                                        + Add Additional Photo Step
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setIsAdding(false)} className="flex-1 py-3 border border-slate-900/10 dark:border-white/10 text-slate-900/40 dark:text-white/40 font-black uppercase text-[10px] tracking-widest rounded-xl hover:border-slate-900/20 dark:hover:border-white/20 hover:text-slate-900/60 dark:hover:text-white/60 transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={14} />
                                {isEditing ? 'Update Product' : 'Save Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl h-64 animate-pulse" />
                    ))
                ) : (
                    filtered.map(p => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-[#0A0A16] border border-slate-900/[0.06] dark:border-white/[0.05] rounded-3xl overflow-hidden group hover:border-violet-500/30 transition-all shadow-sm hover:shadow-2xl hover:shadow-violet-900/10"
                        >
                            <div className="aspect-[16/10] bg-slate-100 dark:bg-white/[0.02] relative overflow-hidden">
                                {p.image_url ? (
                                    <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-white/10">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                    <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md ${p.stock_status === 'In Stock' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                        {p.stock_status}
                                    </span>
                                    {p.category && (
                                        <span className="px-2.5 py-1 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md">
                                            {p.category}
                                        </span>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                                    <button onClick={() => startEdit(p)} className="p-4 bg-white text-black rounded-2xl hover:bg-violet-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 shadow-xl active:scale-90"><Pencil size={20} /></button>
                                    <button onClick={() => handleDelete(p.id)} className="p-4 bg-white text-black rounded-2xl hover:bg-red-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75 shadow-xl active:scale-90"><Trash2 size={20} /></button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-2 flex-1 mr-2">{p.name}</h3>
                                    <div className="w-8 h-8 rounded-xl bg-violet-600/10 text-violet-400 flex items-center justify-center shrink-0">
                                        <ShoppingBag size={14} />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-white/30 line-clamp-2 min-h-[30px] leading-relaxed mb-4">{p.description || 'No description provided.'}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-900/5 dark:border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-slate-400 dark:text-white/20 uppercase font-black tracking-widest mb-1">Pricing</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-violet-500 dark:text-violet-400">₹{p.selling_price}</span>
                                            {p.mrp > p.selling_price && (
                                                <span className="text-[10px] text-slate-400 dark:text-white/20 line-through font-bold">₹{p.mrp}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] text-slate-400 dark:text-white/20 uppercase font-black tracking-widest mb-1">Orders</span>
                                        <span className="text-xs font-black text-slate-600 dark:text-white/60">0 Sold</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    ))
                )}
            </div>
            {!loading && filtered.length === 0 && (
                <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-900/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Package size={32} />
                    </div>
                    <p className="text-slate-900/30 dark:text-white/30 font-bold">No products found in the store.</p>
                </div>
            )}
        </div>
    );
};

const SubscriptionManager: React.FC = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [editing, setEditing] = useState<SubscriptionPlan | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const data = await fetchSubscriptionPlans();
            setPlans(data);
        } catch (_) { }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        try {
            await updateSubscriptionPlan(editing.id, editing);
            setEditing(null);
            load();
        } catch (_) { }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">SUBSCRIPTION DECK</h2>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Crown size={10} className="text-violet-500" />
                        Dynamic Revenue Control
                    </p>
                </div>
                <button
                    onClick={load}
                    className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95 group"
                >
                    <RefreshCw size={20} className={`${loading ? 'animate-spin' : ''} text-slate-600 dark:text-white/40 group-hover:text-violet-500`} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((p, idx) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-[#0a0a18] p-8 rounded-[40px] border border-slate-900/[0.06] dark:border-white/[0.06] relative overflow-hidden group hover:shadow-2xl hover:shadow-violet-500/5 transition-all"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-[100px] opacity-20 ${p.name.includes('elite') ? 'bg-amber-400' : (p.name.includes('pro') ? 'bg-violet-400' : 'bg-blue-400')}`} />
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className={`p-4 rounded-3xl ${p.name.includes('elite') ? 'bg-amber-400/10 text-amber-400' : (p.name.includes('pro') ? 'bg-violet-400/10 text-violet-400' : 'bg-blue-400/10 text-blue-400')}`}>
                                    {p.name.includes('elite') ? <Crown size={28} /> : (p.name.includes('pro') ? <Star size={28} /> : <Zap size={28} />)}
                                </div>
                                <button
                                    onClick={() => setEditing(p)}
                                    className="p-2.5 bg-slate-900/5 dark:bg-white/5 rounded-2xl hover:bg-slate-900/10 dark:hover:bg-white/10 transition-colors"
                                >
                                    <Pencil size={18} />
                                </button>
                            </div>

                            <h3 className="text-xl font-black uppercase tracking-tight mb-4">{p.name}</h3>

                            <div className="space-y-3 mb-10">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Monthly</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white">₹{p.price_monthly}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Quarterly</p>
                                        <p className="text-base font-black text-slate-900 dark:text-white">₹{p.price_quarterly}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Yearly</p>
                                        <p className="text-base font-black text-slate-900 dark:text-white">₹{p.price_yearly}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-slate-900/[0.06] dark:border-white/[0.06]">
                                {p.features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-white/40">
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {editing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setEditing(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-xl bg-white dark:bg-[#070712] rounded-[50px] border border-white/10 shadow-3xl overflow-hidden">
                            <div className="p-12">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-500">
                                        <Crown size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">SYNC {editing.name}</h2>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Pricing Core</p>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdate} className="space-y-8">
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-slate-400/60 tracking-widest ml-1">Monthly (₹)</label>
                                            <input type="number" value={editing.price_monthly} onChange={e => setEditing({ ...editing, price_monthly: +e.target.value })} className="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-violet-500/30 transition-all rounded-3xl px-6 py-4 text-sm font-black outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-slate-400/60 tracking-widest ml-1">Quarterly (₹)</label>
                                            <input type="number" value={editing.price_quarterly} onChange={e => setEditing({ ...editing, price_quarterly: +e.target.value })} className="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-violet-500/30 transition-all rounded-3xl px-6 py-4 text-sm font-black outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-slate-400/60 tracking-widest ml-1">Yearly (₹)</label>
                                            <input type="number" value={editing.price_yearly} onChange={e => setEditing({ ...editing, price_yearly: +e.target.value })} className="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-violet-500/30 transition-all rounded-3xl px-6 py-4 text-sm font-black outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-slate-400/60 tracking-widest ml-1">Core Features (CSV)</label>
                                        <textarea value={editing.features.join(', ')} onChange={e => setEditing({ ...editing, features: e.target.value.split(',').map(s => s.trim()) })} className="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-violet-500/30 transition-all rounded-[32px] px-6 py-4 text-sm font-black h-40 outline-none resize-none" />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setEditing(null)} className="flex-1 py-5 font-black uppercase tracking-[0.2em] text-[10px] bg-slate-100 dark:bg-white/5 rounded-3xl active:scale-95 transition-all">Abort Sync</button>
                                        <button type="submit" className="flex-2 py-5 font-black uppercase tracking-[0.2em] text-[10px] bg-violet-500 text-white rounded-3xl shadow-2xl shadow-violet-500/40 active:scale-95 transition-all">Update Live Pricing</button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────
const AdminApp: React.FC = () => {
    const [operator, setOperator] = useState<Operator | null>(null);
    const [view, setView] = useState<View>('dashboard');
    const [stats, setStats] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('topper_admin_theme') as 'dark' | 'light') || 'dark');

    // Restore session on mount
    useEffect(() => {
        const saved = localStorage.getItem('topper_admin_operator');
        if (saved) {
            try { setOperator(JSON.parse(saved)); } catch (_) { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('topper_admin_theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const loadData = useCallback(async () => {
        if (!operator) return;
        setLoading(true);
        try {
            const s = await fetchAdminStats();
            setStats(s);
            if (view === 'students') {
                const stds = await fetchAllStudents();
                setStudents(stds);
            }
        } catch (_) { }
        setLoading(false);
    }, [operator, view]);

    useEffect(() => {
        if (operator) loadData();
        // Hide splash when app starts
        if ((window as any).hideSplash) {
            setTimeout((window as any).hideSplash, 1000);
        }
    }, [loadData, operator]);

    const handleLogin = (op: Operator) => {
        setOperator(op);
        localStorage.setItem('topper_admin_operator', JSON.stringify(op));
    };

    const handleLogout = async () => {
        await signOutOperator();
        setOperator(null);
        localStorage.removeItem('topper_admin_operator');
        setStats(null);
        setStudents([]);
    };

    if (!operator) return (
        <AnimatePresence mode="wait">
            <LoginPage key="login" onLogin={handleLogin} />
        </AnimatePresence>
    );

    const roleConf = ROLE_CONFIG[operator.role];

    const navItems: { id: View; icon: React.ReactNode; label: string }[] = [
        { id: 'dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
        { id: 'students', icon: <Users size={16} />, label: 'Students' },
        { id: 'operators', icon: <Shield size={16} />, label: 'Operators' },
        { id: 'store', icon: <ShoppingBag size={16} />, label: 'Toppers Store' },
        { id: 'subscriptions', icon: <Crown size={16} />, label: 'Subscriptions' },
        { id: 'content', icon: <BookOpen size={16} />, label: 'Content Manager' },
        { id: 'settings', icon: <Settings size={16} />, label: 'Settings' },
    ];

    return (
        <div className="h-screen w-full bg-slate-50 dark:bg-[#050510] flex text-slate-900 dark:text-white overflow-hidden">
            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: sidebarOpen ? 0 : (window.innerWidth < 768 ? '-100%' : 0),
                    opacity: 1
                }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className={`fixed md:relative z-50 md:z-auto h-screen w-72 flex flex-col bg-white dark:bg-[#07070f] border-r border-slate-900/[0.06] dark:border-white/[0.06] shadow-2xl md:shadow-none`}
            >
                {/* Brand */}
                <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-900/[0.06] dark:border-white/[0.06]">
                    <img src={LOGO_URL} className="w-9 h-9 rounded-xl border border-slate-900/10 dark:border-white/10" />
                    <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">CBSE TOPPERS</p>
                        <p className="text-[9px] font-bold text-violet-400/60 uppercase tracking-[0.3em] mt-0.5">Admin Terminal</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
                    <p className="text-[8px] font-black text-slate-900/15 dark:text-white/15 uppercase tracking-[0.3em] px-3 mb-4">Command Deck</p>
                    <AnimatePresence>
                        {navItems.map((n, i) => (
                            <motion.div
                                key={n.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <SidebarItem
                                    icon={n.icon}
                                    label={n.label}
                                    active={view === n.id}
                                    onClick={() => { setView(n.id); setSidebarOpen(false); }}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </nav>

                {/* GitHub Sync Indicator */}
                <div className="px-3 pb-2 pt-2 border-t border-slate-900/[0.06] dark:border-white/[0.06]">
                    <button
                        onClick={() => alert('Changes are already pushed to GitHub (main branch).')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/[0.03] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-xl hover:bg-slate-900/[0.06] dark:hover:bg-white/[0.04] transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <Github size={16} className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">GitHub Sync</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </button>
                </div>

                {/* Operator Info */}
                <div className="p-4 border-t border-slate-900/[0.06] dark:border-white/[0.06]">
                    <div className="flex items-center gap-3 p-3 bg-slate-900/[0.03] dark:bg-white/[0.03] rounded-xl border border-slate-900/[0.06] dark:border-white/[0.06] mb-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-violet-600/30 to-purple-600/30 border border-violet-500/20 rounded-xl flex items-center justify-center font-black text-violet-300 text-sm">
                            {operator.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-white truncate">{operator.name}</p>
                            <div className={`inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest${roleConf.color}`}>
                                {roleConf.icon} {roleConf.label}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900/60 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5 transition-all mb-2"
                    >
                        <span className="flex items-center gap-3">
                            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Bar (mobile) */}
                <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-slate-900/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#07070f]">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-900/40 dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
                        <div className="space-y-1.5">
                            <div className="w-5 h-0.5 bg-current rounded" />
                            <div className="w-4 h-0.5 bg-current rounded" />
                            <div className="w-5 h-0.5 bg-current rounded" />
                        </div>
                    </button>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">CBSE TOPPERS</p>
                    <div className="w-8" />
                </div>

                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-violet-900/10 blur-[120px] rounded-full pointer-events-none" />

                <main className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-12 relative w-full h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="h-full"
                        >
                            {view === 'dashboard' && <DashboardView stats={stats} operator={operator} onRefresh={loadData} loading={loading} setView={setView} />}
                            {view === 'students' && <StudentsView students={students} loading={loading} />}
                            {view === 'operators' && <OperatorsView currentOperator={operator} />}
                            {view === 'store' && <StoreView />}
                            {view === 'subscriptions' && <SubscriptionManager />}
                            {view === 'content' && <ContentView />}
                            {view === 'settings' && <SettingsView />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AdminApp;
