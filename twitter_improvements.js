const ENABLE_LOGGING = false;
const TWEET_FUNCTIONS = [add_vx];


// Functions to run on each tweet

async function add_vx(tweet) {
    try {
        let share_button = await getTweetButtonPositionAnchor(tweet);
        let vx_button = await createButton("SVG/copy_vx.svg");
        let url = await getVX_URL(tweet);
        vx_button.onmousedown = () => navigator.clipboard.writeText(url);
        share_button.after(vx_button);
        ENABLE_LOGGING && console.log("Created VX Button: " + vx_button);
    }
    catch(error) {
        ENABLE_LOGGING && console.error("add_vx error: " + error);
        return;
    }
}

// async function save_media(tweet) {
//     try {
//         // let media_anchor = get anchor on media
        
//         // let tweet_media = get media

//         if(tweet_media.length ) {
//             return;
//         }
//         let save_image_button = await createButton("SVG/download.svg");
//         let url = await get_tweet_url(tweet);

//         save_image_button.onmousedown = () => {
//             let image = tweet_media[0];
//             let file_end = image.match(/format=(\w+)/)[1];
//             let user = url[3];
//             let id = url[5];
//             let filename = "[twitter] " + user + " - " + id + "." + file_end;
//             chrome.downloads.download({
//                 filename: filename,
//                 url: image
//             });
//         };

//         // media_anchor.after(save_image_button); add button to media
//         ENABLE_LOGGING && console.log("Created Save Media Button: " + save_image_button);
//     }
//     catch(error) {
//         ENABLE_LOGGING && console.error("save_media error: " + error);
//         return;
//     }
// }


// Button Functions

async function getTweetButtonPositionAnchor(tweet) {
    let share_button = tweet.querySelector('div[aria-label="Share post"]');
    if (share_button === null) return;
    return share_button.parentNode.parentNode;
}

async function createButton(icon_svg_url) {
    let div = document.createElement("div");
    let clickable_div = document.createElement("div");
    let btn = document.createElement("button");
    if(icon_svg_url !== null) {
        btn.innerHTML = await (await fetch(chrome.runtime.getURL(icon_svg_url))).text();
    }
    clickable_div.appendChild(btn);
    div.appendChild(clickable_div);
    btn.classList.add("usybutton");
    clickable_div.classList.add("usyclickdiv");
    div.classList.add("usydiv");
    return div;
}


// Helper functions

async function splitLinkAsVX(split_url) {
    let vx_url = split_url[0];
    if (split_url[2] === "twitter.com") {
        vx_url += "//vx";
    }
    else {
        vx_url += "//fixv";
    }
    for(let i = 2; i < 6; i++) {
        vx_url += split_url[i] + "/";
    }
    return vx_url;
}

async function get_tweet_url(tweet) {
    let url = Array.from(tweet.querySelectorAll('a'))
                   .map(link => link.href.split("/"))
                   .filter(link => link[2] === "twitter.com" || link[2] === "x.com")
                   .filter(link => link[4] === "status")
    return url[0];
}

async function getVX_URL(tweet) {
    let url = await get_tweet_url(tweet);
    return await splitLinkAsVX(url);
}

// async function get_tweet_images(tweet) {
//     let images = tweet.querySelectorAll("img[src*='pbs.twimg.com/media/']");
//     return Array.from(images);
// }

// async function get_tweet_videos(tweet) {
//     return Array.from(tweet.querySelectorAll('img[src*="pbs.twimg.com/ext_tw_video_thumb"]'));
// }

// async function get_tweet_gifs(tweet) {
//     return Array.from(tweet.querySelectorAll('video[src*="video.twimg.com/video"]'));
// }

// Observes new tweets, runs each function on them

async function tweet_observer(functions_array) {
    const callback = (mutationList, observer) => {
        mutationList.map(mutation => mutation.addedNodes)
                    .filter(nodelist => nodelist.length > 0)
                    .map(nodelist => nodelist[0])
                    .filter(node => node.attributes.item(0) !== null)
                    .filter(node => node.attributes.item(0).nodeValue === 'cellInnerDiv')
                    .forEach(node => {
                        ENABLE_LOGGING && console.log("Tweet: " + node);
                        functions_array.forEach(func => func(node))
                    });
    }

    const observerConfig = {
        subtree: true,
        childList: true
    }
    let targetNode = document.body;
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, observerConfig);
    ENABLE_LOGGING && console.log("Mutation Observer Started");
}


// Run when page is load, initialises tweet observation

if (document.readyState === "loading") {
    ENABLE_LOGGING && console.log("Twitter Improvements Ready");
    document.addEventListener("DOMContentLoaded", tweet_observer(TWEET_FUNCTIONS));
} 
else {
    ENABLE_LOGGING && console.log("Twitter Improvements Ready");
    tweet_observer(TWEET_FUNCTIONS);
}