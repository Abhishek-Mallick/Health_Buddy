const selectImage = document.querySelector(".select-image");
const inputFile = document.querySelector("#file");
const imgArea = document.querySelector(".img-area");

const URL = "https://teachablemachine.withgoogle.com/models/xr97Ebrkv/"; // Replace with the URL where the model and metadata files are located
let model, labelContainer, maxPredictions;

// Load the model and metadata files
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
    } catch (e) {
        console.error("Error loading the model:", e);
        return;
    }

    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    if (!labelContainer) {
        console.error("Label container not found");
        return;
    }

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

// Event listener for the file input element
inputFile.addEventListener("change", async function (event) {
    const file = event.target.files[0];
    const image = document.createElement("img");

    const reader = new FileReader();
    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    reader.onload = async function (event) {
        const allImg = imgArea.querySelectorAll("img");
        allImg.forEach((item) => item.remove());
        const imgUrl = reader.result;
        const img = document.createElement("img");
        img.src = imgUrl;
        imgArea.appendChild(img);
        imgArea.classList.add("active");
        imgArea.dataset.img = file.name; // Use the file name instead of the image name

        image.src = event.target.result;
        image.onload = async function () {
            console.log("Image loaded:", image.src);
            await predict(image); // Use the await keyword when calling predict
        };
    };

    reader.readAsDataURL(file); // Use the file object instead of the image object
});

// Event listener for the select image button
selectImage.addEventListener("click", function () {
    inputFile.click();
});

// Function to make predictions on the image
async function predict(image) {
    if (!model) {
        console.error("Model not loaded");
        return;
    }

    const prediction = await model.predict(image);
    console.log("Prediction:", prediction);

    if (!labelContainer) {
        console.error("Label container not found");
        return;
    }

    // for (let i = 0; i < maxPredictions; i++) {
    //   const classPrediction =
    //     prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    //   labelContainer.childNodes[i].innerHTML = classPrediction;
    // }

    const messages = {
        Yes: "Brain Tumor Detected",
        No: "Brain Tumor not detected",
    };

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        if (prediction[i].probability > 0.5) {
            const message = messages[prediction[i].className];
            labelContainer.childNodes[i].innerHTML = message;
        } else {
            labelContainer.childNodes[i].innerHTML = "";
        }
    }
}

init();
