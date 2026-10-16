/* Original face-up cut diagrams: girdle, table, and crown facets. */
const point = p => p.map(n => Math.round(n * 100) / 100).join(',');
const polygon = points => `<polygon points="${points.map(point).join(' ')}"/>`;
const line = (a,b) => `M${point(a)}L${point(b)}`;
const ellipsePoints = (rx,ry,count,offset=0) => Array.from({length:count},(_,i)=>{
  const angle=(i/count*360+offset-90)*Math.PI/180;
  return [60+rx*Math.cos(angle),60+ry*Math.sin(angle)];
});
function brilliant(outer,table,outline){
  return outline+polygon(table)+`<path d="${table.map((p,i)=>
    [0,1,2].map(j=>line(p,outer[(2*i+j)%outer.length])).join('')
  ).join('')}"/>`;
}
const cuts = {
  Round: () => brilliant(ellipsePoints(47,47,16),ellipsePoints(27,27,8,22.5),'<circle cx="60" cy="60" r="47"/>'),
  Oval: () => brilliant(ellipsePoints(34,51,16),ellipsePoints(20,31,8,22.5),'<ellipse cx="60" cy="60" rx="34" ry="51"/>'),
  Princess: () => `<path d="M12 12H108V108H12Z M25 25H95V95H25Z M36 36H84V84H36Z
    M12 12 36 36 60 25 84 36 108 12 M108 12 95 60 108 108 84 84 95 60 84 36
    M108 108 60 95 12 108 36 84 60 95 84 84 M12 108 25 60 12 12 M36 36 25 60 36 84"/>`,
  Emerald: () => {
    const rings=[[[32,9],[88,9],[101,22],[101,98],[88,111],[32,111],[19,98],[19,22]],
      [[35,15],[85,15],[95,25],[95,95],[85,105],[35,105],[25,95],[25,25]],
      [[38,21],[82,21],[89,28],[89,92],[82,99],[38,99],[31,92],[31,28]],
      [[41,28],[79,28],[82,31],[82,89],[79,92],[41,92],[38,89],[38,31]]];
    return rings.map(polygon).join('')+`<path d="${rings[0].map((p,i)=>line(p,rings[3][i])).join('')}"/>`;
  },
  Cushion: () => brilliant(
    [[60,12],[79,13],[97,23],[107,41],[108,60],[107,79],[97,97],[79,107],[60,108],[41,107],[23,97],[13,79],[12,60],[13,41],[23,23],[41,13]],
    [[76,33],[87,44],[87,76],[76,87],[44,87],[33,76],[33,44],[44,33]],
    '<path d="M60 12C94 12 108 15 108 60S105 108 60 108 12 105 12 60 15 12 60 12Z"/>'),
  Radiant: () => `<path d="M31 9H89L104 24V96L89 111H31L16 96V24Z
    M35 18H85L95 28V92L85 102H35L25 92V28Z M40 34H80L86 43V77L80 86H40L34 77V43Z
    M31 9 40 34 60 18 80 34 89 9 M16 24 34 43 25 60 34 77 16 96
    M31 111 40 86 60 102 80 86 89 111 M104 24 86 43 95 60 86 77 104 96
    M35 18 40 34 25 28 34 43 M85 18 80 34 95 28 86 43
    M35 102 40 86 25 92 34 77 M85 102 80 86 95 92 86 77
    M16 24 25 28 M104 24 95 28 M16 96 25 92 M104 96 95 92"/>`,
  Marquise: () => brilliant(
    [[60,6],[74,20],[85,34],[92,47],[95,60],[92,73],[85,86],[74,100],[60,114],[46,100],[35,86],[28,73],[25,60],[28,47],[35,34],[46,20]],
    [[67,31],[80,48],[80,72],[67,89],[53,89],[40,72],[40,48],[53,31]],
    '<path d="M60 6C82 24 95 41 95 60S82 96 60 114C38 96 25 79 25 60S38 24 60 6Z"/>'),
  Pear: () => brilliant(
    [[60,7],[72,25],[85,43],[95,62],[98,79],[94,94],[84,105],[72,111],[60,113],[48,111],[36,105],[26,94],[22,79],[25,62],[35,43],[48,25]],
    [[66,38],[80,60],[80,82],[69,94],[51,94],[40,82],[40,60],[54,38]],
    '<path d="M60 7C69 25 98 54 98 79A38 34 0 0 1 22 79C22 54 51 25 60 7Z"/>'),
  Heart: () => `<path d="M60 29C45 6 18 9 12 31C4 55 31 82 60 111C89 82 116 55 108 31C102 9 75 6 60 29Z
    M60 37 83 31 94 51 82 75 60 92 38 75 26 51 37 31Z
    M60 29 60 37 M60 37 45 15 37 31 21 17 26 51 10 43 38 75 23 70 60 92 45 96 60 111
    M60 37 75 15 83 31 99 17 94 51 110 43 82 75 97 70 60 92 75 96 60 111
    M12 31 37 31 M108 31 83 31 M26 51 38 75 M94 51 82 75 M38 75 45 96 M82 75 75 96"/>`
};
module.exports = function shapeSvg(shape){
  if(!cuts[shape])throw new Error('Unknown diamond shape: '+shape);
  return `<svg class="diamond-shape" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="96" height="96" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${cuts[shape]()}</svg>`;
};
