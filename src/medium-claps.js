(function() {
    "use strict"; // Start of use strict

    const mediumUrl = "https://medium.com"

    // let parser = new RSSParser();
    // parser.parseURL("https://cors-anywhere.herokuapp.com/https://medium.com/feed/@stephannielsen/has-recommended", function(err, feed) {
    //     console.log(feed);
    //     feed.items.forEach(function(entry) {
    //         let postImage = $.parseHTML(entry["content:encoded"]);
    //         console.log(postImage);
    //         // let tmp = $.parseHTML(entry["content:encoded"]).filter(e => e.localName === "figure")[0];
    //         // entry.postImage = tmp.children[0].src;
    //         // console.log(entry.title + ':' + entry.link + ":" + entry.postImage);
    //     })
    // })

    let placeholder = $('.claps-container .post').prop('outerHTML');
    $('.claps-container .post').remove();

    $.getJSON('http://allorigins.me/get?url=https://medium.com/@stephannielsen/has-recommended&callback=?', function(data) {
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

            let newPost = placeholder
                .replace('{{postLink}}', post.postLink)
                .replace('{{postTitle}}', post.postTitle)
                .replace('{{postAuthor}}', post.authorName)
                .replace('{{postImage}}', post.postImage);
            $(newPost).hide().appendTo('.claps-container').show('slow');
            // let stats = tmp[2];
        });
    });

    let substringByString = (full, begin, end) => {
        let startIndex = full.indexOf(begin);
        let endIndex = full.indexOf(end);
        return full.substring(startIndex, endIndex);
    }
})();