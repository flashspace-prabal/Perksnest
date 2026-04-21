# Claimed Deals Not Persisting - Debug Guide

## Quick Fixes

### 1. **Check Backend Status**
- Terminal should show: `PerksNest backend API running on port 3000`
- If exit code is 1, backend crashed. Check .env file for missing SUPABASE_URL or SUPABASE_SERVICE_KEY

### 2. **Test Debug Endpoint**
Open in browser: `http://localhost:3000/api/debug/claimed-deals`

You should get JSON response showing:
```json
{
  "status": "ok",
  "user": {
    "claimed_deals_column_exists": true,
    "claimed_deals_current": [],
    "claimed_deals_type": "object",
    "is_array": true
  },
  "update_test": {
    "success": true
  },
  "advice": "Everything looks good!"
}
```

### 3. **If Column Doesn't Exist**

**Error in response:**
```
"advice": "Column claimed_deals does not exist in users table - need to add it via migration"
```

**Solution:**
1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project: perksnest
3. Open SQL Editor
4. Create new query from file: `backend/sql/03-add-claimed-deals-column.sql`
5. Run the query
6. Test again with debug endpoint

### 4. **Check Browser Console**
Open DevTools (F12) → Console tab and look for logs starting with:
- `[API]` - Frontend API calls
- `[DealDetail]` - React component events
- `[CLAIM]` - Backend claim processing

### 5. **If Still Not Working**

**Check these in order:**

1. **Backend running?**
   ```bash
   # In backend terminal
   npm run dev
   ```

2. **Environment variables?**
   ```
   # backend/.env should have:
   SUPABASE_URL=https://vxjhqiptbqzgqvhgause.supabase.co
   SUPABASE_SERVICE_KEY=sb_secret_...
   ```

3. **Database connectivity?**
   Visit: http://localhost:3000/api/debug/claimed-deals
   - If timeout → backend not running
   - If "error" → Supabase connectivity issue
   - If "ok" but column doesn't exist → run migration

4. **Claim endpoint error?**
   Check browser console for error from `/api/deals/claim`
   - "undefined column claimed_deals" → Run migration
   - "permission denied" → Check RLS policies
   - "timeout" → Supabase server down

---

## Full Testing Flow

1. **Terminal 1 - Backend**
   ```bash
   cd backend
   npm run dev
   # Should see: "PerksNest backend API running on port 3000"
   # Should see: "DATABASE VALIDATION OK"
   ```

2. **Terminal 2 - Frontend**
   ```bash
   cd frontend
   npm run dev
   # Should see app running on http://localhost:8080
   ```

3. **Test API**
   - Visit: http://localhost:3000/api/debug/claimed-deals
   - Check response for "claimed_deals_column_exists"

4. **Test Full Flow**
   - Login to app
   - Find a deal
   - Click "Claim Deal"
   - Check browser console for [CLAIM] logs
   - Check backend terminal for [CLAIM] logs
   - Go to Dashboard → should see claimed deal
   - Refresh page → should still show as claimed

---

## Common Issues & Solutions

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Column Missing** | "does not exist" error in logs | Run SQL migration from `sql/03-add-claimed-deals-column.sql` |
| **Supabase Down** | All API calls timeout | Check https://status.supabase.com |
| **Wrong API Key** | "Invalid API key" in backend logs | Update `SUPABASE_SERVICE_KEY` in `.env` |
| **CORS Error** | Frontend gets 403 error | Check `CORS_ORIGIN` in `.env` includes `http://localhost:8080` |
| **Backend Not Running** | "Cannot GET /api/..." | Run `npm run dev` in backend folder |
| **RLS Policy Blocks Update** | "permission denied" in logs | Check Supabase RLS policies allow updates to claimed_deals |

---

## Debug Endpoints

### Check Column Status
```
GET http://localhost:3000/api/debug/claimed-deals
```

Response shows if column exists and can be updated.

### Expected Responses

✅ **Success (Column Exists)**
```json
{
  "status": "ok",
  "user": {
    "claimed_deals_column_exists": true,
    "is_array": true
  },
  "advice": "Everything looks good!"
}
```

❌ **Column Missing**
```json
{
  "status": "ok",
  "user": {
    "claimed_deals_column_exists": false
  },
  "advice": "Column claimed_deals does not exist... need to add it via migration"
}
```

❌ **Update Failed**
```json
{
  "status": "error",
  "error": "permission denied for schema perksnest",
  "hint": "Check database permissions and RLS policies"
}
```

---

## Next Steps

1. Check the debug endpoint first
2. If column missing, run the SQL migration
3. If still failing, check backend logs for detailed error
4. Share the debug endpoint response and backend error logs for help

