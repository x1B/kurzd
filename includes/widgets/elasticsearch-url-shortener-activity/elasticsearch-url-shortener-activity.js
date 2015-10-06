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
         return fetch(mappingUrl(key), {
            method: 'GET'
         }).then(handleResult, handleError);

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
         return fetch(mappingUrl(key) + '/_create', {
            method: 'PUT',
            body: JSON.stringify({ key: key, url: url })
         }).then(handleResult, handleError);

         function handleResult(response) {
            if (response.ok) {
               return response.json().then(function (body) {
                  return { key: key };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsYXN0aWNzZWFyY2gtdXJsLXNob3J0ZW5lci1hY3Rpdml0eS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBLE9BQU0sVUFBVSxHQUFHLENBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsaUJBQWlCLENBQUUsQ0FBQzs7QUFFdEYsWUFBUyxNQUFNLENBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFHO1VBRXZELEtBQUssR0FBa0IsSUFBSSxDQUEzQixLQUFLO1VBQUUsTUFBTSxHQUFVLElBQUksQ0FBcEIsTUFBTTtVQUFFLEdBQUcsR0FBSyxJQUFJLENBQVosR0FBRzs7O0FBRzFCLFVBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNuQixVQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7Ozs7QUFJakIsY0FBUSxDQUFDLFNBQVMsQ0FBRSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQWlCLEVBQUs7YUFBWixHQUFHLEdBQWIsSUFBaUIsQ0FBZixJQUFJLENBQUksR0FBRztnQ0FDakQsUUFBUSxDQUFDLE1BQU07YUFBcEMsTUFBTSxvQkFBTixNQUFNO2FBQUUsUUFBUSxvQkFBUixRQUFROztBQUN4QixpQkFBUSxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsR0FBRyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUUsQ0FBQzs7QUFFM0QsZUFBTSxDQUFFLEdBQUcsQ0FBRSxDQUFDLElBQUksQ0FBRSxVQUFDLEtBQU8sRUFBSztnQkFBVixHQUFHLEdBQUwsS0FBTyxDQUFMLEdBQUc7O0FBQ3ZCLG9CQUFRLENBQUMsT0FBTyxDQUFFLGFBQWEsR0FBRyxRQUFRLEVBQUU7QUFDekMsdUJBQVEsRUFBUixRQUFRO0FBQ1IsbUJBQUksRUFBRSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRTthQUNwQixDQUFFLENB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QUM7QUFDbkIsZ0JBQU8sUUFBUSxDQUFDLE9BQU8sQ0FBRSxvQkFBb0IsR0FBRyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBRSxDQUFDO09BQ3JHOzs7O0FBSUQsZUFBUyxVQUFVLENBQUUsR0FBRyxFQUFHO0FBQ3hCLGFBQU0sTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFLLEdBQUcsRUFBRSxRQUFRO21CQUMzQixhQUFhLENBQUMsR0FBRyxDQUFFLDhCQUE4QixHQUFHLEdBQUcsRUFBRSxRQUFRLENBQUU7VUFBQSxDQUFDOztnQ0FFOUIsTUFBTSxDQUF2QyxRQUFRO2FBQUksUUFBUSxvQkFBUixRQUFRO2FBQUUsSUFBSSxvQkFBSixJQUFJOztBQUNsQyxhQUFJLE1BQU0sR0FBRyxRQUFRLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBRSxNQUFNLEVBQUUsSUFBSSxDQUFFLENBQUM7QUFDdEQsYUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFFLE9BQU8sRUFBRSxPQUFPLENBQUUsQ0FBQztBQUN6QyxhQUFJLE1BQU0sR0FBRyxNQUFNLENBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBRSxDQUFDOztBQUUzQyxnQkFBTyxNQUFNLEdBQUcsR0FBRyxHQUFHLE9BQU8sR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7T0FDM0Q7SUFDSDs7b0JBRWM7QUFDWixVQUFJLEVBQUUsc0NBQXNDO0FBQzVDLGdCQUFVLEVBQUUsVUFBVTtBQUN0QixZQUFNLEVBQUUsTUFBTTtJQUNoQiIsImZpbGUiOiJlbGFzdGljc2VhcmNoLXVybC1zaG9ydGVuZXItYWN0aXZpdHkuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4IGZyb20gJ2xheGFyJztcblxuY29uc3QgaW5qZWN0aW9ucyA9IFsgJ2F4RXZlbnRCdXMnLCAnYXhGZWF0dXJlcycsICdheEZsb3dTZXJ2aWNlJywgJ2F4Q29uZmlndXJhdGlvbicgXTtcblxuZnVuY3Rpb24gY3JlYXRlKCBldmVudEJ1cywgZmVhdHVyZXMsIGZsb3dTZXJ2aWNlLCBjb25maWd1cmF0aW9uICkge1xuXG4gICBjb25zdCB7IGZsb29yLCByYW5kb20sIHBvdyB9ID0gTWF0aDtcblxuICAgLy8gZG8gbm90IHRyeSB0byBkZXBsb3kgdGhpcyBhdCBzY2FsZS4uLlxuICAgY29uc3QgbnVtQWxwaGEgPSAzO1xuICAgY29uc3QgbnVtTnVtID0gMztcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZXZlbnRCdXMuc3Vic2NyaWJlKCAndGFrZUFjdGlvblJlcXVlc3QuJyArIGZlYXR1cmVzLmxvb2t1cC5hY3Rpb24sICh7IGRhdGE6IHsga2V5IH0gfSkgPT4ge1xuICAgICAgY29uc3QgeyBhY3Rpb24sIHJlc291cmNlIH0gPSBmZWF0dXJlcy5sb29rdXA7XG4gICAgICBldmVudEJ1cy5wdWJsaXNoKCAnd2lsbFRha2VBY3Rpb24uJyArIGFjdGlvbiwgeyBhY3Rpb24gfSApO1xuXG4gICAgICBsb29rdXAoIGtleSApLnRoZW4oICh7IHVybCB9KSA9PiB7XG4gICAgICAgICBldmVudEJ1cy5wdWJsaXNoKCAnZGlkUmVwbGFjZS4nICsgcmVzb3VyY2UsIHtcbiAgICAgICAgICAgIHJlc291cmNlLFxuICAgICAgICAgICAgZGF0YTogeyB1cmwsIGtleSB9XG4gICAgICAgICB9ICk7XG4gICAgICAgICBldmVudEJ1cy5wdWJsaXNoKCAnZGlkVGFrZUFjdGlvbi4nICsgYWN0aW9uLCB7IGFjdGlvbiB9ICk7XG4gICAgICB9ICk7XG4gICB9ICk7XG5cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZXZlbnRCdXMuc3Vic2NyaWJlKCAndGFrZUFjdGlvblJlcXVlc3QuJyArIGZlYXR1cmVzLnNob3J0ZW4uYWN0aW9uLCAoeyBkYXRhOiB7IHVybCB9IH0pID0+IHtcbiAgICAgIGNvbnN0IHsgYWN0aW9uLCByZXNvdXJjZSB9ID0gZmVhdHVyZXMuc2hvcnRlbjtcbiAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICd3aWxsVGFrZUFjdGlvbi4nICsgYWN0aW9uLCB7IGFjdGlvbiB9ICk7XG5cbiAgICAgIHNob3J0ZW4oIHVybCApLnRoZW4oICh7IGtleSB9KSA9PiB7XG4gICAgICAgICBjb25zdCBzaG9ydFVybCA9IGZsb3dTZXJ2aWNlLmNvbnN0cnVjdEFic29sdXRlVXJsKCAneCcsIHsga2V5IH0gKTtcbiAgICAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICdkaWRSZXBsYWNlLicgKyBmZWF0dXJlcy5zaG9ydGVuLnJlc291cmNlLCB7XG4gICAgICAgICAgICByZXNvdXJjZSxcbiAgICAgICAgICAgIGRhdGE6IHsgdXJsLCBrZXksIHNob3J0VXJsIH1cbiAgICAgICAgIH0gKTtcbiAgICAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICdkaWRUYWtlQWN0aW9uLicgKyBhY3Rpb24sIHsgYWN0aW9uIH0gKTtcbiAgICAgIH0gKTtcbiAgIH0gKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gZ2VuZXJhdGVLZXkoKSB7XG4gICAgICBjb25zdCBudW1lcmljUGFydCA9XG4gICAgICAgICBwb3coIDEwLCBudW1OdW0gLSAxICkgK1xuICAgICAgICAgZmxvb3IoIHJhbmRvbSgpICogOSpwb3coIDEwLCBudW1OdW0gLSAxICkgKTtcblxuICAgICAgY29uc3QgYWxwaGFPZmZzZXQgPSAnYScuY2hhckNvZGVBdCggMCApO1xuICAgICAgY29uc3QgYWxwaGFSYW5nZSA9IDI2O1xuXG4gICAgICBjb25zdCBhbHBoYVBhcnQgPSBbXTtcbiAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgbnVtQWxwaGE7ICsraSApIHtcbiAgICAgICAgIGFscGhhUGFydC5wdXNoKFxuICAgICAgICAgICAgU3RyaW5nLmZyb21DaGFyQ29kZSggYWxwaGFPZmZzZXQgKyBmbG9vciggcmFuZG9tKCkgKiBhbHBoYVJhbmdlICkgKVxuICAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhbHBoYVBhcnQuam9pbiggJycgKSArIG51bWVyaWNQYXJ0O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBsb29rdXAoIGtleSApIHtcbiAgICAgIHJldHVybiBmZXRjaCggbWFwcGluZ1VybCgga2V5ICksIHtcbiAgICAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICAgIH0gKS50aGVuKCBoYW5kbGVSZXN1bHQsIGhhbmRsZUVycm9yICk7XG5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZUVycm9yKCBlcnJvciApIHtcbiAgICAgICAgIHJlcG9ydCggJ0NvdWxkIG5vdCBzaG9ydGVuIFVSTCcsIGVycm9yICk7XG4gICAgICAgICBldmVudEJ1cy5wdWJsaXNoKCAnZGlkVGFrZUFjdGlvbi4nICsgZXZlbnQuYWN0aW9uLCB7XG4gICAgICAgICAgICBhY3Rpb246IGV2ZW50LmFjdGlvbixcbiAgICAgICAgICAgIG91dGNvbWU6ICdFUlJPUidcbiAgICAgICAgIH0gKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gc2hvcnRlbiggdXJsICkge1xuICAgICAgY29uc3Qga2V5ID0gZ2VuZXJhdGVLZXkoKTtcbiAgICAgIHJldHVybiBmZXRjaCggbWFwcGluZ1VybCgga2V5ICkgKyAnL19jcmVhdGUnLCB7XG4gICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoIHsga2V5LCB1cmwgfSApXG4gICAgICB9ICkudGhlbiggaGFuZGxlUmVzdWx0LCBoYW5kbGVFcnJvciApO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVSZXN1bHQoIHJlc3BvbnNlICkge1xuICAgICAgICAgaWYoIHJlc3BvbnNlLm9rICkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKCBib2R5ID0+ICh7IGtleSB9KSApO1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKCByZXNwb25zZS5zdGF0dXNUZXh0ICk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZUVycm9yKCBlcnJvciApIHtcbiAgICAgICAgIHJlcG9ydCggJ0NvdWxkIG5vdCBzaG9ydGVuIFVSTCcsIGVycm9yICk7XG4gICAgICAgICBldmVudEJ1cy5wdWJsaXNoKCAnZGlkVGFrZUFjdGlvbi4nICsgZXZlbnQuYWN0aW9uLCB7XG4gICAgICAgICAgICBhY3Rpb246IGV2ZW50LmFjdGlvbixcbiAgICAgICAgICAgIG91dGNvbWU6ICdFUlJPUidcbiAgICAgICAgIH0gKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVwb3J0KCBtZXNzYWdlLCBlc09wZXJhdGlvbiwgcmVzcG9uc2UgKSB7XG4gICAgICB2YXIgbXNnID1cbiAgICAgICAgIG1lc3NhZ2UgKyAnIChFbGFzdGljc2VhcmNoIDxlbT4nICsgZXNPcGVyYXRpb24gKyAnPC9lbT4gZmFpbGVkIHdpdGggJyArIHJlc3BvbnNlLnN0YXR1cyArJyknO1xuICAgICAgYXgubG9nLmluZm8oIG1zZyApO1xuICAgICAgcmV0dXJuIGV2ZW50QnVzLnB1Ymxpc2goICdkaWRFbmNvdW50ZXJFcnJvci4nICsgZXNPcGVyYXRpb24sIHsgY29kZTogZXNPcGVyYXRpb24sIG1lc3NhZ2U6IG1zZyB9ICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIG1hcHBpbmdVcmwoIGtleSApIHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9ICgga2V5LCBmYWxsYmFjayAgKSA9PlxuICAgICAgICAgY29uZmlndXJhdGlvbi5nZXQoICd3aWRnZXRzLmt1cnpkLmVsYXN0aWNzZWFyY2guJyArIGtleSwgZmFsbGJhY2sgKTtcblxuICAgICAgY29uc3QgeyBsb2NhdGlvbjogeyBwcm90b2NvbCwgaG9zdCB9IH0gPSB3aW5kb3c7XG4gICAgICB2YXIgZXNIb3N0ID0gcHJvdG9jb2wgKyAnLy8nICsgY29uZmlnKCAnaG9zdCcsIGhvc3QgKTtcbiAgICAgIHZhciBlc0luZGV4ID0gY29uZmlnKCAnaW5kZXgnLCAna3VyemQnICk7XG4gICAgICB2YXIgZXNUeXBlID0gY29uZmlnKCAndHlwZScsICdzaG9ydC11cmwnICk7XG5cbiAgICAgIHJldHVybiBlc0hvc3QgKyAnLycgKyBlc0luZGV4ICsgJy8nICsgZXNUeXBlICsgJy8nICsga2V5O1xuICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICBuYW1lOiAnZWxhc3RpY3NlYXJjaC11cmwtc2hvcnRlbmVyLWFjdGl2aXR5JyxcbiAgIGluamVjdGlvbnM6IGluamVjdGlvbnMsXG4gICBjcmVhdGU6IGNyZWF0ZVxufTtcbiJdfQ==