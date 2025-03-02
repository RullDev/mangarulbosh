
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
    }
    
    /**
      * Comic search
      * @returns {Promise<Array<object>>} - Search results
    */
    async search() {
        try {
            const { data } = await axios({
                method: 'GET',
                url: this.baseUrl,
                params: { 's': this.text }
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
                obj.slug = $(b).find('a').attr('href').replace(this.baseUrl + '/komik/', '')
                obj.cover = $(b).find('img').attr('src');
                obj.status = $(b).find('.status').text().trim();
                obj.type = $(b).find('.type').text().trim();
                obj.score = $(b).find('.numscore').text().trim();
                result.push(obj);
            });
            return result;
        } catch (e) {
            console.log(e);
            throw e;
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
                url: this.baseUrl + '/komik/' + this.text,
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
                result.cover = $(b).find('.komik_info-cover-image img').attr('src');
                result.score = $(b).find('.data-rating strong').text().replace('Rating ', '');
                result.synopsis = $(b).find('.komik_info-description-sinopsis p').text().trim();
                let chapter = [];
                _$($('.komik_info-chapters')).each((a, b) => {
                    let v = _$(b);
                    v.find('.komik_info-chapters-item').each((a, b) => {
                        chapter.push({
                            title: $(b).find('.chapter-link-item').text().replace('\n', ' '),
                            slug: $(b).find('.chapter-link-item').attr('href').replace(this.baseUrl + '/chapter/', ''),
                            released: $(b).find('.chapter-link-time').text().trim()
                        })
                    })
                    result.chapters = chapter;
                })
            })
            return result;
        } catch (e) {
            console.log(e);
            throw e;
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
                url: this.baseUrl + '/chapter/' + this.text,
            });
            const $ = load(data);
            let result = [];
            $(".main-reading-area img").each((a, b) => {
                let obj = {}
                obj.url = $(b).attr('src');
                result.push(obj);
            })
            return result;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    
    async type() {
        try {
            const { data } = await axios({
                method: 'GET',
                url: this.baseUrl + '/type/' + this.text,
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
                obj.slug = $(b).find('a').attr('href').replace(this.baseUrl + '/komik/', '');
                obj.cover = $(b).find('img').attr('src');
                obj.status = $(b).find('.status').text().trim();
                obj.type = $(b).find('.type').text().trim();
                obj.score = $(b).find('.numscore').text().trim();
                result.push(obj);
            });
            return result;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async info() {
        try {
            const { data } = await axios({
                method: 'GET',
                url: this.baseUrl + '/komik/' + this.text,
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
                result.cover = $(b).find('.komik_info-cover-image img').attr('src');
                result.score = $(b).find('.data-rating strong').text().replace('Rating ', '');
                result.synopsis = $(b).find('.komik_info-description-sinopsis p').text().trim();
                let chapter = [];
                _$($('.komik_info-chapters')).each((a, b) => {
                    let v = _$(b);
                    v.find('.komik_info-chapters-item').each((a, b) => {
                        chapter.push({
                            title: $(b).find('.chapter-link-item').text().replace('\n', ' '),
                            slug: $(b).find('.chapter-link-item').attr('href').replace(this.baseUrl + '/chapter/', ''),
                            released: $(b).find('.chapter-link-time').text().trim()
                        });
                    });
                    result.chapters = chapter;
                });
            });
            return result;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    
    async latest() {
        try {
            const { data } = await axios({
                method: 'GET',
                url: this.baseUrl + '/daftar-komik/page/' + this.text + '/?orderby=update',
            });
            const $ = load(data);
            let result = [];
            
            $(".list-update_item").each((index, element) => {
                const link = $(element).find("a").attr("href");
                const slug = link ? link.replace(this.baseUrl + '/komik/', '') : '';
                const title = $(element).find(".title").text().trim();
                const type = $(element).find(".type").text().trim();
                const chapter = $(element).find(".chapter").text().trim();
                const image = $(element).find(".list-update_item-image img").attr("src");
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
            console.log(e);
            throw e;
        }
    }
}

export default Comic;
