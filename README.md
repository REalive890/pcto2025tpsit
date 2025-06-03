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

Okay here we are again. Now i need to implement in this project session management. So first of all start a session whenever I ask
something to the router because there is where the client matters to be authenticated or checked in or out of a session. If you think of
it isn't that the place (the router) where the customer can take action?
Now in order to do this i just need a line of code but to authenticate myself i need to follow more steps. So, after reading out snippet of codes
that my teacher wrote on github, it seems that the authentication is just a simple cicle: 

the action requires privileges? If this is the case i'll just check whether you are in a session(if not just start it) and that you're given your id_user, else in this case  you'll acquire it by logging in ( a router action).

The role of the login method of controller is ensure the safety and the proper login by calling the model which will likely just do a simple compare. Let's do this!

After several tries i concluded that i need to refactor and clean my code. Also i need to implement the feature of changing view, hence the view folder. I'll make bind functions: bind DOM obejects to their meant event listener and the view bind so that the browser sees on page what i'm doing

errore greve, piuttosto greve, non mi son ricordadto di rimpiazzare la connessione database ai controller user.

# AFTERWARDS
now it is really late so i don't think it is worthy to continue however this project was cute in someway so i'd like just to give him a proper ending before leaving it to the lost directories of everlasting projects.


cheklist:
* clean the code
first let's clean js'


need to make the admin log. I'll just return data from the login controller-model so that i can make a check on the script to load the admin view or the client one

Today's goal: allow the admin to CRUD the reviews and the games.

need to create the create methods, both for game and reviews admin. Now i need to refactor and clean all my mess

tried to logout... it did't end well: the reviews didn't appear, so what i need to do is bind the html when it logs out

continuing to refactor

I think i need to put some order in this mess, i have too much js files and all of them are somehow separated but still need one another to function. This is just useless.

The idea is to divide all the js' in their component dominio, the only exceptions are script.js,user.js and utilities.js

the idea is to just link them to their html as i've done with with the style.

first one: login.html

doesn0tìì't work this method, it would be some kind of html injection so obviously it just does not work,
how about just starting the binding when the component loads? Like The main does.

nothing i'll just create chunker methods