class Game {
    constructor() {
        this.gameInProgress = false;
        this.currentAge = 16;
        this.maxAge = 25;
        this.yearsLeft = this.maxAge - this.currentAge;
        this.totalPoints = 0;
        this.character = {};
        this.characterPool = {
            'Family Income': {
              'Low Income': 10,
              'Medium Income': 20,
              'High Income': 30
            },
            'Location': {
              'Rural': 10,
              'Suburban': 20,
              'Urban': 30
            },
            'Parents Education Level': {
              'High School': 10,
              'Bachelor\'s Degree': 20,
              'Master\'s Degree': 30,
              'PhD': 40
            }
        };
        this.choices = [
            new Card('Choose a part-time job', 10),
            new Card('Volunteer for a community project', 5),
            new Card('Take a summer internship', 15),
        ];
        this.lucks = [
            new Card('You found a lucky $100 bill!', 100),
            new Card('You lost your wallet', -50),
            new Card('Won a small scholarship', 30),
        ];
    }

    disableAllButtons() {
        $('#draw-choice, #draw-luck, #next-year').prop('disabled', true).addClass('blurred');
    }

    enableAllButtons() {
        $('#draw-choice, #draw-luck, #next-year').prop('disabled', false).removeClass('blurred');
    }

    selectCharacterAttributes() {
        const selected = {};
        for (const [attribute, options] of Object.entries(this.characterPool)) {
            const keys = Object.keys(options);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            selected[attribute] = {value: randomKey, points: options[randomKey]};
        }
        return selected;
    }

    getStatus() {
        return {
            currentAge: this.currentAge,
            yearsLeft: this.yearsLeft,
            totalPoints: this.totalPoints
        };
    }

    drawChoice() {
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }

    drawLuck() {
        return this.lucks[Math.floor(Math.random() * this.lucks.length)];
    }

    applyPointsForCard(card) {
        this.totalPoints += card.points;
    }

    addPoints(points) {
        this.totalPoints += points;
    }

    nextYear() {
        if (this.currentAge < this.maxAge) {
            this.currentAge++;
            this.yearsLeft--;
            return true;
        }
        return false;
    }

    startNewGame() {
        this.currentAge = 16;
        this.maxAge = 25;
        this.yearsLeft = this.maxAge - this.currentAge;
        this.totalPoints = 0;
        this.character = this.selectCharacterAttributes();
        let html = '';
        let characterPoints = 0;
        
        for (const [attribute, {value, points}] of Object.entries(this.character)) {
            html += `<p><strong>${attribute}:</strong> ${value} (${points} points)</p>`;
            characterPoints += points;
        }
        
        $('#character-attributes').html(html);
        this.addPoints(characterPoints);
        
        html += `<p><strong>Total Starting Points:</strong> ${characterPoints}</p>`;
        $('#character-attributes').html(html);
        
        this.gameInProgress = true;
        this.enableAllButtons(); 
        $('#draw-luck, #next-year').prop('disabled', true)
    }

    endGame() {
        alert(`Game Over! Your final score is: ${this.totalPoints} points.`);
        this.gameInProgress = false;
        this.totalPoints = 0;
        $('#character-attributes').empty();
    }

    isGameInProgress(){
        return this.gameInProgress; 
    }
}
