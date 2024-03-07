if (typeof browser === "undefined") {
    var browser = chrome;
}

const DIV = document.body.querySelector("DIV");

const main = [
    ["vx_button", "Enable Share as VX Button", true], 
    ["image_button", "Enable Image Download Buttons", true],
    ["video_button", "Enable Video/GIF Download Buttons", true],
    ["experimental_button", "Enable Experimental (better looking) buttons", true],
]

const dev = [
    ["error_logging_enabled", "Enable Error Logging", false],
    ["info_logging_enabled", "Enable Info Logging", false]
]

const options = {
    General: main,
    Developer: dev
}

for (let section in options) {
    let outer = document.createElement("DIV");
    let label = document.createElement("LABEL");
    label.innerText = section + ":";
    outer.appendChild(label);

    for (let i = 0; i < options[section].length; i++) {
        button = create_button(options[section][i]).then(node => outer.appendChild(node));
    };

    DIV.appendChild(outer);
}

async function create_button(button) {
    let outer = document.createElement("DIV");

    let name_label = document.createElement("LABEL");
    name_label.innerText = button[1];
    name_label.setAttribute("for", button[0]);

    let toggle = document.createElement("LABEL");
    toggle.classList.add("switch");
    toggle.id = button[0] + "_label";

    let input_elem = document.createElement("INPUT");
    input_elem.setAttribute("type", "checkbox");
    input_elem.id = button[0];
    input_elem.checked = await get_value(button[0], button[2]);

    let span_elem = document.createElement("SPAN");
    span_elem.classList.add("slider", "round");

    toggle.appendChild(input_elem);
    toggle.appendChild(span_elem);

    outer.appendChild(name_label);
    outer.appendChild(toggle);

    toggle.onclick = () => toggle_value(button[0]);
    return outer;
}

async function get_value(value) {
    return get_value(value, true);
}

async function get_value(value, def) {
    let data = await browser.storage.local.get([value]);
    let enabled = data[value];
    if (enabled === undefined) {
        data = {};
        data[value] = def;
        chrome.storage.local.set(data);
        enabled = def;
    }
    return enabled;
}

async function toggle_value(value) {
    let current_value = await get_value(value);
    let data = {};
    data[value] = !current_value;
    chrome.storage.local.set(data);
}
