/**
 * Copyright 2015 Michael Kurze
 * Released under the MIT license
 */
import React from 'react';
import ax from 'laxar';

const injections = [ 'axEventBus', 'axFeatures', 'axReactRender', 'axContext' ];

function create( eventBus, features, reactRender, context ) {

   const model = {
      waiting: false,
      viewKey: '',
      submitKey: null,
      url: null
   };

   const lookup = ax.fn.debounce( lookupImmediately, 200 );

   eventBus.subscribe( 'didReplace.' + features.result.resource, ({ data: { url, key } }) => {
      if( key !== model.submitKey ) {
         // stale request
         return;
      }
      model.url = url;
      model.waiting = false;
      render();
   } );

   return {
      onDomAvailable: render
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function render() {
      reactRender(
         <div>
            {renderForm()}
            {renderResult()}
         </div>
      );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function renderForm() {
      const inputId = context.id( 'key' );
      return <form className='jumbotron'>
         <h3><label htmlFor={inputId}><i className='fa fa-search' /> Enter a short-key to lookup</label></h3>
         <div className='form-group'>
            <input type='url'  className='form-control url-shortener-input' id={inputId}
                   placeholder='e.g. abc123' onChange={updateKey} value={model.viewKey} />
         </div>
      </form>;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function renderResult() {
      const resultClasses = {
         waiting: model.waiting,
         hidden: !(model.waiting || model.shortUrl ),
         'url-shortener-result-ok': model.shortUrl,
         jumbotron: true
      };

      const resultStatus = model.waiting ?
         '…looking up…' :
         'Long URL for key "' + model.submitUrl + '"';
      const result = model.waiting ?
         <i className='fa fa-spinner' /> :
         <a href={model.shortUrl} title={resultStatus}>{model.shortUrl}</a>;

      return <div className={classList( resultClasses )}>
         <h1 className='text-center'>{result}</h1>
         <h3 className='text-center'>{resultStatus}</h3>
      </div>;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function updateKey( ev ) {
      model.viewKey = ev.target.value;
      lookup();
      render();
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function lookupImmediately() {
      model.submitKey = model.viewKey;
      eventBus.publish( 'takeActionRequest.' + features.lookup.action, {
         action: features.lookup.action,
         data: {
            key: model.submitKey
         }
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function classList( classSet ) {
      return Object.keys( classSet ).filter( _ => !!classSet[ _ ] ).join( ' ' );
   }
}

export default {
   name: 'url-lookup-widget',
   injections: injections,
   create: create
};
