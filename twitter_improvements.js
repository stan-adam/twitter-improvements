if (typeof browser === "undefined") {
    var browser = chrome;
}

const ENABLE_LOGGING = true;

const default_settings = {
    vx_button: true,
    image_button: true,
    video_button: true,
    experimental_button: true
};


class Settings {
    vx_enabled;
    image_enabled;
    video_enabled;
    experimental_enabled;
    
    constructor(data) {
        this.vx_enabled = data["vx_button"];
        this.image_enabled = data["image_button"];
        this.video_enabled = data["video_button"];
        this.experimental_enabled = data["experimental_button"];
    }
}

async function main() {

    const SETTINGS = await load_settings();
    const BUTTONS = getButtonClass(SETTINGS.experimental_enabled);
    const ANCHORS = getAnchorsClass();
    const LINKS = getLinkClass();
    const FILENAMES = getFilenameClass();

    // Functions to run on each tweet

    async function add_vx(tweet) {
        try {
            let share_button = await ANCHORS.get_tweet_anchor(tweet);
            let vx_button = await BUTTONS.get_vx_button(share_button);
            let url = await LINKS.get_tweet_url_vx(tweet);
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
            let anchor = await ANCHORS.get_image_anchor(image);
            let share_button = await ANCHORS.get_image_share_button(image);
            let download_button = await BUTTONS.get_media_button(share_button);
            let url = await LINKS.get_image_full_res_url(image);
            let filename = await FILENAMES.get_image_filename(image);
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
            let share_button = await ANCHORS.get_video_anchor(video);
            let download_button = await BUTTONS.get_media_button(share_button);
            for(let i = 0; i < 16; i++) {
                video = video.parentNode;
            }
            let filename = await FILENAMES.get_video_filename(video);
            let url = encodeURI(await LINKS.get_tweet_url_normal(video));
            download_button.onmousedown = () => chrome.runtime.sendMessage({thespecialsecret: "download_cobalt", downurl: url, downfilename: filename});
            share_button.after(download_button);
            ENABLE_LOGGING && console.log("Created Video Download Button: " + download_button);
        }
        catch(error) {
            ENABLE_LOGGING && console.error("save_video error: " + error);
            return;
        }
    }


    // Anchor functions

    function getAnchorsClass() {
        class Anchors {
            static async get_tweet_anchor(tweet) {
                let share_button = tweet.querySelector('div[aria-label="Share post"]');
                if (share_button === null) return;
                return share_button.parentNode.parentNode;
            }
            
            static async get_image_anchor(media) {
                return media.parentNode; // add first child to this
            }
            
            static async get_image_share_button(image) {
                return await Anchors.get_tweet_anchor(image.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
            }
            
            static async get_video_anchor(video) {
                return await Anchors.get_tweet_anchor(video.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
            }
        }
        return Anchors;
    }


    // Button Functions

    function getButtonClass(experimental) {
        let ButtonFunctions;
        if (experimental) {
            ButtonFunctions = class ExperimentalButtons {      
                static async get_vx_button(share_button) {
                    let btn = await ExperimentalButtons.get_button_from_original(share_button);
                    btn.querySelector('path').setAttributeNS(null, "d", "M 18.36 5.64 c -1.95 -1.96 -5.11 -1.96 -7.07 0 l -1.41 1.41 l -1.42 -1.41 l 1.42 -1.42 c 2.73 -2.73 7.16 -2.73 9.9 0 c 2.73 2.74 2.73 7.17 0 9.9 l -1.42 1.42 l -1.41 -1.42 l 1.41 -1.41 c 1.96 -1.96 1.96 -5.12 0 -7.07 z m -2.12 3.53 z m -12.02 0.71 l 1.42 -1.42 l 1.41 1.42 l -1.41 1.41 c -1.96 1.96 -1.96 5.12 0 7.07 c 1.95 1.96 5.11 1.96 7.07 0 l 1.41 -1.41 l 1.42 1.41 l -1.42 1.42 c -2.73 2.73 -7.16 2.73 -9.9 0 c -2.73 -2.74 -2.73 -7.17 0 -9.9 z m 1 5 l 1.2728 -1.2728 l 2.9698 1.2728 l -1.4142 -2.8284 l 1.2728 -1.2728 l 2.2627 6.2225 l -6.364 -2.1213 m 4.9497 -4.9497 l 3.182 1.0607 l 1.0607 3.182 l 1.2728 -1.2728 l -0.7071 -2.1213 l 2.1213 0.7071 l 1.2728 -1.2728 l -3.182 -1.0607 l -1.0607 -3.182 l -1.2728 1.2728 l 0.7071 2.1213 l -2.1213 -0.7071 l -1.2728 1.2728");
                    return btn;
                }
                
                static async get_media_button(share_button) {
                    let btn = await ExperimentalButtons.get_button_from_original(share_button);
                    btn.querySelector('path').setAttributeNS(null, "d", "M 12 17.41 l -5.7 -5.7 l 1.41 -1.42 L 11 13.59 V 4 h 2 V 13.59 l 3.3 -3.3 l 1.41 1.42 L 12 17.41 zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z");
                    return btn;
                }
                
                static async get_button_from_original(share_button) {
                    let button = share_button.cloneNode(true);
                    button.firstChild.firstChild.setAttribute("aria-label", "VX Share");
                
                    button.firstChild.firstChild.firstChild.addEventListener('mouseover', async (elem) => {
                        let btn = await ExperimentalButtons.get_parent_div(elem);
                        btn.firstChild.classList.add("r-1cvl2hr");
                        btn.firstChild.style.color = "";
                        btn.firstChild.firstChild.firstChild.classList.replace("r-1niwhzg", "r-1peqgm7");
                    });
                
                    button.firstChild.firstChild.firstChild.addEventListener('mouseout', async (elem) => {
                        let btn = await ExperimentalButtons.get_parent_div(elem);
                        btn.firstChild.classList.remove("r-1cvl2hr");
                        btn.firstChild.style.color = "rgb(113, 118, 123)";
                        btn.firstChild.firstChild.firstChild.classList.replace("r-1peqgm7", "r-1niwhzg");
                    });
                    return button;
                }
                
                static async get_parent_div(elem) {
                    let btn = elem.target;
                    switch (elem.target.nodeName) {
                        case "DIV":
                            if (elem.target.role === "button") break;
                            else if (elem.target.dir === "ltr") btn = btn.parentNode;
                            else if (elem.target.classList.length === 2) btn = btn.parentNode.parentNode;
                            else btn = btn.parentNode.parentNode.parentNode;
                            break;
                        case "svg":
                            btn = btn.parentNode.parentNode.parentNode;
                            break;
                        case "g":
                            btn = btn.parentNode.parentNode.parentNode.parentNode;
                            break;
                        case "path":
                            btn = btn.parentNode.parentNode.parentNode.parentNode.parentNode;
                            break;
                    }
                    return btn;
                }
            }
        }
        else {
            ButtonFunctions = class ClassicButtons {
                static async get_button(svg_path) {
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

                static async get_vx_button(share_button) {
                    let div = await ClassicButtons.get_button("M 18.36 5.64 c -1.95 -1.96 -5.11 -1.96 -7.07 0 l -1.41 1.41 l -1.42 -1.41 l 1.42 -1.42 c 2.73 -2.73 7.16 -2.73 9.9 0 c 2.73 2.74 2.73 7.17 0 9.9 l -1.42 1.42 l -1.41 -1.42 l 1.41 -1.41 c 1.96 -1.96 1.96 -5.12 0 -7.07 z m -2.12 3.53 z m -12.02 0.71 l 1.42 -1.42 l 1.41 1.42 l -1.41 1.41 c -1.96 1.96 -1.96 5.12 0 7.07 c 1.95 1.96 5.11 1.96 7.07 0 l 1.41 -1.41 l 1.42 1.41 l -1.42 1.42 c -2.73 2.73 -7.16 2.73 -9.9 0 c -2.73 -2.74 -2.73 -7.17 0 -9.9 z m 1 5 l 1.2728 -1.2728 l 2.9698 1.2728 l -1.4142 -2.8284 l 1.2728 -1.2728 l 2.2627 6.2225 l -6.364 -2.1213 m 4.9497 -4.9497 l 3.182 1.0607 l 1.0607 3.182 l 1.2728 -1.2728 l -0.7071 -2.1213 l 2.1213 0.7071 l 1.2728 -1.2728 l -3.182 -1.0607 l -1.0607 -3.182 l -1.2728 1.2728 l 0.7071 2.1213 l -2.1213 -0.7071 l -1.2728 1.2728");
                    return await ClassicButtons.add_share_bar_classes_to_div(div);
                }

                static async get_media_button(share_button) {
                    let div = await ClassicButtons.get_button("M 12 17.41 l -5.7 -5.7 l 1.41 -1.42 L 11 13.59 V 4 h 2 V 13.59 l 3.3 -3.3 l 1.41 1.42 L 12 17.41 zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z");
                    return await ClassicButtons.add_share_bar_classes_to_div(div);
                }

                static async add_share_bar_classes_to_div(div) {
                    div.classList.add("usybuttondiv");
                    div.firstChild.classList.add("usybuttonclickdiv");
                    div.firstChild.firstChild.classList.add("usybutton");
                    return div;
                }
            }
        }
        return ButtonFunctions;
    }


    // Helper functions

    function getLinkClass() {
        class Links {
            static async get_tweet_url_as_vx_from_split(split_url) {
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
            
            static async split_link_to_normal(split_url) {
                let url = split_url[0] + "//";
                for(let i = 2; i < 6; i++) {
                    url += split_url[i] + "/";
                }
                return url;
            }
            
            static async get_tweet_url_split(tweet) {
                let url = Array.from(tweet.querySelectorAll('a'))
                            .map(link => link.href.split("/"))
                            .filter(link => link[2] === "twitter.com" || link[2] === "x.com")
                            .filter(link => link[4] === "status")
                return url[0];
            }
            
            static async get_tweet_url_normal(tweet) {
                let url = await Links.get_tweet_url_split(tweet);
                return await Links.split_link_to_normal(url);
            }
            
            static async get_tweet_url_vx(tweet) {
                let url = await Links.get_tweet_url_split(tweet);
                return await Links.get_tweet_url_as_vx_from_split(url);
            }
            
            static async get_image_full_res_url(media) {
                return media.src.replace(/name=[^&]*/, "name=orig");
            }
        }
        return Links;
    }

    function getFilenameClass() {
        class FileFunctions {
            static async get_image_filename(media) {
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
            
            static async get_video_filename(tweet) {
                let url = await LINKS.get_tweet_url_split(tweet);
                let user = url[3];
                let id = url[5];
                return "[twitter] " + user + " - " + id + " - VID";
            }
        }
        return FileFunctions;
    }

    async function nodes_from_mutation_list(mutationList) {
        return mutationList.map(mutation => mutation.addedNodes)
                        .filter(nodelist => nodelist.length > 0)
                        .map(nodelist => nodelist[0]);
    }

    async function node_operations(nodes) {
        SETTINGS.vx_enabled && get_tweet_nodes(nodes).then(nodes => nodes.forEach(node => add_vx(node)));
        SETTINGS.image_enabled && get_image_nodes(nodes).then(nodes => nodes.forEach(node => save_image(node)));
        SETTINGS.video_enabled && get_video_nodes(nodes).then(nodes => nodes.forEach(node => save_video(node)));
    }


    // Storage functions

    async function get_storage() {
        return await browser.storage.local.get();
    }

    async function load_settings() {
        let data = await get_storage();
        await check_storage_valid(data);
        data = await get_storage();
        return new Settings(data);
    }

    async function check_storage_valid(data) {
        for (option in default_settings) {
            if (data[option] === undefined) {
                data = {};
                data[option] = default_settings[option];
                chrome.storage.local.set(data);
            }
        }
    }


    // Observes new tweets, runs each function on them

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
        if(SETTINGS.vx_enabled || SETTINGS.image_enabled || SETTINGS.video_enabled) {
            const callback = async (mutationList, observer) => {
                nodes_from_mutation_list(mutationList).then(node_operations);
            }
        
            const observerConfig = {
                subtree: true,
                childList: true
            }
            let targetNode = document.body;
            const init_observer = new MutationObserver(callback);
            init_observer.observe(targetNode, observerConfig);
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
}
main();