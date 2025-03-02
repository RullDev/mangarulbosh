import axios from 'axios';

// Use base URL from environment variable or default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

class Comic {
  constructor(slug = '') {
    this.slug = slug;
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        // Log the error
        console.error('API Error:', error);

        // Return a custom error object
        return Promise.reject({
          message: error.response?.data?.message || 'An error occurred while fetching data.',
          status: error.response?.status || 500,
          originalError: error
        });
      }
    );
  }

  // Get comic info
  async info() {
    try {
      const response = await this.api.get(`/comics/${this.slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comic info:', error);
      return {};
    }
  }

  // Get chapter for reading
  async read(chapterSlug) {
    try {
      const response = await this.api.get(`/chapters/${chapterSlug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chapter:', error);
      return null;
    }
  }

  // Search comics
  async search(query, page = 1) {
    try {
      const response = await this.api.get('/search', {
        params: { q: query, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching comics:', error);
      return { comics: [], total: 0 };
    }
  }

  // Get latest comics
  async latest(page = 1, type = '') {
    try {
      const params = { page };
      if (type && type !== 'all') {
        params.type = type;
      }

      const response = await this.api.get('/latest', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching latest comics:', error);
      return { comics: [], total: 0 };
    }
  }

  // Get popular comics
  async popular(page = 1, type = '') {
    try {
      const params = { page };
      if (type && type !== 'all') {
        params.type = type;
      }

      const response = await this.api.get('/popular', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular comics:', error);
      return { comics: [], total: 0 };
    }
  }

  // Mock data for development (remove in production)
  getMockComics(count = 12) {
    const types = ['Manga', 'Manhwa', 'Manhua'];
    const statuses = ['Ongoing', 'Completed', 'Hiatus'];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `Comic Title ${i + 1}`,
      slug: `comic-title-${i + 1}`,
      cover: `https://picsum.photos/300/450?random=${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      chapter: `Chapter ${Math.floor(Math.random() * 100) + 1}`,
      score: (Math.random() * 5 + 5).toFixed(1)
    }));
  }
}

export default Comic;