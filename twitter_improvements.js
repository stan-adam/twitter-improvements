const ENABLE_LOGGING = false;
const TWEET_FUNCTIONS = [add_vx];

const VX_PATH = "M 18.36 5.64 c -1.95 -1.96 -5.11 -1.96 -7.07 0 l -1.41 1.41 l -1.42 -1.41 l 1.42 -1.42 c 2.73 -2.73 7.16 -2.73 9.9 0 c 2.73 2.74 2.73 7.17 0 9.9 l -1.42 1.42 l -1.41 -1.42 l 1.41 -1.41 c 1.96 -1.96 1.96 -5.12 0 -7.07 z m -2.12 3.53 z m -12.02 0.71 l 1.42 -1.42 l 1.41 1.42 l -1.41 1.41 c -1.96 1.96 -1.96 5.12 0 7.07 c 1.95 1.96 5.11 1.96 7.07 0 l 1.41 -1.41 l 1.42 1.41 l -1.42 1.42 c -2.73 2.73 -7.16 2.73 -9.9 0 c -2.73 -2.74 -2.73 -7.17 0 -9.9 z m 1 5 l 1.2728 -1.2728 l 2.9698 1.2728 l -1.4142 -2.8284 l 1.2728 -1.2728 l 2.2627 6.2225 l -6.364 -2.1213 m 4.9497 -4.9497 l 3.182 1.0607 l 1.0607 3.182 l 1.2728 -1.2728 l -0.7071 -2.1213 l 2.1213 0.7071 l 1.2728 -1.2728 l -3.182 -1.0607 l -1.0607 -3.182 l -1.2728 1.2728 l 0.7071 2.1213 l -2.1213 -0.7071 l -1.2728 1.2728";
const DOWNLOAD_PATH = "M 12 17.41 l -5.7 -5.7 l 1.41 -1.42 L 11 13.59 V 4 h 2 V 13.59 l 3.3 -3.3 l 1.41 1.42 L 12 17.41 zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z";


// Functions to run on each tweet

async function add_vx(tweet) {
    try {
        let share_button = await getTweetButtonPositionAnchor(tweet);
        let vx_button = await createButton(VX_PATH);
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

async function createButton(svg_path) {
    let div = document.createElement("div");
    let clickable_div = document.createElement("div");
    let btn = document.createElement("button");
    if(svg_path !== null) {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        svg.setAttributeNS(null, 'viewBox', "0 0 24 24");
        path.setAttributeNS(null, "d", svg_path);
        svg.appendChild(path);
        btn.appendChild(svg);
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