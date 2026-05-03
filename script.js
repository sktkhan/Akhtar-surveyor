// ══════════════════════════════════════════════
//  AKHTAR SURVEYOR — Professional Calculator Suite
// ══════════════════════════════════════════════

// ── Section Switcher ──
function show(id) {
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Accordion (runs immediately — script is at bottom of body) ──
(function initAccordions() {
    document.querySelectorAll('.accordion').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var isActive = this.classList.contains('active');
            document.querySelectorAll('.accordion').forEach(function(a) {
                a.classList.remove('active');
                var p = a.nextElementSibling;
                if (p) p.style.display = 'none';
            });
            if (!isActive) {
                this.classList.add('active');
                var panel = this.nextElementSibling;
                if (panel) panel.style.display = 'block';
            }
        });
    });
})();

// ── Modal ──
function toggleHelp() {
    var m = document.getElementById('helpModal');
    if (!m) return;
    m.style.display = (m.style.display === 'block') ? 'none' : 'block';
}

// ── Toast ──
function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 3000);
}

// ── Show result ──
function showResult(id, html) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = html;
    el.classList.add('show');
}

// ── Decimal degrees to DMS string ──
function toDMS(deg) {
    var a = Math.abs(deg);
    var d = Math.floor(a);
    var mf = (a - d) * 60;
    var m = Math.floor(mf);
    var s = ((mf - m) * 60).toFixed(1);
    return d + '\u00b0 ' + m + "' " + s + '"';
}

// ── Whole Circle Bearing from dE, dN ──
function wcb(dE, dN) {
    var a = Math.atan2(dE, dN) * 180 / Math.PI;
    if (a < 0) a += 360;
    return a;
}

// ══════════════════════════════════════════════
//  RL CALCULATOR
// ══════════════════════════════════════════════
function calcRL() {
    var bm = parseFloat(document.getElementById('bm_input').value);
    var bs = parseFloat(document.getElementById('bs_input').value);
    var fs = parseFloat(document.getElementById('fs_input').value);
    var box = document.getElementById('rl_result');
    if (!box) return;
    if (isNaN(bm) || isNaN(bs) || isNaN(fs)) {
        box.innerHTML = '<span style="color:#ef4444;">&#10060; Please fill all three fields.</span>';
        box.style.display = 'block'; return;
    }
    var hi = bm + bs;
    var rl = hi - fs;
    var rf = bs - fs;
    box.innerHTML =
        '<div class="result-row"><span class="result-label">Bench Mark RL</span><span class="result-value">' + bm.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Height of Instrument (HI)</span><span class="result-value highlight">' + hi.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">New RL at Fore Sight</span><span class="result-value highlight">' + rl.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Rise / Fall</span><span class="result-value">' + (rf >= 0 ? '&#9650; Rise ' : '&#9660; Fall ') + Math.abs(rf).toFixed(3) + ' m</span></div>';
    box.style.display = 'block';
}

// ══════════════════════════════════════════════
//  1. BEARING & DISTANCE
// ══════════════════════════════════════════════
function calcBearing() {
    var e1 = parseFloat(document.getElementById('e1').value);
    var n1 = parseFloat(document.getElementById('n1').value);
    var e2 = parseFloat(document.getElementById('e2').value);
    var n2 = parseFloat(document.getElementById('n2').value);
    if (isNaN(e1)||isNaN(n1)||isNaN(e2)||isNaN(n2)) {
        showResult('res1','<span style="color:#ef4444;">&#10060; Please fill all four coordinate fields.</span>'); return;
    }
    var dE = e2-e1, dN = n2-n1;
    var dist = Math.sqrt(dE*dE + dN*dN);
    var brg  = wcb(dE, dN);
    var quad = dN >= 0 ? (dE >= 0 ? 'NE' : 'NW') : (dE >= 0 ? 'SE' : 'SW');
    var rb   = Math.atan2(Math.abs(dE), Math.abs(dN)) * 180 / Math.PI;
    showResult('res1',
        '<div class="result-section-title">&#128208; Bearing &amp; Distance Result</div>' +
        '<div class="result-row"><span class="result-label">Distance</span><span class="result-value highlight">' + dist.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Whole Circle Bearing</span><span class="result-value highlight">' + brg.toFixed(6) + '&#176;</span></div>' +
        '<div class="result-row"><span class="result-label">Bearing (DMS)</span><span class="result-value">' + toDMS(brg) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Quadrant Bearing</span><span class="result-value">' + quad + ' ' + rb.toFixed(4) + '&#176;</span></div>' +
        '<div class="result-row"><span class="result-label">&#916;E / &#916;N</span><span class="result-value">' + dE.toFixed(3) + ' / ' + dN.toFixed(3) + ' m</span></div>'
    );
}

// ══════════════════════════════════════════════
//  2. REFERENCE LINE
// ══════════════════════════════════════════════
function calcRefLine() {
    var e1=parseFloat(document.getElementById('rl_e1').value);
    var n1=parseFloat(document.getElementById('rl_n1').value);
    var e2=parseFloat(document.getElementById('rl_e2').value);
    var n2=parseFloat(document.getElementById('rl_n2').value);
    var pe=parseFloat(document.getElementById('rl_pe').value);
    var pn=parseFloat(document.getElementById('rl_pn').value);
    if (isNaN(e1)||isNaN(n1)||isNaN(e2)||isNaN(n2)||isNaN(pe)||isNaN(pn)) {
        showResult('res2','<span style="color:#ef4444;">&#10060; Please fill all six fields.</span>'); return;
    }
    var len = Math.sqrt(Math.pow(e2-e1,2)+Math.pow(n2-n1,2));
    if (len===0) { showResult('res2','<span style="color:#ef4444;">&#10060; Line length is zero — check start and end points.</span>'); return; }
    var ux=(e2-e1)/len, uy=(n2-n1)/len;
    var vx=pe-e1, vy=pn-n1;
    var ch=vx*ux+vy*uy;
    var of=vx*uy-vy*ux;
    var side=of>=0?'Left (L)':'Right (R)';
    var fE=e1+ch*ux, fN=n1+ch*uy;
    showResult('res2',
        '<div class="result-section-title">&#128207; Reference Line Result</div>' +
        '<div class="result-row"><span class="result-label">Chainage</span><span class="result-value highlight">'+ch.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Offset</span><span class="result-value highlight">'+Math.abs(of).toFixed(3)+' m &mdash; '+side+'</span></div>'+
        '<div class="result-row"><span class="result-label">Line Total Length</span><span class="result-value">'+len.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Foot Point E</span><span class="result-value">'+fE.toFixed(3)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Foot Point N</span><span class="result-value">'+fN.toFixed(3)+'</span></div>'
    );
}

// ══════════════════════════════════════════════
//  4. CIRCULAR CURVE
// ══════════════════════════════════════════════
function calcCircular() {
    var R=parseFloat(document.getElementById('cc_r').value);
    var d=parseFloat(document.getElementById('cc_a').value);
    if (isNaN(R)||isNaN(d)||R<=0||d<=0||d>=180) {
        showResult('res4','<span style="color:#ef4444;">&#10060; Enter a valid Radius and Delta angle (between 0 and 180).</span>'); return;
    }
    var dr=d*Math.PI/180;
    var T =R*Math.tan(dr/2);
    var L =R*dr;
    var E =R*(1/Math.cos(dr/2)-1);
    var M =R*(1-Math.cos(dr/2));
    var LC=2*R*Math.sin(dr/2);
    var D =1719.0/R;
    showResult('res4',
        '<div class="result-section-title">&#128309; Circular Curve Elements</div>'+
        '<div class="result-row"><span class="result-label">Radius (R)</span><span class="result-value">'+R.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Delta Angle (&#916;)</span><span class="result-value">'+toDMS(d)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Tangent Length (T)</span><span class="result-value highlight">'+T.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Arc Length (L)</span><span class="result-value highlight">'+L.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">External Distance (E)</span><span class="result-value">'+E.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Middle Ordinate (M)</span><span class="result-value">'+M.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Long Chord (LC)</span><span class="result-value">'+LC.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Degree of Curve (D)</span><span class="result-value">'+D.toFixed(4)+'&#176;</span></div>'
    );
}

// ══════════════════════════════════════════════
//  5. SPIRAL CURVE
// ══════════════════════════════════════════════
function calcSpiral() {
    var R =parseFloat(document.getElementById('sp_r').value);
    var Ls=parseFloat(document.getElementById('sp_ls').value);
    if (isNaN(R)||isNaN(Ls)||R<=0||Ls<=0) {
        showResult('res5','<span style="color:#ef4444;">&#10060; Enter a valid Radius and Spiral Length.</span>'); return;
    }
    var ts=(Ls/(2*R))*180/Math.PI;
    var tr=ts*Math.PI/180;
    var Xs=Ls*(1-tr*tr/10);
    var Ys=Ls*(tr/3-tr*tr*tr/42);
    var p =Ys-R*(1-Math.cos(tr));
    var k =Xs-R*Math.sin(tr);
    showResult('res5',
        '<div class="result-section-title">&#8767; Spiral / Transition Curve Elements</div>'+
        '<div class="result-row"><span class="result-label">Spiral Angle (&theta;s)</span><span class="result-value highlight">'+toDMS(ts)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Xs</span><span class="result-value">'+Xs.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Ys</span><span class="result-value">'+Ys.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Shift (p)</span><span class="result-value">'+p.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">k</span><span class="result-value">'+k.toFixed(3)+' m</span></div>'
    );
}

// ══════════════════════════════════════════════
//  6. VERTICAL CURVE
// ══════════════════════════════════════════════
function calcVerticalCurve() {
    var g1=parseFloat(document.getElementById('vc_g1').value);
    var g2=parseFloat(document.getElementById('vc_g2').value);
    var L =parseFloat(document.getElementById('vc_l').value);
    if (isNaN(g1)||isNaN(g2)||isNaN(L)||L<=0) {
        showResult('res6','<span style="color:#ef4444;">&#10060; Please fill all three fields.</span>'); return;
    }
    var A=Math.abs(g2-g1);
    var K=A>0?L/A:0;
    var type=g2>=g1?'Sag Curve &#8599;':'Crest Curve &#8600;';
    showResult('res6',
        '<div class="result-section-title">&#128200; Vertical Curve Result</div>'+
        '<div class="result-row"><span class="result-label">Curve Type</span><span class="result-value highlight">'+type+'</span></div>'+
        '<div class="result-row"><span class="result-label">Grade In (G1) / Out (G2)</span><span class="result-value">'+g1+'% / '+g2+'%</span></div>'+
        '<div class="result-row"><span class="result-label">Algebraic Difference (A)</span><span class="result-value">'+A.toFixed(4)+'%</span></div>'+
        '<div class="result-row"><span class="result-label">K-Value</span><span class="result-value highlight">'+K.toFixed(2)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Curve Length (L)</span><span class="result-value">'+L.toFixed(3)+' m</span></div>'
    );
}

// ══════════════════════════════════════════════
//  7. 2D TRANSFORMATION
// ══════════════════════════════════════════════
function calc2DTrans() {
    var dE=parseFloat(document.getElementById('transE').value)||0;
    var dN=parseFloat(document.getElementById('transN').value)||0;
    var rot=parseFloat(document.getElementById('transRot').value)||0;
    var sc=parseFloat(document.getElementById('transScale').value)||1;
    var rr=rot*Math.PI/180;
    showResult('res7',
        '<div class="result-section-title">&#128260; 2D Transformation Applied</div>'+
        '<div class="result-row"><span class="result-label">Shift E / N</span><span class="result-value">'+dE.toFixed(3)+' / '+dN.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Rotation</span><span class="result-value highlight">'+toDMS(rot)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Scale Factor</span><span class="result-value">'+sc.toFixed(6)+'</span></div>'+
        '<div class="result-row"><span class="result-label">cos&theta; / sin&theta;</span><span class="result-value">'+Math.cos(rr).toFixed(6)+' / '+Math.sin(rr).toFixed(6)+'</span></div>'
    );
}

// ══════════════════════════════════════════════
//  8. TRAVERSE
// ══════════════════════════════════════════════
function calcTraverse() {
    var dist=parseFloat(document.getElementById('trav_dist').value);
    var err =parseFloat(document.getElementById('trav_err').value);
    if (isNaN(dist)||isNaN(err)||dist<=0) {
        showResult('res8','<span style="color:#ef4444;">&#10060; Enter valid traverse length and misclosure.</span>'); return;
    }
    var ratio=err>0?Math.round(dist/err):999999;
    var acc='1/'+ratio.toLocaleString();
    var grade=ratio>=10000?'&#129001; First Order':ratio>=5000?'&#129000; Second Order':ratio>=2000?'&#129002; Third Order':'&#128997; Low Accuracy';
    showResult('res8',
        '<div class="result-section-title">&#128506; Traverse Accuracy Result</div>'+
        '<div class="result-row"><span class="result-label">Total Length</span><span class="result-value">'+dist.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Misclosure</span><span class="result-value">'+err.toFixed(4)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Accuracy Ratio</span><span class="result-value highlight">'+acc+'</span></div>'+
        '<div class="result-row"><span class="result-label">Survey Grade</span><span class="result-value">'+grade+'</span></div>'
    );
}

// ══════════════════════════════════════════════
//  9. TRILATERATION
// ══════════════════════════════════════════════
function calcTrilateration() {
    var e1=parseFloat(document.getElementById('tri_e1').value);
    var n1=parseFloat(document.getElementById('tri_n1').value);
    var d1=parseFloat(document.getElementById('tri_d1').value);
    var e2=parseFloat(document.getElementById('tri_e2').value);
    var n2=parseFloat(document.getElementById('tri_n2').value);
    var d2=parseFloat(document.getElementById('tri_d2').value);
    if (isNaN(e1)||isNaN(n1)||isNaN(d1)||isNaN(e2)||isNaN(n2)||isNaN(d2)) {
        showResult('res9','<span style="color:#ef4444;">&#10060; Please fill all fields.</span>'); return;
    }
    var b=Math.sqrt(Math.pow(e2-e1,2)+Math.pow(n2-n1,2));
    if (b===0){showResult('res9','<span style="color:#ef4444;">&#10060; P1 and P2 must be different points.</span>');return;}
    var a=(d1*d1-d2*d2+b*b)/(2*b);
    var hs=d1*d1-a*a;
    if (hs<0){showResult('res9','<span style="color:#ef4444;">&#10060; Distances do not intersect — check values.</span>');return;}
    var h=Math.sqrt(hs);
    var mx=e1+a*(e2-e1)/b, my=n1+a*(n2-n1)/b;
    showResult('res9',
        '<div class="result-section-title">&#128205; Trilateration Result</div>'+
        '<div class="result-row"><span class="result-label">Solution 1 &mdash; E</span><span class="result-value highlight">'+(mx+h*(n2-n1)/b).toFixed(3)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Solution 1 &mdash; N</span><span class="result-value highlight">'+(my-h*(e2-e1)/b).toFixed(3)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Solution 2 &mdash; E</span><span class="result-value">'+(mx-h*(n2-n1)/b).toFixed(3)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Solution 2 &mdash; N</span><span class="result-value">'+(my+h*(e2-e1)/b).toFixed(3)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Baseline P1&ndash;P2</span><span class="result-value">'+b.toFixed(3)+' m</span></div>'
    );
}

// ══════════════════════════════════════════════
//  10. INTERSECTION (Bearing-Bearing)
// ══════════════════════════════════════════════
function calcIntersection() {
    var e1=parseFloat(document.getElementById('int_e1').value);
    var n1=parseFloat(document.getElementById('int_n1').value);
    var b1=parseFloat(document.getElementById('int_b1').value);
    var e2=parseFloat(document.getElementById('int_e2').value);
    var n2=parseFloat(document.getElementById('int_n2').value);
    var b2=parseFloat(document.getElementById('int_b2').value);
    if (isNaN(e1)||isNaN(n1)||isNaN(b1)||isNaN(e2)||isNaN(n2)||isNaN(b2)) {
        showResult('res10','<span style="color:#ef4444;">&#10060; Please fill all fields.</span>'); return;
    }
    var b1r=b1*Math.PI/180, b2r=b2*Math.PI/180;
    var s1=Math.sin(b1r),c1=Math.cos(b1r),s2=Math.sin(b2r),c2=Math.cos(b2r);
    var den=s1*c2-c1*s2;
    if (Math.abs(den)<1e-10){showResult('res10','<span style="color:#ef4444;">&#10060; Lines are parallel — no intersection possible.</span>');return;}
    var t=((e2-e1)*c2-(n2-n1)*s2)/den;
    showResult('res10',
        '<div class="result-section-title">&#10006; Intersection Point</div>'+
        '<div class="result-row"><span class="result-label">Intersection E</span><span class="result-value highlight">'+(e1+t*s1).toFixed(3)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Intersection N</span><span class="result-value highlight">'+(n1+t*c1).toFixed(3)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Distance from P1</span><span class="result-value">'+Math.abs(t).toFixed(3)+' m</span></div>'
    );
}

// ══════════════════════════════════════════════
//  11. 3-POINT CIRCLE
// ══════════════════════════════════════════════
function calc3PointCircle() {
    var ax=parseFloat(document.getElementById('cir_e1').value);
    var ay=parseFloat(document.getElementById('cir_n1').value);
    var bx=parseFloat(document.getElementById('cir_e2').value);
    var by=parseFloat(document.getElementById('cir_n2').value);
    var cx=parseFloat(document.getElementById('cir_e3').value);
    var cy=parseFloat(document.getElementById('cir_n3').value);
    if (isNaN(ax)||isNaN(ay)||isNaN(bx)||isNaN(by)||isNaN(cx)||isNaN(cy)) {
        showResult('res11','<span style="color:#ef4444;">&#10060; Please enter all three points.</span>'); return;
    }
    var D=2*(ax*(by-cy)+bx*(cy-ay)+cx*(ay-by));
    if (Math.abs(D)<1e-10){showResult('res11','<span style="color:#ef4444;">&#10060; Points are collinear — no circle exists.</span>');return;}
    var a2=ax*ax+ay*ay, b2=bx*bx+by*by, c2=cx*cx+cy*cy;
    var ux=(a2*(by-cy)+b2*(cy-ay)+c2*(ay-by))/D;
    var uy=(a2*(cx-bx)+b2*(ax-cx)+c2*(bx-ax))/D;
    var R=Math.sqrt(Math.pow(ax-ux,2)+Math.pow(ay-uy,2));
    showResult('res11',
        '<div class="result-section-title">&#11093; 3-Point Circle Result</div>'+
        '<div class="result-row"><span class="result-label">Center E</span><span class="result-value highlight">'+ux.toFixed(3)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Center N</span><span class="result-value highlight">'+uy.toFixed(3)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Radius</span><span class="result-value highlight">'+R.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Circumference</span><span class="result-value">'+(2*Math.PI*R).toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Circle Area</span><span class="result-value">'+(Math.PI*R*R).toFixed(3)+' m&#178;</span></div>'
    );
}

// ══════════════════════════════════════════════
//  12. LAT/LONG TO UTM
// ══════════════════════════════════════════════
function calcLatLonToUTM() {
    var lat=parseFloat(document.getElementById('lat_val').value);
    var lon=parseFloat(document.getElementById('lon_val').value);
    if (isNaN(lat)||isNaN(lon)||lat<-90||lat>90||lon<-180||lon>180) {
        showResult('res12','<span style="color:#ef4444;">&#10060; Enter a valid Latitude (-90 to 90) and Longitude (-180 to 180).</span>'); return;
    }
    var zone=Math.floor((lon+180)/6)+1;
    var hemi=lat>=0?'N':'S';
    var a=6378137.0, f=1/298.257223563;
    var e2=2*f-f*f, e12=e2/(1-e2), k0=0.9996;
    var lr=lat*Math.PI/180, lo=lon*Math.PI/180;
    var l0=((zone-1)*6-180+3)*Math.PI/180;
    var N0=a/Math.sqrt(1-e2*Math.pow(Math.sin(lr),2));
    var T0=Math.pow(Math.tan(lr),2);
    var C0=e12*Math.pow(Math.cos(lr),2);
    var A0=Math.cos(lr)*(lo-l0);
    var M0=a*((1-e2/4-3*e2*e2/64)*lr-(3*e2/8+3*e2*e2/32)*Math.sin(2*lr)+(15*e2*e2/256)*Math.sin(4*lr));
    var E=k0*N0*(A0+(1-T0+C0)*Math.pow(A0,3)/6+(5-18*T0+T0*T0+72*C0)*Math.pow(A0,5)/120)+500000;
    var Nv=k0*(M0+N0*Math.tan(lr)*(A0*A0/2+(5-T0+9*C0+4*C0*C0)*Math.pow(A0,4)/24+(61-58*T0+T0*T0+600*C0)*Math.pow(A0,6)/720));
    if (lat<0) Nv+=10000000;
    showResult('res12',
        '<div class="result-section-title">&#127758; Lat/Long &rarr; UTM Result</div>'+
        '<div class="result-row"><span class="result-label">UTM Zone</span><span class="result-value highlight">'+zone+hemi+'</span></div>'+
        '<div class="result-row"><span class="result-label">Easting</span><span class="result-value highlight">'+E.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Northing</span><span class="result-value highlight">'+Nv.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Latitude</span><span class="result-value">'+toDMS(Math.abs(lat))+(lat>=0?' N':' S')+'</span></div>'+
        '<div class="result-row"><span class="result-label">Longitude</span><span class="result-value">'+toDMS(Math.abs(lon))+(lon>=0?' E':' W')+'</span></div>'
    );
}

// ══════════════════════════════════════════════
//  13. AREA BY CO-ORDINATE
// ══════════════════════════════════════════════
var _shareText = '';
var _reportData = null;

function calcArea() {
    var input    = document.getElementById('areaInput').value.trim();
    var resEl    = document.getElementById('res13');
    var canWrap  = document.getElementById('canvasContainer');
    var shareRow = document.getElementById('shareRow');

    resEl.classList.remove('show');
    canWrap.classList.remove('show');
    shareRow.classList.remove('show');
    _reportData = null;

    if (!input) {
        resEl.innerHTML='<span style="color:#ef4444;">&#10060; Please enter coordinate points.</span>';
        resEl.classList.add('show'); return;
    }

    var lines=input.split('\n'), pts=[];
    for (var i=0;i<lines.length;i++) {
        var ln=lines[i].trim(); if (!ln) continue;
        var p=ln.split(',');
        if (p.length<2){resEl.innerHTML='<span style="color:#ef4444;">&#10060; Line '+(i+1)+': "'+ln+'" &mdash; expected format: E,N (e.g. 100,200)</span>';resEl.classList.add('show');return;}
        var e=parseFloat(p[0].trim()),n=parseFloat(p[1].trim());
        if (isNaN(e)||isNaN(n)){resEl.innerHTML='<span style="color:#ef4444;">&#10060; Invalid number on line '+(i+1)+': "'+ln+'"</span>';resEl.classList.add('show');return;}
        pts.push([e,n]);
    }
    if (pts.length<3){resEl.innerHTML='<span style="color:#ef4444;">&#10060; Minimum 3 points required (found '+pts.length+').</span>';resEl.classList.add('show');return;}

    var len=pts.length;

    // Shoelace
    var area=0;
    for (var i=0;i<len;i++){var j=(i+1)%len; area+=pts[i][0]*pts[j][1]-pts[j][0]*pts[i][1];}
    area=Math.abs(area)/2;

    // Side lengths & perimeter
    var sides=[], perim=0;
    for (var i=0;i<len;i++){var j=(i+1)%len; var d=Math.sqrt(Math.pow(pts[j][0]-pts[i][0],2)+Math.pow(pts[j][1]-pts[i][1],2)); sides.push(d); perim+=d;}

    // Interior angles
    var angs=[];
    for (var i=0;i<len;i++){
        var pv=(i-1+len)%len,nx=(i+1)%len;
        var v1e=pts[pv][0]-pts[i][0],v1n=pts[pv][1]-pts[i][1];
        var v2e=pts[nx][0]-pts[i][0],v2n=pts[nx][1]-pts[i][1];
        var dot=v1e*v2e+v1n*v2n;
        var mg=Math.sqrt(v1e*v1e+v1n*v1n)*Math.sqrt(v2e*v2e+v2n*v2n);
        var ca=mg>0?Math.max(-1,Math.min(1,dot/mg)):0;
        angs.push(Math.acos(ca)*180/Math.PI);
    }

    var sqFt=area*10.7639, marla=area/20.9, kanal=marla/20, acre=area/4046.86, hect=area/10000;

    // Side rows
    var sH=''; for(var i=0;i<len;i++) sH+='<div class="result-row"><span class="result-label">Side P'+(i+1)+'&rarr;P'+((i+1)%len+1)+'</span><span class="result-value">'+sides[i].toFixed(3)+' m</span></div>';
    var aH=''; for(var i=0;i<len;i++) aH+='<div class="result-row"><span class="result-label">Angle at P'+(i+1)+'</span><span class="result-value">'+angs[i].toFixed(2)+'&#176; &mdash; '+toDMS(angs[i])+'</span></div>';

    resEl.innerHTML=
        '<div class="result-section-title">&#128208; Area Calculation Result</div>'+
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0;">'+
        '<div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.5px;">Sq. Meters</div><div style="font-size:17px;font-weight:800;color:#38bdf8;margin-top:3px;">'+area.toFixed(2)+'</div></div>'+
        '<div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.5px;">Sq. Feet</div><div style="font-size:17px;font-weight:800;color:#38bdf8;margin-top:3px;">'+sqFt.toFixed(2)+'</div></div>'+
        '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.5px;">Marla</div><div style="font-size:17px;font-weight:800;color:#fbbf24;margin-top:3px;">'+marla.toFixed(3)+'</div></div>'+
        '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.5px;">Kanal</div><div style="font-size:17px;font-weight:800;color:#fbbf24;margin-top:3px;">'+kanal.toFixed(4)+'</div></div>'+
        '</div>'+
        '<div class="result-row"><span class="result-label">Acre</span><span class="result-value">'+acre.toFixed(5)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Hectare</span><span class="result-value">'+hect.toFixed(5)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Perimeter</span><span class="result-value highlight">'+perim.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Total Points</span><span class="result-value">'+len+'</span></div>'+
        '<div class="result-section-title" style="margin-top:12px;">&#128207; Side Lengths</div>'+sH+
        '<div class="result-section-title" style="margin-top:12px;">&#128208; Interior Angles</div>'+aH;

    resEl.classList.add('show');
    canWrap.classList.add('show');

    setTimeout(function() { drawPolygon(pts, sides, angs); }, 60);

    shareRow.classList.add('show');

    _shareText=
        '&#128208; *Akhtar Surveyor \u2014 Area Report*\n\n'+
        '\u25b8 Area: '+area.toFixed(3)+' m\u00b2\n'+
        '\u25b8 Marla: '+marla.toFixed(3)+'\n'+
        '\u25b8 Kanal: '+kanal.toFixed(4)+'\n'+
        '\u25b8 Acre: '+acre.toFixed(5)+'\n'+
        '\u25b8 Sq. Feet: '+sqFt.toFixed(2)+'\n'+
        '\u25b8 Perimeter: '+perim.toFixed(3)+' m\n'+
        '\u25b8 Points: '+len+'\n\n'+
        'Calculated at akhtarsurveyor.com';

    _reportData={pts:pts,sides:sides,angs:angs,area:area,sqFt:sqFt,marla:marla,kanal:kanal,acre:acre,hect:hect,perim:perim};
}

// ── Canvas Drawing ──
function drawPolygon(pts, sides, angs) {
    var canvas=document.getElementById('areaCanvas');
    var wrap  =document.getElementById('canvasContainer');
    if (!canvas||!wrap) return;
    var W=wrap.offsetWidth||340;
    var H=Math.round(W*0.65); if(H<200)H=200;
    canvas.width=W; canvas.height=H;
    var ctx=canvas.getContext('2d');
    var len=pts.length, pad=55;

    ctx.fillStyle='#060e1a'; ctx.fillRect(0,0,W,H);

    // Grid
    ctx.strokeStyle='rgba(56,189,248,0.05)'; ctx.lineWidth=1;
    for(var gx=0;gx<W;gx+=30){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();}
    for(var gy=0;gy<H;gy+=30){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();}

    var minE=pts[0][0],maxE=pts[0][0],minN=pts[0][1],maxN=pts[0][1];
    for(var i=1;i<len;i++){if(pts[i][0]<minE)minE=pts[i][0];if(pts[i][0]>maxE)maxE=pts[i][0];if(pts[i][1]<minN)minN=pts[i][1];if(pts[i][1]>maxN)maxN=pts[i][1];}
    var rE=maxE-minE||1, rN=maxN-minN||1;
    var sx=(W-pad*2)/rE, sy=(H-pad*2)/rN, sc=Math.min(sx,sy);
    var ox=pad+(W-pad*2-rE*sc)/2, oy=pad+(H-pad*2-rN*sc)/2;

    function xy(e,n){return{x:ox+(e-minE)*sc, y:H-oy-(n-minN)*sc};}
    var sp=pts.map(function(p){return xy(p[0],p[1]);});

    // Fill
    ctx.beginPath(); ctx.moveTo(sp[0].x,sp[0].y);
    for(var i=1;i<len;i++) ctx.lineTo(sp[i].x,sp[i].y);
    ctx.closePath(); ctx.fillStyle='rgba(56,189,248,0.07)'; ctx.fill();

    // Outline
    ctx.beginPath(); ctx.moveTo(sp[0].x,sp[0].y);
    for(var i=1;i<len;i++) ctx.lineTo(sp[i].x,sp[i].y);
    ctx.closePath(); ctx.strokeStyle='#38bdf8'; ctx.lineWidth=2; ctx.setLineDash([]); ctx.stroke();

    // Side labels
    ctx.font='bold 9px Arial,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    for(var i=0;i<len;i++){
        var j=(i+1)%len;
        var mx=(sp[i].x+sp[j].x)/2, my=(sp[i].y+sp[j].y)/2;
        var dx=sp[j].x-sp[i].x, dy=sp[j].y-sp[i].y, dl=Math.sqrt(dx*dx+dy*dy)||1;
        var ox2=-dy/dl*13, oy2=dx/dl*13;
        ctx.fillStyle='rgba(6,14,26,0.9)'; ctx.fillRect(mx+ox2-22,my+oy2-8,44,16);
        ctx.fillStyle='#fbbf24'; ctx.fillText(sides[i].toFixed(2)+'m',mx+ox2,my+oy2);
    }

    // Vertices
    for(var i=0;i<len;i++){
        var g=ctx.createRadialGradient(sp[i].x,sp[i].y,0,sp[i].x,sp[i].y,10);
        g.addColorStop(0,'rgba(56,189,248,0.5)'); g.addColorStop(1,'rgba(56,189,248,0)');
        ctx.beginPath(); ctx.arc(sp[i].x,sp[i].y,10,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        ctx.beginPath(); ctx.arc(sp[i].x,sp[i].y,5,0,Math.PI*2); ctx.fillStyle='#38bdf8'; ctx.fill();
        ctx.strokeStyle='white'; ctx.lineWidth=1.5; ctx.stroke();
        ctx.fillStyle='rgba(6,14,26,0.9)'; ctx.fillRect(sp[i].x-12,sp[i].y-24,24,14);
        ctx.fillStyle='white'; ctx.font='bold 10px Arial,sans-serif'; ctx.textAlign='center';
        ctx.fillText('P'+(i+1),sp[i].x,sp[i].y-17);
    }

    // Compass
    var crx=W-24,cry=24;
    ctx.font='bold 9px Arial,sans-serif'; ctx.fillStyle='rgba(56,189,248,0.7)'; ctx.textAlign='center'; ctx.fillText('N',crx,cry-12);
    ctx.beginPath(); ctx.moveTo(crx,cry-8); ctx.lineTo(crx,cry+8); ctx.strokeStyle='rgba(56,189,248,0.4)'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(crx-8,cry); ctx.lineTo(crx+8,cry); ctx.stroke();
}

// ══════════════════════════════════════════════
//  PDF REPORT
// ══════════════════════════════════════════════
function printAreaReport() {
    if (!_reportData) { showToast('Please calculate area first.'); return; }
    var d = _reportData;
    var canvas = document.getElementById('areaCanvas');
    var imgData = canvas ? canvas.toDataURL('image/png') : '';
    var date = new Date().toLocaleDateString('en-GB', {day:'2-digit',month:'long',year:'numeric'});

    var sideRows='';
    for(var i=0;i<d.pts.length;i++){
        var j=(i+1)%d.pts.length;
        sideRows+='<tr><td>P'+(i+1)+' &rarr; P'+(j+1)+'</td><td>'+d.sides[i].toFixed(3)+' m</td><td>'+d.angs[i].toFixed(2)+'&deg; &mdash; '+toDMS(d.angs[i])+'</td></tr>';
    }
    var coordRows='';
    for(var i=0;i<d.pts.length;i++){
        coordRows+='<tr><td>P'+(i+1)+'</td><td>'+d.pts[i][0].toFixed(3)+'</td><td>'+d.pts[i][1].toFixed(3)+'</td></tr>';
    }

    var html='<!DOCTYPE html><html><head><meta charset="UTF-8">'+
        '<title>Area Report &mdash; Akhtar Surveyor</title>'+
        '<style>'+
        '*{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif;}'+
        'body{background:#fff;color:#111;padding:30px;}'+
        '.header{border-bottom:3px solid #0284c7;padding-bottom:15px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:flex-end;}'+
        '.logo{font-size:22px;font-weight:900;color:#0284c7;letter-spacing:1px;}'+
        '.logo span{color:#f59e0b;}'+
        '.report-title{font-size:13px;color:#555;text-align:right;}'+
        '.report-title strong{display:block;font-size:18px;color:#111;margin-bottom:2px;}'+
        'h2{font-size:13px;font-weight:800;letter-spacing:1px;color:#0284c7;text-transform:uppercase;border-left:3px solid #0284c7;padding-left:8px;margin:20px 0 10px;}'+
        '.area-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;}'+
        '.area-card{border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center;}'+
        '.area-card .lbl{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px;}'+
        '.area-card .val{font-size:20px;font-weight:900;color:#0284c7;margin-top:3px;}'+
        '.area-card.gold .val{color:#d97706;}'+
        '.area-card.small .val{font-size:14px;margin-top:5px;}'+
        'table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:15px;}'+
        'th{background:#f1f5f9;padding:8px 10px;text-align:left;font-weight:700;color:#334155;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;}'+
        'td{padding:7px 10px;border-bottom:1px solid #e2e8f0;color:#374151;}'+
        'tr:last-child td{border-bottom:none;}'+
        '.drawing{text-align:center;margin:15px 0;}'+
        '.drawing img{max-width:100%;border:1px solid #e2e8f0;border-radius:8px;}'+
        '.footer{margin-top:30px;border-top:1px solid #e2e8f0;padding-top:12px;font-size:10px;color:#888;display:flex;justify-content:space-between;}'+
        '.disclaimer{font-size:10px;color:#888;font-style:italic;margin-top:8px;}'+
        '@media print{body{padding:15px;}button{display:none;}@page{margin:15mm;}}'+
        '</style></head><body>'+
        '<div class="header">'+
        '<div><div class="logo">AKHTAR <span>SURVEYOR</span></div><div style="font-size:11px;color:#888;margin-top:3px;">Professional Engineering Portal</div></div>'+
        '<div class="report-title"><strong>Area Survey Report</strong>Date: '+date+'<br>Method: Coordinate Geometry (Shoelace Formula)</div>'+
        '</div>'+
        '<h2>Area Summary</h2>'+
        '<div class="area-grid">'+
        '<div class="area-card"><div class="lbl">Square Meters</div><div class="val">'+d.area.toFixed(3)+'</div></div>'+
        '<div class="area-card gold"><div class="lbl">Marla</div><div class="val">'+d.marla.toFixed(3)+'</div></div>'+
        '<div class="area-card gold"><div class="lbl">Kanal</div><div class="val">'+d.kanal.toFixed(4)+'</div></div>'+
        '<div class="area-card small"><div class="lbl">Square Feet</div><div class="val">'+d.sqFt.toFixed(2)+'</div></div>'+
        '<div class="area-card small"><div class="lbl">Acre</div><div class="val">'+d.acre.toFixed(5)+'</div></div>'+
        '<div class="area-card small"><div class="lbl">Hectare</div><div class="val">'+d.hect.toFixed(5)+'</div></div>'+
        '</div>'+
        '<div style="display:flex;gap:20px;font-size:13px;margin-bottom:20px;">'+
        '<span><strong>Perimeter:</strong> '+d.perim.toFixed(3)+' m</span>'+
        '<span><strong>Total Points:</strong> '+d.pts.length+'</span>'+
        '</div>'+
        (imgData?'<h2>Polygon Drawing</h2><div class="drawing"><img src="'+imgData+'"/></div>':'')+
        '<h2>Coordinate Points</h2>'+
        '<table><tr><th>Point</th><th>Easting (E)</th><th>Northing (N)</th></tr>'+coordRows+'</table>'+
        '<h2>Side Lengths &amp; Interior Angles</h2>'+
        '<table><tr><th>Side</th><th>Length</th><th>Interior Angle</th></tr>'+sideRows+'</table>'+
        '<p class="disclaimer">* This report is generated for reference purposes. Verify all measurements with a licensed surveyor before use in any legal or construction context.</p>'+
        '<div class="footer"><span>Akhtar Surveyor | Professional Engineering Portal</span><span>Generated: '+new Date().toLocaleString()+'</span></div>'+
        '</body></html>';

    var w=window.open('','_blank','width=800,height=900');
    if (!w){ showToast('Please allow popups to generate the PDF report.'); return; }
    w.document.write(html);
    w.document.close();
    setTimeout(function(){ w.focus(); w.print(); }, 600);
}

// ── Copy Result ──
function copyAreaResult() {
    if (!_shareText) { showToast('Please calculate area first.'); return; }
    var clean = _shareText.replace(/\*|_/g,'');
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(clean).then(function(){ showToast('Result copied to clipboard!'); }).catch(function(){ fbCopy(clean); });
    } else { fbCopy(clean); }
}

function fbCopy(t) {
    var ta=document.createElement('textarea');
    ta.value=t; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try{document.execCommand('copy');showToast('Copied!');}catch(e){showToast('Copy failed — please copy manually.');}
    document.body.removeChild(ta);
}

// ── WhatsApp Share ──
function shareOnWhatsApp() {
    if (!_shareText) { showToast('Please calculate area first.'); return; }
    window.open('https://wa.me/?text='+encodeURIComponent(_shareText),'_blank');
}
