document.getElementById('genBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('userInput').value;
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('resultCard');

    if (!prompt) return alert("Please type prompt!");

    loader.classList.remove('hidden');
    resultCard.classList.add('hidden');

    try {
        const response = await fetch('/get-image-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_prompt: prompt })
        });

        if (!response.ok) throw new Error("Backend Connection Failed!");

        const data = await response.json();

        document.getElementById('imgName').innerText = data.name;
        let finalDescription = data.description;
        if (finalDescription.length > 175) {
            finalDescription = finalDescription.substring(0, 175);
        }
        document.getElementById('imgDesc').innerText = finalDescription;
        document.getElementById('charCount').innerText = `${finalDescription.length} characters`;

        const tagList = document.getElementById('tagList');
        tagList.innerHTML = data.tags.map(tag => {
            return `<span class="tag" onclick="copyTag('${tag}', this)">${tag}</span>`;
        }).join('');

        loader.classList.add('hidden');
        resultCard.classList.remove('hidden');



    } catch (error) {
        console.error("Error", error);
        loader.classList.add('hidden');
    }
});

async function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;

    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
}

document.getElementById('imgName').addEventListener('click', () => copyToClipboard('imgName'));
document.getElementById('imgDesc').addEventListener('click', () => copyToClipboard('imgDesc'));

function copyTag(tag, element) {
    navigator.clipboard.writeText(tag).then(() => {
        element.innerText = "Copied";
        element.classList.add('copied-style');
        setTimeout(() => {
            element.innerText = tag;
            
        }, 2000);
    }).catch(err => {
        console.error("Copy Failed", err)
    });
}
