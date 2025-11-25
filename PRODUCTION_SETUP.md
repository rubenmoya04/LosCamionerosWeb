# Production Setup Guide - Los Camioneros Web

This guide covers everything needed to deploy Los Camioneros Web to Vercel with full functionality and persistence.

## What Was Changed

All changes ensure 100% production readiness with Vercel KV for persistent storage:

### 1. Database Persistence (Vercel KV)
- **Dishes API** (`app/api/adminCamioneros/dishes/route.ts`):
  - Migrated from filesystem (`fs.readFile/writeFile`) to Vercel KV
  - KV Key: `"dishes"` - stores array of all dishes
  - All CRUD operations now persist in production

- **Audit Log API** (`app/api/adminCamioneros/audit-log/route.ts`):
  - Already uses Vercel KV with key `"audit_log"`
  - Stores all admin actions with timestamp, user, action type, and details
  - Auto-refresh every 15 seconds on dashboard

### 2. Dashboard User Feedback (Menu Dishes Manager)
- **Loading States**:
  - Shows spinner while saving/deleting dishes
  - Buttons disabled during operations to prevent double-clicks
  - Modal shows "Guardando..." while request is in flight

- **Success Toasts** (green - Sonner):
  - "Plato guardado correctamente" - when adding new dish
  - "Plato editado correctamente" - when updating dish
  - "Plato eliminado correctamente" - when deleting dish

- **Error Toasts** (red - Sonner):
  - Shows API error message if operation fails
  - Includes validation errors (missing fields, duplicate IDs)

- **Auto-Refresh**: 
  - After any successful operation, dashboard calls `router.refresh()`
  - Dishes list updates instantly without manual reload
  - Audit log auto-refreshes every 15 seconds

### 3. Login Page Improvements
- **Error Display**:
  - Shows red error box below form: "Usuario o contraseña incorrectos"
  - Clears password field on failed login attempt
  - Toast notification also appears (red)
  - Card shakes with `animate-shake` on error

### 4. Image Handling (No Changes Needed)
- Images upload to `public/` folder as static assets
- Works fine in production because public folder is deployed
- No Vercel Blob or external storage needed

## Critical Setup Steps

### Step 1: Create Vercel KV Database

1. Go to https://vercel.com/dashboard
2. Select your Los Camioneros project
3. Navigate to **Storage** tab
4. Click **Create Database** → Select **KV**
5. Choose region (typically closest to your users)
6. Copy the generated environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### Step 2: Add Environment Variables

1. In Vercel Dashboard → Settings → Environment Variables
2. Add these variables (copy from KV setup above):
   \`\`\`
   KV_REST_API_URL=https://your-kv-store.kv.vercel.sh
   KV_REST_API_TOKEN=your_very_long_token_here
   \`\`\`
3. Add authentication credentials:
   \`\`\`
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin
   \`\`\`
   (Change these to your desired credentials!)

4. Save and redeploy

### Step 3: Deploy to Vercel

\`\`\`bash
# Using Vercel CLI
vercel deploy

# Or push to GitHub and Vercel auto-deploys
git push origin main
\`\`\`

## Testing Checklist

Test these before going live:

### Dashboard Functionality
- [ ] Add new dish → Green toast "Plato guardado correctamente" + list refreshes
- [ ] Edit dish → Green toast "Plato editado correctamente" + list updates
- [ ] Delete dish → Green toast "Plato eliminado correctamente" + list refreshes
- [ ] Invalid form submission → Red toast with error message
- [ ] Buttons show spinners while loading
- [ ] Modal buttons disabled during save

### Login Page
- [ ] Correct credentials → Success, redirects to dashboard
- [ ] Wrong credentials → Red error box shows "Usuario o contraseña incorrectos"
- [ ] Card shakes on failed login
- [ ] Password field clears on error

### Audit Log
- [ ] New entries appear when dishes are added/edited/deleted
- [ ] Log auto-refreshes every 15 seconds
- [ ] CSV export downloads with all entries
- [ ] Search/filter works correctly
- [ ] Clear button removes all logs

### Data Persistence
- [ ] Add a dish in production
- [ ] Redeploy the app (`vercel deploy`)
- [ ] Check if dish still exists (proves KV persisted it)
- [ ] Check audit log entries after redeploy (proves KV works)

## API Endpoints Reference

### Dishes (Protected - requires auth token)

**GET /api/adminCamioneros/dishes**
- Public endpoint
- Returns array of all dishes from KV
- Used by landing page and dashboard

**POST /api/adminCamioneros/dishes** (Protected)
- Add/Update/Delete dishes
- Body: `{ dish: {id, name, description, image, badge}, action: "add"|"update"|"delete" }`
- Returns: `{ success: true, dish? }`

**DELETE /api/adminCamioneros/dishes/[id]** (Protected)
- Delete dish by ID
- Returns: `{ success: true }`

### Audit Log (Protected)

**GET /api/adminCamioneros/audit-log**
- Returns array of audit log entries from KV
- Sorted by most recent first

**POST /api/adminCamioneros/audit-log** (Protected)
- Add new audit log entry
- Body: `{ action, type, details, username }`
- Returns: `{ success: true, entry }`

**DELETE /api/adminCamioneros/audit-log** (Protected)
- Clear all audit logs
- Returns: `{ success: true }`

## Troubleshooting

### "KV not configured" Error

If you see errors like "KV_REST_API_URL is not defined":

1. Check you created KV database in Vercel (Storage → KV)
2. Verify environment variables are added to Vercel project
3. Redeploy: `vercel deploy`
4. Check logs: Vercel Dashboard → Deployments → Logs

### Dishes Not Persisting

If dishes disappear after page reload:

1. Check KV database exists (Vercel Dashboard → Storage)
2. Verify `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set
3. Check Network tab in browser DevTools for API 500 errors
4. Redeploy with new variables: `vercel deploy --prod`

### Toast Messages Not Appearing

- Ensure Sonner is installed: `npm install sonner`
- Check that `<Toaster />` exists in your root layout
- Verify CSS is loading (check browser DevTools → Styles)

## Production Notes

1. **Always use HTTPS** - Vercel provides free HTTPS certificate
2. **Update admin credentials** - Change `ADMIN_USERNAME` and `ADMIN_PASSWORD` from defaults
3. **Monitor KV usage** - Free tier has limits; upgrade if needed
4. **Backup data** - Periodically export CSV of audit logs
5. **Test deploys** - Always test in staging before production

## File Changes Summary

| File | Change | Reason |
|------|--------|--------|
| `app/api/adminCamioneros/dishes/route.ts` | Use KV instead of fs | Production persistence |
| `app/api/adminCamioneros/dishes/[id]/route.ts` | Use KV instead of fs | Production persistence |
| `components/admin/menu-dishes-manager.tsx` | Add loading states, toasts, router.refresh() | User feedback |
| `app/adminCamioneros/login/page.tsx` | Show error message in red box | Better UX |
| `components/admin/audit-log.tsx` | Auto-refresh every 15s | Real-time updates |
| `.env.example` | New file | Document required variables |

## Support

For issues or questions, refer to:
- Vercel Docs: https://vercel.com/docs/storage/vercel-kv
- Next.js Docs: https://nextjs.org/docs
- GitHub Issues: https://github.com/rubenmoya04/LosCamionerosWeb/issues
