// Section Switcher
function show(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// RL Calculator Logic
function calcRL() {
    let bm = parseFloat(document.getElementById('bm_input').value);
    let bs = parseFloat(document.getElementById('bs_input').value);
    let fs = parseFloat(document.getElementById('fs_input').value);

    let resultBox = document.getElementById('rl_result');

    if (!isNaN(bm) && !isNaN(bs) && !isNaN(fs)) {
        let hi = bm + bs;
        let rl = hi - fs;
        resultBox.innerHTML = `HI: ${hi.toFixed(3)} m <br> New RL: ${rl.toFixed(3)} m`;
    } else {
        resultBox.innerHTML = "❌ Please enter valid data!";
    }
}

// Accordion Toggle
var acc = document.getElementsByClassName("accordion");
for (var i = 0; i < acc.length; i++) {
    acc[i].onclick = function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        panel.style.display = (panel.style.display === "block") ? "none" : "block";
    }
}

function toggleHelp() {
    var m = document.getElementById("helpModal");
    m.style.display = (m.style.display === "block") ? "none" : "block";
}

// Basic Math Example
function calcBearing() {
    let e1 = parseFloat(document.getElementById('e1').value);
    let n1 = parseFloat(document.getElementById('n1').value);
    let e2 = parseFloat(document.getElementById('e2').value);
    let n2 = parseFloat(document.getElementById('n2').value);
    let dE = e2 - e1, dN = n2 - n1;
    let dist = Math.sqrt(dE*dE + dN*dN).toFixed(3);
    document.getElementById('res1').innerHTML = "Distance: " + dist + " m";
}
