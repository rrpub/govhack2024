class Game {
    constructor() {
        this.INIT_AGE = 15;
        this.gameInProgress = false;
        this.currentAge = this.INIT_AGE;
        this.maxAge = 24;
        this.yearsLeft = this.maxAge - this.currentAge + 1;
        this.totalPoints = 0;
        this.character = {};
        this.characterPool = {
            'Socio-economic': {
              'Wealthy Family': 5,
              'Middle Income Family': 4,
              'Low Income Family': 3
            },
            'Location/access to education options': {
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
            new Choice('Complete work placement', 2, this.INIT_AGE+1, this.INIT_AGE+10),
            new Choice('Complete micro-credentials', 1, this.INIT_AGE+3, this.INIT_AGE+10), 
            new Choice('Travel', 1, this.INIT_AGE+3, this.INIT_AGE+10), 
            new Choice('Volunteer work', 1, this.INIT_AGE, this.INIT_AGE+10)
        ];
        this.baseLucks = [
            new Card('Natural Disaster', -3),
            new Card('TattsLotto Win!', 4),
            new Card('Health Issues', -3),
            new Card('Parents Divorce', -3),
            new Card('Health Issues', -3),
            new Card('I\'m Broke!', -3)
        ];
        this.currentLucks = [...this.baseLucks];
        this.drawnLucks = new Set();
        this.Lucks_yr12SchoolLeave = [
            new Card('Erratic and Unstable Work Hours', -3),
            new Card('Workplace Accident', -5),
            new Card('Low Wages', -2),
            new Card('Physically Demanding Work', -3),
            new Card('Unexpected Promotion', 2), 
            new Card('Retrenched', -4), 
            new Card('Generous Tips', 2), 
            new Card('Inconsistent Pay', -1)
        ];
        this.Lucks_tertiaryStudents = [
            new Card('Win a Scholarship', 4),
            new Card('Unfulfilled Expectations', -1),
            new Card('Isolation/Loneliness', -1),
            new Card('Job Offer before Graduation', 4),
            new Card('Supportive Educator! (Extra help + Mentorship)', 1),
            new Card('New Friendships', 2),
            new Card('Great Campus Resources', 2),
        ];
        this.choicesForLuck_yr12SchoolLeave = ['Leave education after yr 12'];
        this.choicesForLuck_tertiaryStudents = ['TAFE after yr 12', 'University after yr 12'];
        this.skipLuck = false;
    }

    updateLuckPool(choice){
        if (this.choicesForLuck_yr12SchoolLeave.includes(choice.description)) {
            this.currentLucks.push(...this.Lucks_yr12SchoolLeave);
        } else if (this.choicesForLuck_tertiaryStudents.includes(choice.description)) {
            this.currentLucks = this.currentLucks.filter(luck => !this.Lucks_yr12SchoolLeave.includes(luck));
            this.currentLucks.push(...this.Lucks_tertiaryStudents);
        }
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
        $('#years-left').text(this.yearsLeft+"/10");
        $('#total-points').text(this.totalPoints);
    }

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
            if (selectedChoice.description !== 'Complete micro-credentials' && 
                selectedChoice.description !== 'Access career counselling') {
                selectedChoice.chosen = true;
            }
            this.applyPointsForCard(selectedChoice);
            this.updateStatus();
            this.updateLuckPool(selectedChoice);
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
                    alert(`You chose: ${selectedChoice.description}\nScore: ${selectedChoice.points}`);
                    this.updateChoices();
                    this.updateTurnStatus();
                    $('#draw-choice').prop('disabled', true);
                    this.updateChoices();
                    if(!this.skipLuck){
                        $('#draw-luck').prop('disabled', false);
                    }
                    else{
                        $('#next-year').prop('disabled', false);
                    }
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
        const availableLucks = this.currentLucks.filter(luck => !this.drawnLucks.has(luck));
        if (availableLucks.length === 0) {
            return Promise.resolve(null);  // No more luck cards available
        }
        const luckIndex = Math.floor(Math.random() * availableLucks.length);
        const drawnLuck = availableLucks[luckIndex];
        this.drawnLucks.add(drawnLuck);
        return drawnLuck.flip().then(() => {
            this.applyPointsForCard(drawnLuck);
            this.updateStatus();
        });
    }

    checkLuckPool(){
        if (!this.skipLuck){
            const availableLucks = this.currentLucks.filter(luck => !this.drawnLucks.has(luck));
            if(availableLucks.length === 0) {
                this.skipLuck = true;
                alert("No more luck cards available!");
            }
        }
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
        this.yearsLeft = this.maxAge - this.currentAge + 1;
        this.totalPoints = 0;
        this.character = this.selectCharacterAttributes();
        let html = '<div><h3>Background factors<h3></div>';
        let characterPoints = 0;
        
        for (const [attribute, {value, points}] of Object.entries(this.character)) {
            html += `<p><strong>${attribute}:</strong> ${value} (${points} score)</p>`;
            characterPoints += points;
        }
        
        $('#character-attributes').html(html);
        this.addPoints(characterPoints);
        
        html += `<p><strong>Total Starting Score:</strong> ${characterPoints}</p>`;
        $('#character-attributes').html(html);

        this.updateTurnStatus();
        this.choiceMadeThisTurn = false;
        this.choices.forEach(choice => choice.chosen = false);
        this.updateChoices();
        
        this.currentLucks = [...this.baseLucks];
        this.drawnLucks.clear();
        
        this.gameInProgress = true;
        this.enableAllButtons(); 
        $('#draw-luck, #next-year').prop('disabled', true)
    }

    endGame() {
        alert(`Congratulations! The 10-year period is ended. Your final score is ${this.totalPoints}. You can restart and play the game again.`);
        this.gameInProgress = false;
        this.totalPoints = 0;
        $('#character-attributes').empty();
    }

    isGameInProgress(){
        return this.gameInProgress; 
    }
}
