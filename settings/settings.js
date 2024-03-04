const VX_BUTTON_SETTING = "vx_button"
const IMAGE_BUTTON_SETTING = "image_button"
const VIDEO_BUTTON_SETTING = "video_button"

async function setButtons() {
    document.getElementById("vx_button").checked = await get_value(VX_BUTTON_SETTING);
    document.getElementById("image_button").checked = await get_value(IMAGE_BUTTON_SETTING);
    document.getElementById("video_button").checked = await get_value(VIDEO_BUTTON_SETTING);
}

document.getElementById("vx_button_label").onmousedown = () => toggle_value(VX_BUTTON_SETTING);
document.getElementById("image_button_label").onmousedown = () => toggle_value(IMAGE_BUTTON_SETTING);
document.getElementById("video_button_label").onmousedown = () => toggle_value(VIDEO_BUTTON_SETTING);

async function get_value(value) {
    let data = await browser.storage.local.get([value]);
    let enabled = data[value];
    if (enabled === undefined) {
        data = {};
        data[value] = true;
        chrome.storage.local.set(data);
        enabled = true;
    }
    return enabled;
}

async function toggle_value(value) {
    let current_value = await get_value(value);
    let data = {};
    data[value] = !current_value;
    chrome.storage.local.set(data);
}

setButtons();