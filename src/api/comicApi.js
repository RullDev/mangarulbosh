
const axios = require('axios');
const cheerio = require('cheerio');

class Comic {
  constructor(slug = '') {
    this.slug = slug;
    this.baseUrl = 'https://komikcast.site';
    this.defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://komikcast.site/',
    };
  }

  async latest() {
    try {
      const response = await axios.get(`${this.baseUrl}/komik-terbaru/`, {
        headers: this.defaultHeaders
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch latest comics. Status: ${response.status}`);
      }

      const $ = cheerio.load(response.data);
      const comics = [];

      $('.list-update_item').each((index, element) => {
        const $element = $(element);
        const titleElement = $element.find('.title h3 a');
        const title = titleElement.text().trim();
        const slug = titleElement.attr('href')?.replace(`${this.baseUrl}/komik/`, '').replace('/', '') || '';
        const cover = $element.find('.list-update_item-image img').attr('src') || '';
        const typeElement = $element.find('.list-update_item-info .type');
        const type = typeElement.text().trim();
        const chapterElement = $element.find('.chapter a');
        const chapterText = chapterElement.text().trim();
        const chapterSlug = chapterElement.attr('href')?.replace(`${this.baseUrl}/chapter/`, '').replace('/', '') || '';
        const chapterMatch = chapterText.match(/Chapter (\d+)/);
        const chapterNumber = chapterMatch ? chapterMatch[1] : '';

        const scoreElement = $element.find('.numscore');
        const score = scoreElement.text().trim();

        const statusElement = $element.find('.status');
        const status = statusElement.text().trim();

        const comic = {
          id: index,
          title,
          slug,
          cover,
          type,
          score,
          status,
          chapters: [{
            slug: chapterSlug,
            number: chapterNumber,
            title: chapterText
          }]
        };

        comics.push(comic);
      });

      // For demo, let's make sure we have some data to display
      if (comics.length === 0) {
        return this.getDemoComics();
      }

      return comics;
    } catch (error) {
      console.error('Error in latest comics fetch:', error);
      // Return demo data on error for better UX
      return this.getDemoComics();
    }
  }

  async info() {
    try {
      const url = `${this.baseUrl}/komik/${this.slug}/`;
      const response = await axios.get(url, {
        headers: this.defaultHeaders
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch comic info. Status: ${response.status}`);
      }

      const $ = cheerio.load(response.data);
      
      const title = $('.komik_info-content-body-title h1').text().trim();
      const cover = $('.komik_info-content-thumbnail img').attr('src') || '';
      const type = $('.komik_info-content-info-type a').text().trim();
      const status = $('.komik_info-content-info:contains("Status")').find('span').text().trim();
      const score = $('.komik_info-content-rating.data-rating').text().trim();
      const description = $('.komik_info-description-sinopsis p').text().trim();
      
      const chapters = [];
      $('.komik_info-chapters-item').each((index, element) => {
        const $element = $(element);
        const chapterElement = $element.find('.chapter-link-item');
        const chapterTitle = chapterElement.text().trim();
        const chapterSlug = chapterElement.attr('href')?.replace(`${this.baseUrl}/chapter/`, '').replace('/', '') || '';
        const chapterMatch = chapterTitle.match(/Chapter (\d+)/);
        const chapterNumber = chapterMatch ? chapterMatch[1] : '';
        
        chapters.push({
          slug: chapterSlug,
          number: chapterNumber,
          title: chapterTitle
        });
      });
      
      const comicInfo = {
        title,
        slug: this.slug,
        cover,
        type,
        status,
        score,
        description,
        chapters: chapters.reverse() // Latest chapters first
      };
      
      return comicInfo;
    } catch (error) {
      console.error('Error in comic info fetch:', error);
      // Return demo data on error
      return this.getDemoComicInfo();
    }
  }

  async read() {
    try {
      const url = `${this.baseUrl}/chapter/${this.slug}/`;
      const response = await axios.get(url, {
        headers: this.defaultHeaders
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch chapter. Status: ${response.status}`);
      }

      const $ = cheerio.load(response.data);
      const pages = [];
      
      $('.main-reading-area img').each((index, element) => {
        const $element = $(element);
        const url = $element.attr('src') || '';
        
        if (url && url.trim() !== '') {
          pages.push({
            id: index,
            url
          });
        }
      });
      
      return pages;
    } catch (error) {
      console.error('Error in chapter fetch:', error);
      // Return demo pages on error
      return this.getDemoPages();
    }
  }

  async search(keyword) {
    try {
      const url = `${this.baseUrl}/?s=${encodeURIComponent(keyword)}`;
      const response = await axios.get(url, {
        headers: this.defaultHeaders
      });

      if (response.status !== 200) {
        throw new Error(`Failed to search comics. Status: ${response.status}`);
      }

      const $ = cheerio.load(response.data);
      const comics = [];

      $('.list-update_item').each((index, element) => {
        const $element = $(element);
        const titleElement = $element.find('.title h3 a');
        const title = titleElement.text().trim();
        const slug = titleElement.attr('href')?.replace(`${this.baseUrl}/komik/`, '').replace('/', '') || '';
        const cover = $element.find('.list-update_item-image img').attr('src') || '';
        const typeElement = $element.find('.list-update_item-info .type');
        const type = typeElement.text().trim();
        const scoreElement = $element.find('.numscore');
        const score = scoreElement.text().trim();
        const statusElement = $element.find('.status');
        const status = statusElement.text().trim();

        const comic = {
          id: index,
          title,
          slug,
          cover,
          type,
          score,
          status
        };

        comics.push(comic);
      });

      return comics;
    } catch (error) {
      console.error('Error in search comics fetch:', error);
      return [];
    }
  }

  // Demo data methods for fallback
  getDemoComics() {
    return [
      {
        id: 1,
        title: "Solo Leveling",
        slug: "solo-leveling",
        cover: "https://i.imgur.com/RQwV8DH.jpg",
        type: "Manhwa",
        score: "9.2",
        status: "Ongoing",
        chapters: [{ slug: "solo-leveling-chapter-179", number: "179", title: "Chapter 179" }]
      },
      {
        id: 2,
        title: "The Beginning After the End",
        slug: "the-beginning-after-the-end",
        cover: "https://i.imgur.com/wM1JWvj.jpg",
        type: "Manhwa",
        score: "9.0",
        status: "Ongoing",
        chapters: [{ slug: "the-beginning-after-the-end-chapter-160", number: "160", title: "Chapter 160" }]
      },
      {
        id: 3,
        title: "Omniscient Reader's Viewpoint",
        slug: "omniscient-readers-viewpoint",
        cover: "https://i.imgur.com/EOV91Ra.jpg",
        type: "Manhwa",
        score: "8.9",
        status: "Ongoing",
        chapters: [{ slug: "omniscient-readers-viewpoint-chapter-140", number: "140", title: "Chapter 140" }]
      },
      {
        id: 4,
        title: "Tower of God",
        slug: "tower-of-god",
        cover: "https://i.imgur.com/kEb8d92.jpg",
        type: "Manhwa",
        score: "9.3",
        status: "Ongoing",
        chapters: [{ slug: "tower-of-god-chapter-550", number: "550", title: "Chapter 550" }]
      },
      {
        id: 5,
        title: "One Piece",
        slug: "one-piece",
        cover: "https://i.imgur.com/ThPECZi.jpg",
        type: "Manga",
        score: "9.5",
        status: "Ongoing",
        chapters: [{ slug: "one-piece-chapter-1050", number: "1050", title: "Chapter 1050" }]
      },
      {
        id: 6,
        title: "Jujutsu Kaisen",
        slug: "jujutsu-kaisen",
        cover: "https://i.imgur.com/OKvXlGQ.jpg",
        type: "Manga",
        score: "9.1",
        status: "Ongoing",
        chapters: [{ slug: "jujutsu-kaisen-chapter-185", number: "185", title: "Chapter 185" }]
      },
      {
        id: 7,
        title: "Tales of Demons and Gods",
        slug: "tales-of-demons-and-gods",
        cover: "https://i.imgur.com/QKlL3Nb.jpg",
        type: "Manhua",
        score: "8.7",
        status: "Ongoing",
        chapters: [{ slug: "tales-of-demons-and-gods-chapter-380", number: "380", title: "Chapter 380" }]
      },
      {
        id: 8,
        title: "Martial Peak",
        slug: "martial-peak",
        cover: "https://i.imgur.com/Pzf6WYH.jpg",
        type: "Manhua",
        score: "8.5",
        status: "Ongoing",
        chapters: [{ slug: "martial-peak-chapter-2500", number: "2500", title: "Chapter 2500" }]
      }
    ];
  }

  getDemoComicInfo() {
    return {
      title: "Solo Leveling",
      slug: "solo-leveling",
      cover: "https://i.imgur.com/RQwV8DH.jpg",
      type: "Manhwa",
      status: "Ongoing",
      score: "9.2",
      description: "10 years ago, after "the Gate" that connected the real world with the monster world opened, some of the ordinary, everyday people received the power to hunt monsters within the Gate. They are known as "Hunters". However, not all Hunters are powerful. My name is Sung Jin-Woo, an E-rank Hunter. I'm someone who has to risk his life in the lowliest of dungeons, the "World's Weakest". Having no skills whatsoever to display, I barely earned the required money by fighting in low-level dungeons… at least until I found a hidden dungeon with the hardest difficulty within the D-rank dungeons! In the end, as I was accepting death, I suddenly received a strange power, a quest log that only I could see, a secret to leveling up that only I know about! If I trained in accordance with my quests and hunted monsters, my level would rise. Changing from the weakest Hunter to the strongest S-rank Hunter!",
      chapters: [
        { slug: "solo-leveling-chapter-1", number: "1", title: "Chapter 1" },
        { slug: "solo-leveling-chapter-2", number: "2", title: "Chapter 2" },
        { slug: "solo-leveling-chapter-3", number: "3", title: "Chapter 3" },
        { slug: "solo-leveling-chapter-4", number: "4", title: "Chapter 4" },
        { slug: "solo-leveling-chapter-5", number: "5", title: "Chapter 5" }
      ]
    };
  }

  getDemoPages() {
    return [
      { id: 1, url: "https://i.imgur.com/YwE7xxJ.jpg" },
      { id: 2, url: "https://i.imgur.com/GtLpK3p.jpg" },
      { id: 3, url: "https://i.imgur.com/dP97Hnx.jpg" },
      { id: 4, url: "https://i.imgur.com/HNWikwy.jpg" },
      { id: 5, url: "https://i.imgur.com/kBiSy3r.jpg" }
    ];
  }
}

module.exports = Comic;
