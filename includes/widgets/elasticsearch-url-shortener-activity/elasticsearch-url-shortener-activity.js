define(['exports', 'module', 'laxar'], function (exports, module, _laxar) {
   'use strict';

   function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

   var _ax = _interopRequireDefault(_laxar);

   var injections = ['axEventBus', 'axFeatures', 'axFlowService', 'axConfiguration'];

   function create(eventBus, features, flowService, configuration) {
      var floor = Math.floor;
      var random = Math.random;
      var pow = Math.pow;

      // do not try to deploy this at scale...
      var numAlpha = 3;
      var numNum = 3;

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      eventBus.subscribe('takeActionRequest.' + features.lookup.action, function (_ref) {
         var key = _ref.data.key;
         var _features$lookup = features.lookup;
         var action = _features$lookup.action;
         var resource = _features$lookup.resource;

         eventBus.publish('willTakeAction.' + action, { action: action });

         lookup(key).then(function (_ref2) {
            var url = _ref2.url;

            console.log('lookup: ', key, url); // :TODO: Delete
            eventBus.publish('didReplace.' + resource, {
               resource: resource,
               data: { url: url, key: key }
            });
            eventBus.publish('didTakeAction.' + action, { action: action });
         });
      });

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      eventBus.subscribe('takeActionRequest.' + features.shorten.action, function (_ref3) {
         var url = _ref3.data.url;
         var _features$shorten = features.shorten;
         var action = _features$shorten.action;
         var resource = _features$shorten.resource;

         eventBus.publish('willTakeAction.' + action, { action: action });

         shorten(url).then(function (_ref4) {
            var key = _ref4.key;

            var shortUrl = flowService.constructAbsoluteUrl('x', { key: key });
            eventBus.publish('didReplace.' + features.shorten.resource, {
               resource: resource,
               data: { url: url, key: key, shortUrl: shortUrl }
            });
            eventBus.publish('didTakeAction.' + action, { action: action });
         });
      });

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function generateKey() {
         var numericPart = pow(10, numNum - 1) + floor(random() * 9 * pow(10, numNum - 1));

         var alphaOffset = 'a'.charCodeAt(0);
         var alphaRange = 26;

         var alphaPart = [];
         for (var i = 0; i < numAlpha; ++i) {
            alphaPart.push(String.fromCharCode(alphaOffset + floor(random() * alphaRange)));
         }
         return alphaPart.join('') + numericPart;
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function lookup(key) {
         return fetch(mappingUrl(key), { method: 'GET' }).then(handleResult, handleError);

         function handleResult(response) {
            if (response.ok) {
               return response.json().then(function (body) {
                  return { key: key, url: body._source.url };
               });
            }
            return handleError(response.statusText);
         }

         function handleError(error) {
            report('Could not shorten URL', error);
            eventBus.publish('didTakeAction.' + event.action, {
               action: event.action,
               outcome: 'ERROR'
            });
         }
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function shorten(url) {
         var key = generateKey();
         var body = JSON.stringify({ key: key, url: url });
         return fetch(mappingUrl(key) + '/_create', { method: 'PUT', body: body }).then(handleResult, handleError);

         function handleResult(response) {
            if (response.ok) {
               return response.json().then(function (body) {
                  return { key: key };
               });
            }
            return handleError(response.statusText, response);
         }

         function handleError(error, response) {
            report('Could not shorten URL', error, response || { status: '' });
            eventBus.publish('didTakeAction.' + event.action, {
               action: event.action,
               outcome: 'ERROR'
            });
         }
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function report(message, esOperation, response) {
         var msg = message + ' (Elasticsearch <em>' + esOperation + '</em> failed with ' + response.status + ')';
         _ax['default'].log.info(msg);
         return eventBus.publish('didEncounterError.' + esOperation, { code: esOperation, message: msg });
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function mappingUrl(key) {
         var config = function config(key, fallback) {
            return configuration.get('widgets.kurzd.elasticsearch.' + key, fallback);
         };

         var _window$location = window.location;
         var protocol = _window$location.protocol;
         var host = _window$location.host;

         var esHost = protocol + '//' + config('host', host);
         var esIndex = config('index', 'kurzd');
         var esType = config('type', 'short-url');

         return esHost + '/' + esIndex + '/' + esType + '/' + key;
      }
   }

   module.exports = {
      name: 'elasticsearch-url-shortener-activity',
      injections: injections,
      create: create
   };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsYXN0aWNzZWFyY2gtdXJsLXNob3J0ZW5lci1hY3Rpdml0eS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBLE9BQU0sVUFBVSxHQUFHLENBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsaUJBQWlCLENBQUUsQ0FBQzs7QUFFdEYsWUFBUyxNQUFNLENBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFHO1VBRXZELEtBQUssR0FBa0IsSUFBSSxDQUEzQixLQUFLO1VBQUUsTUFBTSxHQUFVLElBQUksQ0FBcEIsTUFBTTtVQUFFLEdBQUcsR0FBSyxJQUFJLENBQVosR0FBRzs7O0FBRzFCLFVBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNuQixVQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7Ozs7QUFJakIsY0FBUSxDQUFDLFNBQVMsQ0FBRSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQWlCLEVBQUs7YUFBWixHQUFHLEdBQWIsSUFBaUIsQ0FBZixJQUFJLENBQUksR0FBRztnQ0FDakQsUUFBUSxDQUFDLE1BQU07YUFBcEMsTUFBTSxvQkFBTixNQUFNO2FBQUUsUUFBUSxvQkFBUixRQUFROztBQUN4QixpQkFBUSxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsR0FBRyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUUsQ0FBQzs7QUFFM0QsZUFBTSxDQUFFLEdBQUcsQ0FBRSxDQUFDLElBQUksQ0FBRSxVQUFDLEtBQU8sRUFBSztnQkFBVixHQUFHLEdBQUwsS0FBTyxDQUFMLEdBQUc7O0FBQ3ZCLG1CQUFPLENBQUMsR0FBRyxDQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFFLENBQUM7QUFDcEMsb0JBQVEsQ0FBQyxPQUFPLENBQUUsYUFBYSxHQUFHLFFBQVEsRUFBRTtBQUN6Qyx1QkFBUSxFQUFSLFFBQVE7QUFDUixtQkFBSSxF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R0FBRyxNQUFNLENBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBRSxDQUFDOztBQUUzQyxnQkFBTyxNQUFNLEdBQUcsR0FBRyxHQUFHLE9BQU8sR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7T0FDM0Q7SUFDSDs7b0JBRWM7QUFDWixVQUFJLEVBQUUsc0NBQXNDO0FBQzVDLGdCQUFVLEVBQUUsVUFBVTtBQUN0QixZQUFNLEVBQUUsTUFBTTtJQUNoQiIsImZpbGUiOiJlbGFzdGljc2VhcmNoLXVybC1zaG9ydGVuZXItYWN0aXZpdHkuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4IGZyb20gJ2xheGFyJztcblxuY29uc3QgaW5qZWN0aW9ucyA9IFsgJ2F4RXZlbnRCdXMnLCAnYXhGZWF0dXJlcycsICdheEZsb3dTZXJ2aWNlJywgJ2F4Q29uZmlndXJhdGlvbicgXTtcblxuZnVuY3Rpb24gY3JlYXRlKCBldmVudEJ1cywgZmVhdHVyZXMsIGZsb3dTZXJ2aWNlLCBjb25maWd1cmF0aW9uICkge1xuXG4gICBjb25zdCB7IGZsb29yLCByYW5kb20sIHBvdyB9ID0gTWF0aDtcblxuICAgLy8gZG8gbm90IHRyeSB0byBkZXBsb3kgdGhpcyBhdCBzY2FsZS4uLlxuICAgY29uc3QgbnVtQWxwaGEgPSAzO1xuICAgY29uc3QgbnVtTnVtID0gMztcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZXZlbnRCdXMuc3Vic2NyaWJlKCAndGFrZUFjdGlvblJlcXVlc3QuJyArIGZlYXR1cmVzLmxvb2t1cC5hY3Rpb24sICh7IGRhdGE6IHsga2V5IH0gfSkgPT4ge1xuICAgICAgY29uc3QgeyBhY3Rpb24sIHJlc291cmNlIH0gPSBmZWF0dXJlcy5sb29rdXA7XG4gICAgICBldmVudEJ1cy5wdWJsaXNoKCAnd2lsbFRha2VBY3Rpb24uJyArIGFjdGlvbiwgeyBhY3Rpb24gfSApO1xuXG4gICAgICBsb29rdXAoIGtleSApLnRoZW4oICh7IHVybCB9KSA9PiB7XG4gICAgICAgICBjb25zb2xlLmxvZyggJ2xvb2t1cDogJywga2V5LCB1cmwgKTsgLy8gOlRPRE86IERlbGV0ZVxuICAgICAgICAgZXZlbnRCdXMucHVibGlzaCggJ2RpZFJlcGxhY2UuJyArIHJlc291cmNlLCB7XG4gICAgICAgICAgICByZXNvdXJjZSxcbiAgICAgICAgICAgIGRhdGE6IHsgdXJsLCBrZXkgfVxuICAgICAgICAgfSApO1xuICAgICAgICAgZXZlbnRCdXMucHVibGlzaCggJ2RpZFRha2VBY3Rpb24uJyArIGFjdGlvbiwgeyBhY3Rpb24gfSApO1xuICAgICAgfSApO1xuICAgfSApO1xuXG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGV2ZW50QnVzLnN1YnNjcmliZSggJ3Rha2VBY3Rpb25SZXF1ZXN0LicgKyBmZWF0dXJlcy5zaG9ydGVuLmFjdGlvbiwgKHsgZGF0YTogeyB1cmwgfSB9KSA9PiB7XG4gICAgICBjb25zdCB7IGFjdGlvbiwgcmVzb3VyY2UgfSA9IGZlYXR1cmVzLnNob3J0ZW47XG4gICAgICBldmVudEJ1cy5wdWJsaXNoKCAnd2lsbFRha2VBY3Rpb24uJyArIGFjdGlvbiwgeyBhY3Rpb24gfSApO1xuXG4gICAgICBzaG9ydGVuKCB1cmwgKS50aGVuKCAoeyBrZXkgfSkgPT4ge1xuICAgICAgICAgY29uc3Qgc2hvcnRVcmwgPSBmbG93U2VydmljZS5jb25zdHJ1Y3RBYnNvbHV0ZVVybCggJ3gnLCB7IGtleSB9ICk7XG4gICAgICAgICBldmVudEJ1cy5wdWJsaXNoKCAnZGlkUmVwbGFjZS4nICsgZmVhdHVyZXMuc2hvcnRlbi5yZXNvdXJjZSwge1xuICAgICAgICAgICAgcmVzb3VyY2UsXG4gICAgICAgICAgICBkYXRhOiB7IHVybCwga2V5LCBzaG9ydFVybCB9XG4gICAgICAgICB9ICk7XG4gICAgICAgICBldmVudEJ1cy5wdWJsaXNoKCAnZGlkVGFrZUFjdGlvbi4nICsgYWN0aW9uLCB7IGFjdGlvbiB9ICk7XG4gICAgICB9ICk7XG4gICB9ICk7XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGdlbmVyYXRlS2V5KCkge1xuICAgICAgY29uc3QgbnVtZXJpY1BhcnQgPVxuICAgICAgICAgcG93KCAxMCwgbnVtTnVtIC0gMSApICtcbiAgICAgICAgIGZsb29yKCByYW5kb20oKSAqIDkqcG93KCAxMCwgbnVtTnVtIC0gMSApICk7XG5cbiAgICAgIGNvbnN0IGFscGhhT2Zmc2V0ID0gJ2EnLmNoYXJDb2RlQXQoIDAgKTtcbiAgICAgIGNvbnN0IGFscGhhUmFuZ2UgPSAyNjtcblxuICAgICAgY29uc3QgYWxwaGFQYXJ0ID0gW107XG4gICAgICBmb3IoIHZhciBpID0gMDsgaSA8IG51bUFscGhhOyArK2kgKSB7XG4gICAgICAgICBhbHBoYVBhcnQucHVzaChcbiAgICAgICAgICAgIFN0cmluZy5mcm9tQ2hhckNvZGUoIGFscGhhT2Zmc2V0ICsgZmxvb3IoIHJhbmRvbSgpICogYWxwaGFSYW5nZSApIClcbiAgICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWxwaGFQYXJ0LmpvaW4oICcnICkgKyBudW1lcmljUGFydDtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gbG9va3VwKCBrZXkgKSB7XG4gICAgICByZXR1cm4gZmV0Y2goIG1hcHBpbmdVcmwoIGtleSApLCB7IG1ldGhvZDogJ0dFVCcgfSApXG4gICAgICAgICAudGhlbiggaGFuZGxlUmVzdWx0LCBoYW5kbGVFcnJvciApO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVSZXN1bHQoIHJlc3BvbnNlICkge1xuICAgICAgICAgaWYoIHJlc3BvbnNlLm9rICkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKCBib2R5ID0+ICh7IGtleSwgdXJsOiBib2R5Ll9zb3VyY2UudXJsIH0pICk7XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gaGFuZGxlRXJyb3IoIHJlc3BvbnNlLnN0YXR1c1RleHQgKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFuZGxlRXJyb3IoIGVycm9yICkge1xuICAgICAgICAgcmVwb3J0KCAnQ291bGQgbm90IHNob3J0ZW4gVVJMJywgZXJyb3IgKTtcbiAgICAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICdkaWRUYWtlQWN0aW9uLicgKyBldmVudC5hY3Rpb24sIHtcbiAgICAgICAgICAgIGFjdGlvbjogZXZlbnQuYWN0aW9uLFxuICAgICAgICAgICAgb3V0Y29tZTogJ0VSUk9SJ1xuICAgICAgICAgfSApO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBzaG9ydGVuKCB1cmwgKSB7XG4gICAgICBjb25zdCBrZXkgPSBnZW5lcmF0ZUtleSgpO1xuICAgICAgY29uc3QgYm9keSA9IEpTT04uc3RyaW5naWZ5KCB7IGtleSwgdXJsIH0gKTtcbiAgICAgIHJldHVybiBmZXRjaCggbWFwcGluZ1VybCgga2V5ICkgKyAnL19jcmVhdGUnLCB7IG1ldGhvZDogJ1BVVCcsIGJvZHkgfSApXG4gICAgICAgICAudGhlbiggaGFuZGxlUmVzdWx0LCBoYW5kbGVFcnJvciApO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVSZXN1bHQoIHJlc3BvbnNlICkge1xuICAgICAgICAgaWYoIHJlc3BvbnNlLm9rICkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKCBib2R5ID0+ICh7IGtleSB9KSApO1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKCByZXNwb25zZS5zdGF0dXNUZXh0LCByZXNwb25zZSApO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVFcnJvciggZXJyb3IsIHJlc3BvbnNlICkge1xuICAgICAgICAgcmVwb3J0KCAnQ291bGQgbm90IHNob3J0ZW4gVVJMJywgZXJyb3IsIHJlc3BvbnNlIHx8IHsgc3RhdHVzOiAnJyB9ICk7XG4gICAgICAgICBldmVudEJ1cy5wdWJsaXNoKCAnZGlkVGFrZUFjdGlvbi4nICsgZXZlbnQuYWN0aW9uLCB7XG4gICAgICAgICAgICBhY3Rpb246IGV2ZW50LmFjdGlvbixcbiAgICAgICAgICAgIG91dGNvbWU6ICdFUlJPUidcbiAgICAgICAgIH0gKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVwb3J0KCBtZXNzYWdlLCBlc09wZXJhdGlvbiwgcmVzcG9uc2UgKSB7XG4gICAgICB2YXIgbXNnID1cbiAgICAgICAgIG1lc3NhZ2UgKyAnIChFbGFzdGljc2VhcmNoIDxlbT4nICsgZXNPcGVyYXRpb24gKyAnPC9lbT4gZmFpbGVkIHdpdGggJyArIHJlc3BvbnNlLnN0YXR1cyArJyknO1xuICAgICAgYXgubG9nLmluZm8oIG1zZyApO1xuICAgICAgcmV0dXJuIGV2ZW50QnVzLnB1Ymxpc2goICdkaWRFbmNvdW50ZXJFcnJvci4nICsgZXNPcGVyYXRpb24sIHsgY29kZTogZXNPcGVyYXRpb24sIG1lc3NhZ2U6IG1zZyB9ICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIG1hcHBpbmdVcmwoIGtleSApIHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9ICgga2V5LCBmYWxsYmFjayAgKSA9PlxuICAgICAgICAgY29uZmlndXJhdGlvbi5nZXQoICd3aWRnZXRzLmt1cnpkLmVsYXN0aWNzZWFyY2guJyArIGtleSwgZmFsbGJhY2sgKTtcblxuICAgICAgY29uc3QgeyBsb2NhdGlvbjogeyBwcm90b2NvbCwgaG9zdCB9IH0gPSB3aW5kb3c7XG4gICAgICB2YXIgZXNIb3N0ID0gcHJvdG9jb2wgKyAnLy8nICsgY29uZmlnKCAnaG9zdCcsIGhvc3QgKTtcbiAgICAgIHZhciBlc0luZGV4ID0gY29uZmlnKCAnaW5kZXgnLCAna3VyemQnICk7XG4gICAgICB2YXIgZXNUeXBlID0gY29uZmlnKCAndHlwZScsICdzaG9ydC11cmwnICk7XG5cbiAgICAgIHJldHVybiBlc0hvc3QgKyAnLycgKyBlc0luZGV4ICsgJy8nICsgZXNUeXBlICsgJy8nICsga2V5O1xuICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICBuYW1lOiAnZWxhc3RpY3NlYXJjaC11cmwtc2hvcnRlbmVyLWFjdGl2aXR5JyxcbiAgIGluamVjdGlvbnM6IGluamVjdGlvbnMsXG4gICBjcmVhdGU6IGNyZWF0ZVxufTtcbiJdfQ==