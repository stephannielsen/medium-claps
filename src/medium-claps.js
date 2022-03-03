import Parser from 'rss-parser';
import './medium-claps.css';

"use strict"; // Start of use strict
export function MediumClaps(config = {
    feedUrl: '',
    root: '#claps-container',
    template: '#post-template',
    missingImage: '',
}) {
    const configDefaults = {
        root: '#claps-container',
        template: '#post-template',
    };

    if (!config.root) {
        config.root = configDefaults.root;
    }

    if (!config.template) {
        config.template = configDefaults.template;
    }

    if (!config.feedUrl)
        throw ('Config incomplete. Please provide a feed URL.');

    if (!config.missingImage) {
        throw ('Config incomplete. Please provide a missing image.')
    }

    const placeholders = {
        postLink: '#{{postLink}}',
        postTitle: '#{{postTitle}}',
        authorName: '#{{postAuthor}}',
        postImage: '#{{postImage}}',
    }

    const createElementFromHTML = (htmlString) => {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    const getFirstImageOfPostOrMissingImage = (html) => {
        const regex = /<img.*?src="https:\/\/cdn-(.*?)"/;
        let matches = regex.exec(html);
        return matches ? "https://cdn-" + matches[1] : config.missingImage;
    };

    fetch(config.feedUrl)
        .then(response => response.json())
        .then(data => {
            return new Parser().parseString(data.contents);
        })
        .then(feed => {
            for (let item of feed.items) {
                let imageUrl = getFirstImageOfPostOrMissingImage(item['content:encoded'] || item['content']);

                const post = {
                    authorName: item.creator,
                    postImage: imageUrl,
                    postLink: item.link,
                    postTitle: item.title
                }

                //replace all placeholders in template
                const newPost = document.querySelector(config.template)
                    .content.cloneNode(true)
                    .firstElementChild.outerHTML
                    .replace(placeholders.postLink, post.postLink)
                    .replace(placeholders.postTitle, post.postTitle)
                    .replace(placeholders.authorName, post.authorName)
                    .replace(placeholders.postImage, post.postImage);

                //add the post to the root
                const el = createElementFromHTML(newPost);
                document.querySelector(config.root).appendChild(el);

                //use setTimeout to make sure the browser processes the new element
                //necessary to make transitions work properly
                window.setTimeout(() => el.classList.add('is-visible'), 100);
            }
        })
        .catch(console.log);
}