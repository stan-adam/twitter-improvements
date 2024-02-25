let picker = document.getElementById("file");
picker.addEventListener('drop', e => {
    reverseFile(e.target.files[0]);
});
picker.addEventListener('change', e => {
    reverseFile(e.target.files[0]);
});

function reverseFile(file) {
    let name = file.name.split(" ");
    if (name[0] === "[twitter]") {
        chrome.tabs.create({
            url: "https://twitter.com/" + name[1] + "/status/" + name[3].split(".")[0]
        });
    }
    else {
        alert("Not a twitter file: " + name);
    }
}
  