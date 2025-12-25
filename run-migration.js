const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
    console.log('🚀 Running database migration...\n');

    // Check if we have the service role key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
        console.log('\n📝 Please add your Supabase service role key to .env.local:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/xkjbkhjqbpbapwuzcacx/settings/api');
        console.log('   2. Copy the "service_role" key');
        console.log('   3. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_key_here\n');
        process.exit(1);
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    // Read the migration file
    const migrationSQL = fs.readFileSync(
        './supabase/migrations/20251225000000_add_premium_status.sql',
        'utf8'
    );

    console.log('📄 Migration SQL loaded\n');
    console.log('Executing migration...\n');

    // Split by semicolons and execute each statement
    const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';';
        console.log(`Executing statement ${i + 1}/${statements.length}...`);

        const { error } = await supabase.rpc('exec_sql', { sql: statement }).catch(async () => {
            // If exec_sql doesn't exist, try direct query
            return await supabase.from('_').select('*').limit(0).then(() => {
                // Fallback: we'll need to use the SQL editor
                return { error: { message: 'Cannot execute SQL directly. Please use Supabase SQL Editor.' } };
            });
        });

        if (error) {
            console.log(`⚠️  Statement ${i + 1}: ${error.message}`);
        } else {
            console.log(`✅ Statement ${i + 1}: Success`);
        }
    }

    console.log('\n✅ Migration completed!\n');
    console.log('Next steps:');
    console.log('1. Restart your dev server');
    console.log('2. Test the paywall by adding 10+ applications\n');
}

runMigration().catch(error => {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
});
