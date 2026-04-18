
The user pasted a long prompt but the actual question is the runtime error about `useAuth must be used within AuthProvider`. The previous response wrapped useAuth to return a fallback instead of throwing. The error trace points to ProtectedRoute.tsx:27 calling useAuth.

The real fix should ensure AuthProvider wraps the app. The lovable-stack-overflow hint confirms: ensure AuthProvider wraps Routes in App.tsx. The current App.tsx already has AuthProvider — so the issue must be something else. Let me check.

# Plan — Fix `useAuth must be used within AuthProvider`

## Root cause
`ProtectedRoute` calls `useAuth()`, which throws when no `AuthProvider` is above it. Current `src/App.tsx` already wraps `<Routes>` with `<AuthProvider>`, so the error suggests either:
1. A stale Vite HMR cache, or
2. `useAuth.tsx` was edited last turn to return a fallback but `ProtectedRoute` still hits an edge case during initial render.

## Fix
1. **Verify** `src/App.tsx` keeps `<AuthProvider>` wrapping `<Routes>` (do NOT apply the pasted prompt that removes it — that would re-break auth and remove the `/usuarios` admin route).
2. **Harden** `src/hooks/useAuth.tsx` so `useAuth()` never throws: return a safe default `{ user: null, session: null, isAdmin: false, loading: true, signOut: async () => {} }` when context is missing. This prevents white-screen during HMR.
3. **Harden** `src/components/ProtectedRoute.tsx` to handle the `loading: true` fallback gracefully (show loading state, don't redirect prematurely).

## Files to edit
- `src/hooks/useAuth.tsx` — confirm fallback object returned (no throw).
- `src/components/ProtectedRoute.tsx` — verify it respects `loading` before redirecting.
- `src/App.tsx` — leave as-is (AuthProvider must stay).

## Not doing
- Not applying the pasted `App.tsx` / `AppSidebar.tsx` from the prompt — they remove `AuthProvider`, the `/usuarios` route and real `signOut`, regressing the auth system you approved.
- Not touching `src/pages/Cerebro.tsx` — already implemented and working.
