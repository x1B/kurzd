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
               _React['default'].createElement('input', { type: 'url', className: 'form-control url-shortener-input', id: inputId, placeholder: 'http://...',
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
         var resultStatus = model.waiting ? '…kurzing…' : 'You got kurz\'d!';
         var resultTitle = 'Short URL for "' + model.submitUrl + '"';
         var result = model.waiting ? _React['default'].createElement('i', { className: 'fa fa-spinner' }) : _React['default'].createElement(
            'a',
            { href: model.shortUrl, title: resultTitle },
            model.shortUrl
         );

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

         if (url !== model.submitUrl) {
            // stale request
            return;
         }
         model.shortUrl = shortUrl;
         model.waiting = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVybC1zaG9ydGVuZXItd2lkZ2V0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU1BLE9BQU0sVUFBVSxHQUFHLENBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsV0FBVyxDQUFFLENBQUM7O0FBRWhGLFlBQVMsTUFBTSxDQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRzs7QUFFekQsVUFBTSxLQUFLLEdBQUc7QUFDWCxnQkFBTyxFQUFFLEtBQUs7QUFDZCxnQkFBTyxFQUFFLEVBQUU7QUFDWCxrQkFBUyxFQUFFLElBQUk7QUFDZixpQkFBUSxFQUFFLElBQUk7T0FDaEIsQ0FBQzs7QUFFRixjQUFRLENBQUMsU0FBUyxDQUFFLGFBQWEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUUsQ0FBQzs7QUFFN0UsYUFBTztBQUNKLHVCQUFjLEVBQUUsTUFBTTtPQUN4QixDQUFDOzs7O0FBSUYsZUFBUyxNQUFNLEdBQUc7QUFDZixvQkFBVyxDQUNSOzs7WUFDSSxVQUFVLEVBQUU7WUFDWixZQUFZLEVBQUU7VUFDWixDQUNSLENBQUM7T0FDSjs7OztBQUlELGVBQVMsVUFBVSxHQUFHO0FBQ25CLGFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUUsS0FBSyxDQUFFLENBQUM7QUFDcEMsZ0JBQU87O2NBQU0sU0FBUyxFQUFDLFdBQVc7WUFDL0I7OztlQUFJOztvQkFBTyxPQUFPLEVBQUUsT0FBTyxBQUFDO2tCQUFDLHVDQUFHLFNBQVMsRUFBQyxtQkFBbUIsR0FBRzs7Z0JBQWdDO2FBQUs7WUFDckc7O2lCQUFLLFNBQVMsRUFBQyxZQUFZO2VBQ3hCLDJDQUFPLElBQUksRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLGtDQUFrQyxFQUFDLEVBQUUsRUFBRSxPQUFPLEFBQUMsRUFBQyxXQUFXLEVBQUMsWUFBWTtBQUM3RiwwQkFBUSxFQUFFLFNBQVMsQUFBQyxF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b3J0ZW5lci13aWRnZXQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSBNaWNoYWVsIEt1cnplXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY29uc3QgaW5qZWN0aW9ucyA9IFsgJ2F4RXZlbnRCdXMnLCAnYXhGZWF0dXJlcycsICdheFJlYWN0UmVuZGVyJywgJ2F4Q29udGV4dCcgXTtcblxuZnVuY3Rpb24gY3JlYXRlKCBldmVudEJ1cywgZmVhdHVyZXMsIHJlYWN0UmVuZGVyLCBjb250ZXh0ICkge1xuXG4gICBjb25zdCBtb2RlbCA9IHtcbiAgICAgIHdhaXRpbmc6IGZhbHNlLFxuICAgICAgdmlld1VybDogJycsXG4gICAgICBzdWJtaXRVcmw6IG51bGwsXG4gICAgICBzaG9ydFVybDogbnVsbFxuICAgfTtcblxuICAgZXZlbnRCdXMuc3Vic2NyaWJlKCAnZGlkUmVwbGFjZS4nICsgZmVhdHVyZXMucmVzdWx0LnJlc291cmNlLCBoYW5kbGVSZXN1bHQgKTtcblxuICAgcmV0dXJuIHtcbiAgICAgIG9uRG9tQXZhaWxhYmxlOiByZW5kZXJcbiAgIH07XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHJlYWN0UmVuZGVyKFxuICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIHtyZW5kZXJGb3JtKCl9XG4gICAgICAgICAgICB7cmVuZGVyUmVzdWx0KCl9XG4gICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlckZvcm0oKSB7XG4gICAgICBjb25zdCBpbnB1dElkID0gY29udGV4dC5pZCggJ3VybCcgKTtcbiAgICAgIHJldHVybiA8Zm9ybSBjbGFzc05hbWU9XCJqdW1ib3Ryb25cIj5cbiAgICAgICAgIDxoMz48bGFiZWwgaHRtbEZvcj17aW5wdXRJZH0+PGkgY2xhc3NOYW1lPSdmYSBmYS1wbHVzLWNpcmNsZScgLz4gUGFzdGUgYSBVUkwgdG8gc2hvcnRlbjo8L2xhYmVsPjwvaDM+XG4gICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZm9ybS1ncm91cCc+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT0ndXJsJyBjbGFzc05hbWU9J2Zvcm0tY29udHJvbCB1cmwtc2hvcnRlbmVyLWlucHV0JyBpZD17aW5wdXRJZH0gcGxhY2Vob2xkZXI9J2h0dHA6Ly8uLi4nXG4gICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3VwZGF0ZVVybH0gdmFsdWU9e21vZGVsLnZpZXdVcmx9IC8+XG4gICAgICAgICA8L2Rpdj5cbiAgICAgICAgIDxidXR0b24gZGlzYWJsZWQ9eyFtb2RlbC52aWV3VXJsfSB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPSdidG4gYnRuLXByaW1hcnkgYnRuLWxnJ1xuICAgICAgICAgICAgICAgICBvbkNsaWNrPXtzdWJtaXR9Pmt1cnogaXQhPC9idXR0b24+XG4gICAgICA8L2Zvcm0+O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiByZW5kZXJSZXN1bHQoKSB7XG4gICAgICBjb25zdCByZXN1bHRDbGFzc2VzID0ge1xuICAgICAgICAgd2FpdGluZzogbW9kZWwud2FpdGluZyxcbiAgICAgICAgIGhpZGRlbjogIShtb2RlbC53YWl0aW5nIHx8IG1vZGVsLnNob3J0VXJsICksXG4gICAgICAgICAndXJsLXNob3J0ZW5lci1yZXN1bHQtb2snOiBtb2RlbC5zaG9ydFVybCxcbiAgICAgICAgIGp1bWJvdHJvbjogdHJ1ZVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlc3VsdFN0YXR1cyA9IG1vZGVsLndhaXRpbmcgPyAn4oCma3VyemluZ+KApicgOiAnWW91IGdvdCBrdXJ6XFwnZCEnO1xuICAgICAgY29uc3QgcmVzdWx0VGl0bGUgPSAnU2hvcnQgVVJMIGZvciBcIicgKyBtb2RlbC5zdWJtaXRVcmwgKyAnXCInO1xuICAgICAgY29uc3QgcmVzdWx0ID0gbW9kZWwud2FpdGluZyA/XG4gICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXInIC8+IDpcbiAgICAgICAgIDxhIGhyZWY9e21vZGVsLnNob3J0VXJsfSB0aXRsZT17cmVzdWx0VGl0bGV9Pnttb2RlbC5zaG9ydFVybH08L2E+O1xuXG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e2NsYXNzTGlzdCggcmVzdWx0Q2xhc3NlcyApfT5cbiAgICAgICAgIDxoMiBjbGFzc05hbWU9J3VybC1zaG9ydGVuZXItcmVzdWx0IHRleHQtY2VudGVyJz57cmVzdWx0fTwvaDI+XG4gICAgICAgICA8aDMgY2xhc3NOYW1lPSd0ZXh0LWNlbnRlcic+e3Jlc3VsdFN0YXR1c308L2gzPlxuICAgICAgPC9kaXY+O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiB1cGRhdGVVcmwoIGV2ICkge1xuICAgICAgbW9kZWwudmlld1VybCA9IGV2LnRhcmdldC52YWx1ZTtcbiAgICAgIHJlbmRlcigpO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBzdWJtaXQoKSB7XG4gICAgICBtb2RlbC53YWl0aW5nID0gdHJ1ZTtcbiAgICAgIG1vZGVsLnN1Ym1pdFVybCA9IG1vZGVsLnZpZXdVcmw7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICd0YWtlQWN0aW9uUmVxdWVzdC4nICsgZmVhdHVyZXMuc2hvcnRlbi5hY3Rpb24sIHtcbiAgICAgICAgIGFjdGlvbjogZmVhdHVyZXMuc2hvcnRlbi5hY3Rpb24sXG4gICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB1cmw6IG1vZGVsLnN1Ym1pdFVybFxuICAgICAgICAgfVxuICAgICAgfSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBoYW5kbGVSZXN1bHQoeyBkYXRhOiB7IHVybCwgc2hvcnRVcmwgfSB9KSB7XG4gICAgICBpZiggdXJsICE9PSBtb2RlbC5zdWJtaXRVcmwgKSB7XG4gICAgICAgICAvLyBzdGFsZSByZXF1ZXN0XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBtb2RlbC5zaG9ydFVybCA9IHNob3J0VXJsO1xuICAgICAgbW9kZWwud2FpdGluZyA9IGZhbHNlO1xuICAgICAgcmVuZGVyKCk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGNsYXNzTGlzdCggY2xhc3NTZXQgKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoIGNsYXNzU2V0ICkuZmlsdGVyKCBfID0+ICEhY2xhc3NTZXRbIF8gXSApLmpvaW4oICcgJyApO1xuICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICBuYW1lOiAndXJsLXNob3J0ZW5lci13aWRnZXQnLFxuICAgaW5qZWN0aW9uczogaW5qZWN0aW9ucyxcbiAgIGNyZWF0ZTogY3JlYXRlXG59O1xuIl19