class Game {
    constructor() {
        this.INIT_AGE = 15;
        this.gameInProgress = false;
        this.currentAge = this.INIT_AGE;
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
        this.choiceMadeThisTurn = false;
        this.choices = [
            new Choice('Complete Yr 10 work experience', 1, this.INIT_AGE, this.INIT_AGE),
            new Choice('Part time job during school years', 3, this.INIT_AGE, this.INIT_AGE+2),
            new Choice('Leave education after yr 12', -1, this.INIT_AGE+2, this.INIT_AGE+2),
            new Choice('Start on apprenticeship', 4, this.INIT_AGE+1, this.INIT_AGE+2),
            new Choice('TAFE after yr 12', 3, this.INIT_AGE+3, this.INIT_AGE+3), 
            new Choice('University after yr 12', 5, this.INIT_AGE+3, this.INIT_AGE+3), 
            new Choice('Start a job after yr 12', 1, this.INIT_AGE+3, this.INIT_AGE+3),  
            new Choice('Leave study before completion', -3, this.INIT_AGE+3, this.INIT_AGE+10),
            new Choice('Transition from TAFE to university', 2, this.INIT_AGE+4, this.INIT_AGE+10, 'TAFE after yr 12'), 
            new Choice('Access career counselling', 3, this.INIT_AGE, this.INIT_AGE+10),
            new Choice('Do the Morrisby test', 3, this.INIT_AGE, this.INIT_AGE),
            new Choice('Start a business', 3, this.INIT_AGE+3, this.INIT_AGE+10),
            new Choice('Get a licence, buy a car', 3, this.INIT_AGE+3, this.INIT_AGE+10),
            new Choice('Complete work placement', 2, this.INIT_AGE, this.INIT_AGE+10),
            new Choice('Complete Micro-credentials', 1, this.INIT_AGE+3, this.INIT_AGE+10)
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

    /*
    drawChoice() {
        const card = this.choices[Math.floor(Math.random() * this.choices.length)];
        return card.flip().then(() => {
            this.applyPointsForCard(card);
            this.updateStatus();
        });
    }
    */
    getAvailableChoices() {
        return this.choices.filter(choice => 
            !choice.chosen &&
            this.currentAge >= choice.minAge &&
            this.currentAge <= choice.maxAge &&
            (choice.prerequisite === null || this.choices.find(c => c.description === choice.prerequisite && c.chosen))
        );
    }

    makeChoice(choiceIndex) {
        if (this.choiceMadeThisTurn) {
            alert("You've already made a choice this turn.");
            return null;
        }
        const availableChoices = this.getAvailableChoices();
        const selectedChoice = availableChoices[choiceIndex];
        if (selectedChoice) {
            selectedChoice.chosen = true;
            this.applyPointsForCard(selectedChoice);
            this.updateStatus();
            this.choiceMadeThisTurn = true;
            return selectedChoice;
        }
        return null;
    }

    updateChoices() {
        const availableChoices = this.getAvailableChoices();
        const choicesList = $('#choices-list');
        choicesList.empty();
        availableChoices.forEach((choice, index) => {
            const li = $('<li>').text(choice.description).addClass('choice-item');
            li.click(() => {
                const selectedChoice = this.makeChoice(index);
                if (selectedChoice) {
                    alert(`You chose: ${selectedChoice.description}\nPoints: ${selectedChoice.points}`);
                    this.updateChoices();
                    this.updateTurnStatus();
                    $('#draw-choice').prop('disabled', true);
                    this.updateChoices();
                    $('#draw-luck').prop('disabled', false);
                }
            });
            choicesList.append(li);
        });
    }

    updateTurnStatus() {
        const turnStatus = $('#turn-status');
        if (this.choiceMadeThisTurn) {
            turnStatus.text("You've made your choice for this turn.");
            $('#draw-choice').prop('disabled', true);
        } else {
            turnStatus.text("You can make a choice this turn.");
            $('#draw-choice').prop('disabled', false);
        }
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
            this.choiceMadeThisTurn = false;
            return true;
        }
        return false;
    }

    startNewGame() {
        this.currentAge = 15;
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

        this.updateTurnStatus();
        this.choiceMadeThisTurn = false;
        this.choices.forEach(choice => choice.chosen = false);
        this.updateChoices();
        
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
