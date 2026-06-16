const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

let supabase;

const getClient = () => {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabase;
};

const testConnection = async () => {
  const client = getClient();
  const { data, error } = await client.from('usuarios').select('id').limit(1);
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error conectando a Supabase: ${error.message}`);
  }
  return true;
};

module.exports = { getClient, testConnection };
