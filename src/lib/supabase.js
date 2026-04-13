import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseConfig) {
    console.warn('Supabase env vars missing. Lead capture will be skipped.');
}

export const supabase = hasSupabaseConfig
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    })
    : null;

export const insertLead = async (lead) => {
    if (!supabase) {
        return { error: null, skipped: true };
    }

    const { error } = await supabase.from('leads').insert(lead);
    return { error, skipped: false };
};
