<!-- omit in toc -->
# Frustration.

<!-- omit in toc -->
## Table of Contents
- [Description](#description)
- [Features](#features)
- [Future Developments](#future-developments)
- [Credits](#credits)
- [Developers](#developers)
- [Deployed Site](#deployed-site)

## Description
```
Many of us fondly remember training our memories playing card matching games when we were children. Many of us also spend a good deal of time online checking out photos of animals and beautiful places. What if an app could combine these pursuits in a challenging and fun game? Frustration. is the solution. An application that combines the brain-training fun of a memory game with high-quality dynamically-updated images in an exciting and challenging game. 

The memory game that will leave you in Frustration. in a race against the clock! Pick your topic and the level of difficulty, and try to find all the matching cards. The faster you are, the bigger the time bonus that will be added to your score. But be careful, for each mismatch you get, you will lose a point! Get playing and beat the Frustration.
```

## Features
* User gets to pick difficulty level: easy, moderate, hard
  * easy
    * default difficulty if the user did not select one
    * displays a 4x3 grid of cards - 12 cards, 6 matches
    * timer is 120 seconds and user gets the time left over from their game added to their score as a time bonus
  * moderate
    * displays a 5x4 grid of cards - 20 cards, 10 matches
    * timer is 150 seconds and user gets the (time left over * 2) added to their score as a time bonus
  * hard
    * displays a 6x5 grid of cards - 30 cards, 15 matches
    * timer is 150 seconds and user gets the (time left over * 3) added to their score as a time bonus
* User also gets to pick a topic for the pictures: landscapes (the default), dogs, cats
* Displays an overlay while the game loads and starts a countdown when it's finished
* User clicks a card and they will flip over, if the 2 cards are a mismatch they will flip back over, else stay picture side up
* Scoring system 
  * For every match the user gains +5 points
  * For every mismatch the user loses -1 point
  * At the end of the game their final score is the (points gained from the game + the time bonus) 
* User name submission to enter the leaderboard 
* A separate leaderboard for each level that are all saved locally, displaying the users ranking in the top 10 from highest to lowest
    * All scores that are of the same value are given an equal rank
    * The leaderboard displayed after user name submission at the end of the game highlights the user's score. If the user does not make the top 10 it will still display their score and their rank but not the scores in between
    * The leaderboard displayed from the 'Hall of Fame' button on the landing page displays the 'easy' leaderboard by default, but the user is able to pick which leaderboard to view

## Future Developments
* Moving leaderboards from local storage to cloud storage, to provide the ability to play against players worldwide
* Adding more topics, therefore sourcing different APIs and finding APIs that have a faster load rate
* Increase match complexity for different levels
  * Easy: match two cards with the same picture
  * Moderate: match a word with a slightly obscurely related picture 
  * Hard: match two pictures that are both very obscurely related

## Credits
* Materialize CSS
* [jQuery Flip](https://nnattawat.github.io/flip/) - Nattawat Nonsung
* Dog and landscape photos provided by [Pexels API](https://www.pexels.com/) 
* Cat photos provided by [The Cat API](https://thecatapi.com/)

## Developers
* Diana Stebbins - [@dianastebbins](https://github.com/dianastebbins)
* John Huntsperger - [@Huelsdonk](https://github.com/Huelsdonk)
* Olga Sadova - [@OlgaSadova](https://github.com/OlgaSadova)
* Shaidee Alingcastre - [@sali6798](https://github.com/sali6798)

## Deployed Site
[Frustration.](https://sali6798.github.io/memory-game/)
