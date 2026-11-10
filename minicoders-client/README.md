
# Mini Coders — Authentication Frontend

A practice project built with Next.js to learn and implement credential-based authentication and Google OAuth login and registration.

## Features

- Credential-based registration
- Credential-based login
- Google OAuth login
- Google OAuth registration
- Email verification
- Forgot password and password reset
- Authenticated user information
- Toast notifications for authentication feedback

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Sonner
- React OAuth Google


## Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_FRONTEND_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL= your_backend_api_url
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Make sure the environment variable names match those used in your frontend code.

### 4. Configure Google OAuth

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a Google Cloud project.
3. Configure the OAuth consent screen.
4. Create an OAuth client ID for a Web application.
5. Add `http://localhost:3000` to Authorized JavaScript origins.
6. Add your deployed frontend domain when deploying the application.
7. Set the client ID in your `.env.local` file.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
```

Run the production build locally:

```bash
npm run start
```

## Authentication Flow

1. Users register or log in with credentials or Google.
2. The frontend sends authentication requests to the Express.js backend.
3. The backend validates credentials and handles authentication.
4. Users can verify their email or reset their password when needed.
5. Authenticated users can access their account information.

## Project Purpose

This is a learning and practice project focused on understanding frontend authentication, API integration, and Google OAuth using Next.js and React.

It is not intended to be a complete production-ready application.

## License

Created for educational and personal practice.