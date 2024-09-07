class Card {
    constructor(description, points) {
        this.description = description;
        this.points = points;
    }

    flip() {
        return new Promise(resolve => {
            console.log("Flipping card...");
            setTimeout(() => {
                console.log(`Description: ${this.description}\nPoints: ${this.points}`);
                resolve();
            }, 1000);
        });
    }
}