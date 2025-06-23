import { NextRequest, NextResponse } from 'next/server';
import { getJson } from 'serpapi';
import { v2 as cloudinary } from 'cloudinary';

export type PossibleName = {
  name: string;
  thumbnail: string;
}

export type Match = {
  title: string;
  link: string;
  thumbnail: string;
  image: string;
}

export type ApiResponse = {
  success: boolean;
  possibleNames: PossibleName[];
  matches: Match[];
  error?: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');

    const serpApiKey = process.env.SERPAPI_API_KEY;
    
    if (!serpApiKey) {
      return NextResponse.json(
        { error: 'SerpApi key not configured' },
        { status: 500 }
      );
    }

    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Data}`,
      {
        folder: 'plant-identifier',
        public_id: `plant_${Date.now()}`,
        overwrite: true,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' }, // Optimize image quality
          { fetch_format: 'auto' }  // Auto-format (WebP if supported)
        ]
      }
    );

    const imageUrl = uploadResponse.secure_url;

    if (!imageUrl) {
      throw new Error('Failed to get image URL from Cloudinary');
    }

    const data = await getJson({
      engine: 'google_lens',
      api_key: serpApiKey,
      url: imageUrl,
      no_cache: 'true'
    });

    const relatedSearches = data.related_content || [];
    const possibleNames: PossibleName[] = relatedSearches.map((item: any) => ({
      name: item.query,
      thumbnail: item.thumbnail,
    }));

    const visualMatches = data.visual_matches || [];
    const matches: Match[] = visualMatches
      .map((item: any) => ({
        title: item.title,
        link: item.link,
        thumbnail: item.thumbnail,
        image: item.image
      }));

    return NextResponse.json({
      success: true,
      possibleNames: possibleNames,
      matches: matches,
    });
  } catch (error) {
    console.error('Plant identification error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to identify plant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 