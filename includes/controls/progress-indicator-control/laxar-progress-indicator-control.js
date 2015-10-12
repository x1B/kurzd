define(['exports', 'module', 'react'], function (exports, module, _react) {
   'use strict';

   function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

   var _React = _interopRequireDefault(_react);

   var PI = Math.PI;
   var sin = Math.sin;
   var cos = Math.cos;
   var min = Math.min;

   var offset = 10;
   var r = 50;
   var viewBox = [0, 0, 2 * (r + offset), 2 * (r + offset)];
   var start = offset + r + ',' + offset;

   var EPSILON = 0.000001;

   var AxProgressIndicator = _React['default'].createClass({
      displayName: 'AxProgressIndicator',

      getDefaultProps: function getDefaultProps() {
         return {
            progress: 0,
            max: 1
         };
      },

      render: function render() {
         var _props = this.props;
         var progress = _props.progress;
         var max = _props.max;

         var largeArc = progress / max > 0.5 ? '1' : '0';
         var arcAngle = min(2 * PI - EPSILON, 2 * PI * (progress / max));
         var x = offset + r * (1 + sin(arcAngle));
         var y = offset + r * (1 - cos(arcAngle));

         var data = ['M', start, 'A', '50,50', '0', largeArc, '1', x + ',' + y].join(' ');
         return _React['default'].createElement(
            'div',
            { className: 'laxar-progress-indicator-control' },
            _React['default'].createElement(
               'svg',
               { viewBox: viewBox },
               _React['default'].createElement('path', { d: data })
            )
         );
      }

   });

   module.exports = AxProgressIndicator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheGFyLXByb2dyZXNzLWluZGljYXRvci1jb250cm9sLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O09BRVEsRUFBRSxHQUFvQixJQUFJLENBQTFCLEVBQUU7T0FBRSxHQUFHLEdBQWUsSUFBSSxDQUF0QixHQUFHO09BQUUsR0FBRyxHQUFVLElBQUksQ0FBakIsR0FBRztPQUFFLEdBQUcsR0FBSyxJQUFJLENBQVosR0FBRzs7QUFFekIsT0FBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLE9BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNiLE9BQU0sT0FBTyxHQUFHLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQSxBQUFFLEVBQUUsQ0FBQyxJQUFHLENBQUMsR0FBRyxNQUFNLENBQUEsQUFBRSxDQUFFLENBQUM7QUFDN0QsT0FBTSxLQUFLLEdBQUcsQUFBRSxNQUFNLEdBQUcsQ0FBQyxHQUFLLEdBQUcsR0FBRyxNQUFNLENBQUM7O0FBRTVDLE9BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsT0FBTSxtQkFBbUIsR0FBRyxrQkFBTSxXQUFXLENBQUM7OztBQUUzQyxxQkFBZSxFQUFBLDJCQUFHO0FBQ2YsZ0JBQU87QUFDSixvQkFBUSxFQUFFLENBQUM7QUFDWCxlQUFHLEVBQUUsQ0FBQztVQUNSLENBQUM7T0FDSjs7QUFFRCxZQUFNLEVBQUEsa0JBQUc7c0JBQ29CLElBQUksQ0FBQyxLQUFLO2FBQTVCLFFBQVEsVUFBUixRQUFRO2FBQUUsR0FBRyxVQUFILEdBQUc7O0FBQ3JCLGFBQU0sUUFBUSxHQUFHLFFBQVEsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbEQsYUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFFLENBQUMsR0FBQyxFQUFFLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBQyxFQUFFLElBQUUsUUFBUSxHQUFDLEdBQUcsQ0FBQSxBQUFDLENBQUUsQ0FBQztBQUM1RCxhQUFNLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFLLENBQUMsR0FBRyxHQUFHLENBQUUsUUFBUSxDQUFFLENBQUEsQUFBRSxDQUFDO0FBQy9DLGFBQU0sQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBRSxRQUFRLENBQUUsQ0FBQSxBQUFFLENBQUM7O0FBRS9DLGFBQU0sSUFBSSxHQUFHLENBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUMsR0FBRyxFQUFFLENBQUMsR0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFFLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO0FBQ2xGLGdCQUFPOztjQUFLLFNBQVMsRUFBQyxrQ0FBa0M7WUFDckQ7O2lCQUFLLE9BQU8sRUFBRSxPQUFPLEFBQUM7ZUFBQywwQ0FBTSxDQUFDLEVBQUUsSUFBSSxBQUFDLEdBQUc7YUFBTTtVQUMzQyxDQUFDO09BQ1Q7O0lBRUgsQ0FBQyxDQUFDOztvQkFFWSxtQkFBbUIiLCJmaWxlIjoibGF4YXItcHJvZ3Jlc3MtaW5kaWNhdG9yLWNvbnRyb2wuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY29uc3QgeyBQSSwgc2luLCBjb3MsIG1pbiB9ID0gTWF0aDtcblxuY29uc3Qgb2Zmc2V0ID0gMTA7XG5jb25zdCByID0gNTA7XG5jb25zdCB2aWV3Qm94ID0gWyAwLCAwLCAyKiggciArIG9mZnNldCApLCAyKiggciArIG9mZnNldCApIF07XG5jb25zdCBzdGFydCA9ICggb2Zmc2V0ICsgciApICsgJywnICsgb2Zmc2V0O1xuXG5jb25zdCBFUFNJTE9OID0gMC4wMDAwMDE7XG5cbmNvbnN0IEF4UHJvZ3Jlc3NJbmRpY2F0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICBwcm9ncmVzczogMCxcbiAgICAgICAgIG1heDogMVxuICAgICAgfTtcbiAgIH0sXG5cbiAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHsgcHJvZ3Jlc3MsIG1heCB9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IGxhcmdlQXJjID0gcHJvZ3Jlc3MgLyBtYXggPiAwLjUgPyAnMScgOiAnMCc7XG4gICAgICBjb25zdCBhcmNBbmdsZSA9IG1pbiggMipQSSAtIEVQU0lMT04sIDIqUEkqKHByb2dyZXNzL21heCkgKTtcbiAgICAgIGNvbnN0IHggPSBvZmZzZXQgKyByICogKCAxICsgc2luKCBhcmNBbmdsZSApICk7XG4gICAgICBjb25zdCB5ID0gb2Zmc2V0ICsgciAqICggMSAtIGNvcyggYXJjQW5nbGUgKSApO1xuXG4gICAgICBjb25zdCBkYXRhID0gWyAnTScsIHN0YXJ0LCAnQScsICc1MCw1MCcsICcwJywgbGFyZ2VBcmMsJzEnLCB4KycsJyt5IF0uam9pbiggJyAnICk7XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J2xheGFyLXByb2dyZXNzLWluZGljYXRvci1jb250cm9sJz5cbiAgICAgICAgIDxzdmcgdmlld0JveD17dmlld0JveH0+PHBhdGggZD17ZGF0YX0gLz48L3N2Zz5cbiAgICAgIDwvZGl2PjtcbiAgIH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEF4UHJvZ3Jlc3NJbmRpY2F0b3I7XG4iXX0=