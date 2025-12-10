# Timetable-Generator
A website to generate possible timetables for tuks students to help simplify the timetable process

### Tech stack
NodeJS
Express
React
MongoDB


### System design
The website itself supports a few feauteres. 
The main ones are an open form where an user can add a module themselves, which is stored into the database and every other user from then on has access to that module. Making it a public community driven website.
Secondly allows a user to select what modules they're taking, by marking them on the modules page, and then getting a timetable for these modules. This is done by sending the module list to the backend where the server then sends a handful of the top few best timetables.