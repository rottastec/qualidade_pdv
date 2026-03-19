import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { supabase } from '@/api/supabaseClient';

const AuthContext = createContext(undefined);

const DEFAULT_PROFILE = {
  role: 'user',
  full_name: '',
  email: ''
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let timeoutId;

    const init = async () => {
      setIsLoadingAuth(true);
      timeoutId = window.setTimeout(() => {
        console.warn('[Auth] auth initialization timed out, proceeding to login');
        setIsLoadingAuth(false);
        setAuthError({ type: 'auth_timeout' });
      }, 8000);

      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('[Auth] getSession error', error);
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await loadProfile(currentSession.user.id);
        }
      } catch (err) {
        console.error('[Auth] init error', err);
      } finally {
        clearTimeout(timeoutId);
        setIsLoadingAuth(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      clearTimeout(timeoutId);
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await loadProfile(newSession.user.id);
      } else {
        setProfile(DEFAULT_PROFILE);
      }

      setIsLoadingAuth(false);
    });

    return () => {
      clearTimeout(timeoutId);
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('[Auth] failed loading profile', error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('[Auth] loadProfile uncaught', err);
    }
  };

  const signUp = async ({ email, password, full_name }) => {
    setAuthError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
      },
    });

    if (error) {
      setAuthError(error);
      throw error;
    }

    if (data?.user) {
      await upsertProfile({
        id: data.user.id,
        email,
        full_name,
        role: 'user'
      });
    }

    return data;
  };

  const signIn = async ({ email, password, rememberMe = true }) => {
    setAuthError(null);

    // Supabase persists session by default (local storage). If "remember me" is false,
    // we can make session non-persistent by setting to "session".
    const persistence = rememberMe ? 'local' : 'session';
    await supabase.auth.setPersistence(persistence);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error);
      throw error;
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error);
      throw error;
    }
    setUser(null);
    setProfile(DEFAULT_PROFILE);
    setSession(null);
  };

  const sendPasswordResetEmail = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (error) {
      setAuthError(error);
      throw error;
    }

    return data;
  };

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setAuthError(error);
      throw error;
    }
    return data;
  };

  const upsertProfile = async (profileData) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('[Auth] upsertProfile error', error);
      return null;
    }

    setProfile(data);
    return data;
  };

  const isAuthenticated = Boolean(user);
  const role = profile?.role || 'user';

  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      session,
      isAuthenticated,
      isLoadingAuth,
      authError,
      signIn,
      signUp,
      signOut,
      sendPasswordResetEmail,
      updatePassword,
      upsertProfile,
    }),
    [user, profile, session, isAuthenticated, isLoadingAuth, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
