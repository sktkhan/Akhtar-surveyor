function calculateRL() {
    let bm = parseFloat(document.getElementById("bm").value);
    let bs = parseFloat(document.getElementById("bs").value);
    let fs = parseFloat(document.getElementById("fs").value);

    let hi = bm + bs;
    let rl = hi - fs;

    document.getElementById("result").innerText =
        "HI: " + hi + " | RL: " + rl;
}

<script>
function calculateSlope() {
    let rise = document.getElementById("rise").value;
    let distance = document.getElementById("distance").value;

    let slope = rise / distance;

    document.getElementById("slopeResult").innerText =
        "Slope: " + slope;
}
</script>
