// YouTube API service for fetching educational videos
// Requires VITE_YOUTUBE_API_KEY environment variable to be set
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
}

export interface YouTubeSearchResult {
  videos: YouTubeVideo[];
  totalResults: number;
  nextPageToken?: string;
}

interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  statistics?: {
    viewCount: string;
  };
  contentDetails?: {
    duration: string;
  };
}

class YouTubeService {
  private readonly apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || "";
  private readonly baseUrl = "https://www.googleapis.com/youtube/v3";

  async searchVideos(
    query: string, 
    maxResults: number = 10,
    type: 'tutorial' | 'explanation' | 'course' | 'overview' = 'tutorial'
  ): Promise<YouTubeSearchResult> {
    try {
      // Check if API key is configured
      if (!this.apiKey) {
        throw new Error('YouTube API key is not configured. Please add VITE_YOUTUBE_API_KEY to your .env file.');
      }

      // Enhance query based on type
      const enhancedQuery = this.enhanceQuery(query, type);
      const searchUrl = `${this.baseUrl}/search`;
      
      const params = new URLSearchParams({
        part: 'snippet',
        maxResults: maxResults.toString(),
        q: enhancedQuery,
        type: 'video',
        order: 'relevance',
        videoDefinition: 'any',
        videoDuration: 'any',
        key: this.apiKey
      });

      const response = await fetch(`${searchUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`YouTube API error: ${data.error.message}`);
      }

      // Filter out test-related content
      const filteredItems = data.items?.filter((item: YouTubeSearchItem) => {
        const title = item.snippet.title.toLowerCase();
        const description = item.snippet.description.toLowerCase();
        
        // Keywords to exclude for test-related content
        const excludeKeywords = [
          'test', 'quiz', 'exam', 'assessment', 'practice test', 
          'mock test', 'sample test', 'question paper', 'mcq',
          'multiple choice', 'assessment test', 'entrance exam',
          'competitive exam', 'practice questions', 'test series'
        ];
        
        return !excludeKeywords.some(keyword => 
          title.includes(keyword) || description.includes(keyword)
        );
      }) || [];

      const videos: YouTubeVideo[] = filteredItems.map((item: YouTubeSearchItem) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      }));

      return {
        videos,
        totalResults: data.pageInfo?.totalResults || 0,
        nextPageToken: data.nextPageToken
      };

    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      throw new Error('Failed to fetch YouTube videos. Please try again.');
    }
  }

  private enhanceQuery(query: string, type: string): string {
    const typeEnhancements = {
      tutorial: `${query} tutorial step by step`,
      explanation: `${query} explained simply`,
      course: `${query} complete course`,
      overview: `${query} overview introduction`
    };

    return typeEnhancements[type] || `${query} tutorial`;
  }

  async getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
    try {
      const detailsUrl = `${this.baseUrl}/videos`;
      const params = new URLSearchParams({
        part: 'snippet,statistics,contentDetails',
        id: videoIds.join(','),
        key: this.apiKey
      });

      const response = await fetch(`${detailsUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();

      return data.items?.map((item: YouTubeVideoItem) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: this.formatDuration(item.contentDetails?.duration),
        viewCount: this.formatViewCount(item.statistics?.viewCount)
      })) || [];

    } catch (error) {
      console.error('Error fetching video details:', error);
      return [];
    }
  }

  private formatDuration(duration: string): string {
    if (!duration) return '';
    
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return duration;

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    let formatted = '';
    if (hours) formatted += `${hours}:`;
    formatted += `${minutes.padStart(2, '0')}:`;
    formatted += seconds.padStart(2, '0');

    return formatted;
  }

  private formatViewCount(viewCount: string): string {
    if (!viewCount) return '';
    
    const count = parseInt(viewCount);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  }

  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  getWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}

export const youtubeService = new YouTubeService();
