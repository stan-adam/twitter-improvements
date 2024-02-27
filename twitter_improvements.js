const ENABLE_LOGGING = false;
const TWEET_FUNCTIONS = async (tweet) => {
    add_vx(tweet);
};
const MEDIA_FUNCTIONS = async (media) => {
    save_media(media);
};

let VX_BUTTON;
let DOWNLOAD_BUTTON;

// Functions to run on each tweet

async function add_vx(tweet) {
    try {
        let share_button = await getTweetButtonPositionAnchor(tweet);
        let vx_button = VX_BUTTON.cloneNode(true);
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

async function save_media(media) {
    try {
        let anchor = await getMediaButtonPositionAnchor(media);
        let download_button = DOWNLOAD_BUTTON.cloneNode(true);
        if (media.nodeName === "IMG") {
            let url = await getOriginalImageUrl(media);
            let filename = await getImageFileName(media);
            anchor.appendChild(download_button);
            download_button.onmousedown = () => {
                chrome.runtime.sendMessage({thespecialsecret: "download", downurl: url, downfilename: filename});
            };
        }
        else {
            anchor.appendChild(download_button);
        }

        // ENABLE_LOGGING && console.log("Created Save Media Button: ");
    }
    catch(error) {
        ENABLE_LOGGING && console.error("save_media error: " + error);
        console.error("save_media error: " + error);
        return;
    }
}


// Button Functions

async function getTweetButtonPositionAnchor(tweet) {
    let share_button = tweet.querySelector('div[aria-label="Share post"]');
    if (share_button === null) return;
    return share_button.parentNode.parentNode;
}

async function getMediaButtonPositionAnchor(media) {
    if(media.nodeName === "IMG") {
        return media.parentNode; // add first child to this
    }
    else {
        try {
            return media.parentNode.parentNode.parentNode.childList[1].firstChild.firstChild.childList[3].firstChild.childList[1].childList[1];
        }
        catch {
            return media.parentNode.parentNode.parentNode.childList[1].firstChild.firstChild;
        }
    }
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
    return div;
}

async function createVXButton() {
    let div = await createButton("M 18.36 5.64 c -1.95 -1.96 -5.11 -1.96 -7.07 0 l -1.41 1.41 l -1.42 -1.41 l 1.42 -1.42 c 2.73 -2.73 7.16 -2.73 9.9 0 c 2.73 2.74 2.73 7.17 0 9.9 l -1.42 1.42 l -1.41 -1.42 l 1.41 -1.41 c 1.96 -1.96 1.96 -5.12 0 -7.07 z m -2.12 3.53 z m -12.02 0.71 l 1.42 -1.42 l 1.41 1.42 l -1.41 1.41 c -1.96 1.96 -1.96 5.12 0 7.07 c 1.95 1.96 5.11 1.96 7.07 0 l 1.41 -1.41 l 1.42 1.41 l -1.42 1.42 c -2.73 2.73 -7.16 2.73 -9.9 0 c -2.73 -2.74 -2.73 -7.17 0 -9.9 z m 1 5 l 1.2728 -1.2728 l 2.9698 1.2728 l -1.4142 -2.8284 l 1.2728 -1.2728 l 2.2627 6.2225 l -6.364 -2.1213 m 4.9497 -4.9497 l 3.182 1.0607 l 1.0607 3.182 l 1.2728 -1.2728 l -0.7071 -2.1213 l 2.1213 0.7071 l 1.2728 -1.2728 l -3.182 -1.0607 l -1.0607 -3.182 l -1.2728 1.2728 l 0.7071 2.1213 l -2.1213 -0.7071 l -1.2728 1.2728");
    div.classList.add("usybuttondiv");
    div.firstChild.classList.add("usybuttonclickdiv");
    div.firstChild.firstChild.classList.add("usybutton");
    return div;
}

async function createDownloadButton() {
    let div = await createButton("M 12 17.41 l -5.7 -5.7 l 1.41 -1.42 L 11 13.59 V 4 h 2 V 13.59 l 3.3 -3.3 l 1.41 1.42 L 12 17.41 zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z");
    div.classList.add("usybuttondiv", "usyimagediv");
    div.firstChild.classList.add("usybuttonclickdiv");
    div.firstChild.firstChild.classList.add("usybutton", "usydownloadbutton");
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

async function get_split_tweet_url(tweet) {
    let url = Array.from(tweet.querySelectorAll('a'))
                   .map(link => link.href.split("/"))
                   .filter(link => link[2] === "twitter.com" || link[2] === "x.com")
                   .filter(link => link[4] === "status")
    return url[0];
}

async function getVX_URL(tweet) {
    let url = await get_split_tweet_url(tweet);
    return await splitLinkAsVX(url);
}

async function getOriginalImageUrl(media) {
    return media.src.replace(/name=[^&]*/, "name=orig");
}

async function getImageFileName(media) {
    let url = window.location.href.split("/")[6];
    if (url === "photo") {
        url = window.location.href.split("/");
    }
    else {
        url = media.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('a[href*="/status/"').href.split("/");
    }
    let src_url = media.src;
    let file_end = src_url.match(/format=(\w+)/)[1];
    let user = url[3];
    let id = url[5];
    let num = url[7];
    return "[twitter] " + user + " - " + id + " - " + num + "." + file_end;
}


// Observes new tweets, runs each function on them

async function init_buttons() {
    VX_BUTTON = await createVXButton();
    DOWNLOAD_BUTTON = await createDownloadButton();
}

async function getImageNodes(nodes) {
    return nodes.filter(node => node.nodeName === "IMG")
                .filter(node => node.src.includes("https://pbs.twimg.com/media/"));
}

async function getVideoNodes(nodes) {
    // return nodes.filter(node => node.nodeName === "DIV")
    //             .filter(node => node.querySelector('video[poster*="https://pbs.twimg.com/ext_tw_video_thumb/"]') || node.querySelector('video[poster*="https://pbs.twimg.com/amplify_video_thumb/"]'));
    
    // return nodes.filter(node => node.nodeName === "DIV")
    //             .filter(node => node.querySelector('div[data-testid="videoComponent"]'));

    return nodes.filter(node => node.nodeName === "VIDEO");
}

async function getTweetNodes(nodes) {
    return nodes.filter(node => node.nodeName === "DIV")
                .filter(node => node.attributes.item(0) !== null)
                .filter(node => node.attributes.item(0).nodeValue === 'cellInnerDiv');
}

async function tweet_observer() {
    await init_buttons();

    const callback = async (mutationList, observer) => {
        let nodes = mutationList.map(mutation => mutation.addedNodes)
                                .filter(nodelist => nodelist.length > 0)
                                .map(nodelist => nodelist[0]);
        
        getTweetNodes(nodes).then(nodes => nodes.forEach(node => TWEET_FUNCTIONS(node)));
        getImageNodes(nodes).then(nodes => nodes.forEach(node => MEDIA_FUNCTIONS(node)));
        // getVideoNodes(nodes).then(nodes => nodes.forEach(node => MEDIA_FUNCTIONS(node)));
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
    document.addEventListener("DOMContentLoaded", tweet_observer());
} 
else {
    ENABLE_LOGGING && console.log("Twitter Improvements Ready");
    tweet_observer();
}