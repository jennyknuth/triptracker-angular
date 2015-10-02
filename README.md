#Trip Tracker Online

A web application for [Boulder Valley School District's Trip Tracker program] (http://www.bvsd.org/transportation/toschool/tracker/Pages/default.aspx) that rewards kids for taking alternative transportation to school.

[Trip Tracker Online] (http://development.triptracker.divshot.io/#/) aims to provide a fun and engaging way for students to record their trips and chart their progress online. It uses strategic color coding and data-driven graphics.  
See a live demo here: [http://development.triptracker.divshot.io/#/](http://development.triptracker.divshot.io/#/)

The back end is in a separate repo found here: [https://github.com/jennyknuth/triptracker](https://github.com/jennyknuth/triptracker). It serves up trip data from mongoDB to an API via an Express/Node.js server. (Please be patient when first loading…it currently uses free hosting and must first "wake up"). 

On the front end, a thick AngularJS client allows users to view, create, edit, and delete their trips.

Charts are D3.js custom directives in AngularJS. 

