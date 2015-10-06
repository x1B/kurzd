const injections = [ 'axEventBus', 'axFeatures' ];

function create( eventBus, features ) {

   eventBus.subscribe( 'takeActionRequest.' + features.shorten.action, ({ data: { url } }) => {
      // simulate HTTP request:
      window.setTimeout( () => {
         eventBus.publish( 'didReplace.' + features.result.resource, {
            resource: features.result.resource,
            data: { url, shortUrl: 'http://www.example.com/abcdefg' }
         } );
      }, 1000 );
   } );

}

export default {
   name: 'elasticsearch-url-shortener-activity',
   injections: injections,
   create: create
};
