import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Settings, LogOut, Search,
    ShieldAlert, Calendar, TrendingUp, Activity,
    Shield, Plus, Trash2, Pencil, Eye, EyeOff, ChevronRight, ChevronUp, ChevronDown,
    Zap, BarChart3, CheckCircle2, XCircle, Github,
    RefreshCw, MessageSquare, Crown, Star, Lock, Sun, Moon, BookOpen, Download,
    ShoppingBag, Package, Image as ImageIcon,
    Loader2, UploadCloud, Code, Book, Medal, FolderOpen,
    PlayCircle, FileText, Youtube, Home, FilePlus, BookText
} from 'lucide-react';
import {
    fetchAdminStats, fetchAllStudents, fetchMaintenanceSettings,
    updateMaintenanceSettings, signInOperator, signOutOperator,
    Operator, OperatorRole,
    fetchNodes, createNode, deleteNode, updateNode,
    fetchMaterials, createMaterial, deleteMaterial, updateMaterial,
    fetchStoreProducts, createStoreProduct, deleteStoreProduct, updateStoreProduct,
    fetchStoreBanners, createStoreBanner, deleteStoreBanner,
    fetchSubscriptionPlans, updateSubscriptionPlan,
    DashboardContent, fetchDashboardContent,
    TreeNode, NodeType, Material, MaterialType, StoreProduct, StoreBanner, SubscriptionPlan
} from './services/supabase';
import { supabase } from './services/supabase';

type View = 'dashboard' | 'students' | 'content' | 'syllabus' | 'settings' | 'operators' | 'store' | 'subscriptions' | 'news';

const LOGO_URL = "https://i.ibb.co/vC4MYFFk/1770137585956.png";

const ROLE_CONFIG: Record<OperatorRole, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    founder: { label: 'Founder', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', icon: <Crown size={12} /> },
    ceo: { label: 'CEO', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20', icon: <Star size={12} /> },
    owner: { label: 'Owner', color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20', icon: <Shield size={12} /> },
    supervisor: { label: 'Supervisor', color: 'text-slate-400', bg: 'bg-slate-400/10 border-slate-400/20', icon: <Zap size={12} /> },
    mentor: { label: 'Mentor', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: <BookOpen size={12} /> },
    'co-founder': { label: 'Co-Founder', color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10 border-fuchsia-400/20', icon: <Crown size={12} /> },
    developer: { label: 'Developer', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', icon: <Code size={12} /> },
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
        setLoading(true); setError('');
        try {
            const op = await signInOperator(email, password);
            if (op) onLogin(op);
        } catch (err: any) { setError(err.message || 'Authentication failed.'); }
        finally { setLoading(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-50 dark:bg-[#050510] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-[400px] z-10">
                <div className="flex flex-col items-center gap-6 mb-12">
                    <div className="relative w-24 h-24 rounded-[1.75rem] overflow-hidden shadow-2xl border border-white/10">
                        <img src={LOGO_URL} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">CBSE TOPPERS</h1>
                        <p className="text-[11px] font-black text-violet-400 uppercase tracking-[0.5em] mt-3 opacity-60">Admin Terminal</p>
                    </div>
                </div>
                <div className="space-y-5">
                    <input type="email" placeholder="Email Address" className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-medium dark:text-white outline-none focus:border-violet-500/40" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                    <div className="relative">
                        <input type={showPass ? 'text' : 'password'} placeholder="Security Key" className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 pr-14 text-sm font-medium dark:text-white outline-none focus:border-violet-500/40" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                        <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/10 hover:text-violet-500" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                    {error && <p className="text-red-500 text-[11px] font-bold text-center">{error}</p>}
                    <button onClick={handleLogin} disabled={loading} className="w-full py-4.5 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-violet-500 dark:hover:bg-violet-500 hover:text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                        {loading ? 'Authenticating...' : <><Shield size={16} /> Enter Terminal</>}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────
const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <motion.button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all group relative ${active ? 'text-violet-400 bg-violet-600/10 border border-violet-500/20' : 'text-slate-600 dark:text-white/30 hover:text-slate-900 dark:hover:text-white/60 hover:bg-slate-100 dark:hover:bg-white/[0.04]'}`}>
        <span className={active ? 'text-violet-400' : 'opacity-60'}>{icon}</span>
        <span>{label}</span>
        {active && <ChevronRight size={12} className="ml-auto text-violet-500" />}
    </motion.button>
);

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; sub: string; color: string }> = ({ label, value, icon, sub, color }) => (
    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-white/[0.07] transition-all group shadow-sm">
        <div className="flex items-start justify-between mb-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-current/10`}>{icon}</div>
            <Activity size={14} className="text-slate-200 dark:text-white/10" />
        </div>
        <p className={`text-3xl font-black ${color} tracking-tighter mb-1`}>{value}</p>
        <p className="text-[11px] font-black text-slate-500 dark:text-white/20 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-[10px] text-slate-400 dark:text-white/15 font-medium">{sub}</p>
    </div>
);

// ─────────────────────────────────────────────────────────────────────
// VIEWS
// ─────────────────────────────────────────────────────────────────────

const DashboardView: React.FC<{ stats: any; operator: Operator; onRefresh: () => void; loading: boolean; setView: (v: View) => void }> = ({ stats, operator, onRefresh, loading, setView }) => {
    const rc = ROLE_CONFIG[operator.role];
    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border mb-3 ${rc.bg} ${rc.color}`}>{rc.icon} {rc.label}</div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Command Center</h1>
                    <p className="text-slate-500 dark:text-white/30 text-sm font-medium mt-1">Platform overview for {operator.name}.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setView('content')} className="px-4 py-2.5 bg-violet-600 border border-violet-500 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-violet-900/20"><Settings size={13} className="inline mr-2" /> Content Manager</button>
                    <button onClick={onRefresh} className="px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest transition-all hover:bg-slate-50"><RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Students" value={stats?.studentCount ?? '—'} sub="Verified users" icon={<Users className="text-violet-400" />} color="text-violet-400" />
                <StatCard label="Quizzes" value={stats?.quizCount ?? '—'} sub="Total attempts" icon={<Zap className="text-amber-400" />} color="text-amber-400" />
                <StatCard label="Analysis" value={`${stats?.accuracy ?? 0}%`} sub="Platform efficiency" icon={<BarChart3 className="text-cyan-400" />} color="text-cyan-400" />
                <StatCard label="Status" value="Online" sub="Systems active" icon={<CheckCircle2 className="text-emerald-400" />} color="text-emerald-400" />
            </div>
        </div>
    );
};

// Universal Content Manager Component
const ContentView: React.FC = () => {
    const [path, setPath] = useState<TreeNode[]>([]);
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingNode, setEditingNode] = useState<TreeNode | null>(null);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
    const [modalMode, setModalMode] = useState<'node' | 'material'>('node');

    const [nodeForm, setNodeForm] = useState<{ name: string; type: NodeType; category: string }>({ name: '', type: 'CLASS', category: 'SECONDARY' });
    const [matForm, setMatForm] = useState<Partial<Material>>({ title: '', url: '', type: 'pdf' });

    const currentNode = path.length > 0 ? path[path.length - 1] : null;

    const load = useCallback(async () => {
        setLoading(true);
        try {
            if (!currentNode) {
                const [classes, exams] = await Promise.all([fetchNodes('CLASS', null), fetchNodes('EXAM', null)]);
                setNodes([...classes, ...exams]); setMaterials([]);
            } else {
                let nextTypes: NodeType[] = [];
                if (currentNode.node_type === 'CLASS') nextTypes = (currentNode.metadata as any)?.category === 'SENIOR SECONDARY' ? ['STREAM'] : ['SECTION'];
                else if (currentNode.node_type === 'STREAM') nextTypes = ['SECTION'];
                else if (currentNode.node_type === 'SECTION' || currentNode.node_type === 'FOLDER') nextTypes = ['FOLDER'];

                const [n, m] = await Promise.all([
                    Promise.all(nextTypes.map(t => fetchNodes(t, currentNode.id))).then(res => res.flat()),
                    fetchMaterials(currentNode.id)
                ]);
                setNodes(n); setMaterials(m);
            }
        } catch (_) { } finally { setLoading(false); }
    }, [currentNode]);

    useEffect(() => { load(); }, [load]);

    const saveNode = async () => {
        if (!nodeForm.name) return;
        const payload = { name: nodeForm.name, node_type: isEditing ? editingNode!.node_type : nodeForm.type, parent_id: currentNode?.id || null, metadata: { category: nodeForm.category } };
        try {
            if (isEditing) await updateNode(editingNode!.id, payload);
            else await createNode(payload);
            setIsAdding(false); load();
        } catch (_) { alert('Error'); }
    };

    const saveMat = async () => {
        if (!matForm.title || !matForm.url || !currentNode) return;
        try {
            if (isEditing) await updateMaterial(editingMaterial!.id, matForm as any);
            else await createMaterial({ ...matForm, node_id: currentNode.id, order_index: materials.length } as any);
            setIsAdding(false); load();
        } catch (_) { alert('Error'); }
    };

    const remove = async (id: string, isNode: boolean) => {
        if (!confirm('Confirm delete?')) return;
        if (isNode) await deleteNode(id); else await deleteMaterial(id);
        load();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-600/10 dark:bg-violet-600/10 rounded-2xl flex items-center justify-center text-2xl border border-violet-500/20">{currentNode ? '📁' : '🏢'}</div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter leading-none">{currentNode ? currentNode.name : 'Core Materials'}</h1>
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5">{currentNode ? `Layer: ${currentNode.node_type}` : 'Root Navigator'}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {(!currentNode || (currentNode.node_type !== 'EXAM' && currentNode.node_type !== 'FOLDER')) && (
                        <button 
                            onClick={() => { 
                                const isSeniorSecondary = currentNode?.node_type === 'CLASS' && (currentNode.metadata as any)?.category === 'SENIOR SECONDARY';
                                const isSecondary = currentNode?.node_type === 'CLASS' && (currentNode.metadata as any)?.category === 'SECONDARY';
                                
                                setModalMode('node'); 
                                setIsEditing(false); 
                                setNodeForm({ 
                                    name: '', 
                                    type: currentNode ? (isSeniorSecondary ? 'STREAM' : (isSecondary ? 'SECTION' : (currentNode.node_type === 'STREAM' ? 'SECTION' : 'FOLDER'))) : 'CLASS', 
                                    category: 'SECONDARY' 
                                }); 
                                setIsAdding(true); 
                            }} 
                            className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all"
                        >
                            + {currentNode ? 'Structure Node' : 'Root Folder'}
                        </button>
                    )}
                    {currentNode && <button onClick={() => { setModalMode('material'); setIsEditing(false); setMatForm({ title: '', url: '', type: 'pdf' }); setIsAdding(true); }} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">+ Media</button>}
                </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 text-[9px] font-black uppercase tracking-widest">
                <button onClick={() => setPath([])} className={path.length === 0 ? 'text-violet-500' : 'text-slate-500 dark:text-white/40'}>ROOT</button>
                {path.map((p, i) => <React.Fragment key={p.id}><ChevronRight size={10} className="text-slate-300 dark:opacity-20"/><button onClick={() => setPath(path.slice(0, i + 1))} className={i === path.length - 1 ? 'text-violet-500' : 'text-slate-500 dark:text-white/40'}>{p.name}</button></React.Fragment>)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loading ? <div className="col-span-full py-20 text-center"><Loader2 className="animate-spin mx-auto text-violet-500" /></div> : <>
                    {nodes.map(n => (
                        <div key={n.id} onClick={() => setPath([...path, n])} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 group cursor-pointer hover:border-violet-500/50 transition-all shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-lg">{n.node_type === 'CLASS' ? '🏫' : (n.node_type === 'STREAM' ? '🌊' : (n.node_type === 'EXAM' ? '🎓' : '📂'))}</div>
                                    <div>
                                        <h4 className="text-sm font-black uppercase text-slate-950 dark:text-white leading-tight">{n.name}</h4>
                                        <p className="text-[9px] font-black text-slate-500 dark:text-white/30 tracking-widest uppercase">
                                            {n.node_type} {n.node_type === 'CLASS' && `(${(n.metadata as any)?.category === 'SENIOR SECONDARY' ? 'Sr. Sec' : 'Sec'})`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={(e) => { e.stopPropagation(); setEditingNode(n); setNodeForm({ name: n.name, type: n.node_type, category: (n.metadata as any)?.category || 'SECONDARY' }); setIsEditing(true); setModalMode('node'); setIsAdding(true); }} className="p-1.5 text-slate-400 hover:text-violet-500 transition-colors"><Pencil size={14} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); remove(n.id, true); }} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {materials.map(m => (
                        <div key={m.id} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 group">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center text-lg">{m.type === 'pdf' ? '📄' : '🎬'}</div>
                                    <div><h4 className="text-sm font-black uppercase line-clamp-1 max-w-[120px] text-slate-900 dark:text-white">{m.title}</h4><p className="text-[8px] font-black text-slate-500 dark:text-white/30 tracking-widest uppercase">{m.type}</p></div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => { setEditingMaterial(m); setMatForm(m); setIsEditing(true); setModalMode('material'); setIsAdding(true); }} className="p-1.5 text-slate-400 hover:text-violet-500 transition-colors"><Pencil size={14} /></button>
                                    <button onClick={() => remove(m.id, false)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </>}
            </div>

            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/10 rounded-3xl p-8 max-w-md w-full space-y-4 shadow-2xl">
                            <h2 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                <Activity size={12} className="text-violet-500"/>
                                {isEditing ? 'Sync System' : 'Initialize New'} {modalMode}
                            </h2>
                            
                            {modalMode === 'node' ? (
                                <div className="space-y-5">
                                    {!isEditing && !currentNode && (
                                        <>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Select Type</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button onClick={() => setNodeForm({...nodeForm, type: 'CLASS', category: 'SECONDARY'})} className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${nodeForm.type === 'CLASS' ? 'bg-violet-600 border-violet-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}>Class</button>
                                                    <button onClick={() => setNodeForm({...nodeForm, type: 'EXAM', category: 'EXAM'})} className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${nodeForm.type === 'EXAM' ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}>Competitive Exam</button>
                                                </div>
                                            </div>
                                            
                                            {nodeForm.type === 'CLASS' && (
                                                <div className="space-y-1.5 mt-4">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Select Category</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button onClick={() => setNodeForm({...nodeForm, category: 'SECONDARY'})} className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${nodeForm.category === 'SECONDARY' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}>Secondary</button>
                                                        <button onClick={() => setNodeForm({...nodeForm, category: 'SENIOR SECONDARY'})} className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${nodeForm.category === 'SENIOR SECONDARY' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}>Senior Secondary</button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {currentNode && (
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase text-slate-600 dark:text-white/40 ml-1">Creation Context</label>
                                            <div className="px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40">
                                                {nodeForm.type === 'STREAM' && `Create Streams (e.g. Science, Commerce, Arts) inside ${currentNode.name}`}
                                                {nodeForm.type === 'SECTION' && `Create Sections (e.g. A, B, C) inside ${currentNode.name}`}
                                                {nodeForm.type === 'FOLDER' && `Add Subjects (e.g. Maths, Science, English) inside ${currentNode.name}`}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-600 dark:text-white/40 ml-1">
                                            {!currentNode ? (nodeForm.type === 'CLASS' ? 'Enter Class Name' : 'Enter Exam Name') : (nodeForm.type === 'STREAM' ? 'Stream Name' : nodeForm.type === 'SECTION' ? 'Section Name' : 'Subject Name')}
                                        </label>
                                        <input className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-950 dark:text-white outline-none focus:border-violet-500 transition-all placeholder:text-slate-300" placeholder={!currentNode ? (nodeForm.type === 'CLASS' ? 'e.g. Class 10' : 'e.g. JEE, NEET, UPSC') : (nodeForm.type === 'STREAM' ? 'e.g. Science, Commerce, Arts' : nodeForm.type === 'SECTION' ? 'e.g. Section A, Section B' : 'e.g. Maths, Science, English')} value={nodeForm.name} onChange={e => setNodeForm({...nodeForm, name: e.target.value})} />
                                    </div>
                                    
                                    <button onClick={saveNode} className="w-full py-4.5 bg-slate-950 dark:bg-violet-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 hover:bg-violet-700 dark:hover:bg-violet-500 transition-all">Synchronize Entry</button>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Media Format</label>
                                        <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white" value={matForm.type} onChange={e => setMatForm({...matForm, type: e.target.value as any})}>
                                            <option value="pdf">Adobe PDF Document</option>
                                            <option value="video">YouTube / Digital Video</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Asset Title</label>
                                        <input className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white" placeholder="Module Title" value={matForm.title} onChange={e => setMatForm({...matForm, title: e.target.value})} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Digital Link</label>
                                        <input className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white" placeholder="https://..." value={matForm.url} onChange={e => setMatForm({...matForm, url: e.target.value})} />
                                    </div>
                                    <button onClick={saveMat} className="w-full py-4.5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Publish Resource</button>
                                </div>
                            )}
                            <button onClick={() => { setIsAdding(false); setIsEditing(false); }} className="w-full text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] hover:text-red-500 transition-colors">Abort Terminal</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SyllabusView: React.FC = () => {
    const [classes, setClasses] = useState<TreeNode[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [chapters, setChapters] = useState<TreeNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [modal, setModal] = useState<'CHAPTER' | 'TOPIC'>('CHAPTER');
    const [editingNode, setEditingNode] = useState<TreeNode | null>(null);
    const [form, setForm] = useState({ name: '', order: 1 });
    const [parentId, setParentId] = useState<string | null>(null);

    useEffect(() => { fetchNodes('CLASS').then(setClasses); }, []);
    const load = useCallback(() => { if (selectedId) { setLoading(true); fetchNodes('CHAPTER', selectedId).then(d => { setChapters(d); setLoading(false); }); } }, [selectedId]);
    useEffect(() => { load(); }, [load]);

    const save = async () => {
        if (!form.name) return;
        const payload = { name: form.name, node_type: modal as NodeType, parent_id: parentId || selectedId, order_index: form.order };
        try {
            if (editingNode) await updateNode(editingNode.id, payload);
            else await createNode(payload);
            setIsAdding(false); load();
        } catch (_) { }
    };

    const remove = async (id: string) => { if (confirm('Delete?')) { await deleteNode(id); load(); } };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Syllabus Engine</h1>
            <div className="flex gap-2 p-1 bg-slate-900/5 dark:bg-white/5 border border-slate-900/5 dark:border-white/10 rounded-2xl overflow-x-auto">
                {classes.map(c => <button key={c.id} onClick={() => setSelectedId(c.id)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedId === c.id ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>{c.name}</button>)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedId && <button onClick={() => { setModal('CHAPTER'); setParentId(null); setEditingNode(null); setForm({ name: '', order: chapters.length + 1 }); setIsAdding(true); }} className="col-span-full py-6 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl text-[10px] font-black uppercase text-slate-300 dark:text-white/20 hover:text-violet-500 dark:hover:text-violet-500 hover:border-violet-500/50 transition-all flex items-center justify-center gap-2"><Plus size={16}/> Initialize New Chapter</button>}
                {chapters.map(chap => (
                    <div key={chap.id} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 space-y-4 group shadow-sm">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white">{chap.order_index}. {chap.name}</h4>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => { setModal('TOPIC'); setParentId(chap.id); setEditingNode(null); setForm({ name: '', order: (chap.children?.length || 0) + 1 }); setIsAdding(true); }} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"><Plus size={14} /></button>
                                <button onClick={() => { setEditingNode(chap); setModal('CHAPTER'); setParentId(null); setForm({ name: chap.name, order: chap.order_index }); setIsAdding(true); }} className="p-1.5 text-violet-500 hover:bg-violet-500/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                                <button onClick={() => remove(chap.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <div className="pl-4 border-l-2 border-slate-100 dark:border-white/10 space-y-3">
                            {chap.children?.map(t => (
                                <div key={t.id} className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-white/40 group/t">
                                    <span>{t.order_index}. {t.name}</span>
                                    <div className="flex gap-2 opacity-0 group-hover/t:opacity-100 transition-all">
                                        <button onClick={() => { setEditingNode(t); setModal('TOPIC'); setParentId(chap.id); setForm({ name: t.name, order: t.order_index }); setIsAdding(true); }} className="hover:text-violet-500"><Pencil size={12} /></button>
                                        <button onClick={() => remove(t.id)} className="text-red-400 hover:text-red-500"><Trash2 size={12} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#0c0c14] p-8 rounded-3xl w-full max-w-sm border border-slate-200 dark:border-white/10 space-y-5 shadow-2xl">
                        <h2 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest">{editingNode ? 'Sync' : 'Initialize'} {modal} Entry</h2>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Title</label>
                            <input className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Sequence Order</label>
                            <input className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white" type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 1})} />
                        </div>
                        <button onClick={save} className="w-full py-4.5 bg-violet-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all">Authenticate Entry</button>
                        <button onClick={() => setIsAdding(false)} className="w-full text-[9px] font-black uppercase text-slate-400">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const DashboardContentView: React.FC = () => {
    const [items, setItems] = useState<DashboardContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingItem, setEditingItem] = useState<DashboardContent | null>(null);
    const [form, setForm] = useState<Partial<DashboardContent>>({ title: '', content: '', type: 'NEWS', tag: '' });

    const load = async () => {
        setLoading(true);
        try { setItems(await fetchDashboardContent()); } catch (_) { }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleSave = async () => {
        if (!form.title) return;
        try {
            if (editingItem) await supabase.from('DashboardContent').update(form).eq('id', editingItem.id);
            else await supabase.from('DashboardContent').insert({ ...form, order_index: items.length });
            setIsAdding(false); setEditingItem(null); load();
        } catch (_) { alert('Error saving content'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item?')) return;
        await supabase.from('DashboardContent').delete().eq('id', id);
        load();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Dashboard Content</h1>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Manage News, Alerts & Updates for the App</p>
                </div>
                <button onClick={() => { setForm({ title: '', content: '', type: 'NEWS', tag: '' }); setEditingItem(null); setIsAdding(true); }} className="px-6 py-3 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                    <Plus size={14} className="inline mr-2" /> New Content
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(item => (
                    <div key={item.id} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 group shadow-sm transition-all hover:border-violet-500/30">
                        <div className="flex items-center justify-between mb-4">
                            <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${item.type === 'ALERT' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {item.type}
                            </span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => { setEditingItem(item); setForm(item); setIsAdding(true); }} className="p-2 text-violet-500 hover:bg-violet-500/10 rounded-lg"><Pencil size={14} /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-2">{item.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.content}</p>
                    </div>
                ))}
            </div>
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-5">
                             <h2 className="text-[10px] font-black uppercase tracking-widest mb-4">Manage Entry Portal</h2>
                             <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Content Type</label>
                                <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white font-bold" value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}>
                                    <option value="NEWS">News Bulletin</option>
                                    <option value="ALERT">Critical Alert</option>
                                    <option value="UPDATE">System Update</option>
                                </select>
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Heading</label>
                                <input className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white" placeholder="Headline" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Detail Report</label>
                                <textarea className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs min-h-[120px] text-slate-900 dark:text-white font-medium" placeholder="Full Description..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
                             </div>
                             <button onClick={handleSave} className="w-full py-4.5 bg-violet-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all">Publish to Dashboard</button>
                             <button onClick={() => setIsAdding(false)} className="w-full text-[9px] font-black uppercase text-slate-400">Cancel</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SettingsView: React.FC = () => {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        try { setSettings(await fetchMaintenanceSettings()); } catch (_) { }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleSave = async () => {
        setSaving(true);
        try { await updateMaintenanceSettings(settings); alert('Settings Updated'); }
        catch (_) { alert('Error updating settings'); }
        setSaving(false);
    };

    if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-violet-500" /></div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Terminal Settings</h1>
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-6 max-w-2xl shadow-sm">
                <div className="flex items-center justify-between">
                    <div><h3 className="text-sm font-black uppercase text-slate-900 dark:text-white">Maintenance Mode</h3><p className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest">Restrict client app access</p></div>
                    <button onClick={() => setSettings({...settings, is_active: !settings.is_active})} className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${settings.is_active ? 'bg-red-500/20 border-red-500/30' : 'bg-emerald-500/20 border-emerald-500/30'} border`}>
                        <motion.div animate={{ x: settings.is_active ? 24 : 0 }} className={`w-6 h-6 rounded-full ${settings.is_active ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    </button>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-white/30">Broadcast Message</label>
                    <textarea value={settings.message} onChange={e => setSettings({...settings, message: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-medium h-32 outline-none focus:border-violet-500/40 text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-white/30">Auto Re-open (Optional)</label>
                    <input type="datetime-local" value={settings.reopen_at ? new Date(new Date(settings.reopen_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} onChange={e => setSettings({...settings, reopen_at: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white font-bold" />
                </div>
                <button onClick={handleSave} disabled={saving} className="w-full py-4.5 bg-slate-900 dark:bg-violet-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">{saving ? 'Syncing...' : 'Update Production Core'}</button>
            </div>
        </div>
    );
};

const BannerManager: React.FC = () => {
    const [banners, setBanners] = useState<StoreBanner[]>([]);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const load = async () => { setLoading(true); try { setBanners(await fetchStoreBanners()); } catch (_) { } setLoading(false); };
    useEffect(() => { load(); }, []);

    const add = async () => { if (!url) return; await createStoreBanner({ image_url: url, order_index: banners.length }); setUrl(''); load(); };
    const remove = async (id: string) => { if (confirm('Delete?')) { await deleteStoreBanner(id); load(); } };

    return (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white">Promotional Stream Banners</h3>
            <div className="flex gap-3">
                <input className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white font-bold" placeholder="Banner Image URL" value={url} onChange={e => setUrl(e.target.value)} />
                <button onClick={add} className="px-6 py-3 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Upload</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {banners.map(b => (
                    <div key={b.id} className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-white/10 shadow-sm transition-all hover:scale-105 group">
                        <img src={b.image_url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><button onClick={() => remove(b.id)} className="p-2 bg-red-500 rounded-lg text-white"><Trash2 size={16} /></button></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StoreView: React.FC = () => {
    const [products, setProducts] = useState<StoreProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState<Partial<StoreProduct>>({ name: '', selling_price: 0, mrp: 0, stock_status: 'In Stock', category: 'CBSE' });

    const load = async () => { setLoading(true); try { setProducts(await fetchStoreProducts()); } catch (_) { } setLoading(false); };
    useEffect(() => { load(); }, []);

    const save = async () => {
        if (!form.name) return;
        try { if (isAdding) await createStoreProduct(form); load(); setIsAdding(false); } catch (_) { }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Toppers Store</h1>
                <button onClick={() => setIsAdding(true)} className="px-5 py-3 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">+ Add Product</button>
            </div>
            <BannerManager />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {products.map(p => (
                    <div key={p.id} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden group shadow-sm transition-all hover:shadow-md">
                        <div className="aspect-[16/10] bg-slate-100 dark:bg-white/5 relative">
                            {p.image_url && <img src={p.image_url} className="w-full h-full object-cover" />}
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-white/10">{p.category}</div>
                        </div>
                        <div className="p-6 space-y-4">
                            <h3 className="text-sm font-black uppercase line-clamp-2 text-slate-900 dark:text-white">{p.name}</h3>
                            <div className="flex justify-between items-end">
                                <div><p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest mb-1">Market Listing</p><p className="text-xl font-black text-violet-500">₹{p.selling_price}</p></div>
                                <button className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl hover:text-red-500 transition-all text-slate-400"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// APP ENTRY
// ─────────────────────────────────────────────────────────────────────
const AdminApp: React.FC = () => {
    const [operator, setOperator] = useState<Operator | null>(() => {
        const s = localStorage.getItem('op_session');
        return s ? JSON.parse(s) : null;
    });
    const [view, setView] = useState<View>('dashboard');
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isDark, setIsDark] = useState(() => localStorage.getItem('admin_theme') !== 'light');

    const load = useCallback(async () => {
        setLoading(true); try { const s = await fetchAdminStats(); setStats(s); } catch (_) { } setLoading(false);
    }, []);

    useEffect(() => { localStorage.setItem('admin_theme', isDark ? 'dark' : 'light'); }, [isDark]);
    useEffect(() => { if (operator) load(); }, [operator, load]);

    const handleLogin = (op: Operator) => { setOperator(op); localStorage.setItem('op_session', JSON.stringify(op)); };
    const handleLogout = async () => { await signOutOperator(); setOperator(null); localStorage.removeItem('op_session'); };

    if (!operator) return <LoginPage onLogin={handleLogin} />;

    const navItems: { id: View; icon: React.ReactNode; label: string }[] = [
        { id: 'dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
        { id: 'content', icon: <BookOpen size={16} />, label: 'Content Manager' },
        { id: 'syllabus', icon: <Book size={16} />, label: 'Syllabus Engine' },
        { id: 'store', icon: <ShoppingBag size={16} />, label: 'Toppers Store' },
        { id: 'news', icon: <MessageSquare size={16} />, label: 'Dashboard Content' },
        { id: 'settings', icon: <Settings size={16} />, label: 'Global Settings' },
    ];

    return (
        <div className={`flex h-screen w-full overflow-hidden ${isDark ? 'dark bg-[#050510] text-white' : 'bg-slate-50 text-slate-900'}`}>
            <aside className={`w-72 border-r flex flex-col p-6 space-y-8 transition-colors duration-300 ${isDark ? 'bg-[#07070f] border-white/5' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-3">
                    <img src={LOGO_URL} className="w-10 h-10 rounded-xl shadow-lg" />
                    <div><h2 className={`text-sm font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>CBSE TOPPERS</h2><p className="text-[9px] font-black text-violet-500 uppercase tracking-widest mt-0.5">Terminal v3.0</p></div>
                </div>
                
                <div className="flex-1 space-y-2">
                    <p className={`text-[8px] font-black uppercase tracking-[0.3em] mb-4 ${isDark ? 'text-white/10' : 'text-slate-400'}`}>Command Core</p>
                    {navItems.map(n => <SidebarItem key={n.id} {...n} active={view === n.id} onClick={() => setView(n.id)} />)}
                </div>

                <div className="pt-4 space-y-2 border-t border-slate-100 dark:border-white/5">
                    <button onClick={() => setIsDark(!isDark)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'text-amber-400 bg-amber-400/10' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'}`}>
                        {isDark ? <Sun size={14}/> : <Moon size={14}/>} {isDark ? 'Emulate Light' : 'Secure Dark'}
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"><LogOut size={16} /> Logout Terminal</button>
                </div>
            </aside>
            <main className={`flex-1 overflow-y-auto p-12 custom-scrollbar transition-colors ${isDark ? 'bg-[#050510]' : 'bg-slate-50'}`}>
                <AnimatePresence mode="wait">
                    <motion.div key={view} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                        {view === 'dashboard' && <DashboardView stats={stats} operator={operator} onRefresh={load} loading={loading} setView={setView} />}
                        {view === 'content' && <ContentView />}
                        {view === 'syllabus' && <SyllabusView />}
                        {view === 'store' && <StoreView />}
                        {view === 'news' && <DashboardContentView />}
                        {view === 'settings' && <SettingsView />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminApp;
