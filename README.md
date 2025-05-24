This md is made just to be a history of the development of the application in this folder

# OBJECTIVE
1. REGISTRATION AND LOGIN
2. RENDERING OF AVAILABLE GAMES
3. INSERT, EDIT AND DELETE A REVIEW

and this are the things i'ma finish today. Good luck (and commit often)

First of all we need a good UI for the index.html so i thought of a carousel with a review youtube-like section below.
I'm gonna use bootstrap to get the job done quickly. I kind of like how it turned out.

Now i need to handle how the data will be fetched from the client and rendered to the page.
Ok, first there will be an initial loading in order to fetch all the games from the database, which will be tranformed into HTML carousel items and associated with a data-game-id.
 
Done. Now i just need to repeat the same process for the reviews but given the fact that always fetching from the database is a 
struggle i mean to put the review data in the localstorage. But doesn't this make the reviews outdated quite quickly? mmm i need ideas

Okay now i cache the data but i put a timestamp so after a certain timer (5min) it will refresh the data. howevere this piece of garbage made me
waste over 40 minutes: "fetch(`router.php?action=getReviews&id_game=${gameId}`);". I wrote this instead "fetch(`router.php?action=getReviews&gameid=${gameId}`);" so the router didn't got the right parameter... *angry noises*