if (typeof browser === "undefined") {
    var browser = chrome;
}

const DIV = document.body.querySelector("DIV");

const buttons = [
    ["vx_button", "Enable Share as VX Button"], 
    ["image_button", "Enable Image Download Buttons"],
    ["video_button", "Enable Video/GIF Download Buttons"],
    ["experimental_button", "Enable Experimental (better looking) buttons"]
]

for (let i = 0; i < buttons.length; i++) create_button(buttons[i]);

async function create_button(button) {
    let outer = document.createElement("DIV");

    let name_label = document.createElement("LABEL");
    name_label.innerHTML = button[1];
    name_label.setAttribute("for", button[0]);

    let toggle = document.createElement("LABEL");
    toggle.classList.add("switch");
    toggle.id = button[0] + "_label";

    let input_elem = document.createElement("INPUT");
    input_elem.setAttribute("type", "checkbox");
    input_elem.id = button[0];
    input_elem.checked = await get_value(button[0]);

    let span_elem = document.createElement("SPAN");
    span_elem.classList.add("slider", "round");

    toggle.appendChild(input_elem);
    toggle.appendChild(span_elem);

    outer.appendChild(name_label);
    outer.appendChild(toggle);

    DIV.appendChild(outer);

    toggle.onclick = () => toggle_value(button[0]);
}

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