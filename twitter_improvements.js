(async function() {
    "use strict";

    if (typeof browser === "undefined") {
        var browser = chrome;
    }

    const ENABLE_LOGGING = false;
    const default_settings = {
        vx_button: true,
        image_button: true,
        video_button: true,
        experimental_button: true
    };

    const settings = await getSettings();
    const buttons = getButtonFunctions(settings.experimental_enabled);
    const anchors = getAnchorFunctions();
    const links = getLinkFunctions();
    const filenames = getFilenameFunctions();
    const nodes = getNodeFunctions();

    // Anchor functions

    function getAnchorFunctions() {
        class Anchors {
            static async getTweetAnchorFromTweet(tweet) {
                let share_button = tweet.querySelector('div[aria-label="Share post"]');
                if (share_button === null) return;
                return share_button.parentNode.parentNode;
            }
            
            static async getImageAnchor(media) {
                return media.parentNode; // add first child to this
            }
            
            static async getTweetAnchorFromImage(image) {
                return await this.getTweetAnchorFromTweet(image.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
            }
            
            static async getTweetAnchorFromVideo(video) {
                return await this.getTweetAnchorFromTweet(video.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
            }
        }
        return Anchors;
    }


    // Button Functions

    function getButtonFunctions(experimental) {
        let ButtonFunctions;
        if (experimental) {
            ButtonFunctions = class ExperimentalButtons {      
                static async getVXShareButton(share_button) {
                    let btn = await this.getButtonBaseFromTwitter(share_button);
                    btn.querySelector('path').setAttributeNS(null, "d", "M 18.36 5.64 c -1.95 -1.96 -5.11 -1.96 -7.07 0 l -1.41 1.41 l -1.42 -1.41 l 1.42 -1.42 c 2.73 -2.73 7.16 -2.73 9.9 0 c 2.73 2.74 2.73 7.17 0 9.9 l -1.42 1.42 l -1.41 -1.42 l 1.41 -1.41 c 1.96 -1.96 1.96 -5.12 0 -7.07 z m -2.12 3.53 z m -12.02 0.71 l 1.42 -1.42 l 1.41 1.42 l -1.41 1.41 c -1.96 1.96 -1.96 5.12 0 7.07 c 1.95 1.96 5.11 1.96 7.07 0 l 1.41 -1.41 l 1.42 1.41 l -1.42 1.42 c -2.73 2.73 -7.16 2.73 -9.9 0 c -2.73 -2.74 -2.73 -7.17 0 -9.9 z m 1 5 l 1.2728 -1.2728 l 2.9698 1.2728 l -1.4142 -2.8284 l 1.2728 -1.2728 l 2.2627 6.2225 l -6.364 -2.1213 m 4.9497 -4.9497 l 3.182 1.0607 l 1.0607 3.182 l 1.2728 -1.2728 l -0.7071 -2.1213 l 2.1213 0.7071 l 1.2728 -1.2728 l -3.182 -1.0607 l -1.0607 -3.182 l -1.2728 1.2728 l 0.7071 2.1213 l -2.1213 -0.7071 l -1.2728 1.2728");
                    return btn;
                }
                
                static async getMediaDownloadButton(share_button) {
                    let btn = await this.getButtonBaseFromTwitter(share_button);
                    btn.querySelector('path').setAttributeNS(null, "d", "M 12 17.41 l -5.7 -5.7 l 1.41 -1.42 L 11 13.59 V 4 h 2 V 13.59 l 3.3 -3.3 l 1.41 1.42 L 12 17.41 zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z");
                    return btn;
                }
                
                static async getButtonBaseFromTwitter(share_button) {
                    let button = share_button.cloneNode(true);
                    button.firstChild.firstChild.setAttribute("aria-label", "VX Share");
                    button.firstChild.firstChild.firstChild.addEventListener('mouseover', (elem) => this.onhover(elem));
                    button.firstChild.firstChild.firstChild.addEventListener('mouseout', (elem) => this.stophover(elem));
                    return button;
                }

                static async onhover(elem) {
                    let btn = await this.getButtonParentDiv(elem);
                    btn.firstChild.classList.add("r-1cvl2hr");
                    btn.firstChild.style.color = "";
                    btn.firstChild.firstChild.firstChild.classList.replace("r-1niwhzg", "r-1peqgm7");
                }

                static async stophover(elem) {
                    let btn = await this.getButtonParentDiv(elem);
                    btn.firstChild.classList.remove("r-1cvl2hr");
                    btn.firstChild.style.color = "rgb(113, 118, 123)";
                    btn.firstChild.firstChild.firstChild.classList.replace("r-1peqgm7", "r-1niwhzg");
                }
                
                static async getButtonParentDiv(elem) {
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
                static async getButton(svg_path) {
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

                static async getVXShareButton(share_button) {
                    let div = await this.getButton("M 18.36 5.64 c -1.95 -1.96 -5.11 -1.96 -7.07 0 l -1.41 1.41 l -1.42 -1.41 l 1.42 -1.42 c 2.73 -2.73 7.16 -2.73 9.9 0 c 2.73 2.74 2.73 7.17 0 9.9 l -1.42 1.42 l -1.41 -1.42 l 1.41 -1.41 c 1.96 -1.96 1.96 -5.12 0 -7.07 z m -2.12 3.53 z m -12.02 0.71 l 1.42 -1.42 l 1.41 1.42 l -1.41 1.41 c -1.96 1.96 -1.96 5.12 0 7.07 c 1.95 1.96 5.11 1.96 7.07 0 l 1.41 -1.41 l 1.42 1.41 l -1.42 1.42 c -2.73 2.73 -7.16 2.73 -9.9 0 c -2.73 -2.74 -2.73 -7.17 0 -9.9 z m 1 5 l 1.2728 -1.2728 l 2.9698 1.2728 l -1.4142 -2.8284 l 1.2728 -1.2728 l 2.2627 6.2225 l -6.364 -2.1213 m 4.9497 -4.9497 l 3.182 1.0607 l 1.0607 3.182 l 1.2728 -1.2728 l -0.7071 -2.1213 l 2.1213 0.7071 l 1.2728 -1.2728 l -3.182 -1.0607 l -1.0607 -3.182 l -1.2728 1.2728 l 0.7071 2.1213 l -2.1213 -0.7071 l -1.2728 1.2728");
                    return await this.addClassesToButton(div);
                }

                static async getMediaDownloadButton(share_button) {
                    let div = await this.getButton("M 12 17.41 l -5.7 -5.7 l 1.41 -1.42 L 11 13.59 V 4 h 2 V 13.59 l 3.3 -3.3 l 1.41 1.42 L 12 17.41 zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z");
                    return await this.addClassesToButton(div);
                }

                static async addClassesToButton(div) {
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

    function getLinkFunctions() {
        class Links {
            static async getVXURLFromSplitURL(split_url) {
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
            
            static async getURLFromSplitURL(split_url) {
                let url = split_url[0] + "//";
                for(let i = 2; i < 6; i++) {
                    url += split_url[i] + "/";
                }
                return url;
            }
            
            static async getSplitURLFromTweet(tweet) {
                let url = Array.from(tweet.querySelectorAll('a'))
                            .map(link => link.href.split("/"))
                            .filter(link => link[2] === "twitter.com" || link[2] === "x.com")
                            .filter(link => link[4] === "status")
                return url[0];
            }
            
            static async getURLFromTweet(tweet) {
                let url = await this.getSplitURLFromTweet(tweet);
                return await this.getURLFromSplitURL(url);
            }
            
            static async getVXURLFromTweet(tweet) {
                let url = await this.getSplitURLFromTweet(tweet);
                return await this.getVXURLFromSplitURL(url);
            }
            
            static async getFullResImageURL(media) {
                return media.src.replace(/name=[^&]*/, "name=orig");
            }
        }
        return Links;
    }

    function getFilenameFunctions() {
        class FileFunctions {
            static async getImageFilenameFromMedia(media) {
                let url = window.location.href.split("/")[6];
                if (url === "photo") {
                    url = window.location.href.split("/");
                }
                else {
                    url = media.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('a[href*="/status/"').href.split("/");
                }
                let user = url[3];
                let id = url[5];
                let num = url[7];
                return "[twitter] " + user + " - " + id + " - " + num;
            }
            
            static async getVideoFilenameFromTweet(tweet) {
                let url = await links.getSplitURLFromTweet(tweet);
                let user = url[3];
                let id = url[5];
                return "[twitter] " + user + " - " + id + " - VID";
            }
        }
        return FileFunctions;
    }


    // Storage functions

    async function getSettings() {
        class Settings {
            vx_enabled;
            image_enabled;
            video_enabled;
            experimental_enabled;
        
            static async getExtensionEnabled() {
                return this.vx_enabled || this.image_enabled || this.video_enabled;
            }
        
            static async getStorage() {
                return await browser.storage.local.get();
            }
        
            static async loadSettings() {
                let data = await this.getStorage();
                await this.checkStorageValid(data);
                data = await this.getStorage();
                this.vx_enabled = data["vx_button"];
                this.image_enabled = data["image_button"];
                this.video_enabled = data["video_button"];
                this.experimental_enabled = data["experimental_button"];
            }
        
            static async checkStorageValid(data) {
                for (let option in default_settings) {
                    if (data[option] === undefined) {
                        data = {};
                        data[option] = default_settings[option];
                        chrome.storage.local.set(data);
                    }
                }
            }
        }
        let set = Settings;
        await set.loadSettings();
        return set;
    }


    // Observes new tweets, runs each function on them

    function getNodeFunctions() {
        class Nodes {
            static async getImageNodes(nodes) {
                return nodes.filter(node => node.nodeName === "IMG")
                            .filter(node => node.src.includes("https://pbs.twimg.com/media/"));
            }
        
            static async getVideoNodes(nodes) {  
                return nodes.filter(node => node.nodeName === "DIV")
                            .filter(node => node.querySelector('div[data-testid="videoComponent"]'));
            }
        
            static async getTweetNodes(nodes) {
                return nodes.filter(node => node.nodeName === "DIV")
                            .filter(node => node.attributes.item(0) !== null)
                            .filter(node => node.attributes.item(0).nodeValue === 'cellInnerDiv');
            }

            static async nodes_from_mutation_list(mutationList) {
                return mutationList.map(mutation => mutation.addedNodes)
                                .filter(nodelist => nodelist.length > 0)
                                .map(nodelist => nodelist[0]);
            }
        
            static async node_operations(nodes) {
                settings.vx_enabled && Nodes.getTweetNodes(nodes).then(nodes => nodes.forEach(nodes => Nodes.addVXShareButton(nodes)));
                settings.image_enabled && Nodes.getImageNodes(nodes).then(nodes => nodes.forEach(nodes => Nodes.addSaveImageButton(nodes)));
                settings.video_enabled && Nodes.getVideoNodes(nodes).then(nodes => nodes.forEach(nodes => Nodes.addSaveVideoButton(nodes)));
            }

            static async addVXShareButton(tweet) {
                try {
                    let share_button = await anchors.getTweetAnchorFromTweet(tweet);
                    let vx_button = await buttons.getVXShareButton(share_button);
                    let url = await links.getVXURLFromTweet(tweet);
                    vx_button.onmousedown = () => navigator.clipboard.writeText(url);
                    share_button.after(vx_button);
                    ENABLE_LOGGING && console.log("Created VX Button: " + vx_button);
                }
                catch(error) {
                    ENABLE_LOGGING && console.error("add_vx error: " + error);
                    return;
                }
            }
        
            static async addSaveImageButton(image) {
                try {
                    let anchor = await anchors.getImageAnchor(image);
                    let share_button = await anchors.getTweetAnchorFromImage(image);
                    let download_button = await buttons.getMediaDownloadButton(share_button);
                    let url = await links.getFullResImageURL(image);
                    let filename = await filenames.getImageFilenameFromMedia(image);
                    anchor.appendChild(download_button);
                    download_button.onmousedown = () => chrome.runtime.sendMessage({thespecialsecret: "download", downurl: url, downfilename: filename});
                    ENABLE_LOGGING && console.log("Created Image Download Button: " + download_button);
                }
                catch(error) {
                    ENABLE_LOGGING && console.error("save_image error: " + error);
                    return;
                }
            }
        
            static async addSaveVideoButton(video) {
                try {
                    let share_button = await anchors.getTweetAnchorFromVideo(video);
                    let download_button = await buttons.getMediaDownloadButton(share_button);
                    for(let i = 0; i < 16; i++) {
                        video = video.parentNode;
                    }
                    let filename = await filenames.getVideoFilenameFromTweet(video);
                    let url = encodeURI(await links.getURLFromTweet(video));
                    download_button.onmousedown = () => chrome.runtime.sendMessage({thespecialsecret: "download_cobalt", downurl: url, downfilename: filename});
                    share_button.after(download_button);
                    ENABLE_LOGGING && console.log("Created Video Download Button: " + download_button);
                }
                catch(error) {
                    ENABLE_LOGGING && console.error("save_video error: " + error);
                    return;
                }
            }
        }
        return Nodes;
    }


    async function observer() {
        if(await settings.getExtensionEnabled()) {
            const callback = async (mutationList, observer) => {
                nodes.nodes_from_mutation_list(mutationList).then(nodes.node_operations);
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
        document.addEventListener("DOMContentLoaded", observer());
    } 
    else {
        ENABLE_LOGGING && console.log("Twitter Improvements Ready");
        observer();
    }
})();