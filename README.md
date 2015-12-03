# BucketList Back-End

### Team

* Kelvin Ma - Project Lead
* Allie Sebastian - Back End Lead
* Wil Trahan - Front End Lead

### Project Details

Besides finishing WDI, you surely have one or two things you'd love to do with your life. Let's get 'em on paper! You could integrate with a third-party location-based API to allow users to search for a location or venue to add to their bucket list items.

Reach Goal: Add social features to your site, such as following other users. Allow users to make certain list items public, but default to private.

### Generate a New Express App

- Kelvin created a git repo
- Allie generated the express app. (`express --hbs --git --force`)
- Allie performd the 'initial' commit. (`git add . && git commit -m 'Initial commit'`)
- Allie installed dependencies. (`npm install`)

### User Stories that influenced the Back End

As a user, I want to be able to add the places I search to my list.

- The back end will recieve a call on a route and add a venue to the users list.
- Success equals item is now on todo list.

As a user, I want to be able to update the note.

- The back end will recieve a call on a route and update a note to the users list.
- Success equals list item now has a note.

As a user I want to be able to delete items from the list.

- The back end will revieve a call on a route and delete the object (venue and note) from list
- Success equals item no longer on list.
