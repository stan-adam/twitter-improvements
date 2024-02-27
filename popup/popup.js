assign_button_to_page(document.getElementById("reversing"), "reverse_page/image_to_source.html");
assign_button_to_page(document.getElementById("settings"), "settings/settings.html");

function assign_button_to_page(button, page_path) {
    button.addEventListener('click', () => {
        let createData = {
            url: chrome.runtime.getURL(page_path)
        };
        chrome.tabs.create(createData);
        window.close();
    })
}
