// ══════════════════════════════════════════════
//  AKHTAR SURVEYOR — Professional Calculator Suite
// ══════════════════════════════════════════════

// ── Section Switcher ──
function show(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Accordion Toggle ──
document.addEventListener('DOMContentLoaded', function () {
    var acc = document.getElementsByClassName('accordion');
    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener('click', function () {
            var isActive = this.classList.contains('active');
            // Close all
            document.querySelectorAll('.accordion').forEach(a => {
                a.classList.remove('active');
                a.nextElementSibling.style.display = 'none';
            });
            // Open clicked if it was closed
            if (!isActive) {
                this.classList.add('active');
                this.nextElementSibling.style.display = 'block';
            }
        });
    }
});

// ── Modal ──
function toggleHelp() {
    var m = document.getElementById('helpModal');
    m.style.display = (m.style.display === 'block') ? 'none' : 'block';
}

// ── Toast Notification ──
function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Helper: show result ──
function showResult(id, html) {
    var el = document.getElementById(id);
    el.innerHTML = html;
    el.classList.add('show');
}

// ── Helper: DMS from decimal degrees ──
function toDMS(deg) {
    var d = Math.floor(Math.abs(deg));
    var mFull = (Math.abs(deg) - d) * 60;
    var m = Math.floor(mFull);
    var s = ((mFull - m) * 60).toFixed(1);
    return d + '° ' + m + "' " + s + '"';
}

// ── Helper: Bearing from dE, dN ──
function calcBearingFromDeltas(dE, dN) {
    var angle = Math.atan2(dE, dN) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    return angle;
}

// ══════════════════════════════════════════════
//  RL CALCULATOR
// ══════════════════════════════════════════════
function calcRL() {
    var bm = parseFloat(document.getElementById('bm_input').value);
    var bs = parseFloat(document.getElementById('bs_input').value);
    var fs = parseFloat(document.getElementById('fs_input').value);
    var resultBox = document.getElementById('rl_result');

    if (isNaN(bm) || isNaN(bs) || isNaN(fs)) {
        resultBox.innerHTML = '❌ Sab fields bharein!';
        resultBox.style.display = 'block';
        return;
    }

    var hi = bm + bs;
    var rl = hi - fs;

    resultBox.innerHTML =
        '<div class="result-row"><span class="result-label">Bench Mark RL</span><span class="result-value">' + bm.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Height of Instrument (HI)</span><span class="result-value highlight">' + hi.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">New RL (Fore Sight)</span><span class="result-value highlight">' + rl.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Rise / Fall</span><span class="result-value">' + (bs - fs >= 0 ? '▲ Rise ' : '▼ Fall ') + Math.abs(bs - fs).toFixed(3) + ' m</span></div>';
    resultBox.style.display = 'block';
    resultBox.style.animation = 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
}

// ══════════════════════════════════════════════
//  1. BEARING & DISTANCE
// ══════════════════════════════════════════════
function calcBearing() {
    var e1 = parseFloat(document.getElementById('e1').value);
    var n1 = parseFloat(document.getElementById('n1').value);
    var e2 = parseFloat(document.getElementById('e2').value);
    var n2 = parseFloat(document.getElementById('n2').value);

    if (isNaN(e1) || isNaN(n1) || isNaN(e2) || isNaN(n2)) {
        showResult('res1', '<span style="color:#ef4444;">❌ Sab fields bharein!</span>');
        return;
    }

    var dE = e2 - e1;
    var dN = n2 - n1;
    var dist = Math.sqrt(dE * dE + dN * dN);
    var bearingDeg = calcBearingFromDeltas(dE, dN);

    // Quadrant
    var quad = '';
    if (dN >= 0 && dE >= 0) quad = 'NE';
    else if (dN < 0 && dE >= 0) quad = 'SE';
    else if (dN < 0 && dE < 0) quad = 'SW';
    else quad = 'NW';

    // Reduced bearing
    var rb = Math.abs(dN >= 0 ? Math.atan2(Math.abs(dE), Math.abs(dN)) : Math.atan2(Math.abs(dE), Math.abs(dN))) * 180 / Math.PI;

    showResult('res1',
        '<div class="result-section-title">📐 Bearing & Distance Result</div>' +
        '<div class="result-row"><span class="result-label">Distance</span><span class="result-value highlight">' + dist.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Whole Circle Bearing</span><span class="result-value highlight">' + bearingDeg.toFixed(4) + '°</span></div>' +
        '<div class="result-row"><span class="result-label">Bearing (DMS)</span><span class="result-value">' + toDMS(bearingDeg) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Quadrant</span><span class="result-value">' + quad + ' — ' + rb.toFixed(4) + '°</span></div>' +
        '<div class="result-row"><span class="result-label">ΔE / ΔN</span><span class="result-value">' + dE.toFixed(3) + ' / ' + dN.toFixed(3) + '</span></div>'
    );
}

// ══════════════════════════════════════════════
//  2. REFERENCE LINE (Offset / Chainage)
// ══════════════════════════════════════════════
function calcRefLine() {
    var e1 = parseFloat(document.getElementById('rl_e1').value);
    var n1 = parseFloat(document.getElementById('rl_n1').value);
    var e2 = parseFloat(document.getElementById('rl_e2').value);
    var n2 = parseFloat(document.getElementById('rl_n2').value);
    var pe = parseFloat(document.getElementById('rl_pe').value);
    var pn = parseFloat(document.getElementById('rl_pn').value);

    if ([e1, n1, e2, n2, pe, pn].some(isNaN)) {
        showResult('res2', '<span style="color:#ef4444;">❌ Sab fields bharein!</span>');
        return;
    }

    var lineLen = Math.sqrt((e2 - e1) ** 2 + (n2 - n1) ** 2);
    if (lineLen === 0) { showResult('res2', '<span style="color:#ef4444;">❌ Line length zero hai!</span>'); return; }

    // Unit vector along line
    var ux = (e2 - e1) / lineLen;
    var uy = (n2 - n1) / lineLen;

    // Vector from P1 to Point
    var vx = pe - e1;
    var vy = pn - n1;

    // Chainage = dot product
    var chainage = vx * ux + vy * uy;

    // Offset = cross product magnitude
    var offset = vx * uy - vy * ux;
    var side = offset >= 0 ? 'Left (L)' : 'Right (R)';

    // Foot of perpendicular
    var footE = e1 + chainage * ux;
    var footN = n1 + chainage * uy;

    showResult('res2',
        '<div class="result-section-title">📏 Reference Line Result</div>' +
        '<div class="result-row"><span class="result-label">Chainage</span><span class="result-value highlight">' + chainage.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Offset</span><span class="result-value highlight">' + Math.abs(offset).toFixed(3) + ' m — ' + side + '</span></div>' +
        '<div class="result-row"><span class="result-label">Total Line Length</span><span class="result-value">' + lineLen.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Foot Point E</span><span class="result-value">' + footE.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Foot Point N</span><span class="result-value">' + footN.toFixed(3) + '</span></div>'
    );
}

// ══════════════════════════════════════════════
//  4. CIRCULAR CURVE
// ══════════════════════════════════════════════
function calcCircular() {
    var R = parseFloat(document.getElementById('cc_r').value);
    var delta = parseFloat(document.getElementById('cc_a').value);

    if (isNaN(R) || isNaN(delta) || R <= 0 || delta <= 0 || delta >= 180) {
        showResult('res4', '<span style="color:#ef4444;">❌ Valid Radius aur Delta angle (0-180) dalein!</span>');
        return;
    }

    var deltaRad = delta * Math.PI / 180;
    var T = R * Math.tan(deltaRad / 2);               // Tangent Length
    var L = R * deltaRad;                              // Arc Length
    var E = R * (1 / Math.cos(deltaRad / 2) - 1);    // External Distance
    var M = R * (1 - Math.cos(deltaRad / 2));          // Middle Ordinate
    var LC = 2 * R * Math.sin(deltaRad / 2);           // Long Chord
    var D = 1719.0 / R;                                // Degree of Curve

    showResult('res4',
        '<div class="result-section-title">🔵 Circular Curve Elements</div>' +
        '<div class="result-row"><span class="result-label">Radius (R)</span><span class="result-value">' + R.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Delta Angle (Δ)</span><span class="result-value">' + delta.toFixed(4) + '° — ' + toDMS(delta) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Tangent Length (T)</span><span class="result-value highlight">' + T.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Arc Length (L)</span><span class="result-value highlight">' + L.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">External Distance (E)</span><span class="result-value">' + E.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Middle Ordinate (M)</span><span class="result-value">' + M.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Long Chord (LC)</span><span class="result-value">' + LC.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Degree of Curve (D)</span><span class="result-value">' + D.toFixed(4) + '°</span></div>'
    );
}

// ══════════════════════════════════════════════
//  5. SPIRAL CURVE
// ══════════════════════════════════════════════
function calcSpiral() {
    var R = parseFloat(document.getElementById('sp_r').value);
    var Ls = parseFloat(document.getElementById('sp_ls').value);

    if (isNaN(R) || isNaN(Ls) || R <= 0 || Ls <= 0) {
        showResult('res5', '<span style="color:#ef4444;">❌ Valid Radius aur Spiral Length dalein!</span>');
        return;
    }

    var thetaS = (Ls / (2 * R)) * 180 / Math.PI;     // Spiral angle (deg)
    var thetaRad = thetaS * Math.PI / 180;
    var Xs = Ls * (1 - thetaRad * thetaRad / 10);     // X offset
    var Ys = Ls * (thetaRad / 3 - thetaRad * thetaRad * thetaRad / 42); // Y offset
    var k = Xs - R * Math.sin(thetaRad);              // Shift (p)
    var p = Ys - R * (1 - Math.cos(thetaRad));        // p

    showResult('res5',
        '<div class="result-section-title">〰 Spiral Curve Elements</div>' +
        '<div class="result-row"><span class="result-label">Spiral Angle (θs)</span><span class="result-value highlight">' + thetaS.toFixed(4) + '° — ' + toDMS(thetaS) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Xs</span><span class="result-value">' + Xs.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Ys</span><span class="result-value">' + Ys.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Shift (p)</span><span class="result-value">' + p.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">k</span><span class="result-value">' + k.toFixed(3) + ' m</span></div>'
    );
}

// ══════════════════════════════════════════════
//  6. VERTICAL CURVE
// ══════════════════════════════════════════════
function calcVerticalCurve() {
    var g1 = parseFloat(document.getElementById('vc_g1').value);
    var g2 = parseFloat(document.getElementById('vc_g2').value);
    var L = parseFloat(document.getElementById('vc_l').value);

    if (isNaN(g1) || isNaN(g2) || isNaN(L) || L <= 0) {
        showResult('res6', '<span style="color:#ef4444;">❌ Sab fields bharein!</span>');
        return;
    }

    var A = Math.abs(g2 - g1);          // Algebraic difference
    var K = A > 0 ? L / A : 0;          // K-value
    var type = (g2 > g1) ? 'Sag Curve ↑' : 'Crest Curve ↓';
    var HL = L / 2;                     // Highest/Lowest point from PVC

    showResult('res6',
        '<div class="result-section-title">📈 Vertical Curve Result</div>' +
        '<div class="result-row"><span class="result-label">Curve Type</span><span class="result-value highlight">' + type + '</span></div>' +
        '<div class="result-row"><span class="result-label">Grade In (G1)</span><span class="result-value">' + g1 + ' %</span></div>' +
        '<div class="result-row"><span class="result-label">Grade Out (G2)</span><span class="result-value">' + g2 + ' %</span></div>' +
        '<div class="result-row"><span class="result-label">Algebraic Diff (A)</span><span class="result-value">' + A.toFixed(4) + ' %</span></div>' +
        '<div class="result-row"><span class="result-label">K-Value</span><span class="result-value highlight">' + K.toFixed(2) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Curve Length (L)</span><span class="result-value">' + L.toFixed(3) + ' m</span></div>'
    );
}

// ══════════════════════════════════════════════
//  7. 2D TRANSFORMATION
// ══════════════════════════════════════════════
function calc2DTrans() {
    var dE = parseFloat(document.getElementById('transE').value) || 0;
    var dN = parseFloat(document.getElementById('transN').value) || 0;
    var rot = parseFloat(document.getElementById('transRot').value) || 0;
    var scale = parseFloat(document.getElementById('transScale').value) || 1;

    var rotRad = rot * Math.PI / 180;

    showResult('res7',
        '<div class="result-section-title">🔄 2D Transformation Applied</div>' +
        '<div class="result-row"><span class="result-label">Shift Easting</span><span class="result-value">' + dE.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Shift Northing</span><span class="result-value">' + dN.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Rotation</span><span class="result-value highlight">' + toDMS(rot) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Scale Factor</span><span class="result-value">' + scale.toFixed(6) + '</span></div>' +
        '<div class="result-row"><span class="result-label">cos θ / sin θ</span><span class="result-value">' + Math.cos(rotRad).toFixed(6) + ' / ' + Math.sin(rotRad).toFixed(6) + '</span></div>'
    );
}

// ══════════════════════════════════════════════
//  8. TRAVERSE CALCULATION
// ══════════════════════════════════════════════
function calcTraverse() {
    var dist = parseFloat(document.getElementById('trav_dist').value);
    var err = parseFloat(document.getElementById('trav_err').value);

    if (isNaN(dist) || isNaN(err) || dist <= 0) {
        showResult('res8', '<span style="color:#ef4444;">❌ Valid values dalein!</span>');
        return;
    }

    var ratio = err > 0 ? Math.round(dist / err) : 999999;
    var accuracy = '1/' + ratio.toLocaleString();
    var grade = ratio >= 10000 ? '🟢 First Order' : ratio >= 5000 ? '🟡 Second Order' : ratio >= 2000 ? '🟠 Third Order' : '🔴 Low Accuracy';

    showResult('res8',
        '<div class="result-section-title">🗺 Traverse Adjustment Result</div>' +
        '<div class="result-row"><span class="result-label">Total Length</span><span class="result-value">' + dist.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Misclosure</span><span class="result-value">' + err.toFixed(4) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Accuracy Ratio</span><span class="result-value highlight">' + accuracy + '</span></div>' +
        '<div class="result-row"><span class="result-label">Survey Grade</span><span class="result-value">' + grade + '</span></div>'
    );
}

// ══════════════════════════════════════════════
//  9. TRILATERATION
// ══════════════════════════════════════════════
function calcTrilateration() {
    var e1 = parseFloat(document.getElementById('tri_e1').value);
    var n1 = parseFloat(document.getElementById('tri_n1').value);
    var d1 = parseFloat(document.getElementById('tri_d1').value);
    var e2 = parseFloat(document.getElementById('tri_e2').value);
    var n2 = parseFloat(document.getElementById('tri_n2').value);
    var d2 = parseFloat(document.getElementById('tri_d2').value);

    if ([e1, n1, d1, e2, n2, d2].some(isNaN)) {
        showResult('res9', '<span style="color:#ef4444;">❌ Sab fields bharein!</span>');
        return;
    }

    var dist12 = Math.sqrt((e2 - e1) ** 2 + (n2 - n1) ** 2);
    if (dist12 === 0) { showResult('res9', '<span style="color:#ef4444;">❌ P1 aur P2 alag hone chahiye!</span>'); return; }

    var a = (d1 * d1 - d2 * d2 + dist12 * dist12) / (2 * dist12);
    var hSq = d1 * d1 - a * a;
    if (hSq < 0) { showResult('res9', '<span style="color:#ef4444;">❌ Distances overlap nahi karti — check karein!</span>'); return; }
    var h = Math.sqrt(hSq);

    var mx = e1 + a * (e2 - e1) / dist12;
    var my = n1 + a * (n2 - n1) / dist12;

    var px1 = mx + h * (n2 - n1) / dist12;
    var py1 = my - h * (e2 - e1) / dist12;
    var px2 = mx - h * (n2 - n1) / dist12;
    var py2 = my + h * (e2 - e1) / dist12;

    showResult('res9',
        '<div class="result-section-title">📍 Trilateration Result</div>' +
        '<div class="result-row"><span class="result-label">Solution 1 — E</span><span class="result-value highlight">' + px1.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Solution 1 — N</span><span class="result-value highlight">' + py1.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Solution 2 — E</span><span class="result-value">' + px2.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Solution 2 — N</span><span class="result-value">' + py2.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Baseline P1-P2</span><span class="result-value">' + dist12.toFixed(3) + ' m</span></div>'
    );
}

// ══════════════════════════════════════════════
//  10. INTERSECTION (Bearing-Bearing)
// ══════════════════════════════════════════════
function calcIntersection() {
    var e1 = parseFloat(document.getElementById('int_e1').value);
    var n1 = parseFloat(document.getElementById('int_n1').value);
    var b1 = parseFloat(document.getElementById('int_b1').value);
    var e2 = parseFloat(document.getElementById('int_e2').value);
    var n2 = parseFloat(document.getElementById('int_n2').value);
    var b2 = parseFloat(document.getElementById('int_b2').value);

    if ([e1, n1, b1, e2, n2, b2].some(isNaN)) {
        showResult('res10', '<span style="color:#ef4444;">❌ Sab fields bharein!</span>');
        return;
    }

    var b1r = b1 * Math.PI / 180;
    var b2r = b2 * Math.PI / 180;

    // Direction cosines
    var sin1 = Math.sin(b1r), cos1 = Math.cos(b1r);
    var sin2 = Math.sin(b2r), cos2 = Math.cos(b2r);

    var denom = sin1 * cos2 - cos1 * sin2;
    if (Math.abs(denom) < 1e-10) {
        showResult('res10', '<span style="color:#ef4444;">❌ Lines parallel hain — intersection possible nahi!</span>');
        return;
    }

    var t = ((e2 - e1) * cos2 - (n2 - n1) * sin2) / denom;
    var pE = e1 + t * sin1;
    var pN = n1 + t * cos1;

    showResult('res10',
        '<div class="result-section-title">✖ Intersection Point</div>' +
        '<div class="result-row"><span class="result-label">Intersection E</span><span class="result-value highlight">' + pE.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Intersection N</span><span class="result-value highlight">' + pN.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Dist from P1</span><span class="result-value">' + Math.abs(t).toFixed(3) + ' m</span></div>'
    );
}

// ══════════════════════════════════════════════
//  11. 3-POINT CIRCLE
// ══════════════════════════════════════════════
function calc3PointCircle() {
    var e1 = parseFloat(document.getElementById('cir_e1').value);
    var n1 = parseFloat(document.getElementById('cir_n1').value);
    var e2 = parseFloat(document.getElementById('cir_e2').value);
    var n2 = parseFloat(document.getElementById('cir_n2').value);
    var e3 = parseFloat(document.getElementById('cir_e3').value);
    var n3 = parseFloat(document.getElementById('cir_n3').value);

    if ([e1, n1, e2, n2, e3, n3].some(isNaN)) {
        showResult('res11', '<span style="color:#ef4444;">❌ Sab points dalein!</span>');
        return;
    }

    var ax = e1, ay = n1, bx = e2, by = n2, cx = e3, cy = n3;
    var D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
    if (Math.abs(D) < 1e-10) {
        showResult('res11', '<span style="color:#ef4444;">❌ Points collinear hain!</span>');
        return;
    }

    var ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / D;
    var uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / D;

    var radius = Math.sqrt((ax - ux) ** 2 + (ay - uy) ** 2);
    var circ = 2 * Math.PI * radius;
    var area = Math.PI * radius * radius;

    showResult('res11',
        '<div class="result-section-title">⭕ 3-Point Circle Result</div>' +
        '<div class="result-row"><span class="result-label">Center E</span><span class="result-value highlight">' + ux.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Center N</span><span class="result-value highlight">' + uy.toFixed(3) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Radius</span><span class="result-value highlight">' + radius.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Circumference</span><span class="result-value">' + circ.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Circle Area</span><span class="result-value">' + area.toFixed(3) + ' m²</span></div>'
    );
}

// ══════════════════════════════════════════════
//  12. LAT/LONG TO UTM
// ══════════════════════════════════════════════
function calcLatLonToUTM() {
    var lat = parseFloat(document.getElementById('lat_val').value);
    var lon = parseFloat(document.getElementById('lon_val').value);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        showResult('res12', '<span style="color:#ef4444;">❌ Valid Lat (-90 to 90) aur Long (-180 to 180) dalein!</span>');
        return;
    }

    var zone = Math.floor((lon + 180) / 6) + 1;
    var hemisphere = lat >= 0 ? 'N' : 'S';

    // WGS84 ellipsoid
    var a = 6378137.0;
    var f = 1 / 298.257223563;
    var b = a * (1 - f);
    var e2 = (a * a - b * b) / (a * a);
    var e12 = e2 / (1 - e2);
    var k0 = 0.9996;

    var latRad = lat * Math.PI / 180;
    var lonRad = lon * Math.PI / 180;
    var lon0Rad = ((zone - 1) * 6 - 180 + 3) * Math.PI / 180;

    var N = a / Math.sqrt(1 - e2 * Math.sin(latRad) ** 2);
    var T = Math.tan(latRad) ** 2;
    var C = e12 * Math.cos(latRad) ** 2;
    var A = Math.cos(latRad) * (lonRad - lon0Rad);

    var M = a * ((1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 ** 3 / 256) * latRad
        - (3 * e2 / 8 + 3 * e2 * e2 / 32 + 45 * e2 ** 3 / 1024) * Math.sin(2 * latRad)
        + (15 * e2 * e2 / 256 + 45 * e2 ** 3 / 1024) * Math.sin(4 * latRad)
        - (35 * e2 ** 3 / 3072) * Math.sin(6 * latRad));

    var easting = k0 * N * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T * T + 72 * C - 58 * e12) * A ** 5 / 120) + 500000;
    var northing = k0 * (M + N * Math.tan(latRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A ** 4 / 24 + (61 - 58 * T + T * T + 600 * C - 330 * e12) * A ** 6 / 720));
    if (lat < 0) northing += 10000000;

    showResult('res12',
        '<div class="result-section-title">🌍 UTM Conversion Result</div>' +
        '<div class="result-row"><span class="result-label">UTM Zone</span><span class="result-value highlight">' + zone + hemisphere + '</span></div>' +
        '<div class="result-row"><span class="result-label">Easting</span><span class="result-value highlight">' + easting.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Northing</span><span class="result-value highlight">' + northing.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Latitude</span><span class="result-value">' + toDMS(Math.abs(lat)) + (lat >= 0 ? ' N' : ' S') + '</span></div>' +
        '<div class="result-row"><span class="result-label">Longitude</span><span class="result-value">' + toDMS(Math.abs(lon)) + (lon >= 0 ? ' E' : ' W') + '</span></div>'
    );
}

// ══════════════════════════════════════════════
//  13. AREA BY CO-ORDINATE (with Canvas Drawing)
// ══════════════════════════════════════════════

var _areaShareText = '';
var _areaPoints = [];

function calcArea() {
    var input = document.getElementById('areaInput').value.trim();
    var resultEl = document.getElementById('res13');
    var canvasContainer = document.getElementById('canvasContainer');
    var shareRow = document.getElementById('shareRow');

    resultEl.classList.remove('show');
    canvasContainer.classList.remove('show');
    shareRow.classList.remove('show');

    if (!input) {
        resultEl.innerHTML = '<span style="color:#ef4444;">❌ Coordinates dalein!</span>';
        resultEl.classList.add('show');
        return;
    }

    var lines = input.split('\n');
    var points = [];

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) continue;
        var parts = line.split(',');
        if (parts.length < 2) {
            resultEl.innerHTML = '<span style="color:#ef4444;">❌ Galat format — Line ' + (i + 1) + ': "' + line + '"<br>Sahi format: E,N (e.g. 100,200)</span>';
            resultEl.classList.add('show');
            return;
        }
        var e = parseFloat(parts[0].trim());
        var n = parseFloat(parts[1].trim());
        if (isNaN(e) || isNaN(n)) {
            resultEl.innerHTML = '<span style="color:#ef4444;">❌ Invalid number on line ' + (i + 1) + ': "' + line + '"</span>';
            resultEl.classList.add('show');
            return;
        }
        points.push([e, n]);
    }

    if (points.length < 3) {
        resultEl.innerHTML = '<span style="color:#ef4444;">❌ Kam az kam 3 points chahiye!</span>';
        resultEl.classList.add('show');
        return;
    }

    _areaPoints = points;

    // ── Shoelace Formula ──
    var area = 0;
    var len = points.length;
    for (var i = 0; i < len; i++) {
        var j = (i + 1) % len;
        area += points[i][0] * points[j][1];
        area -= points[j][0] * points[i][1];
    }
    area = Math.abs(area) / 2;

    // ── Perimeter ──
    var perimeter = 0;
    var sideLengths = [];
    for (var i = 0; i < len; i++) {
        var j = (i + 1) % len;
        var d = Math.sqrt((points[j][0] - points[i][0]) ** 2 + (points[j][1] - points[i][1]) ** 2);
        perimeter += d;
        sideLengths.push(d);
    }

    // ── Interior Angles ──
    var angles = [];
    for (var i = 0; i < len; i++) {
        var prev = (i - 1 + len) % len;
        var next = (i + 1) % len;
        var v1e = points[prev][0] - points[i][0];
        var v1n = points[prev][1] - points[i][1];
        var v2e = points[next][0] - points[i][0];
        var v2n = points[next][1] - points[i][1];
        var dot = v1e * v2e + v1n * v2n;
        var mag1 = Math.sqrt(v1e * v1e + v1n * v1n);
        var mag2 = Math.sqrt(v2e * v2e + v2n * v2n);
        var cosA = dot / (mag1 * mag2);
        cosA = Math.max(-1, Math.min(1, cosA));
        angles.push(Math.acos(cosA) * 180 / Math.PI);
    }

    // ── Unit Conversions ──
    var areaSqFt = area * 10.7639;
    var areaMarla = area / 20.9;
    var areaKanal = areaMarla / 20;
    var areaAcre = area / 4046.86;
    var areaHectare = area / 10000;

    // ── Build Result HTML ──
    var sideHTML = '';
    for (var i = 0; i < sideLengths.length; i++) {
        sideHTML += '<div class="result-row"><span class="result-label">Side P' + (i + 1) + '→P' + ((i + 1) % len + 1) + '</span><span class="result-value">' + sideLengths[i].toFixed(3) + ' m</span></div>';
    }

    var angleHTML = '';
    for (var i = 0; i < angles.length; i++) {
        angleHTML += '<div class="result-row"><span class="result-label">Angle at P' + (i + 1) + '</span><span class="result-value">' + angles[i].toFixed(2) + '° — ' + toDMS(angles[i]) + '</span></div>';
    }

    var resultHTML =
        '<div class="result-section-title">📐 Area Result</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0;">' +
        '<div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.5px;">Square Meters</div><div style="font-size:18px;font-weight:800;color:var(--primary);margin-top:3px;">' + area.toFixed(2) + '</div></div>' +
        '<div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.5px;">Square Feet</div><div style="font-size:18px;font-weight:800;color:var(--primary);margin-top:3px;">' + areaSqFt.toFixed(2) + '</div></div>' +
        '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.5px;">Marla</div><div style="font-size:18px;font-weight:800;color:var(--gold);margin-top:3px;">' + areaMarla.toFixed(3) + '</div></div>' +
        '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.5px;">Kanal</div><div style="font-size:18px;font-weight:800;color:var(--gold);margin-top:3px;">' + areaKanal.toFixed(4) + '</div></div>' +
        '</div>' +
        '<div class="result-row"><span class="result-label">Acre</span><span class="result-value">' + areaAcre.toFixed(5) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Hectare</span><span class="result-value">' + areaHectare.toFixed(5) + '</span></div>' +
        '<div class="result-row"><span class="result-label">Perimeter</span><span class="result-value highlight">' + perimeter.toFixed(3) + ' m</span></div>' +
        '<div class="result-row"><span class="result-label">Total Points</span><span class="result-value">' + len + '</span></div>' +
        '<div class="result-section-title" style="margin-top:12px;">📏 Side Lengths</div>' + sideHTML +
        '<div class="result-section-title" style="margin-top:12px;">📐 Interior Angles</div>' + angleHTML;

    resultEl.innerHTML = resultHTML;
    resultEl.classList.add('show');

    // ── Draw Canvas ──
    drawPolygon(points, sideLengths, angles);
    canvasContainer.classList.add('show');
    shareRow.classList.add('show');

    // ── Build share text ──
    _areaShareText =
        '📐 *Akhtar Surveyor — Area Result*\n\n' +
        '▸ Area: ' + area.toFixed(3) + ' m²\n' +
        '▸ Marla: ' + areaMarla.toFixed(3) + '\n' +
        '▸ Kanal: ' + areaKanal.toFixed(4) + '\n' +
        '▸ Acre: ' + areaAcre.toFixed(5) + '\n' +
        '▸ Sq Feet: ' + areaSqFt.toFixed(2) + '\n' +
        '▸ Perimeter: ' + perimeter.toFixed(3) + ' m\n' +
        '▸ Points: ' + len + '\n\n' +
        '_Calculated via Akhtar Surveyor_';
}

// ── Canvas Polygon Drawing ──
function drawPolygon(points, sideLengths, angles) {
    var canvas = document.getElementById('areaCanvas');
    var container = document.getElementById('canvasContainer');

    var W = container.offsetWidth || 340;
    var H = Math.round(W * 0.65);
    canvas.width = W;
    canvas.height = H;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#060e1a';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(56,189,248,0.06)';
    ctx.lineWidth = 1;
    for (var gx = 0; gx < W; gx += 30) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (var gy = 0; gy < H; gy += 30) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

    var pad = 50;
    var minE = Math.min(...points.map(p => p[0]));
    var maxE = Math.max(...points.map(p => p[0]));
    var minN = Math.min(...points.map(p => p[1]));
    var maxN = Math.max(...points.map(p => p[1]));

    var rangeE = maxE - minE || 1;
    var rangeN = maxN - minN || 1;
    var scaleX = (W - pad * 2) / rangeE;
    var scaleY = (H - pad * 2) / rangeN;
    var scale = Math.min(scaleX, scaleY);

    var offX = pad + ((W - pad * 2) - rangeE * scale) / 2;
    var offY = pad + ((H - pad * 2) - rangeN * scale) / 2;

    function toScreen(e, n) {
        return {
            x: offX + (e - minE) * scale,
            y: H - offY - (n - minN) * scale
        };
    }

    var screenPts = points.map(p => toScreen(p[0], p[1]));

    // Filled polygon
    ctx.beginPath();
    ctx.moveTo(screenPts[0].x, screenPts[0].y);
    for (var i = 1; i < screenPts.length; i++) {
        ctx.lineTo(screenPts[i].x, screenPts[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(56,189,248,0.08)';
    ctx.fill();

    // Border
    ctx.beginPath();
    ctx.moveTo(screenPts[0].x, screenPts[0].y);
    for (var i = 1; i < screenPts.length; i++) {
        ctx.lineTo(screenPts[i].x, screenPts[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.stroke();

    // Side length labels
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var i = 0; i < screenPts.length; i++) {
        var j = (i + 1) % screenPts.length;
        var mx = (screenPts[i].x + screenPts[j].x) / 2;
        var my = (screenPts[i].y + screenPts[j].y) / 2;
        var label = sideLengths[i].toFixed(2) + 'm';

        // Offset label slightly perpendicular to side
        var dx = screenPts[j].x - screenPts[i].x;
        var dy = screenPts[j].y - screenPts[i].y;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var ox = -dy / len * 12;
        var oy = dx / len * 12;

        ctx.fillStyle = 'rgba(15,23,42,0.85)';
        ctx.fillRect(mx + ox - 22, my + oy - 8, 44, 16);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(label, mx + ox, my + oy);
    }

    // Vertices
    for (var i = 0; i < screenPts.length; i++) {
        // Glow
        var grad = ctx.createRadialGradient(screenPts[i].x, screenPts[i].y, 0, screenPts[i].x, screenPts[i].y, 10);
        grad.addColorStop(0, 'rgba(56,189,248,0.5)');
        grad.addColorStop(1, 'rgba(56,189,248,0)');
        ctx.beginPath();
        ctx.arc(screenPts[i].x, screenPts[i].y, 10, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(screenPts[i].x, screenPts[i].y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Point label
        var lx = screenPts[i].x;
        var ly = screenPts[i].y - 16;
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillStyle = 'rgba(15,23,42,0.9)';
        ctx.fillRect(lx - 12, ly - 8, 24, 14);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('P' + (i + 1), lx, ly);
    }

    // Compass rose (mini)
    var cx2 = W - 28, cy2 = 28;
    ctx.font = 'bold 8px Inter, sans-serif';
    ctx.fillStyle = 'rgba(56,189,248,0.6)';
    ctx.textAlign = 'center';
    ctx.fillText('N', cx2, cy2 - 12);
    ctx.beginPath();
    ctx.moveTo(cx2, cy2 - 8);
    ctx.lineTo(cx2, cy2 + 8);
    ctx.strokeStyle = 'rgba(56,189,248,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx2 - 8, cy2);
    ctx.lineTo(cx2 + 8, cy2);
    ctx.stroke();
}

// ── Share Functions ──
function copyAreaResult() {
    if (!_areaShareText) return;
    navigator.clipboard.writeText(_areaShareText).then(function () {
        showToast('✅ Result copied to clipboard!');
    }).catch(function () {
        showToast('❌ Copy failed — try manually');
    });
}

function shareOnWhatsApp() {
    if (!_areaShareText) return;
    var url = 'https://wa.me/?text=' + encodeURIComponent(_areaShareText);
    window.open(url, '_blank');
}
