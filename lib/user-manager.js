import { supabaseAdmin } from './supabase'

export async function createOrUpdateUser(userData) {
  try {
    const { name, email, image, provider = 'google', providerAccountId } = userData

    // Check if user already exists
    const { data: existingUser, error: selectError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, image')
      .eq('email', email)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new users
      throw selectError
    }

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          name,
          image,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single()

      if (updateError) throw updateError
      
      console.log('User updated in Supabase:', email)
      return updatedUser
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert([
          {
            name,
            email,
            image,
            email_verified: new Date().toISOString(),
            provider,
            provider_account_id: providerAccountId,
          }
        ])
        .select()
        .single()

      if (insertError) throw insertError
      
      console.log('New user created in Supabase:', email)
      return newUser
    }
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error)
    throw error
  }
}

export async function getUserByEmail(email) {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return user
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

export async function getAllUsers() {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return users
  } catch (error) {
    console.error('Error getting all users:', error)
    return []
  }
} 