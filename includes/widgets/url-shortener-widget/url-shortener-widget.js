define(['exports', 'module', 'react'], function (exports, module, _react) {
   /**
    * Copyright 2015 Michael Kurze
    * Released under the MIT license
    */
   'use strict';

   function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

   var _React = _interopRequireDefault(_react);

   var injections = ['axEventBus', 'axFeatures', 'axReactRender', 'axContext'];

   var URL_CHECKER = /\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|‌​]/;

   function create(eventBus, features, reactRender, context) {

      var model = {
         waiting: false,
         invalidUrl: false,
         viewUrl: '',
         submitUrl: null,
         shortUrl: null
      };

      eventBus.subscribe('didReplace.' + features.result.resource, handleResult);

      return {
         onDomAvailable: render
      };

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
         var inputId = context.id('url');
         return _React['default'].createElement(
            'form',
            { className: 'jumbotron' },
            _React['default'].createElement(
               'h3',
               null,
               _React['default'].createElement(
                  'label',
                  { htmlFor: inputId },
                  _React['default'].createElement('i', { className: 'fa fa-plus-circle' }),
                  ' Paste a URL to shorten:'
               )
            ),
            _React['default'].createElement(
               'div',
               { className: 'form-group' },
               _React['default'].createElement('input', { type: 'url',
                  autoComplete: true,
                  className: 'form-control url-shortener-input',
                  id: inputId,
                  placeholder: 'http://...',
                  onChange: updateUrl, value: model.viewUrl })
            ),
            _React['default'].createElement(
               'button',
               { disabled: !model.viewUrl, type: 'button', className: 'btn btn-primary btn-lg',
                  onClick: submit },
               'kurz it!'
            )
         );
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function renderResult() {
         var resultClasses = {
            waiting: model.waiting,
            hidden: !(model.waiting || model.shortUrl || model.invalidUrl),
            'url-shortener-result-ok': model.shortUrl,
            'url-shortener-result-invalid': model.invalidUrl,
            jumbotron: true
         };

         if (model.invalidUrl) {
            return _React['default'].createElement(
               'div',
               { className: classList(resultClasses) },
               _React['default'].createElement(
                  'h3',
                  { className: 'text-center' },
                  'Please enter a valid URL'
               )
            );
         }

         var resultTitle = 'Short URL for "' + model.submitUrl + '"';
         var result = model.waiting ? _React['default'].createElement('i', { className: 'fa fa-spinner' }) : _React['default'].createElement(
            'span',
            null,
            'Your short URL:',
            _React['default'].createElement('br', null),
            _React['default'].createElement(
               'a',
               { href: model.shortUrl, title: resultTitle },
               model.shortUrl
            )
         );

         var resultStatus = model.waiting ? '…kurzing…' : 'Short key: ' + model.key;

         return _React['default'].createElement(
            'div',
            { className: classList(resultClasses) },
            _React['default'].createElement(
               'h2',
               { className: 'url-shortener-result text-center' },
               result
            ),
            _React['default'].createElement(
               'h3',
               { className: 'text-center' },
               resultStatus
            )
         );
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function updateUrl(ev) {
         model.viewUrl = ev.target.value;
         model.invalidUrl = false;
         render();
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function submit() {
         model.invalidUrl = !URL_CHECKER.test(model.viewUrl);
         if (model.invalidUrl) {
            render();
            return;
         }
         model.submitUrl = model.viewUrl;
         model.waiting = true;

         render();
         eventBus.publish('takeActionRequest.' + features.shorten.action, {
            action: features.shorten.action,
            data: {
               url: model.submitUrl
            }
         });
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function handleResult(_ref) {
         var _ref$data = _ref.data;
         var url = _ref$data.url;
         var shortUrl = _ref$data.shortUrl;
         var key = _ref$data.key;

         if (url !== model.submitUrl) {
            // stale request
            return;
         }
         model.shortUrl = shortUrl;
         model.waiting = false;
         model.key = key;
         render();
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function classList(classSet) {
         return Object.keys(classSet).filter(function (_) {
            return !!classSet[_];
         }).join(' ');
      }
   }

   module.exports = {
      name: 'url-shortener-widget',
      injections: injections,
      create: create
   };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVybC1zaG9ydGVuZXItd2lkZ2V0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU1BLE9BQU0sVUFBVSxHQUFHLENBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsV0FBVyxDQUFFLENBQUM7O0FBRWhGLE9BQU0sV0FBVyxHQUFHLG1GQUFtRixDQUFDOztBQUV4RyxZQUFTLE1BQU0sQ0FBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUc7O0FBRXpELFVBQU0sS0FBSyxHQUFHO0FBQ1gsZ0JBQU8sRUFBRSxLQUFLO0FBQ2QsbUJBQVUsRUFBRSxLQUFLO0FBQ2pCLGdCQUFPLEVBQUUsRUFBRTtBQUNYLGtCQUFTLEVBQUUsSUFBSTtBQUNmLGlCQUFRLEVBQUUsSUFBSTtPQUNoQixDQUFDOztBQUVGLGNBQVEsQ0FBQyxTQUFTLENBQUUsYUFBYSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBRSxDQUFDOztBQUU3RSxhQUFPO0FBQ0osdUJBQWMsRUFBRSxNQUFNO09BQ3hCLENBQUM7Ozs7QUFJRixlQUFTLE1BQU0sR0FBRztBQUNmLG9CQUFXLENBQ1I7OztZQUNJLFVBQVUsRUFBRTtZQUNaLFlBQVksRUFBRTtVQUNaLENBQ1IsQ0FBQztPQUNKOzs7O0FBSUQsZUFBUyxVQUFVLEdBQUc7QUFDbkIsYUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBRSxLQUFLLENBQUUsQ0FBQztBQUNwQyxnQkFBTzs7Y0FBTSxTQUFTLEVBQUMsV0FBVztZQUMvQjs7O2VBQUk7O29CQUFPLE9BQU8sRUFBRSxPQUFPLEFBQUM7a0JBQUMsdUNBQUcsU0FBUyxFQUFDLG1CQUFtQixHQUFHOztnQkFBZ0M7YUFBSztZQUNyRzs7aUJBQUssU0FBUyxFQUFDLFlBQVk7ZUFDeEIsMkNBQU8sSUFBSSxFQUFDLEtBQUs7QUFDViw4QkFBWSxFQUFFLElBQUksQUFBQztBQUNuQiwyQkFBUyxF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QUU7eUJBQWxDLElBQWdDLENBQTlCLElBQUk7YUFBSSxHQUFHLGFBQUgsR0FBRzthQUFFLFFBQVEsYUFBUixRQUFRO2FBQUUsR0FBRyxhQUFILEdBQUc7O0FBQy9DLGFBQUksR0FBRyxLQUFLLEtBQUssQ0FBQyxTQUFTLEVBQUc7O0FBRTNCLG1CQUFPO1VBQ1Q7QUFDRCxjQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUMxQixjQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUN0QixjQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNoQixlQUFNLEVBQUUsQ0FBQztPQUNYOzs7O0FBSUQsZUFBUyxTQUFTLENBQUUsUUFBUSxFQUFHO0FBQzVCLGdCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFFLENBQUMsTUFBTSxDQUFFLFVBQUEsQ0FBQzttQkFBSSxDQUFDLENBQUMsUUFBUSxDQUFFLENBQUMsQ0FBRTtVQUFBLENBQUUsQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7T0FDNUU7SUFDSDs7b0JBRWM7QUFDWixVQUFJLEVBQUUsc0JBQXNCO0FBQzVCLGdCQUFVLEVBQUUsVUFBVTtBQUN0QixZQUFNLEVBQUUsTUFBTTtJQUNoQiIsImZpbGUiOiJ1cmwtc2hvcnRlbmVyLXdpZGdldC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE1IE1pY2hhZWwgS3VyemVcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jb25zdCBpbmplY3Rpb25zID0gWyAnYXhFdmVudEJ1cycsICdheEZlYXR1cmVzJywgJ2F4UmVhY3RSZW5kZXInLCAnYXhDb250ZXh0JyBdO1xuXG5jb25zdCBVUkxfQ0hFQ0tFUiA9IC9cXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bXFwtQS1aYS16MC05KyZAI1xcLyU/PX5ffCE6LC47XSpbXFwtQS1aYS16MC05KyZAI1xcLyU9fl984oCM4oCLXS87XG5cbmZ1bmN0aW9uIGNyZWF0ZSggZXZlbnRCdXMsIGZlYXR1cmVzLCByZWFjdFJlbmRlciwgY29udGV4dCApIHtcblxuICAgY29uc3QgbW9kZWwgPSB7XG4gICAgICB3YWl0aW5nOiBmYWxzZSxcbiAgICAgIGludmFsaWRVcmw6IGZhbHNlLFxuICAgICAgdmlld1VybDogJycsXG4gICAgICBzdWJtaXRVcmw6IG51bGwsXG4gICAgICBzaG9ydFVybDogbnVsbFxuICAgfTtcblxuICAgZXZlbnRCdXMuc3Vic2NyaWJlKCAnZGlkUmVwbGFjZS4nICsgZmVhdHVyZXMucmVzdWx0LnJlc291cmNlLCBoYW5kbGVSZXN1bHQgKTtcblxuICAgcmV0dXJuIHtcbiAgICAgIG9uRG9tQXZhaWxhYmxlOiByZW5kZXJcbiAgIH07XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHJlYWN0UmVuZGVyKFxuICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIHtyZW5kZXJGb3JtKCl9XG4gICAgICAgICAgICB7cmVuZGVyUmVzdWx0KCl9XG4gICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlckZvcm0oKSB7XG4gICAgICBjb25zdCBpbnB1dElkID0gY29udGV4dC5pZCggJ3VybCcgKTtcbiAgICAgIHJldHVybiA8Zm9ybSBjbGFzc05hbWU9XCJqdW1ib3Ryb25cIj5cbiAgICAgICAgIDxoMz48bGFiZWwgaHRtbEZvcj17aW5wdXRJZH0+PGkgY2xhc3NOYW1lPSdmYSBmYS1wbHVzLWNpcmNsZScgLz4gUGFzdGUgYSBVUkwgdG8gc2hvcnRlbjo8L2xhYmVsPjwvaDM+XG4gICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZm9ybS1ncm91cCc+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT0ndXJsJ1xuICAgICAgICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9J2Zvcm0tY29udHJvbCB1cmwtc2hvcnRlbmVyLWlucHV0J1xuICAgICAgICAgICAgICAgICAgIGlkPXtpbnB1dElkfVxuICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdodHRwOi8vLi4uJ1xuICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt1cGRhdGVVcmx9IHZhbHVlPXttb2RlbC52aWV3VXJsfSAvPlxuICAgICAgICAgPC9kaXY+XG4gICAgICAgICA8YnV0dG9uIGRpc2FibGVkPXshbW9kZWwudmlld1VybH0gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT0nYnRuIGJ0bi1wcmltYXJ5IGJ0bi1sZydcbiAgICAgICAgICAgICAgICAgb25DbGljaz17c3VibWl0fT5rdXJ6IGl0ITwvYnV0dG9uPlxuICAgICAgPC9mb3JtPjtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVuZGVyUmVzdWx0KCkge1xuICAgICAgY29uc3QgcmVzdWx0Q2xhc3NlcyA9IHtcbiAgICAgICAgIHdhaXRpbmc6IG1vZGVsLndhaXRpbmcsXG4gICAgICAgICBoaWRkZW46ICEobW9kZWwud2FpdGluZyB8fCBtb2RlbC5zaG9ydFVybCB8fCBtb2RlbC5pbnZhbGlkVXJsKSxcbiAgICAgICAgICd1cmwtc2hvcnRlbmVyLXJlc3VsdC1vayc6IG1vZGVsLnNob3J0VXJsLFxuICAgICAgICAgJ3VybC1zaG9ydGVuZXItcmVzdWx0LWludmFsaWQnOiBtb2RlbC5pbnZhbGlkVXJsLFxuICAgICAgICAganVtYm90cm9uOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICBpZiggbW9kZWwuaW52YWxpZFVybCApIHtcbiAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NMaXN0KCByZXN1bHRDbGFzc2VzICl9PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT0ndGV4dC1jZW50ZXInPlBsZWFzZSBlbnRlciBhIHZhbGlkIFVSTDwvaDM+XG4gICAgICAgICA8L2Rpdj5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0VGl0bGUgPSAnU2hvcnQgVVJMIGZvciBcIicgKyBtb2RlbC5zdWJtaXRVcmwgKyAnXCInO1xuICAgICAgY29uc3QgcmVzdWx0ID0gbW9kZWwud2FpdGluZyA/XG4gICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXInIC8+IDpcbiAgICAgICAgIDxzcGFuPllvdXIgc2hvcnQgVVJMOjxici8+PGEgaHJlZj17bW9kZWwuc2hvcnRVcmx9IHRpdGxlPXtyZXN1bHRUaXRsZX0+e21vZGVsLnNob3J0VXJsfTwvYT48L3NwYW4+O1xuXG4gICAgICBjb25zdCByZXN1bHRTdGF0dXMgPSBtb2RlbC53YWl0aW5nID8gJ+KApmt1cnppbmfigKYnIDogJ1Nob3J0IGtleTogJyArIG1vZGVsLmtleTtcblxuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtjbGFzc0xpc3QoIHJlc3VsdENsYXNzZXMgKX0+XG4gICAgICAgICA8aDIgY2xhc3NOYW1lPSd1cmwtc2hvcnRlbmVyLXJlc3VsdCB0ZXh0LWNlbnRlcic+e3Jlc3VsdH08L2gyPlxuICAgICAgICAgPGgzIGNsYXNzTmFtZT0ndGV4dC1jZW50ZXInPntyZXN1bHRTdGF0dXN9PC9oMz5cbiAgICAgIDwvZGl2PjtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gdXBkYXRlVXJsKCBldiApIHtcbiAgICAgIG1vZGVsLnZpZXdVcmwgPSBldi50YXJnZXQudmFsdWU7XG4gICAgICBtb2RlbC5pbnZhbGlkVXJsID0gZmFsc2U7XG4gICAgICByZW5kZXIoKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gc3VibWl0KCkge1xuICAgICAgbW9kZWwuaW52YWxpZFVybCA9ICFVUkxfQ0hFQ0tFUi50ZXN0KCBtb2RlbC52aWV3VXJsICk7XG4gICAgICBpZiggbW9kZWwuaW52YWxpZFVybCApIHtcbiAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbW9kZWwuc3VibWl0VXJsID0gbW9kZWwudmlld1VybDtcbiAgICAgIG1vZGVsLndhaXRpbmcgPSB0cnVlO1xuXG4gICAgICByZW5kZXIoKTtcbiAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICd0YWtlQWN0aW9uUmVxdWVzdC4nICsgZmVhdHVyZXMuc2hvcnRlbi5hY3Rpb24sIHtcbiAgICAgICAgIGFjdGlvbjogZmVhdHVyZXMuc2hvcnRlbi5hY3Rpb24sXG4gICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB1cmw6IG1vZGVsLnN1Ym1pdFVybFxuICAgICAgICAgfVxuICAgICAgfSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBoYW5kbGVSZXN1bHQoeyBkYXRhOiB7IHVybCwgc2hvcnRVcmwsIGtleSB9IH0pIHtcbiAgICAgIGlmKCB1cmwgIT09IG1vZGVsLnN1Ym1pdFVybCApIHtcbiAgICAgICAgIC8vIHN0YWxlIHJlcXVlc3RcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG1vZGVsLnNob3J0VXJsID0gc2hvcnRVcmw7XG4gICAgICBtb2RlbC53YWl0aW5nID0gZmFsc2U7XG4gICAgICBtb2RlbC5rZXkgPSBrZXk7XG4gICAgICByZW5kZXIoKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gY2xhc3NMaXN0KCBjbGFzc1NldCApIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyggY2xhc3NTZXQgKS5maWx0ZXIoIF8gPT4gISFjbGFzc1NldFsgXyBdICkuam9pbiggJyAnICk7XG4gICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgIG5hbWU6ICd1cmwtc2hvcnRlbmVyLXdpZGdldCcsXG4gICBpbmplY3Rpb25zOiBpbmplY3Rpb25zLFxuICAgY3JlYXRlOiBjcmVhdGVcbn07XG4iXX0=