/**
 * Copyright 2015 Michael Kurze
 * Released under the MIT license
 */
define( [
   'json!../widget.json',
   'laxar-react-adapter',
   'laxar-mocks'
], function( descriptor, axReactAdapter, axMocks ) {
   'use strict';

   // Minimalistic test setup. More information:
   // https://github.com/LaxarJS/laxar-mocks/blob/master/docs/manuals/index.md
   describe( 'The url-lookup-widget', function() {

      beforeEach( axMocks.createSetupForWidget( descriptor, {
         adapter: axReactAdapter,
         knownMissingResources: [ 'default.theme/url-lookup-widget.html' ]
      } ) );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      beforeEach( function() {
         axMocks.widget.configure( {} );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      beforeEach( axMocks.widget.load );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'subscribes', function() {
         expect( axMocks.widget.axEventBus.subscribe ).toHaveBeenCalled();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( axMocks.tearDown );

   } );

} );
