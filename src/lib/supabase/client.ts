import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtdzzqywftsirghlpzsc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_nbPnc2oCUc6yqWAdfsiEqA_lwZwL1H5';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
