// See https://github.com/LaxarJS/laxar/blob/master/docs/manuals/configuration.md
window.laxar = ( function() {
   'use strict';

   var modeAttribute = 'data-ax-application-mode';
   var mode = document.querySelector( 'script[' + modeAttribute + ']' ).getAttribute( modeAttribute );

   return {
      name: 'kurzd',
      description: 'A URL shortener for use as an ElasticSearch plugin',
      theme: 'default',

      widgets: {
         kurzd: {
            elasticsearch: {
               host: 'localhost:9200',
               index: 'kurzd'
            }
         }
      },

      useEmbeddedFileListings: mode === 'PRODUCTION',
      useMergedCss: mode === 'PRODUCTION',
      eventBusTimeoutMs: (mode === 'PRODUCTION' ? 120 : 10) * 1000,

   };

} )();
