(function() {
    "use strict"; // Start of use strict


    $.getJSON('http://allorigins.me/get?url=https://medium.com/@stephannielsen/has-recommended&callback=?', function(data) {
        console.log($.parseHTML(data.contents));
        // filterArticles($.parseHTML(data.contents));
    });

    // fetch('https://allorigins.me/get?method=raw&url=' + encodeURIComponent('https://medium.com/@stephannielsen/has-recommended') + '&callback=?', {
    //         method: "GET",
    //         mode: "no-cors",
    //         credentials: "same-origin",
    //         cache: "no-cache",
    //         redirect: "follow",
    //         referrer: "no-referrer"
    //     })
    //     .then(function(response) {
    //         return response.text();
    //     }) 
    //     .then(function(body) {
    //         filterArticles($.parseHTML(body))
    //     });

    // var filterArticles = function(html) {
    //     var $root = $(html.filter(function(element) { return element.id === 'root'; })[0]
    //         .children[0]
    //         .children[0]
    //         .children[1] //section
    //         .children[0]
    //         .children[1]); //container
    //     var author = $root[0]
    //         .children[0]
    //         .children[0]
    //         .children[0]
    //         .children[0]
    //         .children[0] //s ct ei
    //         .children[0]
    //         .children[0]; //<a> with author link
    //     var authorLink = author[0].href;
    //     var authorName =
    //         var post = $root[0]
    //             .children[0]
    //             .children[1]; //<a> with post link
    //     var all = getLinks($root[0]);
    //     links.forEach(function(element) { console.log(element) });
    //     // var children = root.children;
    //     // children
    //     //     .filter(function(element) { return element.nodeName === 'a'; })
    //     //     .forEach(function(element) { console.log(element) });
    //     // var links = html.filter(node => node.no)
    // }

    // var beginWith = "/p/";

    // function getLinks(element) {
    //     var links = [];
    //     if (element.href && element.href.startsWith(beginWith))
    //         return element;
    //     element.children.forEach(function(chil d) {
    //         links.push(getLinks(child));
    //         links = links.concat(getLinks(child));
    //     })
    //     return links;
    // }

    // function getLinks(element) {
    //     var links = [];
    //     var beginWith =
    //     root.children.filter(categories, function(c) {
    //         return c["parent_id"] === id;
    //     }).forEach(function(c) {
    //         children.push(c);
    //         children = children.concat(getChildren(c.category_id, categories));
    //     })

    //     return children;
    // }
})();