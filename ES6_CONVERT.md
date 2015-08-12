# Converting the Site to ES6

The old site files are in app_old, the new ones are in app.

The new version uses ES6 Classes and Modules.  All the visual stuff is a component (an Angular directive), there's no plain 'controllers'.
Each component get's it's own folder with a JS file, a Stylus file and an HTML file.  A typical JS component file looks like this:

<code>
import template from './home.html';
import './home.styl';

class Home {
  // Don't leave out this annotation
  /*@ngInject*/
  constructor(){
    this.name = 'home';
    this.template = template;
    this.restrict = 'E';
    this.scope = {};
  }

  controller($scope, $attrs, $element){
    // directive's controller function
  }

  link(scope){
    // directives link function
  }

}

export default Home;
</code>

## Case is important! The class name should start with a Capital letter, so should the JS file name.

Each compnent must be registered with the application, that's done in app.js.  The app.js file imports all the needed classes at the top, configures the routes, then
registers all the directives and services.

<code>
register('app')
  .directive('shell', Shell)
  // first argument becomes the tag name used to include this directive, see the home route and how it includes '<home></home>'
  // second argument is the imported class.
  .directive('home', Home);
</code>

# The build
The new build uses Gulp instead of Grunt, there are two tasks you need now to run the site

```
gulp build:dev
```
bundles all the files

```
gulp serve
```
starts a simple webserver

# Other Changes
* References to "Campaign" in the code have mostly been converted to "PAC" for correctness
* Not using the Title service for now.
* Not converting the meat of the controller and link functions for each directive over to more ES6y code.  Just copy+past the meat of those functions for now.

# TODO
* Convert the rest of the Campaign Detail page over to ES6 (new one should be PacDetail)
* Convert the footer
* Conver the all Oregon Page (uses the PacDetail page code)
* Write gulp task to copy fonts and images to 'dist' folder

# Campaign Detail Page Conversion
The old campaign detail page is a controller (app_old/scripts/controllers/campaign.js) that uses several directives:
* simple-radial (already converted to Radial),
* who-chart
* spending-chart
* data-slider-chart
* money-by-state

These all use data retrieved by the old CampaignService.  The methods necessary haven't been moved over to the new PacService yet.  Some of those are pretty meaty but it's very copy+paste.

New components should be:
* app/
  * components/
    * pac/
      * detail/
        * PacDetail
    * donations/
      * list/
        * DonationsList (from who-chart)
      * map/
        * DonationsMap (from moenty-by-state)
    * spending/
      * Spending (from spending-chart)
    * histogram/
      * Histogram (from data-slider-chart)
