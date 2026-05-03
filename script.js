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

// ── Accordion Toggle (runs immediately — script is at bottom of body) ──
(function initAccordions() {
    var acc = document.querySelectorAll('.accordion');
    acc.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var isActive = this.classList.contains('active');
            // Close all panels
            document.querySelectorAll('.accordion').forEach(function(a) {
                a.classList.remove('active');
                var p = a.nextElementSibling;
                if (p) p.style.display = 'none';
            });
            // Open this one if it was closed
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

// ── Show result box ──
function showResult(id, html) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = html;
    el.classList.add('show');
}

// ── Degrees to DMS ──
function toDMS(deg) {
    var absDeg = Math.abs(deg);
    var d = Math.floor(absDeg);
    var mFull = (absDeg - d) * 60;
    var m = Math.floor(mFull);
    var s = ((mFull - m) * 60).toFixed(1);
    return d + '\u00b0 ' + m + "' " + s + '"';
}

// ── Whole Circle Bearing from dE, dN ──
function wcBearing(dE, dN) {
    var angle = Math.atan2(dE, dN) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    return angle;
}

// ════════════════════════════════
//  RL CALCULATOR
// ════════════════════════════════
function calcRL() {
    var bm = parseFloat(document.getElementById('bm_input').value);
    var bs = parseFloat(document.getElementById('bs_input').value);
    var fs = parseFloat(document.getElementById('fs_input').value);
    var box = document.getElementById('rl_result');
    if (!box) return;

    if (isNaN(bm) || isNaN(bs) || isNaN(fs)) {
        box.innerHTML = '\u274c Sab fields bharein!';
        box.style.display = 'block';
        return;
    }
    var hi  = bm + bs;
    var rl  = hi - fs;
    var rf  = bs - fs;

    box.innerHTML =
        '<div class="result-row"><span class="result-label">Bench Mark RL</span><span class="result-value">' + bm.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Height of Instrument (HI)</span><span class="result-value highlight">' + hi.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">New RL (FS Point)</span><span class="result-value highlight">' + rl.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Rise / Fall</span><span class="result-value">' + (rf >= 0 ? '\u25b2 Rise ' : '\u25bc Fall ') + Math.abs(rf).toFixed(3) + ' m</span></div>';
    box.style.display = 'block';
}

// ════════════════════════════════
//  1. BEARING & DISTANCE
// ════════════════════════════════
function calcBearing() {
    var e1 = parseFloat(document.getElementById('e1').value);
    var n1 = parseFloat(document.getElementById('n1').value);
    var e2 = parseFloat(document.getElementById('e2').value);
    var n2 = parseFloat(document.getElementById('n2').value);

    if (isNaN(e1) || isNaN(n1) || isNaN(e2) || isNaN(n2)) {
        showResult('res1', '<span style="color:#ef4444;">\u274c Sab 4 fields bharein!</span>');
        return;
    }
    var dE   = e2 - e1;
    var dN   = n2 - n1;
    var dist = Math.sqrt(dE * dE + dN * dN);
    var brg  = wcBearing(dE, dN);

    var quad = dN >= 0 ? (dE >= 0 ? 'NE' : 'NW') : (dE >= 0 ? 'SE' : 'SW');
    var rbDeg = Math.atan2(Math.abs(dE), Math.abs(dN)) * 180 / Math.PI;

    showResult('res1',
        '<div class="result-section-title">\ud83d\udcd0 Bearing & Distance</div>' +
        '<div class="result-row"><span class="result-label">Distance</span><span class="result-value highlight">' + dist.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">WCB (Decimal)</span><span class="result-value highlight">' + brg.toFixed(6) + '\u00b0</span></div>' +
        '<div class="result-row"><span class="result-label">WCB (DMS)</span><span class="result-value">' + toDMS(brg) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Quadrant Bearing</span><span class="result-value">' + quad + ' ' + rbDeg.toFixed(4) + '\u00b0</span></div>' +
        '<div class="result-row"><span class="result-label">\u0394E / \u0394N</span><span class="result-value">' + dE.toFixed(3) + ' / ' + dN.toFixed(3) + '</span></div>'
    );
}

// ════════════════════════════════
//  2. REFERENCE LINE
// ════════════════════════════════
function calcRefLine() {
    var e1 = parseFloat(document.getElementById('rl_e1').value);
    var n1 = parseFloat(document.getElementById('rl_n1').value);
    var e2 = parseFloat(document.getElementById('rl_e2').value);
    var n2 = parseFloat(document.getElementById('rl_n2').value);
    var pe = parseFloat(document.getElementById('rl_pe').value);
    var pn = parseFloat(document.getElementById('rl_pn').value);

    if (isNaN(e1)||isNaN(n1)||isNaN(e2)||isNaN(n2)||isNaN(pe)||isNaN(pn)) {
        showResult('res2', '<span style="color:#ef4444;">\u274c Sab fields bharein!</span>');
        return;
    }
    var lineLen = Math.sqrt(Math.pow(e2-e1,2) + Math.pow(n2-n1,2));
    if (lineLen === 0) { showResult('res2', '<span style="color:#ef4444;">\u274c Line length zero hai!</span>'); return; }

    var ux = (e2-e1)/lineLen, uy = (n2-n1)/lineLen;
    var vx = pe-e1, vy = pn-n1;
    var chainage = vx*ux + vy*uy;
    var offset   = vx*uy - vy*ux;
    var side     = offset >= 0 ? 'Left (L)' : 'Right (R)';
    var footE    = e1 + chainage*ux;
    var footN    = n1 + chainage*uy;

    showResult('res2',
        '<div class="result-section-title">\ud83d\udccf Reference Line Result</div>' +
        '<div class="result-row"><span class="result-label">Chainage</span><span class="result-value highlight">' + chainage.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Offset</span><span class="result-value highlight">' + Math.abs(offset).toFixed(3) + ' m \u2014 ' + side + '</span></div>' +
        '<div class="result-row"><span class="result-label">Line Total Length</span><span class="result-value">' + lineLen.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Foot Point E</span><span class="result-value">' + footE.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Foot Point N</span><span class="result-value">' + footN.toFixed(3) + '</span></div>'
    );
}

// ════════════════════════════════
//  4. CIRCULAR CURVE
// ════════════════════════════════
function calcCircular() {
    var R     = parseFloat(document.getElementById('cc_r').value);
    var delta = parseFloat(document.getElementById('cc_a').value);

    if (isNaN(R)||isNaN(delta)||R<=0||delta<=0||delta>=180) {
        showResult('res4', '<span style="color:#ef4444;">\u274c Valid Radius aur Delta (0-180\u00b0) dalein!</span>');
        return;
    }
    var dRad = delta * Math.PI / 180;
    var T    = R * Math.tan(dRad / 2);
    var L    = R * dRad;
    var E    = R * (1/Math.cos(dRad/2) - 1);
    var M    = R * (1 - Math.cos(dRad/2));
    var LC   = 2 * R * Math.sin(dRad/2);
    var D    = 1719.0 / R;

    showResult('res4',
        '<div class="result-section-title">\ud83d\udd35 Circular Curve Elements</div>' +
        '<div class="result-row"><span class="result-label">Radius (R)</span><span class="result-value">' + R.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Delta (\u0394)</span><span class="result-value">' + toDMS(delta) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Tangent Length (T)</span><span class="result-value highlight">' + T.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Arc Length (L)</span><span class="result-value highlight">' + L.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">External Distance (E)</span><span class="result-value">' + E.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Mid Ordinate (M)</span><span class="result-value">' + M.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Long Chord (LC)</span><span class="result-value">' + LC.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Degree of Curve (D)</span><span class="result-value">' + D.toFixed(4) + '\u00b0</span></div>'
    );
}

// ════════════════════════════════
//  5. SPIRAL CURVE
// ════════════════════════════════
function calcSpiral() {
    var R  = parseFloat(document.getElementById('sp_r').value);
    var Ls = parseFloat(document.getElementById('sp_ls').value);

    if (isNaN(R)||isNaN(Ls)||R<=0||Ls<=0) {
        showResult('res5', '<span style="color:#ef4444;">\u274c Valid R aur Ls dalein!</span>');
        return;
    }
    var thetaS   = (Ls/(2*R)) * 180/Math.PI;
    var tRad     = thetaS * Math.PI/180;
    var Xs       = Ls*(1 - tRad*tRad/10);
    var Ys       = Ls*(tRad/3 - tRad*tRad*tRad/42);
    var p        = Ys - R*(1 - Math.cos(tRad));
    var k        = Xs - R*Math.sin(tRad);

    showResult('res5',
        '<div class="result-section-title">\u223c Spiral Curve Elements</div>' +
        '<div class="result-row"><span class="result-label">Spiral Angle (\u03b8s)</span><span class="result-value highlight">' + toDMS(thetaS) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Xs</span><span class="result-value">' + Xs.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Ys</span><span class="result-value">' + Ys.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Shift (p)</span><span class="result-value">' + p.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">k</span><span class="result-value">' + k.toFixed(3) + ' m</span></div>'
    );
}

// ════════════════════════════════
//  6. VERTICAL CURVE
// ════════════════════════════════
function calcVerticalCurve() {
    var g1 = parseFloat(document.getElementById('vc_g1').value);
    var g2 = parseFloat(document.getElementById('vc_g2').value);
    var L  = parseFloat(document.getElementById('vc_l').value);

    if (isNaN(g1)||isNaN(g2)||isNaN(L)||L<=0) {
        showResult('res6', '<span style="color:#ef4444;">\u274c Sab fields bharein!</span>');
        return;
    }
    var A    = Math.abs(g2 - g1);
    var K    = A > 0 ? L/A : 0;
    var type = g2 >= g1 ? 'Sag Curve \u2197' : 'Crest Curve \u2198';

    showResult('res6',
        '<div class="result-section-title">\ud83d\udcc8 Vertical Curve</div>' +
        '<div class="result-row"><span class="result-label">Curve Type</span><span class="result-value highlight">' + type + '</span></div>' +
        '<div class="result-row"><span class="result-label">G1 / G2</span><span class="result-value">' + g1 + '% / ' + g2 + '%</span></div>' +
        '<div class="result-row"><span class="result-label">Algebraic Diff (A)</span><span class="result-value">' + A.toFixed(4) + '%</span></div>' +
        '<div class="result-row"><span class="result-label">K-Value</span><span class="result-value highlight">' + K.toFixed(2) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Length (L)</span><span class="result-value">' + L.toFixed(3) + ' m</span></div>'
    );
}

// ════════════════════════════════
//  7. 2D TRANSFORMATION
// ════════════════════════════════
function calc2DTrans() {
    var dE    = parseFloat(document.getElementById('transE').value)    || 0;
    var dN    = parseFloat(document.getElementById('transN').value)    || 0;
    var rot   = parseFloat(document.getElementById('transRot').value)  || 0;
    var scale = parseFloat(document.getElementById('transScale').value)|| 1;
    var rRad  = rot * Math.PI / 180;

    showResult('res7',
        '<div class="result-section-title">\ud83d\udd04 2D Transformation</div>' +
        '<div class="result-row"><span class="result-label">Shift E / N</span><span class="result-value">' + dE.toFixed(3) + ' / ' + dN.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Rotation</span><span class="result-value highlight">' + toDMS(rot) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Scale Factor</span><span class="result-value">' + scale.toFixed(6) + '</span></div>' +
        '<div class="result-row"><span class="result-label">cos\u03b8 / sin\u03b8</span><span class="result-value">' + Math.cos(rRad).toFixed(6) + ' / ' + Math.sin(rRad).toFixed(6) + '</span></div>'
    );
}

// ════════════════════════════════
//  8. TRAVERSE
// ════════════════════════════════
function calcTraverse() {
    var dist = parseFloat(document.getElementById('trav_dist').value);
    var err  = parseFloat(document.getElementById('trav_err').value);

    if (isNaN(dist)||isNaN(err)||dist<=0) {
        showResult('res8', '<span style="color:#ef4444;">\u274c Valid values dalein!</span>');
        return;
    }
    var ratio  = err > 0 ? Math.round(dist/err) : 999999;
    var acc    = '1/' + ratio.toLocaleString();
    var grade  = ratio >= 10000 ? '\ud83d\udfe2 First Order'
               : ratio >= 5000  ? '\ud83d\udfe1 Second Order'
               : ratio >= 2000  ? '\ud83d\udfe0 Third Order'
               : '\ud83d\udd34 Low Accuracy';

    showResult('res8',
        '<div class="result-section-title">\ud83d\uddfa Traverse Adjustment</div>' +
        '<div class="result-row"><span class="result-label">Total Length</span><span class="result-value">' + dist.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Misclosure</span><span class="result-value">' + err.toFixed(4) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Accuracy Ratio</span><span class="result-value highlight">' + acc + '</span></div>' +
        '<div class="result-row"><span class="result-label">Grade</span><span class="result-value">' + grade + '</span></div>'
    );
}

// ════════════════════════════════
//  9. TRILATERATION
// ════════════════════════════════
function calcTrilateration() {
    var e1 = parseFloat(document.getElementById('tri_e1').value);
    var n1 = parseFloat(document.getElementById('tri_n1').value);
    var d1 = parseFloat(document.getElementById('tri_d1').value);
    var e2 = parseFloat(document.getElementById('tri_e2').value);
    var n2 = parseFloat(document.getElementById('tri_n2').value);
    var d2 = parseFloat(document.getElementById('tri_d2').value);

    if (isNaN(e1)||isNaN(n1)||isNaN(d1)||isNaN(e2)||isNaN(n2)||isNaN(d2)) {
        showResult('res9', '<span style="color:#ef4444;">\u274c Sab fields bharein!</span>');
        return;
    }
    var dist12 = Math.sqrt(Math.pow(e2-e1,2)+Math.pow(n2-n1,2));
    if (dist12===0){ showResult('res9','<span style="color:#ef4444;">\u274c P1 aur P2 same hain!</span>'); return; }

    var a   = (d1*d1 - d2*d2 + dist12*dist12)/(2*dist12);
    var hSq = d1*d1 - a*a;
    if (hSq<0){ showResult('res9','<span style="color:#ef4444;">\u274c Distances overlap nahi karti!</span>'); return; }
    var h   = Math.sqrt(hSq);
    var mx  = e1 + a*(e2-e1)/dist12;
    var my  = n1 + a*(n2-n1)/dist12;

    showResult('res9',
        '<div class="result-section-title">\ud83d\udccd Trilateration Result</div>' +
        '<div class="result-row"><span class="result-label">Solution 1 — E</span><span class="result-value highlight">' + (mx+h*(n2-n1)/dist12).toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Solution 1 — N</span><span class="result-value highlight">' + (my-h*(e2-e1)/dist12).toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Solution 2 — E</span><span class="result-value">' + (mx-h*(n2-n1)/dist12).toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Solution 2 — N</span><span class="result-value">' + (my+h*(e2-e1)/dist12).toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Baseline</span><span class="result-value">' + dist12.toFixed(3) + ' m</span></div>'
    );
}

// ════════════════════════════════
//  10. INTERSECTION (Brg-Brg)
// ════════════════════════════════
function calcIntersection() {
    var e1 = parseFloat(document.getElementById('int_e1').value);
    var n1 = parseFloat(document.getElementById('int_n1').value);
    var b1 = parseFloat(document.getElementById('int_b1').value);
    var e2 = parseFloat(document.getElementById('int_e2').value);
    var n2 = parseFloat(document.getElementById('int_n2').value);
    var b2 = parseFloat(document.getElementById('int_b2').value);

    if (isNaN(e1)||isNaN(n1)||isNaN(b1)||isNaN(e2)||isNaN(n2)||isNaN(b2)) {
        showResult('res10', '<span style="color:#ef4444;">\u274c Sab fields bharein!</span>');
        return;
    }
    var b1r=b1*Math.PI/180, b2r=b2*Math.PI/180;
    var s1=Math.sin(b1r), c1=Math.cos(b1r);
    var s2=Math.sin(b2r), c2=Math.cos(b2r);
    var denom = s1*c2 - c1*s2;
    if (Math.abs(denom)<1e-10){ showResult('res10','<span style="color:#ef4444;">\u274c Lines parallel hain!</span>'); return; }

    var t  = ((e2-e1)*c2-(n2-n1)*s2)/denom;
    var pE = e1+t*s1;
    var pN = n1+t*c1;

    showResult('res10',
        '<div class="result-section-title">\u2716 Intersection Point</div>' +
        '<div class="result-row"><span class="result-label">Intersection E</span><span class="result-value highlight">' + pE.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Intersection N</span><span class="result-value highlight">' + pN.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Distance from P1</span><span class="result-value">' + Math.abs(t).toFixed(3) + ' m</span></div>'
    );
}

// ════════════════════════════════
//  11. 3-POINT CIRCLE
// ════════════════════════════════
function calc3PointCircle() {
    var ax=parseFloat(document.getElementById('cir_e1').value);
    var ay=parseFloat(document.getElementById('cir_n1').value);
    var bx=parseFloat(document.getElementById('cir_e2').value);
    var by=parseFloat(document.getElementById('cir_n2').value);
    var cx=parseFloat(document.getElementById('cir_e3').value);
    var cy=parseFloat(document.getElementById('cir_n3').value);

    if (isNaN(ax)||isNaN(ay)||isNaN(bx)||isNaN(by)||isNaN(cx)||isNaN(cy)) {
        showResult('res11','<span style="color:#ef4444;">\u274c Teeno points dalein!</span>'); return;
    }
    var D=2*(ax*(by-cy)+bx*(cy-ay)+cx*(ay-by));
    if (Math.abs(D)<1e-10){ showResult('res11','<span style="color:#ef4444;">\u274c Points collinear hain!</span>'); return; }

    var a2=ax*ax+ay*ay, b2=bx*bx+by*by, c2=cx*cx+cy*cy;
    var ux=(a2*(by-cy)+b2*(cy-ay)+c2*(ay-by))/D;
    var uy=(a2*(cx-bx)+b2*(ax-cx)+c2*(bx-ax))/D;
    var R =Math.sqrt(Math.pow(ax-ux,2)+Math.pow(ay-uy,2));

    showResult('res11',
        '<div class="result-section-title">\u2b55 3-Point Circle</div>' +
        '<div class="result-row"><span class="result-label">Center E</span><span class="result-value highlight">' + ux.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Center N</span><span class="result-value highlight">' + uy.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Radius</span><span class="result-value highlight">' + R.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Circumference</span><span class="result-value">' + (2*Math.PI*R).toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Circle Area</span><span class="result-value">' + (Math.PI*R*R).toFixed(3) + ' m\u00b2</span></div>'
    );
}

// ════════════════════════════════
//  12. LAT/LONG TO UTM
// ════════════════════════════════
function calcLatLonToUTM() {
    var lat=parseFloat(document.getElementById('lat_val').value);
    var lon=parseFloat(document.getElementById('lon_val').value);

    if (isNaN(lat)||isNaN(lon)||lat<-90||lat>90||lon<-180||lon>180) {
        showResult('res12','<span style="color:#ef4444;">\u274c Valid Lat/Long dalein!</span>'); return;
    }
    var zone = Math.floor((lon+180)/6)+1;
    var hemi = lat>=0?'N':'S';

    var a=6378137.0, f=1/298.257223563;
    var e2=(2*f-f*f);
    var e12=e2/(1-e2);
    var k0=0.9996;

    var latR=lat*Math.PI/180;
    var lonR=lon*Math.PI/180;
    var lon0R=((zone-1)*6-180+3)*Math.PI/180;

    var N0=a/Math.sqrt(1-e2*Math.pow(Math.sin(latR),2));
    var T0=Math.pow(Math.tan(latR),2);
    var C0=e12*Math.pow(Math.cos(latR),2);
    var A0=Math.cos(latR)*(lonR-lon0R);

    var M0=a*((1-e2/4-3*e2*e2/64)*latR
            -(3*e2/8+3*e2*e2/32)*Math.sin(2*latR)
            +(15*e2*e2/256)*Math.sin(4*latR));

    var east=k0*N0*(A0+(1-T0+C0)*Math.pow(A0,3)/6+(5-18*T0+T0*T0+72*C0)*Math.pow(A0,5)/120)+500000;
    var north=k0*(M0+N0*Math.tan(latR)*(A0*A0/2+(5-T0+9*C0+4*C0*C0)*Math.pow(A0,4)/24+(61-58*T0+T0*T0+600*C0)*Math.pow(A0,6)/720));
    if (lat<0) north+=10000000;

    showResult('res12',
        '<div class="result-section-title">\ud83c\udf0d Lat/Long \u2192 UTM</div>' +
        '<div class="result-row"><span class="result-label">UTM Zone</span><span class="result-value highlight">' + zone + hemi + '</span></div>' +
        '<div class="result-row"><span class="result-label">Easting</span><span class="result-value highlight">' + east.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Northing</span><span class="result-value highlight">' + north.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Latitude</span><span class="result-value">' + toDMS(Math.abs(lat)) + (lat>=0?' N':' S') + '</span></div>' +
        '<div class="result-row"><span class="result-label">Longitude</span><span class="result-value">' + toDMS(Math.abs(lon)) + (lon>=0?' E':' W') + '</span></div>'
    );
}

// ════════════════════════════════
//  13. AREA BY CO-ORDINATE
// ════════════════════════════════
var _shareText = '';

function calcArea() {
    var input       = document.getElementById('areaInput').value.trim();
    var resultEl    = document.getElementById('res13');
    var canvasWrap  = document.getElementById('canvasContainer');
    var shareRow    = document.getElementById('shareRow');

    resultEl.classList.remove('show');
    canvasWrap.classList.remove('show');
    shareRow.classList.remove('show');

    if (!input) {
        resultEl.innerHTML='<span style="color:#ef4444;">\u274c Coordinates dalein!</span>';
        resultEl.classList.add('show'); return;
    }

    var lines  = input.split('\n');
    var points = [];

    for (var i=0;i<lines.length;i++) {
        var line=lines[i].trim();
        if (!line) continue;
        var parts=line.split(',');
        if (parts.length<2){
            resultEl.innerHTML='<span style="color:#ef4444;">\u274c Line '+(i+1)+': "'+line+'" \u2014 E,N format chahiye (e.g. 100,200)</span>';
            resultEl.classList.add('show'); return;
        }
        var e=parseFloat(parts[0].trim()), n=parseFloat(parts[1].trim());
        if (isNaN(e)||isNaN(n)){
            resultEl.innerHTML='<span style="color:#ef4444;">\u274c Invalid number on line '+(i+1)+'</span>';
            resultEl.classList.add('show'); return;
        }
        points.push([e,n]);
    }

    if (points.length<3){
        resultEl.innerHTML='<span style="color:#ef4444;">\u274c Kam az kam 3 points chahiye!</span>';
        resultEl.classList.add('show'); return;
    }

    var len=points.length;

    // Shoelace
    var area=0;
    for (var i=0;i<len;i++){
        var j=(i+1)%len;
        area+=points[i][0]*points[j][1];
        area-=points[j][0]*points[i][1];
    }
    area=Math.abs(area)/2;

    // Side lengths
    var perimeter=0, sides=[];
    for (var i=0;i<len;i++){
        var j=(i+1)%len;
        var d=Math.sqrt(Math.pow(points[j][0]-points[i][0],2)+Math.pow(points[j][1]-points[i][1],2));
        perimeter+=d; sides.push(d);
    }

    // Angles
    var angles=[];
    for (var i=0;i<len;i++){
        var prev=(i-1+len)%len, next=(i+1)%len;
        var v1e=points[prev][0]-points[i][0], v1n=points[prev][1]-points[i][1];
        var v2e=points[next][0]-points[i][0], v2n=points[next][1]-points[i][1];
        var dot=v1e*v2e+v1n*v2n;
        var mag=Math.sqrt(v1e*v1e+v1n*v1n)*Math.sqrt(v2e*v2e+v2n*v2n);
        var cosA=mag>0?dot/mag:0;
        cosA=Math.max(-1,Math.min(1,cosA));
        angles.push(Math.acos(cosA)*180/Math.PI);
    }

    // Conversions
    var sqFt  = area*10.7639;
    var marla = area/20.9;
    var kanal = marla/20;
    var acre  = area/4046.86;
    var hect  = area/10000;

    // Side table
    var sideHTML='';
    for (var i=0;i<len;i++) {
        sideHTML+='<div class="result-row"><span class="result-label">P'+(i+1)+' \u2192 P'+((i+1)%len+1)+'</span><span class="result-value">'+sides[i].toFixed(3)+' m</span></div>';
    }
    var angleHTML='';
    for (var i=0;i<len;i++) {
        angleHTML+='<div class="result-row"><span class="result-label">Angle @ P'+(i+1)+'</span><span class="result-value">'+angles[i].toFixed(2)+'\u00b0 \u2014 '+toDMS(angles[i])+'</span></div>';
    }

    resultEl.innerHTML=
        '<div class="result-section-title">\ud83d\udcd0 Area Result</div>'+
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0;">'+
        '<div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:0.5px;text-transform:uppercase;">Sq Meters</div><div style="font-size:17px;font-weight:800;color:#38bdf8;margin-top:3px;">'+area.toFixed(2)+'</div></div>'+
        '<div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:0.5px;text-transform:uppercase;">Sq Feet</div><div style="font-size:17px;font-weight:800;color:#38bdf8;margin-top:3px;">'+sqFt.toFixed(2)+'</div></div>'+
        '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:0.5px;text-transform:uppercase;">Marla</div><div style="font-size:17px;font-weight:800;color:#fbbf24;margin-top:3px;">'+marla.toFixed(3)+'</div></div>'+
        '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:0.5px;text-transform:uppercase;">Kanal</div><div style="font-size:17px;font-weight:800;color:#fbbf24;margin-top:3px;">'+kanal.toFixed(4)+'</div></div>'+
        '</div>'+
        '<div class="result-row"><span class="result-label">Acre</span><span class="result-value">'+acre.toFixed(5)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Hectare</span><span class="result-value">'+hect.toFixed(5)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Perimeter</span><span class="result-value highlight">'+perimeter.toFixed(3)+' m</span></div>'+
        '<div class="result-row"><span class="result-label">Points Used</span><span class="result-value">'+len+'</span></div>'+
        '<div class="result-section-title" style="margin-top:12px;">\ud83d\udccf Side Lengths</div>'+sideHTML+
        '<div class="result-section-title" style="margin-top:12px;">\ud83d\udcd0 Interior Angles</div>'+angleHTML;

    resultEl.classList.add('show');

    // Show canvas THEN draw
    canvasWrap.classList.add('show');
    setTimeout(function(){ drawPolygon(points, sides, angles); }, 50);

    shareRow.classList.add('show');

    _shareText=
        '\ud83d\udcd0 *Akhtar Surveyor \u2014 Area Result*\n\n'+
        '\u25b8 Area: '+area.toFixed(3)+' m\u00b2\n'+
        '\u25b8 Marla: '+marla.toFixed(3)+'\n'+
        '\u25b8 Kanal: '+kanal.toFixed(4)+'\n'+
        '\u25b8 Acre: '+acre.toFixed(5)+'\n'+
        '\u25b8 Sq Feet: '+sqFt.toFixed(2)+'\n'+
        '\u25b8 Perimeter: '+perimeter.toFixed(3)+' m\n'+
        '\u25b8 Points: '+len+'\n\n'+
        '_Calculated via Akhtar Surveyor_';
}

// ── Canvas Polygon Drawing ──
function drawPolygon(points, sides, angles) {
    var canvas=document.getElementById('areaCanvas');
    var wrap  =document.getElementById('canvasContainer');
    if (!canvas||!wrap) return;

    var W=wrap.offsetWidth||340;
    var H=Math.round(W*0.65);
    if (H<200) H=200;
    canvas.width=W;
    canvas.height=H;

    var ctx=canvas.getContext('2d');
    var len=points.length;
    var pad=55;

    // Background
    ctx.fillStyle='#060e1a';
    ctx.fillRect(0,0,W,H);

    // Grid
    ctx.strokeStyle='rgba(56,189,248,0.05)';
    ctx.lineWidth=1;
    for (var gx=0;gx<W;gx+=30){ ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke(); }
    for (var gy=0;gy<H;gy+=30){ ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke(); }

    // Scale
    var minE=points[0][0], maxE=points[0][0], minN=points[0][1], maxN=points[0][1];
    for (var i=1;i<len;i++){
        if(points[i][0]<minE) minE=points[i][0];
        if(points[i][0]>maxE) maxE=points[i][0];
        if(points[i][1]<minN) minN=points[i][1];
        if(points[i][1]>maxN) maxN=points[i][1];
    }
    var rE=maxE-minE||1, rN=maxN-minN||1;
    var sx=(W-pad*2)/rE, sy=(H-pad*2)/rN;
    var sc=Math.min(sx,sy);
    var ox=pad+(W-pad*2-rE*sc)/2;
    var oy=pad+(H-pad*2-rN*sc)/2;

    function toXY(e,n){ return { x:ox+(e-minE)*sc, y:H-oy-(n-minN)*sc }; }

    var sp=points.map(function(p){ return toXY(p[0],p[1]); });

    // Filled polygon
    ctx.beginPath();
    ctx.moveTo(sp[0].x,sp[0].y);
    for(var i=1;i<len;i++) ctx.lineTo(sp[i].x,sp[i].y);
    ctx.closePath();
    ctx.fillStyle='rgba(56,189,248,0.07)';
    ctx.fill();

    // Outline
    ctx.beginPath();
    ctx.moveTo(sp[0].x,sp[0].y);
    for(var i=1;i<len;i++) ctx.lineTo(sp[i].x,sp[i].y);
    ctx.closePath();
    ctx.strokeStyle='#38bdf8';
    ctx.lineWidth=2;
    ctx.setLineDash([]);
    ctx.stroke();

    // Side labels
    ctx.font='bold 9px Arial,sans-serif';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    for(var i=0;i<len;i++){
        var j=(i+1)%len;
        var mx=(sp[i].x+sp[j].x)/2;
        var my=(sp[i].y+sp[j].y)/2;
        var dx=sp[j].x-sp[i].x, dy=sp[j].y-sp[i].y;
        var dl=Math.sqrt(dx*dx+dy*dy)||1;
        var ox2=-dy/dl*13, oy2=dx/dl*13;
        var lbl=sides[i].toFixed(2)+'m';
        ctx.fillStyle='rgba(6,14,26,0.85)';
        ctx.fillRect(mx+ox2-22,my+oy2-8,44,16);
        ctx.fillStyle='#fbbf24';
        ctx.fillText(lbl,mx+ox2,my+oy2);
    }

    // Vertices
    for(var i=0;i<len;i++){
        var g=ctx.createRadialGradient(sp[i].x,sp[i].y,0,sp[i].x,sp[i].y,10);
        g.addColorStop(0,'rgba(56,189,248,0.5)');
        g.addColorStop(1,'rgba(56,189,248,0)');
        ctx.beginPath(); ctx.arc(sp[i].x,sp[i].y,10,0,Math.PI*2);
        ctx.fillStyle=g; ctx.fill();
        ctx.beginPath(); ctx.arc(sp[i].x,sp[i].y,5,0,Math.PI*2);
        ctx.fillStyle='#38bdf8'; ctx.fill();
        ctx.strokeStyle='white'; ctx.lineWidth=1.5; ctx.stroke();
        // Label
        var ly2=sp[i].y-16;
        ctx.fillStyle='rgba(6,14,26,0.9)';
        ctx.fillRect(sp[i].x-12,ly2-8,24,14);
        ctx.fillStyle='white'; ctx.font='bold 10px Arial,sans-serif';
        ctx.textAlign='center'; ctx.fillText('P'+(i+1),sp[i].x,ly2);
    }

    // Compass rose
    var crx=W-24, cry=24;
    ctx.font='bold 9px Arial,sans-serif';
    ctx.fillStyle='rgba(56,189,248,0.7)';
    ctx.textAlign='center'; ctx.fillText('N',crx,cry-12);
    ctx.beginPath(); ctx.moveTo(crx,cry-8); ctx.lineTo(crx,cry+8);
    ctx.strokeStyle='rgba(56,189,248,0.4)'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(crx-8,cry); ctx.lineTo(crx+8,cry); ctx.stroke();
}

// ── Share ──
function copyAreaResult() {
    if (!_shareText) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(_shareText)
            .then(function(){ showToast('\u2705 Result copy ho gaya!'); })
            .catch(function(){ fallbackCopy(_shareText); });
    } else {
        fallbackCopy(_shareText);
    }
}

function fallbackCopy(text) {
    var ta=document.createElement('textarea');
    ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand('copy'); showToast('\u2705 Copied!'); }
    catch(e){ showToast('\u274c Copy nahi hua, manually karein'); }
    document.body.removeChild(ta);
}

function shareOnWhatsApp() {
    if (!_shareText) return;
    window.open('https://wa.me/?text='+encodeURIComponent(_shareText),'_blank');
}
