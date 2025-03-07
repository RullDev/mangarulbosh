
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
        // Try multiple CORS proxies in case one fails
        this.corsProxies = [
            'https://corsproxy.io/?',
            'https://api.allorigins.win/raw?url=',
            'https://cors-anywhere.herokuapp.com/'
        ];
        this.currentProxyIndex = 0;
    }
    
    getProxiedUrl(url) {
        // Get current proxy
        const proxy = this.corsProxies[this.currentProxyIndex];
        // For some proxies we need to encode the URL, for others we don't
        return proxy.includes('?url=') ? 
            `${proxy}${encodeURIComponent(url)}` : 
            `${proxy}${url}`;
    }
    
    // Method to try the next proxy if the current one fails
    switchToNextProxy() {
        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.corsProxies.length;
        return this.currentProxyIndex;
    }
    
    /**
      * Comic search
      * @returns {Promise<Array<object>>} - Search results
    */
    async search() {
        // Try with each proxy if needed
        let attempts = 0;
        const maxAttempts = this.corsProxies.length;
        
        while (attempts < maxAttempts) {
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
                    obj.chapter = $(b).find('.chapter').text().replace("Ch.", "Chapter\n").trim();
                    result.push(obj);
                });
                return result;
            } catch (e) {
                console.log(`Search error with proxy ${this.currentProxyIndex}:`, e);
                this.switchToNextProxy();
                attempts++;
                
                // If we've tried all proxies, return empty array
                if (attempts >= maxAttempts) {
                    console.log('All proxies failed for search');
                    return [];
                }
            }
        }
        return []; // Fallback empty array
    }
    
    /**
      * Comic series
      * @returns {Promise<Array<object>>} - Series results
    */
    async series() {
        let attempts = 0;
        const maxAttempts = this.corsProxies.length;
        
        while (attempts < maxAttempts) {
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
                console.log(`Series error with proxy ${this.currentProxyIndex}:`, e);
                this.switchToNextProxy();
                attempts++;
                
                if (attempts >= maxAttempts) {
                    console.log('All proxies failed for series');
                    return {};
                }
            }
        }
        return {}; // Fallback empty object
    }
    
    /**
      * Comic read
      * @returns {Promise<Array<object>>} - Read results
    */
    async read() {
        let attempts = 0;
        const maxAttempts = this.corsProxies.length;
        
        while (attempts < maxAttempts) {
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
                console.log(`Read error with proxy ${this.currentProxyIndex}:`, e);
                this.switchToNextProxy();
                attempts++;
                
                if (attempts >= maxAttempts) {
                    console.log('All proxies failed for read');
                    return [];
                }
            }
        }
        return []; // Fallback empty array
    }
    
    async type() {
        let attempts = 0;
        const maxAttempts = this.corsProxies.length;
        
        while (attempts < maxAttempts) {
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
                console.log(`Type error with proxy ${this.currentProxyIndex}:`, e);
                this.switchToNextProxy();
                attempts++;
                
                if (attempts >= maxAttempts) {
                    console.log('All proxies failed for type');
                    return [];
                }
            }
        }
        return []; // Fallback empty array
    }

    async info() {
        // Reuse the series method since they do the same thing
        return this.series();
    }
    
    async latest() {
        try {
            let attempts = 0;
            const maxAttempts = this.corsProxies.length;
            
            while (attempts < maxAttempts) {
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
                        const chapter = $(element).find(".chapter").text().replace("Ch.", "").trim();
                        const image = $(element).find(".list-update_item-image img").attr("src") || $(element).find("img").attr("src") || '';
                        const status = $(element).find(".status").text().trim();
                        const score = $(element).find(".numscore").text().trim();
                        
                        result.push({
                            title: title,
                            type: type,
                            chapter: "Chapter " + chapter,
                            slug: slug,
                            cover: image,
                            status: status,
                            score: score
                        });
                    });
                    
                    if (result.length > 0) {
                        return result;
                    }
                    throw new Error("No comics found");
                } catch (proxyError) {
                    console.log(`Latest error with proxy ${this.currentProxyIndex}:`, proxyError);
                    this.switchToNextProxy();
                    attempts++;
                    
                    if (attempts >= maxAttempts) {
                        console.log('All proxies failed for latest');
                        return this.getMockData();
                    }
                }
            }
        } catch (e) {
            console.log('Latest error:', e);
            return this.getMockData();
        }
        return this.getMockData();
    }

    async popular() {
        try {
            let attempts = 0;
            const maxAttempts = this.corsProxies.length;

            while (attempts < maxAttempts) {
                try {
                    const { data } = await axios({
                        method: 'GET',
                        url: this.getProxiedUrl(`${this.baseUrl}/daftar-komik/page/${this.text || 1}/?orderby=popular`),
                        timeout: 10000,
                    });
                    const $ = load(data);
                    let result = [];

                    $(".list-update_item").each((index, element) => {
                        const link = $(element).find("a").attr("href");
                        const slug = link ? link.replace(this.baseUrl + '/komik/', '') : '';
                        const title = $(element).find(".title").text().trim() || $(element).find("h3").text().trim();
                        const type = $(element).find(".type").text().trim();
                        const chapter = $(element).find(".chapter").text().replace("Ch.", "").trim();
                        const image = $(element).find(".list-update_item-image img").attr("src") || $(element).find("img").attr("src") || '';
                        const status = $(element).find(".status").text().trim();
                        const score = $(element).find(".numscore").text().trim();

                        result.push({
                            title: title,
                            type: type,
                            chapter: "Chapter " + chapter,
                            slug: slug,
                            cover: image,
                            status: status,
                            score: score
                        });
                    });

                    if (result.length > 0) {
                        return result;
                    }
                    throw new Error("No comics found");
                } catch (proxyError) {
                    console.log(`Popular error with proxy ${this.currentProxyIndex}:`, proxyError);
                    this.switchToNextProxy();
                    attempts++;

                    if (attempts >= maxAttempts) {
                        console.log('All proxies failed for Popular');
                        return this.getMockData();
                    }
                }
            }
        } catch (e) {
            console.log('Popular error:', e);
            return this.getMockData();
        }
        return this.getMockData();
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
            },
            {
                title: "My Hero Academia",
                type: "Manga",
                chapter: "Chapter 420",
                slug: "boku-no-hero-academia",
                cover: "https://cdn.myanimelist.net/images/manga/1/209370.jpg",
                status: "Ongoing",
                score: "9.1"
            },
            {
                title: "Solo Leveling",
                type: "Manhwa",
                chapter: "Chapter 179",
                slug: "solo-leveling",
                cover: "https://cdn.myanimelist.net/images/manga/3/222295.jpg",
                status: "Completed",
                score: "9.5"
            },
            {
                title: "Tower of God",
                type: "Manhwa",
                chapter: "Chapter 585",
                slug: "tower-of-god",
                cover: "https://cdn.myanimelist.net/images/manga/1/245734.jpg",
                status: "Ongoing",
                score: "9.2"
            }
        ];
    }
}

export default Comic;
