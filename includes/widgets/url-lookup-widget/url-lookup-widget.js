define(['exports', 'module', 'react', 'laxar'], function (exports, module, _react, _laxar) {
   /**
    * Copyright 2015 Michael Kurze
    * Released under the MIT license
    */
   'use strict';

   function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

   var _React = _interopRequireDefault(_react);

   var _ax = _interopRequireDefault(_laxar);

   var injections = ['axEventBus', 'axFeatures', 'axReactRender', 'axContext', 'axControls'];

   var REDIRECT_MS = 1000;
   var keyLength = 6;

   function create(eventBus, features, reactRender, context, controls) {

      var ProgressIndicator = controls.provide('laxar-progress-indicator-control');

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
         if (model.redirect.url === url) {
            // already in progress:
            return;
         }

         cancelAnyRedirect();

         model.redirect.url = url;
         model.redirect.startMs = Date.now();
         model.redirect.id = false;
         window.requestAnimationFrame(next);

         function next() {
            if (model.redirect.url !== url) {
               return;
            }
            model.redirect.progress = (Date.now() - model.redirect.startMs) / REDIRECT_MS;
            if (model.redirect.progress >= 1) {
               window.location.href = model.url;
            } else {
               window.requestAnimationFrame(next);
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
                  symbol: _React['default'].createElement(ProgressIndicator, { progress: redirect.progress }),
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
         if (model.submitKey === model.viewKey.toLowerCase()) {
            return;
         }
         cancelAnyRedirect();
         model.notFound = false;
         model.waiting = true;
         model.submitKey = model.viewKey.toLowerCase();
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
//# sourceMappingURL=data:application/json;base64,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T0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFHO0FBQ25ELG1CQUFPO1VBQ1Q7QUFDRCwwQkFBaUIsRUFBRSxDQUFDO0FBQ3BCLGNBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLGNBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLGNBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM5QyxpQkFBUSxDQUFDLE9BQU8sQ0FBRSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUM5RCxrQkFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTTtBQUM5QixnQkFBSSxFQUFFO0FBQ0gsa0JBQUcsRUFBRSxLQUFLLENBQUMsU0FBUzthQUN0QjtVQUNILENBQUUsQ0FBQztPQUNOOzs7O0FBSUQsZUFBUyxTQUFTLENBQUUsUUFBUSxFQUFHO0FBQzVCLGdCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFFLENBQUMsTUFBTSxDQUFFLFVBQUEsQ0FBQzttQkFBSSxDQUFDLENBQUMsUUFBUSxDQUFFLENBQUMsQ0FBRTtVQUFBLENBQUUsQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7T0FDNUU7SUFDSDs7b0JBRWM7QUFDWixVQUFJLEVBQUUsbUJBQW1CO0FBQ3pCLGdCQUFVLEVBQUUsVUFBVTtBQUN0QixZQUFNLEVBQUUsTUFBTTtJQUNoQiIsImZpbGUiOiJ1cmwtbG9va3VwLXdpZGdldC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE1IE1pY2hhZWwgS3VyemVcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF4IGZyb20gJ2xheGFyJztcblxuY29uc3QgaW5qZWN0aW9ucyA9IFsgJ2F4RXZlbnRCdXMnLCAnYXhGZWF0dXJlcycsICdheFJlYWN0UmVuZGVyJywgJ2F4Q29udGV4dCcsICdheENvbnRyb2xzJyBdO1xuXG5jb25zdCBSRURJUkVDVF9NUyA9IDEwMDA7XG5jb25zdCBrZXlMZW5ndGggPSA2O1xuXG5mdW5jdGlvbiBjcmVhdGUoIGV2ZW50QnVzLCBmZWF0dXJlcywgcmVhY3RSZW5kZXIsIGNvbnRleHQsIGNvbnRyb2xzICkge1xuXG4gICBjb25zdCBQcm9ncmVzc0luZGljYXRvciA9IGNvbnRyb2xzLnByb3ZpZGUoICdsYXhhci1wcm9ncmVzcy1pbmRpY2F0b3ItY29udHJvbCcgKTtcblxuICAgY29uc3QgbW9kZWwgPSB7XG4gICAgICB3YWl0aW5nOiBmYWxzZSxcbiAgICAgIHZpZXdLZXk6ICcnLFxuICAgICAgc3VibWl0S2V5OiBudWxsLFxuICAgICAgdXJsOiBudWxsLFxuICAgICAgcmVkaXJlY3Q6IHtcbiAgICAgICAgIHVybDogbnVsbCxcbiAgICAgICAgIGluU2Vjb25kczogbnVsbCxcbiAgICAgICAgIHRpbWVvdXQ6IG51bGxcbiAgICAgIH1cbiAgIH07XG5cbiAgIGV2ZW50QnVzLnN1YnNjcmliZSggJ2VuZExpZmVjeWNsZVJlcXVlc3QnLCBjYW5jZWxBbnlSZWRpcmVjdCApO1xuICAgZXZlbnRCdXMuc3Vic2NyaWJlKCAnZGlkTmF2aWdhdGUnLCBoYW5kbGVEaWROYXZpZ2F0ZSApO1xuICAgZXZlbnRCdXMuc3Vic2NyaWJlKCAnZGlkUmVwbGFjZS4nICsgZmVhdHVyZXMucmVzdWx0LnJlc291cmNlLCBoYW5kbGVEaWRSZXBsYWNlICk7XG5cbiAgIGNvbnN0IGxvb2t1cCA9IGF4LmZuLmRlYm91bmNlKCBsb29rdXBJbW1lZGlhdGVseSwgMTAwICk7XG5cbiAgIHJldHVybiB7XG4gICAgICBvbkRvbUF2YWlsYWJsZTogcmVuZGVyXG4gICB9O1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBoYW5kbGVEaWRSZXBsYWNlKCBldmVudCApIHtcbiAgICAgIGNvbnN0IHsgZGF0YTogeyB1cmwsIGtleSB9IH0gPSBldmVudDtcbiAgICAgIGlmKCBrZXkgIT09IG1vZGVsLnN1Ym1pdEtleSApIHtcbiAgICAgICAgIC8vIHN0YWxlIHJlcXVlc3RcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbW9kZWwud2FpdGluZyA9IGZhbHNlO1xuICAgICAgaWYoICF1cmwgKSB7XG4gICAgICAgICBtb2RlbC5ub3RGb3VuZCA9IHRydWU7XG4gICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbW9kZWwudXJsID0gdXJsO1xuICAgICAgc3RhcnRSZWRpcmVjdCggdXJsICk7XG4gICAgICByZW5kZXIoKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gaGFuZGxlRGlkTmF2aWdhdGUoIGV2ZW50ICkge1xuICAgICAgY29uc3QgeyBkYXRhOiB7IGtleSB9IH0gPSBldmVudDtcbiAgICAgIGlmKCBrZXkgKSB7XG4gICAgICAgICBtb2RlbC52aWV3S2V5ID0ga2V5O1xuICAgICAgICAgbG9va3VwKCk7XG4gICAgICAgICByZW5kZXIoKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gc3RhcnRSZWRpcmVjdCggdXJsICkge1xuICAgICAgaWYoIG1vZGVsLnJlZGlyZWN0LnVybCA9PT0gdXJsICkge1xuICAgICAgICAgLy8gYWxyZWFkeSBpbiBwcm9ncmVzczpcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY2FuY2VsQW55UmVkaXJlY3QoKTtcblxuICAgICAgbW9kZWwucmVkaXJlY3QudXJsID0gdXJsO1xuICAgICAgbW9kZWwucmVkaXJlY3Quc3RhcnRNcyA9IERhdGUubm93KCk7XG4gICAgICBtb2RlbC5yZWRpcmVjdC5pZCA9IGZhbHNlO1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggbmV4dCApO1xuXG4gICAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgaWYoIG1vZGVsLnJlZGlyZWN0LnVybCAhPT0gdXJsICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgfVxuICAgICAgICAgbW9kZWwucmVkaXJlY3QucHJvZ3Jlc3MgPSAoIERhdGUubm93KCkgLSBtb2RlbC5yZWRpcmVjdC5zdGFydE1zICkgLyBSRURJUkVDVF9NUztcbiAgICAgICAgIGlmKCBtb2RlbC5yZWRpcmVjdC5wcm9ncmVzcyA+PSAxICkge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBtb2RlbC51cmw7XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIG5leHQgKTtcbiAgICAgICAgIH1cbiAgICAgICAgIHJlbmRlcigpO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBjYW5jZWxBbnlSZWRpcmVjdCgpIHtcbiAgICAgIG1vZGVsLnJlZGlyZWN0LnVybCA9IG51bGw7XG4gICAgICBtb2RlbC5yZWRpcmVjdC5zdGFydE1zID0gbnVsbDtcbiAgICAgIG1vZGVsLnJlZGlyZWN0LnByb2dyZXNzID0gMDtcbiAgICAgIG1vZGVsLnJlZGlyZWN0LmNhbmNlbGxlZCA9IHRydWU7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHJlYWN0UmVuZGVyKFxuICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIHtyZW5kZXJGb3JtKCl9XG4gICAgICAgICAgICB7cmVuZGVyUmVzdWx0KCl9XG4gICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlckZvcm0oKSB7XG4gICAgICBjb25zdCBpbnB1dElkID0gY29udGV4dC5pZCggJ2tleScgKTtcbiAgICAgIHJldHVybiA8Zm9ybSBjbGFzc05hbWU9J2p1bWJvdHJvbic+XG4gICAgICAgICA8aDM+PGxhYmVsIGh0bWxGb3I9e2lucHV0SWR9PjxpIGNsYXNzTmFtZT0nZmEgZmEtc2VhcmNoJyAvPiBFbnRlciBhIHNob3J0LWtleSB0byBsb29rdXA8L2xhYmVsPjwvaDM+XG4gICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZm9ybS1ncm91cCc+XG4gICAgICAgICAgICA8aW5wdXQgYXV0b0NvbXBsZXRlPXt0cnVlfSB0eXBlPSd0ZXh0J1xuICAgICAgICAgICAgICAgICAgIGxlbmd0aD17a2V5TGVuZ3RofVxuICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0nZm9ybS1jb250cm9sIHVybC1zaG9ydGVuZXItaW5wdXQnXG4gICAgICAgICAgICAgICAgICAgaWQ9e2lucHV0SWR9XG4gICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9J2UuZy4gYWJjMTIzJ1xuICAgICAgICAgICAgICAgICAgIHZhbHVlPXttb2RlbC52aWV3S2V5fVxuICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt1cGRhdGVLZXl9IC8+XG4gICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZm9ybT47XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlclJlc3VsdCgpIHtcbiAgICAgIGNvbnN0IHJlc3VsdENsYXNzZXMgPSB7XG4gICAgICAgICB3YWl0aW5nOiBtb2RlbC53YWl0aW5nLFxuICAgICAgICAgaGlkZGVuOiAhKG1vZGVsLndhaXRpbmcgfHwgbW9kZWwudmlld0tleSksXG4gICAgICAgICAndXJsLXNob3J0ZW5lci1yZXN1bHQtb2snOiBtb2RlbC5zaG9ydFVybCxcbiAgICAgICAgICd1cmwtc2hvcnRlbmVyLXJlc3VsdC00MDQnOiBtb2RlbC5ub3RGb3VuZCxcbiAgICAgICAgIGp1bWJvdHJvbjogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgY29uc3Qgc3RhdHVzID0gKHt2aWV3S2V5LCB3YWl0aW5nLCBub3RGb3VuZCwgcmVkaXJlY3R9KSA9PiB7XG4gICAgICAgICBpZiggdmlld0tleSAmJiB2aWV3S2V5Lmxlbmd0aCAhPT0ga2V5TGVuZ3RoICkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgIHN5bWJvbDogJycsXG4gICAgICAgICAgICAgICBpbmZvOiAnTG9va3VwIGtleSBtdXN0IGJlICcgKyBrZXlMZW5ndGggKyAnIGNoYXJhY3RlcnMgbG9uZyEnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgfVxuICAgICAgICAgaWYoIHdhaXRpbmcgKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgc3ltYm9sOiA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXInIC8+LFxuICAgICAgICAgICAgICAgaW5mbzogJ+KApmxvb2tpbmcgdXDigKYnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgfVxuICAgICAgICAgaWYoIG5vdEZvdW5kICkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgIHN5bWJvbDogPGkgY2xhc3NOYW1lPSdmYSBmYS1tZWgtbycgLz4sXG4gICAgICAgICAgICAgICBpbmZvOiAnNDA0OiBub3RoaW5nIGZvdW5kIGZvciAnICsgbW9kZWwuc3VibWl0S2V5XG4gICAgICAgICAgICB9O1xuICAgICAgICAgfVxuICAgICAgICAgaWYoIHJlZGlyZWN0ICkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgIHN5bWJvbDogPFByb2dyZXNzSW5kaWNhdG9yIHByb2dyZXNzPXtyZWRpcmVjdC5wcm9ncmVzc30gLz4sXG4gICAgICAgICAgICAgICBpbmZvOiA8c3Bhbj5SZWRpcmVjdGluZyB0bzxiciAvPjxhIGhyZWY9e21vZGVsLnJlZGlyZWN0LnVybH0+e21vZGVsLnJlZGlyZWN0LnVybH08L2E+PC9zcGFuPlxuICAgICAgICAgICAgfTtcbiAgICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHsgc3ltYm9sLCBpbmZvIH0gPSBzdGF0dXMoIG1vZGVsICk7XG5cbiAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NMaXN0KCByZXN1bHRDbGFzc2VzICl9PlxuICAgICAgICAgPGgxIGNsYXNzTmFtZT0ndGV4dC1jZW50ZXInPntzeW1ib2x9PC9oMT5cbiAgICAgICAgIDxoMyBjbGFzc05hbWU9J3RleHQtY2VudGVyJz57aW5mb308L2gzPlxuICAgICAgPC9kaXY+O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiB1cGRhdGVLZXkoIGV2ICkge1xuICAgICAgbW9kZWwudmlld0tleSA9IGV2LnRhcmdldC52YWx1ZTtcbiAgICAgIGlmKCBtb2RlbC52aWV3S2V5Lmxlbmd0aCA9PT0ga2V5TGVuZ3RoICkge1xuICAgICAgICAgbG9va3VwKCk7XG4gICAgICB9XG4gICAgICByZW5kZXIoKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gbG9va3VwSW1tZWRpYXRlbHkoKSB7XG4gICAgICBpZiggbW9kZWwuc3VibWl0S2V5ID09PSBtb2RlbC52aWV3S2V5LnRvTG93ZXJDYXNlKCkgKSB7XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYW5jZWxBbnlSZWRpcmVjdCgpO1xuICAgICAgbW9kZWwubm90Rm91bmQgPSBmYWxzZTtcbiAgICAgIG1vZGVsLndhaXRpbmcgPSB0cnVlO1xuICAgICAgbW9kZWwuc3VibWl0S2V5ID0gbW9kZWwudmlld0tleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZXZlbnRCdXMucHVibGlzaCggJ3Rha2VBY3Rpb25SZXF1ZXN0LicgKyBmZWF0dXJlcy5sb29rdXAuYWN0aW9uLCB7XG4gICAgICAgICBhY3Rpb246IGZlYXR1cmVzLmxvb2t1cC5hY3Rpb24sXG4gICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IG1vZGVsLnN1Ym1pdEtleVxuICAgICAgICAgfVxuICAgICAgfSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBjbGFzc0xpc3QoIGNsYXNzU2V0ICkge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKCBjbGFzc1NldCApLmZpbHRlciggXyA9PiAhIWNsYXNzU2V0WyBfIF0gKS5qb2luKCAnICcgKTtcbiAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgbmFtZTogJ3VybC1sb29rdXAtd2lkZ2V0JyxcbiAgIGluamVjdGlvbnM6IGluamVjdGlvbnMsXG4gICBjcmVhdGU6IGNyZWF0ZVxufTtcbiJdfQ==