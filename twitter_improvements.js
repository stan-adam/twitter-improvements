if (typeof browser === "undefined") {
    var browser = chrome;
}

const ENABLE_LOGGING = false;

const default_settings = {
    vx_button: true,
    image_button: true,
    video_button: true
};
check_storage_values();

let VX_BUTTON;
let DOWNLOAD_BUTTON_IMAGE;
let DOWNLOAD_BUTTON_VIDEO;

// Functions to run on each tweet

async function add_vx(tweet) {
    try {
        let share_button = await get_tweet_anchor(tweet);
        let vx_button = VX_BUTTON.cloneNode(true);
        let url = await get_tweet_url_vx(tweet);
        vx_button.onmousedown = () => navigator.clipboard.writeText(url);
        share_button.after(vx_button);
        ENABLE_LOGGING && console.log("Created VX Button: " + vx_button);
    }
    catch(error) {
        ENABLE_LOGGING && console.error("add_vx error: " + error);
        return;
    }
}

async function save_image(image) {
    try {
        let anchor = await get_image_anchor(image);
        let download_button = DOWNLOAD_BUTTON_IMAGE.cloneNode(true);
        let url = await get_image_full_res_url(image);
        let filename = await get_image_filename(image);
        anchor.appendChild(download_button);
        download_button.onmousedown = () => chrome.runtime.sendMessage({thespecialsecret: "download", downurl: url, downfilename: filename});
        ENABLE_LOGGING && console.log("Created Image Download Button: " + download_button);
    }
    catch(error) {
        ENABLE_LOGGING && console.error("save_image error: " + error);
        return;
    }
}

async function save_video(video) {
    try {
        let anchor = await get_video_anchor(video);
        let download_button = DOWNLOAD_BUTTON_VIDEO.cloneNode(true);
        for(let i = 0; i < 16; i++) {
            video = video.parentNode;
        }
        let filename = await get_video_filename(video);
        let url = encodeURI(await get_tweet_url_normal(video));
        download_button.onmousedown = () => chrome.runtime.sendMessage({thespecialsecret: "download_cobalt", downurl: url, downfilename: filename});
        anchor.after(download_button);
        ENABLE_LOGGING && console.log("Created Video Download Button: " + download_button);
    }
    catch(error) {
        ENABLE_LOGGING && console.error("save_video error: " + error);
        return;
    }
}


// Button Functions

async function get_tweet_anchor(tweet) {
    let share_button = tweet.querySelector('div[aria-label="Share post"]');
    if (share_button === null) return;
    return share_button.parentNode.parentNode;
}

async function get_image_anchor(media) {
    return media.parentNode; // add first child to this
}

async function get_video_anchor(video) {
    return await get_tweet_anchor(video.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
}

async function get_button(svg_path) {
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

async function get_vx_share_button() {
    let div = await get_button("M 18.36 5.64 c -1.95 -1.96 -5.11 -1.96 -7.07 0 l -1.41 1.41 l -1.42 -1.41 l 1.42 -1.42 c 2.73 -2.73 7.16 -2.73 9.9 0 c 2.73 2.74 2.73 7.17 0 9.9 l -1.42 1.42 l -1.41 -1.42 l 1.41 -1.41 c 1.96 -1.96 1.96 -5.12 0 -7.07 z m -2.12 3.53 z m -12.02 0.71 l 1.42 -1.42 l 1.41 1.42 l -1.41 1.41 c -1.96 1.96 -1.96 5.12 0 7.07 c 1.95 1.96 5.11 1.96 7.07 0 l 1.41 -1.41 l 1.42 1.41 l -1.42 1.42 c -2.73 2.73 -7.16 2.73 -9.9 0 c -2.73 -2.74 -2.73 -7.17 0 -9.9 z m 1 5 l 1.2728 -1.2728 l 2.9698 1.2728 l -1.4142 -2.8284 l 1.2728 -1.2728 l 2.2627 6.2225 l -6.364 -2.1213 m 4.9497 -4.9497 l 3.182 1.0607 l 1.0607 3.182 l 1.2728 -1.2728 l -0.7071 -2.1213 l 2.1213 0.7071 l 1.2728 -1.2728 l -3.182 -1.0607 l -1.0607 -3.182 l -1.2728 1.2728 l 0.7071 2.1213 l -2.1213 -0.7071 l -1.2728 1.2728");
    return await add_share_bar_classes_to_div(div);
}

async function get_video_download_button() {
    let div = await get_button("M 12 17.41 l -5.7 -5.7 l 1.41 -1.42 L 11 13.59 V 4 h 2 V 13.59 l 3.3 -3.3 l 1.41 1.42 L 12 17.41 zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z");
    return await add_share_bar_classes_to_div(div);
}

async function add_share_bar_classes_to_div(div) {
    div.classList.add("usybuttondiv");
    div.firstChild.classList.add("usybuttonclickdiv");
    div.firstChild.firstChild.classList.add("usybutton");
    return div;
}

async function get_image_download_button() {
    let div = await get_button("M 12 17.41 l -5.7 -5.7 l 1.41 -1.42 L 11 13.59 V 4 h 2 V 13.59 l 3.3 -3.3 l 1.41 1.42 L 12 17.41 zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z");
    div.classList.add("usybuttondiv", "usyimagediv");
    div.firstChild.classList.add("usybuttonclickdiv");
    div.firstChild.firstChild.classList.add("usybutton", "usydownloadbutton");
    return div;
}


// Helper functions

async function get_tweet_url_as_vx_from_split(split_url) {
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

async function split_link_to_normal(split_url) {
    let url = split_url[0] + "//";
    for(let i = 2; i < 6; i++) {
        url += split_url[i] + "/";
    }
    return url;
}

async function get_tweet_url_split(tweet) {
    let url = Array.from(tweet.querySelectorAll('a'))
                   .map(link => link.href.split("/"))
                   .filter(link => link[2] === "twitter.com" || link[2] === "x.com")
                   .filter(link => link[4] === "status")
    return url[0];
}

async function get_tweet_url_normal(tweet) {
    let url = await get_tweet_url_split(tweet);
    return await split_link_to_normal(url);
}

async function get_tweet_url_vx(tweet) {
    let url = await get_tweet_url_split(tweet);
    return await get_tweet_url_as_vx_from_split(url);
}

async function get_image_full_res_url(media) {
    return media.src.replace(/name=[^&]*/, "name=orig");
}

async function get_image_filename(media) {
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

async function get_video_filename(tweet) {
    let url = await get_tweet_url_split(tweet);
    let user = url[3];
    let id = url[5];
    return "[twitter] " + user + " - " + id + " - VID";
}


// Storage functions

async function get_storage_values() {
    let data = await browser.storage.local.get();
    let vx_enabled = data["vx_button"];
    let image_enabled = data["image_button"];
    let video_enabled = data["video_button"];
    return [vx_enabled, image_enabled, video_enabled];
}

async function check_storage_values() {
    let vx, image, video = await get_storage_values();
    if (vx === undefined || image === undefined || video === undefined) {
        chrome.storage.local.set(default_settings);
    }
}


// Observes new tweets, runs each function on them

async function init_buttons() {
    VX_BUTTON = await get_vx_share_button();
    DOWNLOAD_BUTTON_IMAGE = await get_image_download_button();
    DOWNLOAD_BUTTON_VIDEO = await get_video_download_button();
}

async function get_image_nodes(nodes) {
    return nodes.filter(node => node.nodeName === "IMG")
                .filter(node => node.src.includes("https://pbs.twimg.com/media/"));
}

async function get_video_nodes(nodes) {  
    return nodes.filter(node => node.nodeName === "DIV")
                .filter(node => node.querySelector('div[data-testid="videoComponent"]'));
}

async function get_tweet_nodes(nodes) {
    return nodes.filter(node => node.nodeName === "DIV")
                .filter(node => node.attributes.item(0) !== null)
                .filter(node => node.attributes.item(0).nodeValue === 'cellInnerDiv');
}

async function tweet_observer() {
    let [vx, image, video] = await get_storage_values();

    if(vx || image || video) {
        await init_buttons();

        const callback = async (mutationList, observer) => {
            let nodes = mutationList.map(mutation => mutation.addedNodes)
                                    .filter(nodelist => nodelist.length > 0)
                                    .map(nodelist => nodelist[0]);
            
            vx && get_tweet_nodes(nodes).then(nodes => nodes.forEach(node => add_vx(node)));
            image && get_image_nodes(nodes).then(nodes => nodes.forEach(node => save_image(node)));
            video && get_video_nodes(nodes).then(nodes => nodes.forEach(node => save_video(node)));
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