/**
 * Copyright 2015 Michael Kurze
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [ 'react' ], function( React ) {
   'use strict';

   var widgetModules = {};

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      technology: 'react',
      bootstrap: bootstrap,
      create: create,
      applyViewChanges: function() {}
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function bootstrap( modules ) {
      modules.forEach( function( module ) {
         widgetModules[ module.name ] = module;
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   /**
    * @param {Object}      environment
    * @param {Object}      services
    *
    * @return {Object}
    */
   function create( environment, services ) {

      var isAttached = true;
      var exports = {
         createController: createController,
         domAttachTo: domAttachTo,
         domDetach: domDetach,
         destroy: function() {}
      };

      var widgetName = environment.specification.name;
      var moduleName = widgetName.replace( /^./, function( _ ) { return _.toLowerCase(); } );
      var context = environment.context;
      var controller = null;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function createController( config ) {
         var widgetModule = widgetModules[ moduleName ];
         var injector = createInjector();
         var injections = ( widgetModule.injections || [] ).map( function( injection ) {
            return injector.get( injection );
         } );
         config.onBeforeControllerCreation( environment, injector.get() );
         controller = widgetModule.create.apply( widgetModule, injections );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function domAttachTo( areaElement ) {
         isAttached = true;
         areaElement.appendChild( environment.anchorElement );
         controller.onDomAvailable();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function domDetach() {
         isAttached = false;
         var parent = environment.anchorElement.parentNode;
         if( parent ) {
            parent.removeChild( environment.anchorElement );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function createInjector() {
         var map = {
            axContext: context,
            axEventBus: context.eventBus,
            axFeatures: context.features || {},
            axReactRender: function( componentInstance ) {
               if( isAttached ) {
                  React.render(
                     componentInstance,
                     environment.anchorElement
                  );
               }
            }
         };

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         return {
            get: function( name ) {
               if( arguments.length === 0 ) {
                  return map;
               }

               if( name in map ) {
                  return map[ name ];
               }

               if( name in services ) {
                  return services[ name ];
               }

               throw new Error( 'laxar-react-adapter: Unknown dependency: "' + name + '"' );
            }
         };
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      return exports;

   }

} );
