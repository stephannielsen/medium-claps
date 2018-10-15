(function() {
    "use strict"; // Start of use strict


    $.getJSON('http://allorigins.me/get?url=https://medium.com/@stephannielsen/has-recommended&callback=?', function(data) {
        console.log($.parseHTML(data.contents));
        var root = $.parseHTML(data.contents).filter(e => e.id === 'root')[0];
        var section = $(root).find("section")[0];
        var container = $(section).children()[1];
        var posts = $(container).children().first().children().toArray();
        posts.shift(); //hei we got all the posts on the page

        posts.forEach(p => {
            //each post is wrapped in a div, so traverse one down first
            p = $(p).find("div").first()[0];
            var tmp = $(p).children().toArray();
            var authorInfo = tmp[0];
            var postInfo = tmp[1];
            var post = {
                authorImage: $(authorInfo).find("img")[0].src,
                authorLink: $(authorInfo).find("a")[0].href,
                authorName: $(authorInfo).find("span").first().find("a")[0].innerHTML,
                postImage: $(postInfo).find("img")[0].src,
                postLink: $(postInfo)[0].href,
                postTitle: $(postInfo).find("h1")[0].innerHTML
            }
            var stats = tmp[2];
            console.log(post);
        });
    });

    //div#root > div > section > 2nd div > div > 2nd div
})();