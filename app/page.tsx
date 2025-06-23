"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface PossibleName {
  name: string;
  thumbnail: string;
}

interface Match {
  title: string;
  link: string;
  thumbnail: string;
  image: string;
}

interface ApiResponse {
  success: boolean;
  possibleNames: PossibleName[];
  matches: Match[];
  error?: string;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [possibleNames, setPossibleNames] = useState<PossibleName[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-identify when image is selected
  useEffect(() => {
    if (selectedImage && !isLoading) {
      identifyPlant();
    }
  }, [selectedImage]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setPossibleNames([]);
        setMatches([]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setSelectedImage(null);
    setPossibleNames([]);
    setMatches([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const identifyPlant = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);
    setPossibleNames([]);
    setMatches([]);

    try {
      const response = await fetch('/api/identify-plant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: selectedImage
        }),
      });

      const data: ApiResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to identify plant');
      }

      if (data.success) {
        setPossibleNames(data.possibleNames);
        setMatches(data.matches);
        if (data.possibleNames.length === 0 && data.matches.length === 0) {
          setError('No plant matches found. Try taking a clearer photo of the plant.');
        }
      } else {
        throw new Error('Identification failed');
      }
    } catch (err) {
      console.error('Identification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to identify plant');
    } finally {
      setIsLoading(false);
    }
  };

  // Full page loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
              <svg className="animate-spin w-12 h-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              🌿 Identifying Your Plant
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Analyzing your photo to find the best matches...
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Uploading image</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Searching database</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Filtering matches</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 pt-10">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            🌿 Plant Identifier
          </h1>
          <p className="text-gray-600">
            Upload a photo to identify your plant
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {!selectedImage ? (
            /* Upload Section */
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Add a Photo
                </h2>
              </div>

              <div className="text-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex flex-col items-center p-8 border-2 border-dashed border-green-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-colors w-full max-w-md"
                >
                  <svg className="w-8 h-8 text-green-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium text-gray-700">Upload a photo from your gallery or take a new one</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="relative mb-6">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={selectedImage}
                      alt="Plant photo"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={resetImage}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Try again
                  </button>
                </div>

                <div className="border-t border-gray-50 mt-4 py-4">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  {(possibleNames.length > 0 || matches.length > 0) && (
                    <div>
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                          Here what we found
                        </h2>
                      </div>

                      {possibleNames.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-black mb-2 text-center">
                            Possible Names
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {possibleNames.map((name, index) => (
                              <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors">
                                <div className="flex items-center space-x-3">
                                  {name.thumbnail && (
                                    <div className="w-12 h-12 flex-shrink-0">
                                      <Image
                                        src={name.thumbnail}
                                        alt={name.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-green-800 truncate">
                                      {name.name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {matches.length > 0 && (
                        <div>
                          <h3 className="text-black mb-2 text-center">
                            Other Matches
                          </h3>
                          <div className="space-y-4">
                            {matches.map((match, index) => (
                              <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                {match.thumbnail && (
                                  <div className="w-16 h-16 mr-4 flex-shrink-0">
                                    <Image
                                      src={match.thumbnail}
                                      alt={match.title}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  </div>
                                )}
                                <div className="flex flex-col gap-2">
                                  <p className="font-medium text-gray-800">
                                    {match.title}
                                  </p>
                                  {match.link && (
                                    <div>
                                      <a
                                        href={match.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
                                      >
                                        View
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
