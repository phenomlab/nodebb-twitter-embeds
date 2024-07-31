function loadTwitterScript(callback) {
    if (typeof twttr !== 'undefined' && twttr.widgets) {
        // Twitter script is already loaded
        callback();
        return;
    }

    // Create and load the Twitter script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.onload = callback;
    script.onerror = function() {
        console.error('Failed to load Twitter script.');
    };
    document.head.appendChild(script);
}

function embedTweets() {
    // Regular expression to match tweet URLs within <a> tags
    const tweetUrlRegex = /<a\s+[^>]*href="(https?:\/\/x\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+))(?:\?[^\s]*)?"[^>]*>/g;

    // Regular expression to match tweet URLs outside of <a> tags
    const externalTweetUrlRegex = /https?:\/\/x\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)(?:\?[^\s]*)?/g;

    // Get the content of the body or a specific element
    let content = $('[component="topic"]').html();

    // Replace tweet URLs within <a> tags with a placeholder div
    content = content.replace(tweetUrlRegex, function(match, url, p1, p2, p3) {
        // Extract tweet ID
        const tweetId = p3;
        return `<div data-tweet-id="${tweetId}" class="tweet-placeholder"></div>`;
    });

    // Remove URLs outside of <a> tags
    content = content.replace(externalTweetUrlRegex, '');

    // Update the content
    $('[component="topic"]').html(content);

    // Embed the tweets
    $(".tweet-placeholder").each(function() {
        const tweetId = $(this).data("tweet-id");
        // Create a tweet widget
        twttr.widgets.createTweet(
            tweetId,
            this,
            // Uncomment any functionality you want to disable
            {
                conversation: 'none',    // Hide conversation thread
                //cards: 'hidden',         // Hide media cards
                //linkColor: '#cc0000',    // Customize link color
                //theme: 'light'           // Set tweet theme
            }
        ).then(function() {
            console.log('Tweet ID ' + tweetId + ' embedded successfully');
        }).catch(function(error) {
            console.error('Error embedding tweet ID ' + tweetId, error);
        });
    });
}

// Attach the function to relevant events
$(window).on('action:ajaxify.end action:posts.loaded action:chat.loaded', function(data) {
    // Load Twitter script and then embed tweets
    loadTwitterScript(embedTweets);
});
