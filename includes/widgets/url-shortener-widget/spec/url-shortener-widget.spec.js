/**
 * Copyright 2015 Michael Kurze
 * Released under the MIT license
 */
'use strict';

define(['json!../widget.json', 'laxar-mocks'], function (descriptor, axMocks) {
   'use strict';

   // Minimalistic test setup. More information:
   // https://github.com/LaxarJS/laxar-mocks/blob/master/docs/manuals/index.md

   describe('The url-shortener-widget', function () {

      beforeEach(axMocks.createSetupForWidget(descriptor, {
         knownMissingResources: []
      }));

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      beforeEach(function () {
         axMocks.widget.configure({});
      });

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      beforeEach(axMocks.widget.load);

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it('still needs some tests', function () {
         // ... first test here
      });

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach(axMocks.tearDown);
   });
});