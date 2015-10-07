/**
 * Copyright 2015 Michael Kurze
 * Released under the MIT license
 */
import React from 'react';

const injections = [ 'axEventBus', 'axFeatures', 'axReactRender', 'axContext' ];

const URL_CHECKER = /\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|‌​]/;

function create( eventBus, features, reactRender, context ) {

   const model = {
      waiting: false,
      invalidUrl: false,
      viewUrl: '',
      submitUrl: null,
      shortUrl: null
   };

   eventBus.subscribe( 'didReplace.' + features.result.resource, handleResult );

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
      const inputId = context.id( 'url' );
      return <form className="jumbotron">
         <h3><label htmlFor={inputId}><i className='fa fa-plus-circle' /> Paste a URL to shorten:</label></h3>
         <div className='form-group'>
            <input type='url'
                   autoComplete={true}
                   className='form-control url-shortener-input'
                   id={inputId}
                   placeholder='http://...'
                   onChange={updateUrl} value={model.viewUrl} />
         </div>
         <button disabled={!model.viewUrl} type="button" className='btn btn-primary btn-lg'
                 onClick={submit}>kurz it!</button>
      </form>;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function renderResult() {
      const resultClasses = {
         waiting: model.waiting,
         hidden: !(model.waiting || model.shortUrl || model.invalidUrl),
         'url-shortener-result-ok': model.shortUrl,
         'url-shortener-result-invalid': model.invalidUrl,
         jumbotron: true
      };

      if( model.invalidUrl ) {
         return <div className={classList( resultClasses )}>
            <h3 className='text-center'>Please enter a valid URL</h3>
         </div>
      }

      const resultTitle = 'Short URL for "' + model.submitUrl + '"';
      const result = model.waiting ?
         <i className='fa fa-spinner' /> :
         <span>Your short URL:<br/><a href={model.shortUrl} title={resultTitle}>{model.shortUrl}</a></span>;

      const resultStatus = model.waiting ? '…kurzing…' : 'Short key: ' + model.key;

      return <div className={classList( resultClasses )}>
         <h2 className='url-shortener-result text-center'>{result}</h2>
         <h3 className='text-center'>{resultStatus}</h3>
      </div>;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function updateUrl( ev ) {
      model.viewUrl = ev.target.value;
      model.invalidUrl = false;
      render();
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function submit() {
      model.invalidUrl = !URL_CHECKER.test( model.viewUrl );
      if( model.invalidUrl ) {
         render();
         return;
      }
      model.submitUrl = model.viewUrl;
      model.waiting = true;

      render();
      eventBus.publish( 'takeActionRequest.' + features.shorten.action, {
         action: features.shorten.action,
         data: {
            url: model.submitUrl
         }
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function handleResult({ data: { url, shortUrl, key } }) {
      if( url !== model.submitUrl ) {
         // stale request
         return;
      }
      model.shortUrl = shortUrl;
      model.waiting = false;
      model.key = key;
      render();
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function classList( classSet ) {
      return Object.keys( classSet ).filter( _ => !!classSet[ _ ] ).join( ' ' );
   }
}

export default {
   name: 'url-shortener-widget',
   injections: injections,
   create: create
};
