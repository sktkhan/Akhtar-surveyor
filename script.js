function calculateRL() {
    let bm = parseFloat(document.getElementById("bm").value);
    let bs = parseFloat(document.getElementById("bs").value);
    let fs = parseFloat(document.getElementById("fs").value);

    let hi = bm + bs;
    let rl = hi - fs;

    document.getElementById("result").innerText =
        "HI: " + hi + " | RL: " + rl;
}
