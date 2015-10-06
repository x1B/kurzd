/**
 * Copyright 2015 Michael Kurze
 * Released under the MIT license
 */
import React from 'react';

const injections = [ 'axEventBus', 'axFeatures', 'axReactRender', 'axContext' ];

function create( eventBus, features, reactRender, context ) {

   const model = {
      waiting: false,
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
            <input type='url' className='form-control url-shortener-input' id={inputId} placeholder='http://...'
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
         hidden: !(model.waiting || model.shortUrl ),
         'url-shortener-result-ok': model.shortUrl,
         jumbotron: true
      };
      const resultStatus = model.waiting ? '…kurzing…' : 'You got kurz\'d!';
      const resultTitle = 'Short URL for "' + model.submitUrl + '"';
      const result = model.waiting ?
         <i className='fa fa-spinner' /> :
         <a href={model.shortUrl} title={resultTitle}>{model.shortUrl}</a>;

      return <div className={classList( resultClasses )}>
         <h2 className='url-shortener-result text-center'>{result}</h2>
         <h3 className='text-center'>{resultStatus}</h3>
      </div>;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function updateUrl( ev ) {
      model.viewUrl = ev.target.value;
      render();
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function submit() {
      model.waiting = true;
      model.submitUrl = model.viewUrl;
      render();
      eventBus.publish( 'takeActionRequest.' + features.shorten.action, {
         action: features.shorten.action,
         data: {
            url: model.submitUrl
         }
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function handleResult({ data: { url, shortUrl } }) {
      if( url !== model.submitUrl ) {
         // stale request
         return;
      }
      model.shortUrl = shortUrl;
      model.waiting = false;
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
