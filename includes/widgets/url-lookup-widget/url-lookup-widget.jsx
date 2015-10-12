/**
 * Copyright 2015 Michael Kurze
 * Released under the MIT license
 */
import React from 'react';
import ax from 'laxar';

const injections = [ 'axEventBus', 'axFeatures', 'axReactRender', 'axContext', 'axControls' ];

const REDIRECT_MS = 1000;
const keyLength = 6;

function create( eventBus, features, reactRender, context, controls ) {

   const ProgressIndicator = controls.provide( 'laxar-progress-indicator-control' );

   const model = {
      waiting: false,
      viewKey: '',
      submitKey: null,
      url: null,
      redirect: {
         url: null,
         inSeconds: null,
         timeout: null
      }
   };

   eventBus.subscribe( 'endLifecycleRequest', cancelAnyRedirect );
   eventBus.subscribe( 'didNavigate', handleDidNavigate );
   eventBus.subscribe( 'didReplace.' + features.result.resource, handleDidReplace );

   const lookup = ax.fn.debounce( lookupImmediately, 100 );

   return {
      onDomAvailable: render
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function handleDidReplace( event ) {
      const { data: { url, key } } = event;
      if( key !== model.submitKey ) {
         // stale request
         return;
      }

      model.waiting = false;
      if( !url ) {
         model.notFound = true;
         render();
         return;
      }

      model.url = url;
      startRedirect( url );
      render();
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function handleDidNavigate( event ) {
      const { data: { key } } = event;
      if( key ) {
         model.viewKey = key;
         lookup();
         render();
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function startRedirect( url ) {
      if( model.redirect.url === url ) {
         // already in progress:
         return;
      }

      cancelAnyRedirect();

      model.redirect.url = url;
      model.redirect.startMs = Date.now();
      model.redirect.id = false;
      window.requestAnimationFrame( next );

      function next() {
         if( model.redirect.url !== url ) {
            return;
         }
         model.redirect.progress = ( Date.now() - model.redirect.startMs ) / REDIRECT_MS;
         if( model.redirect.progress >= 1 ) {
            window.location.href = model.url;
         }
         else {
            window.requestAnimationFrame( next );
         }
         render();
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function cancelAnyRedirect() {
      model.redirect.url = null;
      model.redirect.startMs = null;
      model.redirect.progress = 0;
      model.redirect.cancelled = true;
   }

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
            <input autoComplete={true} type='text'
                   length={keyLength}
                   className='form-control url-shortener-input'
                   id={inputId}
                   placeholder='e.g. abc123'
                   value={model.viewKey}
                   onChange={updateKey} />
         </div>
      </form>;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function renderResult() {
      const resultClasses = {
         waiting: model.waiting,
         hidden: !(model.waiting || model.viewKey),
         'url-shortener-result-ok': model.shortUrl,
         'url-shortener-result-404': model.notFound,
         jumbotron: true
      };

      const status = ({viewKey, waiting, notFound, redirect}) => {
         if( viewKey && viewKey.length !== keyLength ) {
            return {
               symbol: '',
               info: 'Lookup key must be ' + keyLength + ' characters long!'
            };
         }
         if( waiting ) {
            return {
               symbol: <i className='fa fa-spinner' />,
               info: '…looking up…'
            };
         }
         if( notFound ) {
            return {
               symbol: <i className='fa fa-meh-o' />,
               info: '404: nothing found for ' + model.submitKey
            };
         }
         if( redirect ) {
            return {
               symbol: <ProgressIndicator progress={redirect.progress} />,
               info: <span>Redirecting to<br /><a href={model.redirect.url}>{model.redirect.url}</a></span>
            };
         }
      };

      const { symbol, info } = status( model );

      return <div className={classList( resultClasses )}>
         <h1 className='text-center'>{symbol}</h1>
         <h3 className='text-center'>{info}</h3>
      </div>;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function updateKey( ev ) {
      model.viewKey = ev.target.value;
      if( model.viewKey.length === keyLength ) {
         lookup();
      }
      render();
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function lookupImmediately() {
      if( model.submitKey === model.viewKey.toLowerCase() ) {
         return;
      }
      cancelAnyRedirect();
      model.notFound = false;
      model.waiting = true;
      model.submitKey = model.viewKey.toLowerCase();
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
