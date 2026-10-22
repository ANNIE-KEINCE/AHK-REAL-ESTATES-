# AHK Real Estate - Setup Instructions

## 1. Firebase Configuration
To get this website fully functional, you need to set up a Firebase project:
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named "AHK Real Estate".
3. Add a Web App to the project.
4. Copy the Firebase configuration object.
5. Create a `.env` file in the project root and add the values from your Firebase web app:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```
   The provided Firebase web configuration has been added to the local `.env` file. Restart the Vite dev server after changing it. These client settings are included in the built website; protect your data with Firebase Security Rules and API key restrictions, not by treating the web config as a password.

## 2. Firebase Services Setup
1. **Authentication**: Enable "Email/Password" sign-in method.
2. **Firestore Database**: Create a database in "Production mode" (or test mode, but apply the rules provided in `firebase-rules.txt`).
Property and update images are uploaded to the Supabase Storage bucket `ahkrealestatesproperties` through a Supabase Edge Function. Image URLs and property/update records remain in Firestore. The bucket must allow public reads for listing images to display; uploads are restricted by the Edge Function to the configured Firebase admin UID.

## 3. Supabase Image Upload Setup
1. Create the `ahkrealestatesproperties` Storage bucket and enable public reads so listing images can be displayed on the public website.
2. Rotate/revoke any Supabase secret key shared outside the Supabase dashboard. The function uses Supabase's server-provided `SUPABASE_SERVICE_ROLE_KEY` (or an Edge Function secret named `SUPABASE_SECRET_KEY`); never put a Supabase secret key in source code or a `VITE_` variable.
3. Deploy the Edge Function from the project root using the Supabase CLI: `supabase functions deploy upload-property-image`.
4. `supabase/config.toml` disables the Supabase JWT gateway check for this function because it verifies the Firebase ID token itself. The function only accepts the admin UID configured in both `src/constants/index.ts` and `supabase/functions/upload-property-image/index.ts`.
5. Restart Vite after `.env` changes. For deployment, set the `VITE_SUPABASE_*` values in the hosting environment and rebuild.

## 4. Creating an Admin Account
Since there is no "Sign Up" page for admins (for security), you need to create the first admin account manually:
1. Go to Firebase Console > Authentication > Users.
2. Click "Add user".
3. Enter the admin email and a strong, unique password.
4. The account's Firebase user ID must match `ADMIN_UID` in `src/constants/index.ts`.
5. Use the account email and password to log in at `/admin/login`. The user ID itself is not used as the login name.

## 5. Security Rules
Copy the Firestore rules in `firebase-rules.txt` into Firestore > "Rules" and publish. They restrict Firestore writes to the UID configured in `src/constants/index.ts`.

## 6. Deployment
You can deploy this site to Firebase Hosting, Vercel, or Netlify.
For Firebase Hosting:
1. `npm install -g firebase-tools`
2. `firebase login`
3. `firebase init` (Select Hosting)
4. `npm run build`
5. `firebase deploy`
