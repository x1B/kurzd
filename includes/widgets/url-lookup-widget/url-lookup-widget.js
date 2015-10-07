define(['exports', 'module', 'react', 'laxar'], function (exports, module, _react, _laxar) {
   /**
    * Copyright 2015 Michael Kurze
    * Released under the MIT license
    */
   'use strict';

   function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

   var _React = _interopRequireDefault(_react);

   var _ax = _interopRequireDefault(_laxar);

   var injections = ['axEventBus', 'axFeatures', 'axReactRender', 'axContext'];

   var keyLength = 6;

   function create(eventBus, features, reactRender, context) {

      var model = {
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

      eventBus.subscribe('endLifecycleRequest', cancelAnyRedirect);
      eventBus.subscribe('didNavigate', handleDidNavigate);
      eventBus.subscribe('didReplace.' + features.result.resource, handleDidReplace);

      var lookup = _ax['default'].fn.debounce(lookupImmediately, 100);

      return {
         onDomAvailable: render
      };

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function handleDidReplace(event) {
         var _event$data = event.data;
         var url = _event$data.url;
         var key = _event$data.key;

         if (key !== model.submitKey) {
            // stale request
            return;
         }

         model.waiting = false;
         if (!url) {
            model.notFound = true;
            render();
            return;
         }

         model.url = url;
         startRedirect(url);
         render();
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function handleDidNavigate(event) {
         var key = event.data.key;

         if (key) {
            model.viewKey = key;
            lookup();
            render();
         }
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function startRedirect(url) {
         cancelAnyRedirect();

         model.redirect.timeout = window.setTimeout(next, 1000);
         model.redirect.inSeconds = 3;
         model.redirect.url = url;
         function next() {
            --model.redirect.inSeconds;
            if (model.redirect.inSeconds <= 0) {
               window.location.href = model.url;
            } else {
               model.redirect.timeout = window.setTimeout(next, 1000);
            }
            render();
         }
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function cancelAnyRedirect() {
         if (model.redirect.timeout === null) {
            return;
         }
         window.clearTimeout(model.redirect.timeout);
         model.redirect.timeout = null;
         model.redirect.url = null;
         model.redirect.inSeconds = null;
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function render() {
         reactRender(_React['default'].createElement(
            'div',
            null,
            renderForm(),
            renderResult()
         ));
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function renderForm() {
         var inputId = context.id('key');
         return _React['default'].createElement(
            'form',
            { className: 'jumbotron' },
            _React['default'].createElement(
               'h3',
               null,
               _React['default'].createElement(
                  'label',
                  { htmlFor: inputId },
                  _React['default'].createElement('i', { className: 'fa fa-search' }),
                  ' Enter a short-key to lookup'
               )
            ),
            _React['default'].createElement(
               'div',
               { className: 'form-group' },
               _React['default'].createElement('input', { autoComplete: true, type: 'text',
                  length: keyLength,
                  className: 'form-control url-shortener-input',
                  id: inputId,
                  placeholder: 'e.g. abc123',
                  value: model.viewKey,
                  onChange: updateKey })
            )
         );
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function renderResult() {
         var resultClasses = {
            waiting: model.waiting,
            hidden: !(model.waiting || model.viewKey),
            'url-shortener-result-ok': model.shortUrl,
            'url-shortener-result-404': model.notFound,
            jumbotron: true
         };

         var status = function status(_ref) {
            var viewKey = _ref.viewKey;
            var waiting = _ref.waiting;
            var notFound = _ref.notFound;
            var redirect = _ref.redirect;

            if (viewKey && viewKey.length !== keyLength) {
               return {
                  symbol: '',
                  info: 'Lookup key must be ' + keyLength + ' characters long!'
               };
            }
            if (waiting) {
               return {
                  symbol: _React['default'].createElement('i', { className: 'fa fa-spinner' }),
                  info: '…looking up…'
               };
            }
            if (notFound) {
               return {
                  symbol: _React['default'].createElement('i', { className: 'fa fa-meh-o' }),
                  info: '404: nothing found for ' + model.submitKey
               };
            }
            if (redirect) {
               return {
                  symbol: model.redirect.inSeconds || '0',
                  info: _React['default'].createElement(
                     'span',
                     null,
                     'Redirecting to',
                     _React['default'].createElement('br', null),
                     _React['default'].createElement(
                        'a',
                        { href: model.redirect.url },
                        model.redirect.url
                     )
                  )
               };
            }
         };

         var _status = status(model);

         var symbol = _status.symbol;
         var info = _status.info;

         return _React['default'].createElement(
            'div',
            { className: classList(resultClasses) },
            _React['default'].createElement(
               'h1',
               { className: 'text-center' },
               symbol
            ),
            _React['default'].createElement(
               'h3',
               { className: 'text-center' },
               info
            )
         );
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function updateKey(ev) {
         model.viewKey = ev.target.value;
         if (model.viewKey.length === keyLength) {
            lookup();
         }
         render();
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function lookupImmediately() {
         if (model.submitKey === model.viewKey) {
            return;
         }
         cancelAnyRedirect();
         model.notFound = false;
         model.waiting = true;
         model.submitKey = model.viewKey;
         eventBus.publish('takeActionRequest.' + features.lookup.action, {
            action: features.lookup.action,
            data: {
               key: model.submitKey
            }
         });
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function classList(classSet) {
         return Object.keys(classSet).filter(function (_) {
            return !!classSet[_];
         }).join(' ');
      }
   }

   module.exports = {
      name: 'url-lookup-widget',
      injections: injections,
      create: create
   };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVybC1sb29rdXAtd2lkZ2V0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBT0EsT0FBTSxVQUFVLEdBQUcsQ0FBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUUsQ0FBQzs7QUFFaEYsT0FBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDOztBQUVwQixZQUFTLE1BQU0sQ0FBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUc7O0FBRXpELFVBQU0sS0FBSyxHQUFHO0FBQ1gsZ0JBQU8sRUFBRSxLQUFLO0FBQ2QsZ0JBQU8sRUFBRSxFQUFFO0FBQ1gsa0JBQVMsRUFBRSxJQUFJO0FBQ2YsWUFBRyxFQUFFLElBQUk7QUFDVCxpQkFBUSxFQUFFO0FBQ1AsZUFBRyxFQUFFLElBQUk7QUFDVCxxQkFBUyxFQUFFLElBQUk7QUFDZixtQkFBTyxFQUFFLElBQUk7VUFDZjtPQUNILENBQUM7O0FBRUYsY0FBUSxDQUFDLFNBQVMsQ0FBRSxxQkFBcUIsRUFBRSxpQkFBaUIsQ0FBRSxDQUFDO0FBQy9ELGNBQVEsQ0FBQyxTQUFTLENBQUUsYUFBYSxFQUFFLGlCQUFpQixDQUFFLENBQUM7QUFDdkQsY0FBUSxDQUFDLFNBQVMsQ0FBRSxhQUFhLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUUsQ0FBQzs7QUFFakYsVUFBTSxNQUFNLEdBQUcsZUFBRyxFQUFFLENBQUMsUUFBUSxDQUFFLGlCQUFpQixFQUFFLEdBQUcsQ0FBRSxDQUFDOztBQUV4RCxhQUFPO0FBQ0osdUJBQWMsRUFBRSxNQUFNO09BQ3hCLENBQUM7Ozs7QUFJRixlQUFTLGdCQUFnQixDQUFFLEtBQUssRUFBRzsyQkFDRCxLQUFLLENBQTVCLElBQUk7YUFBSSxHQUFHLGVBQUgsR0FBRzthQUFFLEdBQUcsZUFBSCxHQUFHOztBQUN4QixhQUFJLEdBQUcsS0FBSyxLQUFLLENBQUMsU0FBUyxFQUFHOztBQUUz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a0JBQU0sRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU07QUFDOUIsZ0JBQUksRUFBRTtBQUNILGtCQUFHLEVBQUUsS0FBSyxDQUFDLFNBQVM7YUFDdEI7VUFDSCxDQUFFLENBQUM7T0FDTjs7OztBQUlELGVBQVMsU0FBUyxDQUFFLFFBQVEsRUFBRztBQUM1QixnQkFBTyxNQUFNLENBQUMsSUFBSSxDQUFFLFFBQVEsQ0FBRSxDQUFDLE1BQU0sQ0FBRSxVQUFBLENBQUM7bUJBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBRSxDQUFDLENBQUU7VUFBQSxDQUFFLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO09BQzVFO0lBQ0g7O29CQUVjO0FBQ1osVUFBSSxFQUFFLG1CQUFtQjtBQUN6QixnQkFBVSxFQUFFLFVBQVU7QUFDdEIsWUFBTSxFQUFFLE1BQU07SUFDaEIiLCJmaWxlIjoidXJsLWxvb2t1cC13aWRnZXQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSBNaWNoYWVsIEt1cnplXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBheCBmcm9tICdsYXhhcic7XG5cbmNvbnN0IGluamVjdGlvbnMgPSBbICdheEV2ZW50QnVzJywgJ2F4RmVhdHVyZXMnLCAnYXhSZWFjdFJlbmRlcicsICdheENvbnRleHQnIF07XG5cbmNvbnN0IGtleUxlbmd0aCA9IDY7XG5cbmZ1bmN0aW9uIGNyZWF0ZSggZXZlbnRCdXMsIGZlYXR1cmVzLCByZWFjdFJlbmRlciwgY29udGV4dCApIHtcblxuICAgY29uc3QgbW9kZWwgPSB7XG4gICAgICB3YWl0aW5nOiBmYWxzZSxcbiAgICAgIHZpZXdLZXk6ICcnLFxuICAgICAgc3VibWl0S2V5OiBudWxsLFxuICAgICAgdXJsOiBudWxsLFxuICAgICAgcmVkaXJlY3Q6IHtcbiAgICAgICAgIHVybDogbnVsbCxcbiAgICAgICAgIGluU2Vjb25kczogbnVsbCxcbiAgICAgICAgIHRpbWVvdXQ6IG51bGxcbiAgICAgIH1cbiAgIH07XG5cbiAgIGV2ZW50QnVzLnN1YnNjcmliZSggJ2VuZExpZmVjeWNsZVJlcXVlc3QnLCBjYW5jZWxBbnlSZWRpcmVjdCApO1xuICAgZXZlbnRCdXMuc3Vic2NyaWJlKCAnZGlkTmF2aWdhdGUnLCBoYW5kbGVEaWROYXZpZ2F0ZSApO1xuICAgZXZlbnRCdXMuc3Vic2NyaWJlKCAnZGlkUmVwbGFjZS4nICsgZmVhdHVyZXMucmVzdWx0LnJlc291cmNlLCBoYW5kbGVEaWRSZXBsYWNlICk7XG5cbiAgIGNvbnN0IGxvb2t1cCA9IGF4LmZuLmRlYm91bmNlKCBsb29rdXBJbW1lZGlhdGVseSwgMTAwICk7XG5cbiAgIHJldHVybiB7XG4gICAgICBvbkRvbUF2YWlsYWJsZTogcmVuZGVyXG4gICB9O1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBoYW5kbGVEaWRSZXBsYWNlKCBldmVudCApIHtcbiAgICAgIGNvbnN0IHsgZGF0YTogeyB1cmwsIGtleSB9IH0gPSBldmVudDtcbiAgICAgIGlmKCBrZXkgIT09IG1vZGVsLnN1Ym1pdEtleSApIHtcbiAgICAgICAgIC8vIHN0YWxlIHJlcXVlc3RcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbW9kZWwud2FpdGluZyA9IGZhbHNlO1xuICAgICAgaWYoICF1cmwgKSB7XG4gICAgICAgICBtb2RlbC5ub3RGb3VuZCA9IHRydWU7XG4gICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbW9kZWwudXJsID0gdXJsO1xuICAgICAgc3RhcnRSZWRpcmVjdCggdXJsICk7XG4gICAgICByZW5kZXIoKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gaGFuZGxlRGlkTmF2aWdhdGUoIGV2ZW50ICkge1xuICAgICAgY29uc3QgeyBkYXRhOiB7IGtleSB9IH0gPSBldmVudDtcbiAgICAgIGlmKCBrZXkgKSB7XG4gICAgICAgICBtb2RlbC52aWV3S2V5ID0ga2V5O1xuICAgICAgICAgbG9va3VwKCk7XG4gICAgICAgICByZW5kZXIoKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gc3RhcnRSZWRpcmVjdCggdXJsICkge1xuICAgICAgY2FuY2VsQW55UmVkaXJlY3QoKTtcblxuICAgICAgbW9kZWwucmVkaXJlY3QudGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCBuZXh0LCAxMDAwICk7XG4gICAgICBtb2RlbC5yZWRpcmVjdC5pblNlY29uZHMgPSAzO1xuICAgICAgbW9kZWwucmVkaXJlY3QudXJsID0gdXJsO1xuICAgICAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgIC0tbW9kZWwucmVkaXJlY3QuaW5TZWNvbmRzO1xuICAgICAgICAgaWYoIG1vZGVsLnJlZGlyZWN0LmluU2Vjb25kcyA8PSAwICkge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBtb2RlbC51cmw7XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1vZGVsLnJlZGlyZWN0LnRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCggbmV4dCwgMTAwMCApO1xuICAgICAgICAgfVxuICAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGNhbmNlbEFueVJlZGlyZWN0KCkge1xuICAgICAgaWYoIG1vZGVsLnJlZGlyZWN0LnRpbWVvdXQgPT09IG51bGwgKSB7XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KCBtb2RlbC5yZWRpcmVjdC50aW1lb3V0ICk7XG4gICAgICBtb2RlbC5yZWRpcmVjdC50aW1lb3V0ID0gbnVsbDtcbiAgICAgIG1vZGVsLnJlZGlyZWN0LnVybCA9IG51bGw7XG4gICAgICBtb2RlbC5yZWRpcmVjdC5pblNlY29uZHMgPSBudWxsO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICByZWFjdFJlbmRlcihcbiAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICB7cmVuZGVyRm9ybSgpfVxuICAgICAgICAgICAge3JlbmRlclJlc3VsdCgpfVxuICAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiByZW5kZXJGb3JtKCkge1xuICAgICAgY29uc3QgaW5wdXRJZCA9IGNvbnRleHQuaWQoICdrZXknICk7XG4gICAgICByZXR1cm4gPGZvcm0gY2xhc3NOYW1lPSdqdW1ib3Ryb24nPlxuICAgICAgICAgPGgzPjxsYWJlbCBodG1sRm9yPXtpbnB1dElkfT48aSBjbGFzc05hbWU9J2ZhIGZhLXNlYXJjaCcgLz4gRW50ZXIgYSBzaG9ydC1rZXkgdG8gbG9va3VwPC9sYWJlbD48L2gzPlxuICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2Zvcm0tZ3JvdXAnPlxuICAgICAgICAgICAgPGlucHV0IGF1dG9Db21wbGV0ZT17dHJ1ZX0gdHlwZT0ndGV4dCdcbiAgICAgICAgICAgICAgICAgICBsZW5ndGg9e2tleUxlbmd0aH1cbiAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9J2Zvcm0tY29udHJvbCB1cmwtc2hvcnRlbmVyLWlucHV0J1xuICAgICAgICAgICAgICAgICAgIGlkPXtpbnB1dElkfVxuICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdlLmcuIGFiYzEyMydcbiAgICAgICAgICAgICAgICAgICB2YWx1ZT17bW9kZWwudmlld0tleX1cbiAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dXBkYXRlS2V5fSAvPlxuICAgICAgICAgPC9kaXY+XG4gICAgICA8L2Zvcm0+O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiByZW5kZXJSZXN1bHQoKSB7XG4gICAgICBjb25zdCByZXN1bHRDbGFzc2VzID0ge1xuICAgICAgICAgd2FpdGluZzogbW9kZWwud2FpdGluZyxcbiAgICAgICAgIGhpZGRlbjogIShtb2RlbC53YWl0aW5nIHx8IG1vZGVsLnZpZXdLZXkpLFxuICAgICAgICAgJ3VybC1zaG9ydGVuZXItcmVzdWx0LW9rJzogbW9kZWwuc2hvcnRVcmwsXG4gICAgICAgICAndXJsLXNob3J0ZW5lci1yZXN1bHQtNDA0JzogbW9kZWwubm90Rm91bmQsXG4gICAgICAgICBqdW1ib3Ryb246IHRydWVcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHN0YXR1cyA9ICh7dmlld0tleSwgd2FpdGluZywgbm90Rm91bmQsIHJlZGlyZWN0fSkgPT4ge1xuICAgICAgICAgaWYoIHZpZXdLZXkgJiYgdmlld0tleS5sZW5ndGggIT09IGtleUxlbmd0aCApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICBzeW1ib2w6ICcnLFxuICAgICAgICAgICAgICAgaW5mbzogJ0xvb2t1cCBrZXkgbXVzdCBiZSAnICsga2V5TGVuZ3RoICsgJyBjaGFyYWN0ZXJzIGxvbmchJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCB3YWl0aW5nICkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgIHN5bWJvbDogPGkgY2xhc3NOYW1lPSdmYSBmYS1zcGlubmVyJyAvPixcbiAgICAgICAgICAgICAgIGluZm86ICfigKZsb29raW5nIHVw4oCmJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCBub3RGb3VuZCApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICBzeW1ib2w6IDxpIGNsYXNzTmFtZT0nZmEgZmEtbWVoLW8nIC8+LFxuICAgICAgICAgICAgICAgaW5mbzogJzQwNDogbm90aGluZyBmb3VuZCBmb3IgJyArIG1vZGVsLnN1Ym1pdEtleVxuICAgICAgICAgICAgfTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCByZWRpcmVjdCApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICBzeW1ib2w6IG1vZGVsLnJlZGlyZWN0LmluU2Vjb25kcyB8fCAnMCcsXG4gICAgICAgICAgICAgICBpbmZvOiA8c3Bhbj5SZWRpcmVjdGluZyB0bzxiciAvPjxhIGhyZWY9e21vZGVsLnJlZGlyZWN0LnVybH0+e21vZGVsLnJlZGlyZWN0LnVybH08L2E+PC9zcGFuPlxuICAgICAgICAgICAgfTtcbiAgICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHsgc3ltYm9sLCBpbmZvIH0gPSBzdGF0dXMoIG1vZGVsICk7XG5cbiAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NMaXN0KCByZXN1bHRDbGFzc2VzICl9PlxuICAgICAgICAgPGgxIGNsYXNzTmFtZT0ndGV4dC1jZW50ZXInPntzeW1ib2x9PC9oMT5cbiAgICAgICAgIDxoMyBjbGFzc05hbWU9J3RleHQtY2VudGVyJz57aW5mb308L2gzPlxuICAgICAgPC9kaXY+O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiB1cGRhdGVLZXkoIGV2ICkge1xuICAgICAgbW9kZWwudmlld0tleSA9IGV2LnRhcmdldC52YWx1ZTtcbiAgICAgIGlmKCBtb2RlbC52aWV3S2V5Lmxlbmd0aCA9PT0ga2V5TGVuZ3RoICkge1xuICAgICAgICAgbG9va3VwKCk7XG4gICAgICB9XG4gICAgICByZW5kZXIoKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gbG9va3VwSW1tZWRpYXRlbHkoKSB7XG4gICAgICBpZiggbW9kZWwuc3VibWl0S2V5ID09PSBtb2RlbC52aWV3S2V5ICkge1xuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FuY2VsQW55UmVkaXJlY3QoKTtcbiAgICAgIG1vZGVsLm5vdEZvdW5kID0gZmFsc2U7XG4gICAgICBtb2RlbC53YWl0aW5nID0gdHJ1ZTtcbiAgICAgIG1vZGVsLnN1Ym1pdEtleSA9IG1vZGVsLnZpZXdLZXk7XG4gICAgICBldmVudEJ1cy5wdWJsaXNoKCAndGFrZUFjdGlvblJlcXVlc3QuJyArIGZlYXR1cmVzLmxvb2t1cC5hY3Rpb24sIHtcbiAgICAgICAgIGFjdGlvbjogZmVhdHVyZXMubG9va3VwLmFjdGlvbixcbiAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleTogbW9kZWwuc3VibWl0S2V5XG4gICAgICAgICB9XG4gICAgICB9ICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGNsYXNzTGlzdCggY2xhc3NTZXQgKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoIGNsYXNzU2V0ICkuZmlsdGVyKCBfID0+ICEhY2xhc3NTZXRbIF8gXSApLmpvaW4oICcgJyApO1xuICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICBuYW1lOiAndXJsLWxvb2t1cC13aWRnZXQnLFxuICAgaW5qZWN0aW9uczogaW5qZWN0aW9ucyxcbiAgIGNyZWF0ZTogY3JlYXRlXG59O1xuIl19