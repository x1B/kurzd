define(['exports', 'module', 'react'], function (exports, module, _react) {
   /**
    * Copyright 2015 Michael Kurze
    * Released under the MIT license
    */
   'use strict';

   function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

   var _React = _interopRequireDefault(_react);

   var injections = ['axEventBus', 'axFeatures', 'axReactRender', 'axContext'];

   function create(eventBus, features, reactRender, context) {

      var model = {
         waiting: false,
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
            hidden: !(model.waiting || model.shortUrl),
            'url-shortener-result-ok': model.shortUrl,
            jumbotron: true
         };
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
         render();
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function submit() {
         model.waiting = true;
         model.submitUrl = model.viewUrl;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVybC1zaG9ydGVuZXItd2lkZ2V0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU1BLE9BQU0sVUFBVSxHQUFHLENBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsV0FBVyxDQUFFLENBQUM7O0FBRWhGLFlBQVMsTUFBTSxDQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRzs7QUFFekQsVUFBTSxLQUFLLEdBQUc7QUFDWCxnQkFBTyxFQUFFLEtBQUs7QUFDZCxnQkFBTyxFQUFFLEVBQUU7QUFDWCxrQkFBUyxFQUFFLElBQUk7QUFDZixpQkFBUSxFQUFFLElBQUk7T0FDaEIsQ0FBQzs7QUFFRixjQUFRLENBQUMsU0FBUyxDQUFFLGFBQWEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUUsQ0FBQzs7QUFFN0UsYUFBTztBQUNKLHVCQUFjLEVBQUUsTUFBTTtPQUN4QixDQUFDOzs7O0FBSUYsZUFBUyxNQUFNLEdBQUc7QUFDZixvQkFBVyxDQUNSOzs7WUFDSSxVQUFVLEVBQUU7WUFDWixZQUFZLEVBQUU7VUFDWixDQUNSLENBQUM7T0FDSjs7OztBQUlELGVBQVMsVUFBVSxHQUFHO0FBQ25CLGFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUUsS0FBSyxDQUFFLENBQUM7QUFDcEMsZ0JBQU87O2NBQU0sU0FBUyxFQUFDLFdBQVc7WUFDL0I7OztlQUFJOztvQkFBTyxPQUFPLEVBQUUsT0FBTyxBQUFDO2tCQUFDLHVDQUFHLFNBQVMsRUFBQyxtQkFBbUIsR0FBRzs7Z0JBQWdDO2FBQUs7WUFDckc7O2lCQUFLLFNBQVMsRUFBQyxZQUFZO2VBQ3hCLDJDQUFPLElBQUksRUFBQyxLQUFLO0FBQ1YsOEJBQVksRUFBRSxJQUFJLEFBQUM7QUFDbkIsMkJBQVMsRUFBQyxrQ0FBa0M7QUFDNUMsb0JBQUUsRUFBRSxPQUFPLEFBQUM7QUFDWiw2QkFBVyxFQUFDLFlB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QUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO09BQzVFO0lBQ0g7O29CQUVjO0FBQ1osVUFBSSxFQUFFLHNCQUFzQjtBQUM1QixnQkFBVSxFQUFFLFVBQVU7QUFDdEIsWUFBTSxFQUFFLE1BQU07SUFDaEIiLCJmaWxlIjoidXJsLXNob3J0ZW5lci13aWRnZXQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSBNaWNoYWVsIEt1cnplXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY29uc3QgaW5qZWN0aW9ucyA9IFsgJ2F4RXZlbnRCdXMnLCAnYXhGZWF0dXJlcycsICdheFJlYWN0UmVuZGVyJywgJ2F4Q29udGV4dCcgXTtcblxuZnVuY3Rpb24gY3JlYXRlKCBldmVudEJ1cywgZmVhdHVyZXMsIHJlYWN0UmVuZGVyLCBjb250ZXh0ICkge1xuXG4gICBjb25zdCBtb2RlbCA9IHtcbiAgICAgIHdhaXRpbmc6IGZhbHNlLFxuICAgICAgdmlld1VybDogJycsXG4gICAgICBzdWJtaXRVcmw6IG51bGwsXG4gICAgICBzaG9ydFVybDogbnVsbFxuICAgfTtcblxuICAgZXZlbnRCdXMuc3Vic2NyaWJlKCAnZGlkUmVwbGFjZS4nICsgZmVhdHVyZXMucmVzdWx0LnJlc291cmNlLCBoYW5kbGVSZXN1bHQgKTtcblxuICAgcmV0dXJuIHtcbiAgICAgIG9uRG9tQXZhaWxhYmxlOiByZW5kZXJcbiAgIH07XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHJlYWN0UmVuZGVyKFxuICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIHtyZW5kZXJGb3JtKCl9XG4gICAgICAgICAgICB7cmVuZGVyUmVzdWx0KCl9XG4gICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlckZvcm0oKSB7XG4gICAgICBjb25zdCBpbnB1dElkID0gY29udGV4dC5pZCggJ3VybCcgKTtcbiAgICAgIHJldHVybiA8Zm9ybSBjbGFzc05hbWU9XCJqdW1ib3Ryb25cIj5cbiAgICAgICAgIDxoMz48bGFiZWwgaHRtbEZvcj17aW5wdXRJZH0+PGkgY2xhc3NOYW1lPSdmYSBmYS1wbHVzLWNpcmNsZScgLz4gUGFzdGUgYSBVUkwgdG8gc2hvcnRlbjo8L2xhYmVsPjwvaDM+XG4gICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZm9ybS1ncm91cCc+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT0ndXJsJ1xuICAgICAgICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9J2Zvcm0tY29udHJvbCB1cmwtc2hvcnRlbmVyLWlucHV0J1xuICAgICAgICAgICAgICAgICAgIGlkPXtpbnB1dElkfVxuICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdodHRwOi8vLi4uJ1xuICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt1cGRhdGVVcmx9IHZhbHVlPXttb2RlbC52aWV3VXJsfSAvPlxuICAgICAgICAgPC9kaXY+XG4gICAgICAgICA8YnV0dG9uIGRpc2FibGVkPXshbW9kZWwudmlld1VybH0gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT0nYnRuIGJ0bi1wcmltYXJ5IGJ0bi1sZydcbiAgICAgICAgICAgICAgICAgb25DbGljaz17c3VibWl0fT5rdXJ6IGl0ITwvYnV0dG9uPlxuICAgICAgPC9mb3JtPjtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVuZGVyUmVzdWx0KCkge1xuICAgICAgY29uc3QgcmVzdWx0Q2xhc3NlcyA9IHtcbiAgICAgICAgIHdhaXRpbmc6IG1vZGVsLndhaXRpbmcsXG4gICAgICAgICBoaWRkZW46ICEobW9kZWwud2FpdGluZyB8fCBtb2RlbC5zaG9ydFVybCApLFxuICAgICAgICAgJ3VybC1zaG9ydGVuZXItcmVzdWx0LW9rJzogbW9kZWwuc2hvcnRVcmwsXG4gICAgICAgICBqdW1ib3Ryb246IHRydWVcbiAgICAgIH07XG4gICAgICBjb25zdCByZXN1bHRUaXRsZSA9ICdTaG9ydCBVUkwgZm9yIFwiJyArIG1vZGVsLnN1Ym1pdFVybCArICdcIic7XG4gICAgICBjb25zdCByZXN1bHQgPSBtb2RlbC53YWl0aW5nID9cbiAgICAgICAgIDxpIGNsYXNzTmFtZT0nZmEgZmEtc3Bpbm5lcicgLz4gOlxuICAgICAgICAgPHNwYW4+WW91ciBzaG9ydCBVUkw6PGJyLz48YSBocmVmPXttb2RlbC5zaG9ydFVybH0gdGl0bGU9e3Jlc3VsdFRpdGxlfT57bW9kZWwuc2hvcnRVcmx9PC9hPjwvc3Bhbj47XG5cbiAgICAgIGNvbnN0IHJlc3VsdFN0YXR1cyA9IG1vZGVsLndhaXRpbmcgPyAn4oCma3VyemluZ+KApicgOiAnU2hvcnQga2V5OiAnICsgbW9kZWwua2V5O1xuXG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e2NsYXNzTGlzdCggcmVzdWx0Q2xhc3NlcyApfT5cbiAgICAgICAgIDxoMiBjbGFzc05hbWU9J3VybC1zaG9ydGVuZXItcmVzdWx0IHRleHQtY2VudGVyJz57cmVzdWx0fTwvaDI+XG4gICAgICAgICA8aDMgY2xhc3NOYW1lPSd0ZXh0LWNlbnRlcic+e3Jlc3VsdFN0YXR1c308L2gzPlxuICAgICAgPC9kaXY+O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiB1cGRhdGVVcmwoIGV2ICkge1xuICAgICAgbW9kZWwudmlld1VybCA9IGV2LnRhcmdldC52YWx1ZTtcbiAgICAgIHJlbmRlcigpO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBzdWJtaXQoKSB7XG4gICAgICBtb2RlbC53YWl0aW5nID0gdHJ1ZTtcbiAgICAgIG1vZGVsLnN1Ym1pdFVybCA9IG1vZGVsLnZpZXdVcmw7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICd0YWtlQWN0aW9uUmVxdWVzdC4nICsgZmVhdHVyZXMuc2hvcnRlbi5hY3Rpb24sIHtcbiAgICAgICAgIGFjdGlvbjogZmVhdHVyZXMuc2hvcnRlbi5hY3Rpb24sXG4gICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB1cmw6IG1vZGVsLnN1Ym1pdFVybFxuICAgICAgICAgfVxuICAgICAgfSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBoYW5kbGVSZXN1bHQoeyBkYXRhOiB7IHVybCwgc2hvcnRVcmwsIGtleSB9IH0pIHtcbiAgICAgIGlmKCB1cmwgIT09IG1vZGVsLnN1Ym1pdFVybCApIHtcbiAgICAgICAgIC8vIHN0YWxlIHJlcXVlc3RcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG1vZGVsLnNob3J0VXJsID0gc2hvcnRVcmw7XG4gICAgICBtb2RlbC53YWl0aW5nID0gZmFsc2U7XG4gICAgICBtb2RlbC5rZXkgPSBrZXk7XG4gICAgICByZW5kZXIoKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gY2xhc3NMaXN0KCBjbGFzc1NldCApIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyggY2xhc3NTZXQgKS5maWx0ZXIoIF8gPT4gISFjbGFzc1NldFsgXyBdICkuam9pbiggJyAnICk7XG4gICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgIG5hbWU6ICd1cmwtc2hvcnRlbmVyLXdpZGdldCcsXG4gICBpbmplY3Rpb25zOiBpbmplY3Rpb25zLFxuICAgY3JlYXRlOiBjcmVhdGVcbn07XG4iXX0=