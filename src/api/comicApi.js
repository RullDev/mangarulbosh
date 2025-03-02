
import axios from 'axios';
import { load } from 'cheerio';

class Comic {
    /**
      * constructor Comic
      * @params {string} text - Comic search
    */
    constructor(text) {
        this.text = text;
        this.baseUrl = 'https://komikcast02.com';
        // Use a CORS proxy to avoid CORS issues
        this.corsProxy = 'https://corsproxy.io/?';
    }
    
    getProxiedUrl(url) {
        return `${this.corsProxy}${encodeURIComponent(url)}`;
    }
    
    /**
      * Comic search
      * @returns {Promise<Array<object>>} - Search results
    */
    async search() {
        try {
            const { data } = await axios({
                method: 'GET',
                url: this.getProxiedUrl(`${this.baseUrl}/?s=${encodeURIComponent(this.text)}`),
                timeout: 10000,
            });
            const $ = load(data);
            let result = [];
            $('.list-update_item').each((a, b) => {
                let obj = {};
                let _$ = $(b).find.bind($(b));
                _$($('.list-update_item-info')).each((a, b) => {
                    let v = _$(b);
                    obj.title = v.find('h3').text().trim()
                })
                obj.slug = $(b).find('a').attr('href')?.replace(this.baseUrl + '/komik/', '') || '';
                obj.cover = $(b).find('img').attr('src') || '';
                obj.status = $(b).find('.status').text().trim();
                obj.type = $(b).find('.type').text().trim();
                obj.score = $(b).find('.numscore').text().trim();
                result.push(obj);
            });
            return result;
        } catch (e) {
            console.log('Search error:', e);
            // Return empty array instead of throwing
            return [];
        }
    }
    
    /**
      * Comic series
      * @returns {Promise<Array<object>>} - Series results
    */
    async series() {
        try {
            const { data } = await axios({
                method: 'GET',
                url: this.getProxiedUrl(`${this.baseUrl}/komik/${this.text}`),
                timeout: 10000,
            });
            const $ = load(data);
            let result = {};
            $('.komik_info').each((a, b) => {
                let _$ = $(b).find.bind($(b));
                _$($('.komik_info-content-body')).each((a, b) => {
                    let v = _$(b);
                    let genre = [];
                    result.title = v.find('h1').text().trim();
                    v.find('.genre-item').each((a, b) => {
                        genre.push({
                            name: $(b).text(),
                            url: $(b).attr('href')
                        });
                    });
                    result.genre = genre;
                    result.released = v.find('.komik_info-content-info-release').text().replace('Released:\n', '');
                    result.author = v.find('.komik_info-content-info:contains("Author:")').text().replace('Author:\n', '');
                    result.status = v.find('.komik_info-content-info:contains("Status:")').text().replace('Status:\n', '');
                    result.type = v.find('.komik_info-content-info-type').text().replace('Type:', '');
                    result.total_chapter = v.find('.komik_info-content-info:contains("Total Chapter:")').text().replace('Total Chapter:\n', '');
                    result.updated = v.find('.komik_info-content-update time').text();
                })
                result.cover = $(b).find('.komik_info-cover-image img').attr('src') || '';
                result.score = $(b).find('.data-rating strong').text().replace('Rating ', '');
                result.synopsis = $(b).find('.komik_info-description-sinopsis p').text().trim();
                let chapter = [];
                _$($('.komik_info-chapters')).each((a, b) => {
                    let v = _$(b);
                    v.find('.komik_info-chapters-item').each((a, b) => {
                        chapter.push({
                            title: $(b).find('.chapter-link-item').text().replace('\n', ' '),
                            slug: $(b).find('.chapter-link-item').attr('href')?.replace(this.baseUrl + '/chapter/', '') || '',
                            released: $(b).find('.chapter-link-time').text().trim()
                        })
                    })
                    result.chapters = chapter;
                })
            })
            return result;
        } catch (e) {
            console.log('Series error:', e);
            return {};
        }
    }
    
    /**
      * Comic read
      * @returns {Promise<Array<object>>} - Read results
    */
    async read() {
        try {
            const { data } = await axios({
                method: 'GET',
                url: this.getProxiedUrl(`${this.baseUrl}/chapter/${this.text}`),
                timeout: 10000,
            });
            const $ = load(data);
            let result = [];
            $(".main-reading-area img").each((a, b) => {
                let obj = {}
                obj.url = $(b).attr('src') || '';
                result.push(obj);
            })
            return result;
        } catch (e) {
            console.log('Read error:', e);
            return [];
        }
    }
    
    async type() {
        try {
            const { data } = await axios({
                method: 'GET',
                url: this.getProxiedUrl(`${this.baseUrl}/type/${this.text}`),
                timeout: 10000,
            });
            const $ = load(data);
            let result = [];
            $('.list-update_item').each((a, b) => {
                let obj = {};
                let _$ = $(b).find.bind($(b));
                _$($('.list-update_item-info')).each((a, b) => {
                    let v = _$(b);
                    obj.title = v.find('h3').text().trim();
                });
                obj.slug = $(b).find('a').attr('href')?.replace(this.baseUrl + '/komik/', '') || '';
                obj.cover = $(b).find('img').attr('src') || '';
                obj.status = $(b).find('.status').text().trim();
                obj.type = $(b).find('.type').text().trim();
                obj.score = $(b).find('.numscore').text().trim();
                result.push(obj);
            });
            return result;
        } catch (e) {
            console.log('Type error:', e);
            return [];
        }
    }

    async info() {
        try {
            const { data } = await axios({
                method: 'GET',
                url: this.getProxiedUrl(`${this.baseUrl}/komik/${this.text}`),
                timeout: 10000,
            });
            const $ = load(data);
            let result = {};
            $('.komik_info').each((a, b) => {
                let _$ = $(b).find.bind($(b));
                _$($('.komik_info-content-body')).each((a, b) => {
                    let v = _$(b);
                    let genre = [];
                    result.title = v.find('h1').text().trim();
                    v.find('.genre-item').each((a, b) => {
                        genre.push({
                            name: $(b).text(),
                            url: $(b).attr('href')
                        });
                    });
                    result.genre = genre;
                    result.released = v.find('.komik_info-content-info-release').text().replace('Released:\n', '');
                    result.author = v.find('.komik_info-content-info:contains("Author:")').text().replace('Author:\n', '');
                    result.status = v.find('.komik_info-content-info:contains("Status:")').text().replace('Status:\n', '');
                    result.type = v.find('.komik_info-content-info-type').text().replace('Type:', '');
                    result.total_chapter = v.find('.komik_info-content-info:contains("Total Chapter:")').text().replace('Total Chapter:\n', '');
                    result.updated = v.find('.komik_info-content-update time').text();
                });
                result.cover = $(b).find('.komik_info-cover-image img').attr('src') || '';
                result.score = $(b).find('.data-rating strong').text().replace('Rating ', '');
                result.synopsis = $(b).find('.komik_info-description-sinopsis p').text().trim();
                let chapter = [];
                _$($('.komik_info-chapters')).each((a, b) => {
                    let v = _$(b);
                    v.find('.komik_info-chapters-item').each((a, b) => {
                        chapter.push({
                            title: $(b).find('.chapter-link-item').text().replace('\n', ' '),
                            slug: $(b).find('.chapter-link-item').attr('href')?.replace(this.baseUrl + '/chapter/', '') || '',
                            released: $(b).find('.chapter-link-time').text().trim()
                        });
                    });
                    result.chapters = chapter;
                });
            });
            return result;
        } catch (e) {
            console.log('Info error:', e);
            return {};
        }
    }
    
    async latest() {
        try {
            const { data } = await axios({
                method: 'GET',
                url: this.getProxiedUrl(`${this.baseUrl}/daftar-komik/page/${this.text || 1}/?orderby=update`),
                timeout: 10000,
            });
            const $ = load(data);
            let result = [];
            
            $(".list-update_item").each((index, element) => {
                const link = $(element).find("a").attr("href");
                const slug = link ? link.replace(this.baseUrl + '/komik/', '') : '';
                const title = $(element).find(".title").text().trim() || $(element).find("h3").text().trim();
                const type = $(element).find(".type").text().trim();
                const chapter = $(element).find(".chapter").text().trim();
                const image = $(element).find(".list-update_item-image img").attr("src") || $(element).find("img").attr("src") || '';
                const status = $(element).find(".status").text().trim();
                const score = $(element).find(".numscore").text().trim();
                
                result.push({
                    title: title,
                    type: type,
                    chapter: chapter,
                    slug: slug,
                    cover: image,
                    status: status,
                    score: score
                });
            });
            
            return result;
        } catch (e) {
            console.log('Latest error:', e);
            return [];
        }
    }

    // Fallback method using mock data if all fetches fail
    getMockData() {
        return [
            {
                title: "One Piece",
                type: "Manga",
                chapter: "Chapter 1091",
                slug: "one-piece",
                cover: "https://cdn.myanimelist.net/images/manga/3/259528.jpg",
                status: "Ongoing",
                score: "9.8"
            },
            {
                title: "Jujutsu Kaisen",
                type: "Manga",
                chapter: "Chapter 265",
                slug: "jujutsu-kaisen",
                cover: "https://cdn.myanimelist.net/images/manga/3/214566.jpg",
                status: "Ongoing",
                score: "9.4"
            },
            {
                title: "Demon Slayer",
                type: "Manga",
                chapter: "Chapter 205",
                slug: "kimetsu-no-yaiba",
                cover: "https://cdn.myanimelist.net/images/manga/3/179023.jpg",
                status: "Completed",
                score: "9.3"
            }
        ];
    }
}

export default Comic;
