import { createClient } from '@supabase/supabase-js';
import { decode as legacyDecode } from '../utils/crypto';
import { decryptStudent, encryptMaterial, decryptMaterial } from './cryptoService';

// High-security obfuscated DBMS secrets
const _U = "b2MuZXNhYmFwdXMubWhvc2Fwb3Z4Y3ZtZGZ6aGtka2gvLzpzcHR0aA==";
const _K = "Y2lYVXU2d2VvMG01NUdiX05hU25aYklYOVdXQks1ekhIeF9JOWZZYTZsaS5RZjRjak54Z0RPMmdETXlvakl3aFhaaXdDTzNZVE53TVRNM2NUTTZJQ2RobG1Jc0lTWnM5bWNmVjJZcFpuY2xObkk2SVNaczltY2l3aUl0aDJiekZHY3ZaSGVqWlhia1ptZW90R1pyaG1JNklpWmxKbklzSVNaekZtWWhCWGR6SmlPaU0zY3BKeWUuOUpDVlhwa0k2SUNjNVJuSXNJaU4xSXpVSUppT2ljR2JoSnll";

const SUPABASE_URL = legacyDecode(_U);
const SUPABASE_ANON_KEY = legacyDecode(_K);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type OperatorRole = 'ceo' | 'founder' | 'owner' | 'supervisor' | 'mentor' | 'co-founder' | 'developer';

export interface Operator {
    id: string;
    email: string;
    name: string;
    role: OperatorRole;
    student_id?: string | null;
    created_at: string;
}

// ─── UNIVERSAL TREE ARCHITECTURE ───────────────────────────────────

export type NodeType = 'CLASS' | 'STREAM' | 'SECTION' | 'FOLDER' | 'CHAPTER' | 'TOPIC' | 'EXAM';

export interface TreeNode {
    id: string;
    parent_id: string | null;
    name: string;
    node_type: NodeType;
    order_index: number;
    metadata: any;
    created_at: string;
    children?: TreeNode[]; // For recursive UI needs
}

export const fetchNodes = async (type?: NodeType, parentId: string | null = null): Promise<TreeNode[]> => {
    let query = supabase.from('tree').select('*');
    if (type) query = query.eq('node_type', type);
    if (parentId !== undefined) {
        if (parentId === null) query = query.is('parent_id', null);
        else query = query.eq('parent_id', parentId);
    }
    const { data, error } = await query.order('order_index');
    if (error) throw error;
    return data || [];
};

export const createNode = async (node: Partial<TreeNode>) => {
    const { data, error } = await supabase.from('tree').insert([node]).select().single();
    if (error) throw error;
    return data;
};

export const updateNode = async (id: string, updates: Partial<TreeNode>) => {
    const { data, error } = await supabase.from('tree').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteNode = async (id: string) => {
    const { error } = await supabase.from('tree').delete().eq('id', id);
    if (error) throw error;
};

// ─── ADMIN AUTH ─────────────────────────────────────────────────────

export const signInOperator = async (email: string, password: string): Promise<Operator | null> => {
    const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
    });
    if (authError) throw authError;

    const { data: op, error: opError } = await supabase
        .from('operators')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

    if (opError || !op) {
        await supabase.auth.signOut();
        throw new Error('Access Denied: Not an operator.');
    }
    return op as Operator;
};

export const signOutOperator = async () => {
    await supabase.auth.signOut();
};

// ─── MATERIALS (Universal Link to Tree Nodes) ───────────────────────

export type MaterialType = 'pdf' | 'image' | 'video';

export interface Material {
    id: string;
    node_id: string; // Unified link to 'tree'
    title: string;
    type: MaterialType;
    url: string;
    order_index: number;
    created_at: string;
}

export const fetchMaterials = async (nodeId: string): Promise<Material[]> => {
    const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('node_id', nodeId)
        .order('order_index');
    if (error) throw error;
    return (data || []).map(decryptMaterial);
};

export const createMaterial = async (material: Partial<Material>) => {
    const { data, error } = await supabase.from('materials').insert([encryptMaterial(material)]).select().single();
    if (error) throw error;
    return decryptMaterial(data);
};

export const updateMaterial = async (id: string, updates: Partial<Material>) => {
    const { data, error } = await supabase.from('materials').update(encryptMaterial(updates)).eq('id', id).select().single();
    if (error) throw error;
    return decryptMaterial(data);
};

export const deleteMaterial = async (id: string) => {
    await supabase.from('materials').delete().eq('id', id);
};

// ─── STORE & COMMERCE (PascalCase Tables) ───────────────────────────

export interface StoreProduct {
    id: string;
    name: string;
    description: string;
    image_url: string;
    image_urls?: string[];
    file_url?: string;
    preview_url?: string;
    mrp: number;
    selling_price: number;
    stock_status: 'In Stock' | 'Out of Stock';
    category?: string;
    order_index: number;
    created_at: string;
}

export const fetchStoreProducts = async (): Promise<StoreProduct[]> => {
    const { data, error } = await supabase.from('StoreProducts').select('*').order('order_index');
    if (error) throw error;
    return data || [];
};

export const createStoreProduct = async (product: Partial<StoreProduct>) => {
    const { data, error } = await supabase.from('StoreProducts').insert([product]).select().single();
    if (error) throw error;
    return data;
};

export const updateStoreProduct = async (id: string, updates: Partial<StoreProduct>) => {
    const { data, error } = await supabase.from('StoreProducts').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteStoreProduct = async (id: string) => {
    await supabase.from('StoreProducts').delete().eq('id', id);
};

export interface StoreBanner {
    id: string;
    image_url: string;
    order_index: number;
    created_at: string;
}

export const fetchStoreBanners = async (): Promise<StoreBanner[]> => {
    const { data, error } = await supabase.from('StoreBanners').select('*').order('order_index');
    if (error) throw error;
    return data || [];
};

export const createStoreBanner = async (banner: Partial<StoreBanner>) => {
    const { data, error } = await supabase.from('StoreBanners').insert([banner]).select().single();
    if (error) throw error;
    return data;
};

export const deleteStoreBanner = async (id: string) => {
    await supabase.from('StoreBanners').delete().eq('id', id);
};

// ─── ANALYTICS & DASHBOARD ──────────────────────────────────────────

export const fetchAdminStats = async () => {
    const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
    const { count: nodeCount } = await supabase.from('tree').select('*', { count: 'exact', head: true });

    return {
        studentCount: studentCount || 0,
        subjectCount: nodeCount || 0, // Now includes all levels
        quizCount: 0,
        accuracy: 0
    };
};

export const fetchAllStudents = async () => {
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(decryptStudent);
};

// ─── SETTINGS & SUBSCRIPTIONS ───────────────────────────────────────

export const fetchMaintenanceSettings = async () => {
    const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
    if (error) throw error;
    return data;
};

export const updateMaintenanceSettings = async (settings: any) => {
    const { id, ...updateData } = settings;
    const { data, error } = await supabase.from('settings').update(updateData).eq('id', id || 1).select();
    if (error) throw error;
    return data;
};

export interface SubscriptionPlan {
    id: string;
    name: string;
    price_monthly: number;
    price_quarterly: number;
    price_yearly: number;
    features: string[];
    is_featured: boolean;
}

export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
    const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price_monthly', { ascending: true });
    if (error) throw error;
    return data || [];
};

export const updateSubscriptionPlan = async (id: string, updates: Partial<SubscriptionPlan>) => {
    const { error } = await supabase
        .from('subscription_plans')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw error;
};
// ─── DASHBOARD CONTENT (Universal News/Alerts) ───────────────────

export interface DashboardContent {
    id: string;
    parent_id: string | null;
    title: string;
    content?: string;
    type: 'ALERT' | 'NEWS' | 'UPDATE';
    tag?: string;
    order_index: number;
    created_at: string;
}

export const fetchDashboardContent = async (): Promise<DashboardContent[]> => {
    const { data, error } = await supabase.from('DashboardContent').select('*').order('order_index');
    if (error) throw error;
    return data || [];
};

// ─── PURCHASE & PROGRESS ──────────────────────────────────────────

export interface PurchaseRecord {
    id: string;
    student_id: string;
    product_id: string;
    status: 'success' | 'failed' | 'pending';
    amount: number;
    created_at: string;
}

export const fetchPurchaseHistory = async (studentId?: string): Promise<PurchaseRecord[]> => {
    let query = supabase.from('PurchaseHistory').select('*');
    if (studentId) query = query.eq('student_id', studentId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
};

export const updateSyllabusProgress = async (studentId: string, topicId: string, isCompleted: boolean) => {
    const { error } = await supabase.from('SyllabusProgress').upsert({
        student_id: studentId,
        topic_id: topicId,
        is_completed: isCompleted,
        updated_at: new Date().toISOString()
    }, { onConflict: 'student_id,topic_id' });
    if (error) throw error;
};

export const fetchSyllabusProgress = async (studentId: string) => {
    const { data, error } = await supabase.from('SyllabusProgress').select('*').eq('student_id', studentId);
    if (error) throw error;
    return data || [];
};
