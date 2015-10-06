import ax from 'laxar';

const injections = [ 'axEventBus', 'axFeatures', 'axFlowService', 'axConfiguration' ];

function create( eventBus, features, flowService, configuration ) {

   const { floor, random, pow } = Math;

   // do not try to deploy this at scale...
   const numAlpha = 3;
   const numNum = 3;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   eventBus.subscribe( 'takeActionRequest.' + features.lookup.action, ({ data: { key } }) => {
      const { action, resource } = features.lookup;
      eventBus.publish( 'willTakeAction.' + action, { action } );

      lookup( key ).then( ({ url }) => {
         console.log( 'lookup: ', key, url ); // :TODO: Delete
         eventBus.publish( 'didReplace.' + resource, {
            resource,
            data: { url, key }
         } );
         eventBus.publish( 'didTakeAction.' + action, { action } );
      } );
   } );


   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   eventBus.subscribe( 'takeActionRequest.' + features.shorten.action, ({ data: { url } }) => {
      const { action, resource } = features.shorten;
      eventBus.publish( 'willTakeAction.' + action, { action } );

      shorten( url ).then( ({ key }) => {
         const shortUrl = flowService.constructAbsoluteUrl( 'x', { key } );
         eventBus.publish( 'didReplace.' + features.shorten.resource, {
            resource,
            data: { url, key, shortUrl }
         } );
         eventBus.publish( 'didTakeAction.' + action, { action } );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function generateKey() {
      const numericPart =
         pow( 10, numNum - 1 ) +
         floor( random() * 9*pow( 10, numNum - 1 ) );

      const alphaOffset = 'a'.charCodeAt( 0 );
      const alphaRange = 26;

      const alphaPart = [];
      for( var i = 0; i < numAlpha; ++i ) {
         alphaPart.push(
            String.fromCharCode( alphaOffset + floor( random() * alphaRange ) )
         );
      }
      return alphaPart.join( '' ) + numericPart;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function lookup( key ) {
      return fetch( mappingUrl( key ), { method: 'GET' } )
         .then( handleResult, handleError );

      function handleResult( response ) {
         if( response.ok ) {
            return response.json().then( body => ({ key, url: body._source.url }) );
         }
         return handleError( response.statusText );
      }

      function handleError( error ) {
         report( 'Could not shorten URL', error );
         eventBus.publish( 'didTakeAction.' + event.action, {
            action: event.action,
            outcome: 'ERROR'
         } );
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function shorten( url ) {
      const key = generateKey();
      const body = JSON.stringify( { key, url } );
      return fetch( mappingUrl( key ) + '/_create', { method: 'PUT', body } )
         .then( handleResult, handleError );

      function handleResult( response ) {
         if( response.ok ) {
            return response.json().then( body => ({ key }) );
         }
         return handleError( response.statusText, response );
      }

      function handleError( error, response ) {
         report( 'Could not shorten URL', error, response || { status: '' } );
         eventBus.publish( 'didTakeAction.' + event.action, {
            action: event.action,
            outcome: 'ERROR'
         } );
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function report( message, esOperation, response ) {
      var msg =
         message + ' (Elasticsearch <em>' + esOperation + '</em> failed with ' + response.status +')';
      ax.log.info( msg );
      return eventBus.publish( 'didEncounterError.' + esOperation, { code: esOperation, message: msg } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function mappingUrl( key ) {
      const config = ( key, fallback  ) =>
         configuration.get( 'widgets.kurzd.elasticsearch.' + key, fallback );

      const { location: { protocol, host } } = window;
      var esHost = protocol + '//' + config( 'host', host );
      var esIndex = config( 'index', 'kurzd' );
      var esType = config( 'type', 'short-url' );

      return esHost + '/' + esIndex + '/' + esType + '/' + key;
   }
}

export default {
   name: 'elasticsearch-url-shortener-activity',
   injections: injections,
   create: create
};
