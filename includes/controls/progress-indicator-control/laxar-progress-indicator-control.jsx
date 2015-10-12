import React from 'react';

const { PI, sin, cos, min } = Math;

const offset = 10;
const r = 50;
const viewBox = [ 0, 0, 2*( r + offset ), 2*( r + offset ) ];
const start = ( offset + r ) + ',' + offset;

const EPSILON = 0.000001;

const AxProgressIndicator = React.createClass({

   getDefaultProps() {
      return {
         progress: 0,
         max: 1
      };
   },

   render() {
      const { progress, max } = this.props;
      const largeArc = progress / max > 0.5 ? '1' : '0';
      const arcAngle = min( 2*PI - EPSILON, 2*PI*(progress/max) );
      const x = offset + r * ( 1 + sin( arcAngle ) );
      const y = offset + r * ( 1 - cos( arcAngle ) );

      const data = [ 'M', start, 'A', '50,50', '0', largeArc,'1', x+','+y ].join( ' ' );
      return <div className='laxar-progress-indicator-control'>
         <svg viewBox={viewBox}><path d={data} /></svg>
      </div>;
   }

});

export default AxProgressIndicator;
