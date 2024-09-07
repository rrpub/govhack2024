class Card {
    constructor(description, points) {
        this.description = description;
        this.points = points;
    }

    flip() {
        return new Promise(resolve => {
            const cardElement = this.createCardElement();
            document.body.appendChild(cardElement);

            setTimeout(() => {
                cardElement.classList.add('flipped');
                setTimeout(() => {
                    document.body.removeChild(cardElement);
                    resolve();
                }, 2000);
            }, 100);
        });
    }

    createCardElement() {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <h3>${this.description}</h3>
                    <p>Points: ${this.points}</p>
                </div>
            </div>
        `;
        return card;
    }
}