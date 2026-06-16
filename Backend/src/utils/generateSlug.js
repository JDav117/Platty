const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
};

const makeUniqueSlug = async (supabase, titulo, excludeId = null) => {
  let slug = generateSlug(titulo);
  let counter = 0;
  let uniqueSlug = slug;

  while (true) {
    let query = supabase.from('recetas').select('id').eq('slug', uniqueSlug).limit(1);
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) break;
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }

  return uniqueSlug;
};

module.exports = { generateSlug, makeUniqueSlug };
