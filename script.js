// Navigation Control
function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 1. RL & HI Calculator
function calcRL() {
    let bm = parseFloat(document.getElementById('bm_rl').value);
    let bs = parseFloat(document.getElementById('bs_val').value);
    let fs = parseFloat(document.getElementById('fs_val').value);

    if (!isNaN(bm) && !isNaN(bs) && !isNaN(fs)) {
        let hi = bm + bs;
        let rl = hi - fs;
        document.getElementById('rl_res').innerHTML = `HI: ${hi.toFixed(3)} | New RL: ${rl.toFixed(3)}`;
    } else {
        alert("Please enter valid numbers");
    }
}

// 2. Slope Calculator
function calcSlope() {
    let rise = parseFloat(document.getElementById('rise').value);
    let run = parseFloat(document.getElementById('run').value);

    if (!isNaN(rise) && !isNaN(run) && run !== 0) {
        let slope = (rise / run) * 100;
        document.getElementById('slope_res').innerHTML = `Slope: ${slope.toFixed(2)} %`;
    } else {
        alert("Enter valid Rise and Run (Run cannot be 0)");
    }
}

// 3. Unit Converter (Feet to Meter)
function convertUnit() {
    let feet = parseFloat(document.getElementById('feet_val').value);
    if (!isNaN(feet)) {
        let meters = feet * 0.3048;
        document.getElementById('conv_res').innerHTML = `${feet} ft = ${meters.toFixed(3)} meters`;
    } else {
        alert("Please enter feet value");
    }
}
