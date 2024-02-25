document.getElementById("settings-button").addEventListener('click', () => {
    let createData = {
        url: chrome.runtime.getURL("reverse_page/image_to_source.html")
    };
    chrome.tabs.create(createData);
    window.close();
});
