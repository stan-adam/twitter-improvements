const vx_button = document.getElementById("vx_button");
const download_button = document.getElementById("download_button");

async function setButtons() {
    vx_button.checked = await get_value("vx_button_enabled");
    download_button.checked = await get_value("download_button_enabled");
}

vx_button.addEventListener("change", () => {
    chrome.storage.local.set(
        {
            "vx_button_enabled": !get_value("vx_button_enabled")
        }
    );
});

download_button.addEventListener("change", () => {
    chrome.storage.local.set(
        {
            "download_button_enabled": !get_value("download_button_enabled")
        }
    );
});

async function get_value(value) {
    let return_value = await chrome.storage.local.get(value, data => {
        if(value in data) {
            return data[value];
        }
        else {
            chrome.storage.local.set({value: true});
            return true;
        }
    });
    console.log(return_value);
    return return_value;
}

setButtons();