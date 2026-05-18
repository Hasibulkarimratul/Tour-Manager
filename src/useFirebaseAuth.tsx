import React, { useState, useEffect } from 'react';
import { auth, signInAnonymouslyUser } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [askName, setAskName] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('userDisplayName') || '');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Sign in anonymously if no user is present
        try {
          const newUser = await signInAnonymouslyUser();
          setUser(newUser);
        } catch (error: any) {
          console.error("Anonymous authentication failed", error);
          if (error?.code === 'auth/configuration-not-found' || error?.code === 'auth/admin-restricted-operation') {
            setAuthError("Please enable 'Anonymous' Sign-in in your Firebase Console (Authentication > Sign-in method).");
          } else {
            setAuthError(error.message || "Failed to authenticate.");
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !localStorage.getItem('userDisplayName')) {
      setAskName(true);
    }
  }, [loading, user]);

  const saveName = (name: string) => {
    if (name.trim() && !authError) {
      localStorage.setItem('userDisplayName', name.trim());
      setDisplayName(name.trim());
      setAskName(false);
    }
  };

  const AuthModal = () => {
    const [inputValue, setInputValue] = useState('');

    if (!askName && !authError) return null;

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <div className="bg-[var(--bg-main)] w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col gap-4 relative overflow-hidden">
          {authError ? (
            <>
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              <h2 className="text-xl font-black uppercase text-red-500 tracking-tighter">Setup Required</h2>
              <p className="text-sm font-bold text-[var(--text-main)] mb-2">
                {authError}
              </p>
              <p className="text-xs text-[var(--text-muted)] p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                1. Go to console.firebase.google.com<br/>
                2. Open your project.<br/>
                3. Go to <b>Authentication</b> &rarr; <b>Sign-in method</b> tab.<br/>
                4. Click <b>Add new provider</b> &rarr; <b>Anonymous</b>.<br/>
                5. Enable it and save. Refresh this page.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-black uppercase text-purple-500 tracking-tighter">Welcome!</h2>
              <p className="text-sm font-bold text-[var(--text-muted)]">What is your name?</p>
              <input
                type="text"
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter your name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveName(inputValue)}
                autoFocus
              />
              <button
                onClick={() => saveName(inputValue)}
                className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-purple-500 transition-all flex items-center justify-center disabled:opacity-50"
                disabled={!inputValue.trim()}
              >
                Save & Continue
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return { user, loading, displayName, AuthModal };
}
