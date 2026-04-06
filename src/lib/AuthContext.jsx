import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/api/supabaseClient';
import { normalizeAllowedStates, normalizeRole } from '@/lib/access-control';

const AuthContext = createContext(undefined);

const DEFAULT_PROFILE = {
  role: 'comercial',
  full_name: '',
  email: '',
  estados: [],
};

const buildFallbackProfile = (authUser) => ({
  role: normalizeRole(authUser?.app_metadata?.role || authUser?.user_metadata?.role || DEFAULT_PROFILE.role),
  full_name: authUser?.user_metadata?.full_name || DEFAULT_PROFILE.full_name,
  email: authUser?.email || DEFAULT_PROFILE.email,
  estados: normalizeAllowedStates(authUser?.user_metadata?.estados),
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [authError, setAuthError] = useState(null);

  const loadProfile = async (userId, fallbackUser) => {
    setIsLoadingProfile(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('[Auth] loadProfile →', { data, error, userId });

      if (error && error.code !== 'PGRST116') {
        console.error('[Auth] failed loading profile — código:', error.code, '— mensagem:', error.message);
        setProfile(buildFallbackProfile(fallbackUser));
        return;
      }

      if (data) {
        console.log('[Auth] perfil carregado, role =', data.role);
        setProfile({
          ...data,
          role: normalizeRole(data.role),
          estados: normalizeAllowedStates(data.estados),
        });
      } else {
        console.warn('[Auth] perfil não encontrado, usando fallback, role =', buildFallbackProfile(fallbackUser).role);
        setProfile(buildFallbackProfile(fallbackUser));
      }
    } catch (err) {
      console.error('[Auth] loadProfile uncaught', err);
      setProfile(buildFallbackProfile(fallbackUser));
    } finally {
      setIsLoadingProfile(false);
    }
  };

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

        const currentUser = currentSession?.user ?? null;

        setSession(currentSession);
        setUser(currentUser);
        setProfile(buildFallbackProfile(currentUser));

        if (currentUser) {
          void loadProfile(currentUser.id, currentUser);
        } else {
          setProfile(DEFAULT_PROFILE);
          setIsLoadingProfile(false);
        }
      } catch (err) {
        console.error('[Auth] init error', err);
      } finally {
        clearTimeout(timeoutId);
        setIsLoadingAuth(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      clearTimeout(timeoutId);

      const nextUser = newSession?.user ?? null;

      setSession(newSession);
      setUser(nextUser);
      setProfile(buildFallbackProfile(nextUser));

      if (nextUser) {
        void loadProfile(nextUser.id, nextUser);
      } else {
        setProfile(DEFAULT_PROFILE);
        setIsLoadingProfile(false);
      }

      setIsLoadingAuth(false);
    });

    return () => {
      clearTimeout(timeoutId);
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const handleWindowFocus = () => {
      void loadProfile(user.id, user);
    };

    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [user?.id]);

  const refreshProfile = async () => {
    if (!user?.id) return;
    await loadProfile(user.id, user);
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
      try {
        await upsertProfile({
          id: data.user.id,
          email,
          full_name,
          role: 'comercial',
          estados: [],
        });
      } catch (profileError) {
        const message = String(profileError?.message || '').toLowerCase();
        const isRlsBlock =
          message.includes('row-level security') ||
          message.includes('permission denied') ||
          message.includes('violates row-level security policy');

        if (!isRlsBlock) {
          throw profileError;
        }

        // Profile creation can be handled by DB trigger on auth.users.
        console.warn('[Auth] signUp profile upsert blocked by RLS; relying on DB trigger.');
      }
    }

    return data;
  };

  const signIn = async ({ email, password, rememberMe = true }) => {
    setAuthError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error);
      throw error;
    }

    const nextSession = data?.session ?? null;
    const nextUser = data?.user ?? nextSession?.user ?? null;

    setSession(nextSession);
    setUser(nextUser);
    setProfile(buildFallbackProfile(nextUser));

    if (nextUser) {
      void loadProfile(nextUser.id, nextUser);
    } else {
      setProfile(DEFAULT_PROFILE);
      setIsLoadingProfile(false);
    }

    void rememberMe;

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
    setIsLoadingProfile(false);
  };

  const sendPasswordResetEmail = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/ResetPassword',
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
    const payload = {
      ...profileData,
      role: normalizeRole(profileData.role),
      estados: normalizeAllowedStates(profileData.estados),
    };

    let response = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (response.error && String(response.error.message || '').toLowerCase().includes('estados')) {
      const fallbackPayload = {
        ...payload,
      };
      delete fallbackPayload.estados;

      response = await supabase
        .from('profiles')
        .upsert(fallbackPayload, { onConflict: 'id' })
        .select()
        .single();
    }

    const { data, error } = response;

    if (error) {
      console.error('[Auth] upsertProfile error', error);
      throw error;
    }

    setProfile({
      ...data,
      role: normalizeRole(data.role),
      estados: normalizeAllowedStates(data.estados),
    });
    return data;
  };

  const isAuthenticated = Boolean(user);
  const role = normalizeRole(profile?.role);

  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      session,
      isAuthenticated,
      isLoadingAuth,
      isLoadingProfile,
      authError,
      signIn,
      signUp,
      signOut,
      sendPasswordResetEmail,
      updatePassword,
      upsertProfile,
      refreshProfile,
    }),
    [user, profile, role, session, isAuthenticated, isLoadingAuth, isLoadingProfile, authError]
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
