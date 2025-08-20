# Plant Identifier Demo App 

A Next.js application that uses SerpApi Google Lens to identify plants from photos.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```
   SERPAPI_API_KEY=your_serpapi_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
   
   **API Keys:**
   - **SerpApi key**: Get from [https://serpapi.com/](https://serpapi.com/) (free searches available)
   - **Cloudinary credentials**: Get from [https://cloudinary.com/](https://cloudinary.com/) (free tier available)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

The app uses a two-step process for plant identification:

1. **Image Upload**: Images are uploaded to Cloudinary
2. **Plant Identification**: The hosted image URL is sent to SerpApi's Google Lens engine
