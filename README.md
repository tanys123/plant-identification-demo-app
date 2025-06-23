# Plant Identifier App

A Next.js application that uses SerpApi Google Lens to identify plants from photos.

## Features

- 📸 Upload photos from gallery or take photos with camera
- 🔍 Plant identification using Google Lens API
- 📱 Responsive design for mobile and desktop
- 🎨 Modern, beautiful UI with Tailwind CSS
- ☁️ Professional image hosting with Cloudinary

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```
   SERPAPI_KEY=your_serpapi_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
   
   **API Keys:**
   - **SerpApi key**: Get from [https://serpapi.com/](https://serpapi.com/)
   - **Cloudinary credentials**: Get from [https://cloudinary.com/](https://cloudinary.com/) (free tier available)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

The app uses a two-step process for plant identification:

1. **Image Upload**: Images are uploaded to Cloudinary (professional image hosting service)
2. **Plant Identification**: The hosted image URL is sent to SerpApi's Google Lens engine

The API endpoint is located at `/api/identify-plant` and:

- Accepts base64 image data from the frontend
- Uploads image to Cloudinary with optimization and organization
- Uses the optimized URL with SerpApi Google Lens for identification
- Returns plant suggestions with titles, links, and thumbnails
- Filters results to focus on plant-related matches
- Handles errors gracefully

## Why Cloudinary?

- **Professional-grade** service used by major companies
- **Advanced image optimization** (auto WebP, quality optimization)
- **Global CDN** for fast image delivery
- **Organized storage** with folders and naming conventions
- **Secure URLs** with HTTPS
- **Generous free tier** (25GB storage, 25GB bandwidth)

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- SerpApi Google Lens API
- Cloudinary Image Management API

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
