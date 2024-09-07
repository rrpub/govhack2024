class Game {
    constructor() {
        this.gameInProgress = false;
        this.currentAge = 15;
        this.maxAge = 25;
        this.yearsLeft = this.maxAge - this.currentAge;
        this.totalPoints = 0;
        this.character = {};
        this.characterPool = {
            'Family Income': {
              'Wealthy Family': 5,
              'Middle Income Family': 4,
              'Low Income Family': 3
            },
            'Location': {
              'Wealthy Suburb': 5,
              'Middle Suburb': 4,
              'Rural': 3, 
              'Low S-E Suburb': 2 
            },
            'Parents Education Level': {
              'Tertiary': 5, 
              'Yr 12': 4,
              'Pre-yr 10': 3
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

    updateStatus() {
        $('#age').text(this.currentAge);
        $('#years-left').text(this.yearsLeft);
        $('#total-points').text(this.totalPoints);
    }

    drawChoice() {
        const card = this.choices[Math.floor(Math.random() * this.choices.length)];
        return card.flip().then(() => {
            this.applyPointsForCard(card);
            this.updateStatus();
        });
    }

    drawLuck() {
        const card = this.lucks[Math.floor(Math.random() * this.lucks.length)];
        return card.flip().then(() => {
            this.applyPointsForCard(card);
            this.updateStatus();
        });
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
