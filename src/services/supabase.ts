import { createClient } from '@supabase/supabase-js';
import { decode } from '../utils/crypto';
import { decryptStudent, encryptMaterial, decryptMaterial } from './cryptoService';

// High-security obfuscated DBMS secrets
const _U = "b2MuZXNhYmFwdXMubWhvc2Fwb3Z4Y3ZtZGZ6aGtka2gvLzpzcHR0aA==";
const _K = "Y2lYVXU2d2VvMG01NUdiX05hU25aYklYOVdXQks1ekhIeF9JOWZZYTZsaS5RZjRjak54Z0RPMmdETXlvakl3aFhaaXdDTzNZVE53TVRNM2NUTTZJQ2RobG1Jc0lTWnM5bWNmVjJZcFpuY2xObkk2SVNaczltY2l3aUl0aDJiekZHY3ZaSGVqWlhia1ptZW90R1pyaG1JNklpWmxKbklzSVNaekZtWWhCWGR6SmlPaU0zY3BKeWUuOUpDVlhwa0k2SUNjNVJuSXNJaU4xSXpVSUppT2ljR2JoSnll";

const SUPABASE_URL = decode(_U);
const SUPABASE_ANON_KEY = decode(_K);

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

export const fetchAllOperators = async (): Promise<Operator[]> => {
    const { data, error } = await supabase.from('operators').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
};

export const createOperator = async (op: any) => {
    const { data, error } = await supabase.from('operators').insert([op]).select().single();
    if (error) throw error;
    return data;
};

export const deleteOperator = async (id: string) => {
    await supabase.from('operators').delete().eq('id', id);
};

// ─── CONTENT MANAGEMENT (STRICT RULES) ──────────────────────────────

export type SubjectCategory = 'Core' | 'Additional';
export type MaterialType = 'pdf' | 'image' | 'video';

export interface Subject {
    id: string;
    name: string;
    code: string;
    category: SubjectCategory;
    target_class: string; // Keep for legacy if needed, or we can replace
    target_stream?: string; // Keep for legacy
    target_classes?: string[];
    target_streams?: string[];
    target_exams?: string[];
    icon_url?: string;
    order_index: number;
    created_at: string;
}

export interface Folder {
    id: string;
    subject_id: string;
    parent_id?: string | null;
    name: string;
    order_index: number;
    created_at: string;
}

export interface Material {
    id: string;
    folder_id?: string | null;
    subject_id: string;
    title: string;
    type: MaterialType;
    url: string;
    order_index: number;
    created_at: string;
}

export interface StoreProduct {
    id: string;
    name: string;
    description: string;
    image_url: string;
    image_urls?: string[]; // Multiple photos
    file_url?: string;     // GDrive URL for purchased users
    preview_url?: string;  // PDF Preview URL
    mrp: number;
    selling_price: number;
    stock_status: 'In Stock' | 'Out of Stock';
    category?: string;
    order_index: number;
    created_at: string;
}


// SUBJECTS
export const fetchSubjects = async (): Promise<Subject[]> => {
    const { data, error } = await supabase.from('subjects').select('*').order('order_index');
    if (error) throw error;
    return data || [];
};

export const createSubject = async (subject: Partial<Subject>) => {
    // Validation is enforced by DB constraints, but we can catch it here too
    const { data, error } = await supabase.from('subjects').insert([subject]).select().single();
    if (error) throw error;
    return data;
};

export const deleteSubject = async (id: string) => {
    await supabase.from('subjects').delete().eq('id', id);
};

export const updateSubject = async (id: string, updates: Partial<Subject>) => {
    const { data, error } = await supabase.from('subjects').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

// FOLDERS
export const fetchFolders = async (subjectId: string, parentId: string | null = null): Promise<Folder[]> => {
    let query = supabase.from('folders').select('*').eq('subject_id', subjectId);
    if (parentId) query = query.eq('parent_id', parentId);
    else query = query.is('parent_id', null);

    const { data, error } = await query.order('order_index');
    if (error) throw error;
    return data || [];
};

export const createFolder = async (folder: Partial<Folder>) => {
    const { data, error } = await supabase.from('folders').insert([folder]).select().single();
    if (error) throw error;
    return data;
};

export const deleteFolder = async (id: string) => {
    await supabase.from('folders').delete().eq('id', id);
};

export const updateFolder = async (id: string, updates: Partial<Folder>) => {
    const { data, error } = await supabase.from('folders').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

// MATERIALS
export const fetchMaterials = async (subjectId: string, folderId: string | null = null): Promise<Material[]> => {
    let query = supabase.from('materials').select('*').eq('subject_id', subjectId);
    if (folderId) query = query.eq('folder_id', folderId);
    else query = query.is('folder_id', null);

    const { data, error } = await query.order('order_index');
    if (error) throw error;
    return (data || []).map(decryptMaterial);
};

export const createMaterial = async (material: Partial<Material>) => {
    const { data, error } = await supabase.from('materials').insert([encryptMaterial(material)]).select().single();
    if (error) throw error;
    return decryptMaterial(data);
};

export const deleteMaterial = async (id: string) => {
    await supabase.from('materials').delete().eq('id', id);
};

export const updateMaterial = async (id: string, updates: Partial<Material>) => {
    const { data, error } = await supabase.from('materials').update(encryptMaterial(updates)).eq('id', id).select().single();
    if (error) throw error;
    return decryptMaterial(data);
};

// STORE PRODUCTS
export const fetchStoreProducts = async (): Promise<StoreProduct[]> => {
    const { data, error } = await supabase.from('store_products').select('*').order('order_index');
    if (error) throw error;
    return data || [];
};

export const createStoreProduct = async (product: Partial<StoreProduct>) => {
    const { data, error } = await supabase.from('store_products').insert([product]).select().single();
    if (error) throw error;
    return data;
};

export const deleteStoreProduct = async (id: string) => {
    await supabase.from('store_products').delete().eq('id', id);
};

export const updateStoreProduct = async (id: string, updates: Partial<StoreProduct>) => {
    const { data, error } = await supabase.from('store_products').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

// STORE BANNERS
export interface StoreBanner {
    id: string;
    image_url: string;
    order_index: number;
    created_at: string;
}

export const fetchStoreBanners = async (): Promise<StoreBanner[]> => {
    const { data, error } = await supabase.from('store_banners').select('*').order('order_index');
    if (error) throw error;
    return data || [];
};

export const createStoreBanner = async (banner: Partial<StoreBanner>) => {
    const { data, error } = await supabase.from('store_banners').insert([banner]).select().single();
    if (error) throw error;
    return data;
};

export const deleteStoreBanner = async (id: string) => {
    await supabase.from('store_banners').delete().eq('id', id);
};

// ─── ANALYTICS (DASHBOARD) ───────────────────────────────────────────

export const fetchAdminStats = async () => {
    const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
    const { count: subjectCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true });

    return {
        studentCount: studentCount || 0,
        subjectCount: subjectCount || 0,
        quizCount: 0, // Placeholder
        accuracy: 0
    };
};

export const fetchAllStudents = async () => {
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(decryptStudent);
};

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
