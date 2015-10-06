/**
 * Copyright 2015 Michael Kurze
 * Released under the MIT license
 */
require( [
   'laxar',
   'laxar-application-dependencies',
   'json!laxar-application/var/flows/main/resources.json',
   'laxar-react-adapter'
], function( ax, applicationDependencies, resources, reactAdapter ) {
   'use strict';

   // prepare file listings for efficient asset loading
   // listing contents are determined by the Gruntfile.js
   window.laxar.fileListings = {
      application: resources,
      bower_components: resources,
      includes: resources
   };

   ax.bootstrap( applicationDependencies, [ reactAdapter ] );
} );
