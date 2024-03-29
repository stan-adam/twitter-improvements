chrome.contextMenus.create(
    {
        id: "save-image",
        title: "Twitter Save Image",
        contexts: ["image", "link"],
    }
);

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!isTwitter(tab.url)) {
        return;
    }
    let url = getCorrespondingUrl(info).split("/");

    if (info.menuItemId === "save-image") {   
        saveTwitterImage(url, info);
    }
})

function isTwitter(url) {
    return (url.split("/")[2] === "twitter.com") || (url.split("/")[2] === "x.com");
}

function getCorrespondingUrl(info) {
    if (isUndefined(info.linkUrl)) {
        return info.pageUrl;
    }
    else {
        return info.linkUrl;
    }
}

function isUndefined(item) {
    return typeof item === 'undefined';
}

function saveTwitterImage(url, info) {
    let img = info.srcUrl.replace(/name=[^&]*/, "name=orig");
    let file_end = img.match(/format=(\w+)/)[1];
    let user = url[3];
    let id = url[5];
    let num = url[7];
    let filename = "[twitter] " + user + " - " + id + " - " + num + "." + file_end;
    
    chrome.downloads.download({
        filename: filename,
        url: img
    });
}

async function download(url, filename) {
    let file_end = url.match(/format=(\w+)/)[1];
    filename += "." + file_end;
    chrome.downloads.download({
        filename: filename,
        url: url
    });
}

async function download_cobalt(url, filename) {
    let api_url = "https://co.wuk.sh/api/json";
    let data = {
        vQuality: "max",
        filenamePattern: "nerdy",
        twitterGif: true,
        url: url
    };
    let requestOptions = {
        method: 'POST',
        headers: {
            Accept: "application/json",
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data)
    };
    let response = await fetch(api_url, requestOptions);
    let json = await response.json();
    let down_url = json.url;
    if(!response.ok) {
        alert("Cobalt Error");
    }
    if(down_url === undefined) {
        let picker = json.picker;
        for (let i = 0; i < picker.length; i++) {
            down_url = picker[i].url;
            let new_file = filename + " - " + (i + 1) + getVideoFileEnd(down_url);
            chrome.downloads.download({
                filename: new_file,
                url: down_url
            });
        }
    }
    else {
        filename += getVideoFileEnd(down_url);
        chrome.downloads.download({
            filename: filename,
            url: down_url
        });
    }
}

function getVideoFileEnd(url) {
    if (url.includes(".mp4")) {
        return ".mp4";
    }
    else {
        return ".gif";
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.thespecialsecret === "download") {
            download(request.downurl, request.downfilename);
        }
        else if (request.thespecialsecret === "download_cobalt") {
            download_cobalt(request.downurl, request.downfilename);
        }
    }
)