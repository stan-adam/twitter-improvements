chrome.contextMenus.create(
    {
        id: "save-image",
        title: "Save Twitter Image",
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
