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
            eventBus.publish('didTakeAction.' + action, { action: action, outcome: url ? 'SUCCESS' : 'ERROR' });
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
            } else if (response.status === 404) {
               return { key: key, url: null };
            }
            return handleError(response.statusText);
         }

         function handleError(error) {
            report('Could not lookup key', error);
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
         var msg = message + ' (Elasticsearch <em>' + esOperation + '</em> failed with ' + response + ')';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsYXN0aWNzZWFyY2gtdXJsLXNob3J0ZW5lci1hY3Rpdml0eS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBLE9BQU0sVUFBVSxHQUFHLENBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsaUJBQWlCLENBQUUsQ0FBQzs7QUFFdEYsWUFBUyxNQUFNLENBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFHO1VBRXZELEtBQUssR0FBa0IsSUFBSSxDQUEzQixLQUFLO1VBQUUsTUFBTSxHQUFVLElBQUksQ0FBcEIsTUFBTTtVQUFFLEdBQUcsR0FBSyxJQUFJLENBQVosR0FBRzs7O0FBRzFCLFVBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNuQixVQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7Ozs7QUFJakIsY0FBUSxDQUFDLFNBQVMsQ0FBRSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQWlCLEVBQUs7YUFBWixHQUFHLEdBQWIsSUFBaUIsQ0FBZixJQUFJLENBQUksR0FBRztnQ0FDakQsUUFBUSxDQUFDLE1BQU07YUFBcEMsTUFBTSxvQkFBTixNQUFNO2FBQUUsUUFBUSxvQkFBUixRQUFROztBQUN4QixpQkFBUSxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsR0FBRyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUUsQ0FBQzs7QUFFM0QsZUFBTSxDQUFFLEdBQUcsQ0FBRSxDQUFDLElBQUksQ0FBRSxVQUFDLEtBQU8sRUFBSztnQkFBVixHQUFHLEdBQUwsS0FBTyxDQUFMLEdBQUc7O0FBQ3ZCLG9CQUFRLENBQUMsT0FBTyxDQUFFLGFBQWEsR0FBRyxRQUFRLEVBQUU7QUFDekMsdUJBQVEsRUFBUixRQUFRO0FBQ1IsbUJBQUksRUFBRSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRTthQUNwQixDQUFFLENB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LE1BQU0sR0FBRyxHQUFHLEdBQUcsT0FBTyxHQUFHLEdBQUcsR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztPQUMzRDtJQUNIOztvQkFFYztBQUNaLFVBQUksRUFBRSxzQ0FBc0M7QUFDNUMsZ0JBQVUsRUFBRSxVQUFVO0FBQ3RCLFlBQU0sRUFBRSxNQUFNO0lBQ2hCIiwiZmlsZSI6ImVsYXN0aWNzZWFyY2gtdXJsLXNob3J0ZW5lci1hY3Rpdml0eS5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXggZnJvbSAnbGF4YXInO1xuXG5jb25zdCBpbmplY3Rpb25zID0gWyAnYXhFdmVudEJ1cycsICdheEZlYXR1cmVzJywgJ2F4Rmxvd1NlcnZpY2UnLCAnYXhDb25maWd1cmF0aW9uJyBdO1xuXG5mdW5jdGlvbiBjcmVhdGUoIGV2ZW50QnVzLCBmZWF0dXJlcywgZmxvd1NlcnZpY2UsIGNvbmZpZ3VyYXRpb24gKSB7XG5cbiAgIGNvbnN0IHsgZmxvb3IsIHJhbmRvbSwgcG93IH0gPSBNYXRoO1xuXG4gICAvLyBkbyBub3QgdHJ5IHRvIGRlcGxveSB0aGlzIGF0IHNjYWxlLi4uXG4gICBjb25zdCBudW1BbHBoYSA9IDM7XG4gICBjb25zdCBudW1OdW0gPSAzO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoICd0YWtlQWN0aW9uUmVxdWVzdC4nICsgZmVhdHVyZXMubG9va3VwLmFjdGlvbiwgKHsgZGF0YTogeyBrZXkgfSB9KSA9PiB7XG4gICAgICBjb25zdCB7IGFjdGlvbiwgcmVzb3VyY2UgfSA9IGZlYXR1cmVzLmxvb2t1cDtcbiAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICd3aWxsVGFrZUFjdGlvbi4nICsgYWN0aW9uLCB7IGFjdGlvbiB9ICk7XG5cbiAgICAgIGxvb2t1cCgga2V5ICkudGhlbiggKHsgdXJsIH0pID0+IHtcbiAgICAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICdkaWRSZXBsYWNlLicgKyByZXNvdXJjZSwge1xuICAgICAgICAgICAgcmVzb3VyY2UsXG4gICAgICAgICAgICBkYXRhOiB7IHVybCwga2V5IH1cbiAgICAgICAgIH0gKTtcbiAgICAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICdkaWRUYWtlQWN0aW9uLicgKyBhY3Rpb24sIHsgYWN0aW9uLCBvdXRjb21lOiB1cmwgPyAnU1VDQ0VTUycgOiAnRVJST1InIH0gKTtcbiAgICAgIH0gKTtcbiAgIH0gKTtcblxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoICd0YWtlQWN0aW9uUmVxdWVzdC4nICsgZmVhdHVyZXMuc2hvcnRlbi5hY3Rpb24sICh7IGRhdGE6IHsgdXJsIH0gfSkgPT4ge1xuICAgICAgY29uc3QgeyBhY3Rpb24sIHJlc291cmNlIH0gPSBmZWF0dXJlcy5zaG9ydGVuO1xuICAgICAgZXZlbnRCdXMucHVibGlzaCggJ3dpbGxUYWtlQWN0aW9uLicgKyBhY3Rpb24sIHsgYWN0aW9uIH0gKTtcblxuICAgICAgc2hvcnRlbiggdXJsICkudGhlbiggKHsga2V5IH0pID0+IHtcbiAgICAgICAgIGNvbnN0IHNob3J0VXJsID0gZmxvd1NlcnZpY2UuY29uc3RydWN0QWJzb2x1dGVVcmwoICd4JywgeyBrZXkgfSApO1xuICAgICAgICAgZXZlbnRCdXMucHVibGlzaCggJ2RpZFJlcGxhY2UuJyArIGZlYXR1cmVzLnNob3J0ZW4ucmVzb3VyY2UsIHtcbiAgICAgICAgICAgIHJlc291cmNlLFxuICAgICAgICAgICAgZGF0YTogeyB1cmwsIGtleSwgc2hvcnRVcmwgfVxuICAgICAgICAgfSApO1xuICAgICAgICAgZXZlbnRCdXMucHVibGlzaCggJ2RpZFRha2VBY3Rpb24uJyArIGFjdGlvbiwgeyBhY3Rpb24gfSApO1xuICAgICAgfSApO1xuICAgfSApO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBnZW5lcmF0ZUtleSgpIHtcbiAgICAgIGNvbnN0IG51bWVyaWNQYXJ0ID1cbiAgICAgICAgIHBvdyggMTAsIG51bU51bSAtIDEgKSArXG4gICAgICAgICBmbG9vciggcmFuZG9tKCkgKiA5KnBvdyggMTAsIG51bU51bSAtIDEgKSApO1xuXG4gICAgICBjb25zdCBhbHBoYU9mZnNldCA9ICdhJy5jaGFyQ29kZUF0KCAwICk7XG4gICAgICBjb25zdCBhbHBoYVJhbmdlID0gMjY7XG5cbiAgICAgIGNvbnN0IGFscGhhUGFydCA9IFtdO1xuICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBudW1BbHBoYTsgKytpICkge1xuICAgICAgICAgYWxwaGFQYXJ0LnB1c2goXG4gICAgICAgICAgICBTdHJpbmcuZnJvbUNoYXJDb2RlKCBhbHBoYU9mZnNldCArIGZsb29yKCByYW5kb20oKSAqIGFscGhhUmFuZ2UgKSApXG4gICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFscGhhUGFydC5qb2luKCAnJyApICsgbnVtZXJpY1BhcnQ7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGxvb2t1cCgga2V5ICkge1xuICAgICAgcmV0dXJuIGZldGNoKCBtYXBwaW5nVXJsKCBrZXkgKSwgeyBtZXRob2Q6ICdHRVQnIH0gKVxuICAgICAgICAgLnRoZW4oIGhhbmRsZVJlc3VsdCwgaGFuZGxlRXJyb3IgKTtcblxuICAgICAgZnVuY3Rpb24gaGFuZGxlUmVzdWx0KCByZXNwb25zZSApIHtcbiAgICAgICAgIGlmKCByZXNwb25zZS5vayApIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbiggYm9keSA9PiAoeyBrZXksIHVybDogYm9keS5fc291cmNlLnVybCB9KSApO1xuICAgICAgICAgfVxuICAgICAgICAgZWxzZSBpZiggcmVzcG9uc2Uuc3RhdHVzID09PSA0MDQgKSB7XG4gICAgICAgICAgICByZXR1cm4geyBrZXk6IGtleSwgdXJsOiBudWxsIH07XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gaGFuZGxlRXJyb3IoIHJlc3BvbnNlLnN0YXR1c1RleHQgKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFuZGxlRXJyb3IoIGVycm9yICkge1xuICAgICAgICAgcmVwb3J0KCAnQ291bGQgbm90IGxvb2t1cCBrZXknLCBlcnJvciApO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBzaG9ydGVuKCB1cmwgKSB7XG4gICAgICBjb25zdCBrZXkgPSBnZW5lcmF0ZUtleSgpO1xuICAgICAgY29uc3QgYm9keSA9IEpTT04uc3RyaW5naWZ5KCB7IGtleSwgdXJsIH0gKTtcbiAgICAgIHJldHVybiBmZXRjaCggbWFwcGluZ1VybCgga2V5ICkgKyAnL19jcmVhdGUnLCB7IG1ldGhvZDogJ1BVVCcsIGJvZHkgfSApXG4gICAgICAgICAudGhlbiggaGFuZGxlUmVzdWx0LCBoYW5kbGVFcnJvciApO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVSZXN1bHQoIHJlc3BvbnNlICkge1xuICAgICAgICAgaWYoIHJlc3BvbnNlLm9rICkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKCBib2R5ID0+ICh7IGtleSB9KSApO1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKCByZXNwb25zZS5zdGF0dXNUZXh0LCByZXNwb25zZSApO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVFcnJvciggZXJyb3IsIHJlc3BvbnNlICkge1xuICAgICAgICAgcmVwb3J0KCAnQ291bGQgbm90IHNob3J0ZW4gVVJMJywgZXJyb3IsIHJlc3BvbnNlIHx8IHsgc3RhdHVzOiAnJyB9ICk7XG4gICAgICAgICBldmVudEJ1cy5wdWJsaXNoKCAnZGlkVGFrZUFjdGlvbi4nICsgZXZlbnQuYWN0aW9uLCB7XG4gICAgICAgICAgICBhY3Rpb246IGV2ZW50LmFjdGlvbixcbiAgICAgICAgICAgIG91dGNvbWU6ICdFUlJPUidcbiAgICAgICAgIH0gKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVwb3J0KCBtZXNzYWdlLCBlc09wZXJhdGlvbiwgcmVzcG9uc2UgKSB7XG4gICAgICB2YXIgbXNnID1cbiAgICAgICAgIG1lc3NhZ2UgKyAnIChFbGFzdGljc2VhcmNoIDxlbT4nICsgZXNPcGVyYXRpb24gKyAnPC9lbT4gZmFpbGVkIHdpdGggJyArIHJlc3BvbnNlICsnKSc7XG4gICAgICBheC5sb2cuaW5mbyggbXNnICk7XG4gICAgICByZXR1cm4gZXZlbnRCdXMucHVibGlzaCggJ2RpZEVuY291bnRlckVycm9yLicgKyBlc09wZXJhdGlvbiwgeyBjb2RlOiBlc09wZXJhdGlvbiwgbWVzc2FnZTogbXNnIH0gKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gbWFwcGluZ1VybCgga2V5ICkge1xuICAgICAgY29uc3QgY29uZmlnID0gKCBrZXksIGZhbGxiYWNrICApID0+XG4gICAgICAgICBjb25maWd1cmF0aW9uLmdldCggJ3dpZGdldHMua3VyemQuZWxhc3RpY3NlYXJjaC4nICsga2V5LCBmYWxsYmFjayApO1xuXG4gICAgICBjb25zdCB7IGxvY2F0aW9uOiB7IHByb3RvY29sLCBob3N0IH0gfSA9IHdpbmRvdztcbiAgICAgIHZhciBlc0hvc3QgPSBwcm90b2NvbCArICcvLycgKyBjb25maWcoICdob3N0JywgaG9zdCApO1xuICAgICAgdmFyIGVzSW5kZXggPSBjb25maWcoICdpbmRleCcsICdrdXJ6ZCcgKTtcbiAgICAgIHZhciBlc1R5cGUgPSBjb25maWcoICd0eXBlJywgJ3Nob3J0LXVybCcgKTtcblxuICAgICAgcmV0dXJuIGVzSG9zdCArICcvJyArIGVzSW5kZXggKyAnLycgKyBlc1R5cGUgKyAnLycgKyBrZXk7XG4gICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgIG5hbWU6ICdlbGFzdGljc2VhcmNoLXVybC1zaG9ydGVuZXItYWN0aXZpdHknLFxuICAgaW5qZWN0aW9uczogaW5qZWN0aW9ucyxcbiAgIGNyZWF0ZTogY3JlYXRlXG59O1xuIl19