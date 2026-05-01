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
