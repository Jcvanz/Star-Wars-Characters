let currentPageUrl = "https://swapi.dev/api/people/";

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl);
    } catch(error) {
        console.log(error)
        alert("Erro ao carregar cards");
    }

    // Buttons
    const nextButton = document.getElementById("next-button");
    const backButton = document.getElementById("back-button");
    nextButton.addEventListener("click", loadNextPage);
    backButton.addEventListener("click", loadPreviousPage);
};

async function loadCharacters(url) {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = "";

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            const card = document.createElement("div");
            card.style.backgroundImage = `url("https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, '')}.jpg")`
            card.className = "cards";

            const characterNameBg = document.createElement("div")
            characterNameBg.className = "character-name-bg"

            const characterName = document.createElement("span")
            characterName.className = "character-name"
            characterName.innerText = `${character.name}`

            characterNameBg.appendChild(characterName)
            card.appendChild(characterNameBg)

            card.onclick = () => {
                const modal = document.getElementById("modal")
                modal.style.visibility = "visible";

                const modalContent = document.getElementById("modal-content")
                modalContent.innerHTML = "";

                const characterImage = document.createElement("div");
                characterImage.style.backgroundImage = `url("https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, '')}.jpg")`
                characterImage.className = "character-image";

                const name = document.createElement("span")
                name.className = "character-details"
                name.innerText = `Nome: ${character.name}`

                const characterHeight = document.createElement("span")
                characterHeight.className = "character-details"
                characterHeight.innerText = `Altura: ${convertHeight(character.height)}`

                const mass = document.createElement("span")
                mass.className = "character-details"
                mass.innerText = `Peso: ${convertMass(character.mass)}`

                const gender = document.createElement("span")
                gender.className = "character-details"
                gender.innerText = `Genero: ${convertGender(character.gender)}`

                const birthYear = document.createElement("span")
                birthYear.className = "character-details"
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(characterHeight)
                modalContent.appendChild(mass)
                modalContent.appendChild(gender)
                modalContent.appendChild(birthYear)
            }

            mainContent.appendChild(card);    
        });

        const nextButton = document.getElementById("next-button");
        const backButton = document.getElementById("back-button");
        nextButton.disabled = !responseJson.next;
        backButton.disabled = !responseJson.previous;
        backButton.style.visibility = responseJson.previous ? "visible" : "hidden";

        currentPageUrl = url;

    } catch(error) {
        console.log(error, "Erro ao carregar os cards")
    }
}

async function loadNextPage() {
    if(!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();
        
        await loadCharacters(responseJson.next);
    } catch(error) {
        console.log(error, "Erro ao carregar próxima página")
    }
}

async function loadPreviousPage() {
    if(!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();
        
        await loadCharacters(responseJson.previous);
    } catch(error) {
        console.log(error, "Erro ao carregar página anterior")
    }
}

function hideModal() {
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden";
}

function convertGender(gender) {
    const generos = {
        male: "Masculino",
        female: "Feminino",
        hermaphrodite: "Hermafrodita",
        none: "Nenhum",
        unknown: "Desconhecido"
    }

    return generos[gender.toLowerCase()] || gender;
}

function convertHeight(height) {
    if(height === "unknown") {
        return "desconhecida"
    }

    return (height / 100).toFixed(2);
}

function convertMass(mass) {
    if(mass === "unknown") {
        return "desconhecido"
    }

    return `${mass} kg`
}

function convertBirthYear(birthYear) {
    if(birthYear === "unknown") {
        return "desconhecido"
    }

    return birthYear
}