// G30 Logic Field Geology - exporters: GeoJSON, CSV (Excel), DXF (AutoCAD R12 ASCII)
(function(){
const stamp=()=>new Date().toISOString().slice(0,10);
function save(text,name,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.appendChild(a);a.click();a.remove();}

// Projected XY for CSV/DXF. Uses the chosen datum; lat/lon systems fall back to UTM in that datum.
function utmDef(crsName,z){
 const e=/NAD27/.test(crsName)?'+ellps=clrk66 +towgs84=-8,160,176,0,0,0,0':/NAD83/.test(crsName)?'+ellps=GRS80 +towgs84=0,0,0':'+datum=WGS84';
 return `+proj=utm +zone=${z} ${e} +units=m +no_defs`;
}
function xy(lat,lng,crsName,zone){const [x,y]=proj4('EPSG:4326',utmDef(crsName,zone),[lng,lat]);return [x,y];}
function zoneFor(d){const p=d.feats.find(f=>f.c.length)?.c[0]||(d.track[0]&&[d.track[0].lat,d.track[0].lng])||[34,-117];return Math.floor((p[1]+180)/6)+1;}
function datumName(c){return /NAD27/.test(c)?'NAD27':/NAD83/.test(c)?'NAD83':'WGS84';}

// ---------- CSV (opens directly in Excel) ----------
function csv(d){
 const z=zoneFor(d),dn=datumName(d.crs),q=v=>`"${String(v??'').replace(/"/g,'""')}"`;
 const rows=[['Feature','Type','Vertex','Latitude','Longitude',`${dn} UTM Z${z} Easting (m)`,`${dn} UTM Z${z} Northing (m)`,`Display (${d.crs})`,'Length/Area','Note','Time']];
 d.feats.forEach(f=>f.c.forEach((p,i)=>{const [x,y]=xy(p[0],p[1],d.crs,z);
  rows.push([f.name,f.t,i+1,p[0].toFixed(7),p[1].toFixed(7),x.toFixed(2),y.toFixed(2),d.fmt(p[0],p[1]),i===0?d.measure(f):'',i===0?f.note:'',i===0?f.time:''])}));
 d.track.forEach((l,i)=>{const [x,y]=xy(l.lat,l.lng,d.crs,z);rows.push(['GPS track','track',i+1,l.lat.toFixed(7),l.lng.toFixed(7),x.toFixed(2),y.toFixed(2),d.fmt(l.lat,l.lng),'','',''])});
 if(d.notes)rows.push(['Field notes','notes','','','','','','','',d.notes,'']);
 save('\ufeff'+rows.map(r=>r.map(q).join(',')).join('\r\n'),`G30_field_${stamp()}.csv`,'text/csv');
}

// ---------- DXF R12 (AutoCAD, Civil 3D, Micromine, ArcGIS) ----------
function dxf(d){
 const z=zoneFor(d),o=[],P=(c,v)=>o.push(c,v);
 const layers={G30_POINTS:1,G30_LINES:3,G30_POLYGONS:5,G30_TRACK:4,G30_LABELS:7};
 P(0,'SECTION');P(2,'HEADER');P(9,'$ACADVER');P(1,'AC1009');P(9,'$INSUNITS');P(70,6);P(0,'ENDSEC');
 P(0,'SECTION');P(2,'TABLES');P(0,'TABLE');P(2,'LAYER');P(70,Object.keys(layers).length);
 for(const [n,c] of Object.entries(layers)){P(0,'LAYER');P(2,n);P(70,0);P(62,c);P(6,'CONTINUOUS');}
 P(0,'ENDTAB');P(0,'ENDSEC');P(0,'SECTION');P(2,'ENTITIES');
 const text=(x,y,s)=>{P(0,'TEXT');P(8,'G30_LABELS');P(10,x.toFixed(3));P(20,(y+2).toFixed(3));P(30,0);P(40,2.5);P(1,s.replace(/[\r\n]+/g,' ').slice(0,250));};
 const poly=(pts,layer,closed)=>{P(0,'POLYLINE');P(8,layer);P(66,1);P(10,0);P(20,0);P(30,0);P(70,closed?1:0);
  pts.forEach(([x,y])=>{P(0,'VERTEX');P(8,layer);P(10,x.toFixed(3));P(20,y.toFixed(3));P(30,0);});P(0,'SEQEND');P(8,layer);};
 d.feats.forEach(f=>{const pts=f.c.map(p=>xy(p[0],p[1],d.crs,z));
  if(f.t==='point'){P(0,'POINT');P(8,'G30_POINTS');P(10,pts[0][0].toFixed(3));P(20,pts[0][1].toFixed(3));P(30,0);}
  else poly(pts,f.t==='line'?'G30_LINES':'G30_POLYGONS',f.t==='polygon');
  text(pts[0][0],pts[0][1],f.name+(f.note?' - '+f.note:''));});
 if(d.track.length>1)poly(d.track.map(l=>xy(l.lat,l.lng,d.crs,z)),'G30_TRACK',false);
 P(0,'ENDSEC');P(0,'EOF');
 save(o.join('\r\n'),`G30_field_${datumName(d.crs)}_UTM${z}_${stamp()}.dxf`,'application/dxf');
}

// ---------- GeoJSON ----------
function geojson(d){
 const fc={type:'FeatureCollection',features:d.feats.map(f=>{const ll=f.c.map(p=>[p[1],p[0]]);
  return {type:'Feature',properties:{name:f.name,note:f.note,time:f.time,measure:d.measure(f)},geometry:f.t==='point'?{type:'Point',coordinates:ll[0]}:f.t==='line'?{type:'LineString',coordinates:ll}:{type:'Polygon',coordinates:[[...ll,ll[0]]]}}})};
 if(d.track.length>1)fc.features.push({type:'Feature',properties:{name:'GPS track'},geometry:{type:'LineString',coordinates:d.track.map(l=>[l.lng,l.lat])}});
 fc.features.push({type:'Feature',properties:{name:'Field notes',notes:d.notes},geometry:null});
 save(JSON.stringify(fc,null,1),`G30_field_${stamp()}.geojson`,'application/geo+json');
}
window.G30Export={csv,dxf,geojson};
})();
