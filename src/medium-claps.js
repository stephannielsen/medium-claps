function MediumClaps(config) {


    "use strict"; // Start of use strict

    const mediumUrl = "https://medium.com";
    const username = config.username;
    const useRss = config.useRss;
    const root = config.root;
    const templateElement = config.placeholders.templateElement;
    const placeholders = config.placeholders;

    const createClapCardsFromRss = () => {
        let parser = new RSSParser();

        const getFirstMediumCdnImageInHtml = (html) => {
            const regex = /<img.*?src="https:\/\/cdn-(.*?)"/;
            let matches = regex.exec(html);
            return matches ? "https://cdn-" + matches[1] : undefined;
        };

        fetch("https://allorigins.me/get?url=" + encodeURIComponent(mediumUrl + "/feed/@" + username + "/has-recommended"))
            .then(response => response.json())
            .then(data => {
                parser.parseString(data.contents, function(err, feed) {
                    feed.items.forEach(function(item) {
                        let imageUrl = getFirstMediumCdnImageInHtml(item['content:encoded']);
                        imageUrl = imageUrl ? imageUrl : placeholders.postImage;
                        let post = {
                            authorName: item.creator,
                            postImage: imageUrl,
                            postLink: item.link,
                            postTitle: item.title
                        }
                        let newPost = placeholders.template
                            .replace(placeholders.postLink, post.postLink)
                            .replace(placeholders.postTitle, post.postTitle)
                            .replace(placeholders.authorName, post.authorName)
                            .replace(placeholders.postImage, post.postImage);
                        $(newPost).hide().appendTo(root).show('slow');
                    });
                })
            })
    }

    const createClapCardsFromHtml = () => {

        const substringByString = (full, begin, end) => {
            let startIndex = full.indexOf(begin);
            let endIndex = full.indexOf(end);
            return full.substring(startIndex, endIndex);
        };

        $.getJSON("https://allorigins.me/get?url=" + mediumUrl + "/@" + username + "/has-recommended&callback=?", function(data) {
            let root = $.parseHTML(data.contents).filter(e => e.id === 'root')[0];
            let section = $(root).find("section")[0];
            let container = $(section).children()[1];
            let postsHtml = $(container).children().first().children().toArray();
            let posts = [];
            postsHtml.shift();

            postsHtml.forEach(p => {
                //each post is wrapped in a div, so traverse one down first
                p = $(p).find("div").first()[0];
                let tmp = $(p).children().toArray();
                let authorInfo = $(tmp[0]);
                let postInfo = $(tmp[1]);
                let post = {
                    authorImage: authorInfo.find("img")[0].src,
                    authorLink: mediumUrl + substringByString(authorInfo.find("a")[0].href, "/@", "?"),
                    authorName: authorInfo.find("span").first().find("a")[0].innerHTML,
                    postImage: postInfo.find("img")[0].src,
                    postLink: mediumUrl + substringByString(postInfo[0].href, "/p/", "?"),
                    postTitle: postInfo.find("h1")[0].innerHTML
                }

                let newPost = placeholders.template
                    .replace(placeholders.postLink, post.postLink)
                    .replace(placeholders.postTitle, post.postTitle)
                    .replace(placeholders.authorName, post.authorName)
                    .replace(placeholders.postImage, post.postImage);
                $(newPost).hide().appendTo(root).show('slow');
            });
        });
    }

    // remove the template element
    $(templateElement).remove();
    if (useRss) {
        createClapCardsFromRss();
    } else {
        createClapCardsFromHtml();
    }
}