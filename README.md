# Food Tracker Project

This was a final capstone project for a javascript course.

The project keeps track of toatal daily calories intake, based on provided information of meal type and measurement of carbs, protein and fat.

The project implements a graphical representation of data with the help of an external library, [Chart.js](https://www.chartjs.org/docs/2.9.4/).

The project implements a delete button that takes off each cards from the screen but upon refresh it returns to the screen again, and this is due to some limitation of the API that was provided and used.

## Challenges 

I faced some challenges working with this particular API, due to some restrictions,
- The values of the API were not editable, i.e the food entries could not be changed or personalised.
- The API didnt grant permission for deleting, therefore an entry could not be deleted from the API, only from the DOM locally. Hence, the reason for the deleted entries returning to the screen onced refreshed.
- During the project, we were expected to make use of a snackbar UI to update users of certain changes during usage, however, i was not able to implement this, due to difficulty using the library. i did not implement the feature.

 Overall this project was a great way to test and demonstrate my javascript skills, and put to test the things i have learnt so far, and carry on more practice on other areas where i am lacking.