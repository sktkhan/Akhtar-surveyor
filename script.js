// Function to switch between pages
function showSection(id) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.remove('active'));

    // Show the targeted section
    const target = document.getElementById(id);
    target.classList.add('active');

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// RL Calculator Logic
function calcRL() {
    let bm = parseFloat(document.getElementById('bm_rl').value);
    let bs = parseFloat(document.getElementById('bs_val').value);
    let fs = parseFloat(document.getElementById('fs_val').value);

    if (isNaN(bm) || isNaN(bs) || isNaN(fs)) {
        alert("Please enter all field values.");
        return;
    }

    let hi = bm + bs;
    let rl = hi - fs;

    document.getElementById('rl_res').innerHTML = `
        <p>HI: ${hi.toFixed(3)}</p>
        <p>New RL: ${rl.toFixed(3)}</p>
    `;
}

// More functions for daily updates will be added below this line
