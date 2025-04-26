export interface Scene {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  audioUrl?: string;
  duration?: number;
}

export interface RenderRequest {
  template_id: string;
  modifications: Scene[];
}

export interface RenderResponse {
  success: boolean;
  video_url: string;
  filename: string;
}

// API functions for frontend to use
export const renderVideo = async (request: RenderRequest): Promise<RenderResponse> => {
  const response = await fetch('/api/render', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to render video');
  }

  return response.json();
};
