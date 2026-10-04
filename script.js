let partsData = {};
let selectedCpu = null;
let selectedMobo = null;
let selectedGpu = null;

// Haal de data op uit de losse JSON-file
async function loadData() {
    try {
        const response = await fetch('data.json');
        partsData = await response.json();
        setupDropdowns();
    } catch (error) {
        console.error("Fout bij het laden van data.json:", error);
    }
}

function setupDropdowns() {
    const cpuSelect = document.getElementById('cpu-select');
    const moboSelect = document.getElementById('mobo-select');
    const gpuSelect = document.getElementById('gpu-select');

    partsData.cpus.forEach(c => {
        cpuSelect.innerHTML += `<option value="${c.id}">${c.name} (€${c.price})</option>`;
    });
    partsData.motherboards.forEach(m => {
        moboSelect.innerHTML += `<option value="${m.id}">${m.name} (€${m.price})</option>`;
    });
    partsData.gpus.forEach(g => {
        gpuSelect.innerHTML += `<option value="${g.id}">${g.name} (€${g.price})</option>`;
    });
}

function updateSystem() {
    const cpuId = document.getElementById('cpu-select').value;
    const moboId = document.getElementById('mobo-select').value;
    const gpuId = document.getElementById('gpu-select').value;

    selectedCpu = partsData.cpus.find(c => c.id === cpuId) || null;
    selectedMobo = partsData.motherboards.find(m => m.id === moboId) || null;
    selectedGpu = partsData.gpus.find(g => g.id === gpuId) || null;

    // Update CPU rij
    if (selectedCpu) {
        document.getElementById('cpu-name').innerText = `${selectedCpu.name} (${selectedCpu.socket})`;
        document.getElementById('cpu-price').innerText = `€${selectedCpu.price}`;
    } else {
        document.getElementById('cpu-name').innerText = 'Geen processor gekozen';
        document.getElementById('cpu-price').innerText = '—';
    }

    // Update Moederbord rij
    if (selectedMobo) {
        document.getElementById('mobo-name').innerText = `${selectedMobo.name} (${selectedMobo.socket})`;
        document.getElementById('mobo-price').innerText = `€${selectedMobo.price}`;
    } else {
        document.getElementById('mobo-name').innerText = 'Geen moederbord gekozen';
        document.getElementById('mobo-price').innerText = '—';
    }

    // Update GPU rij
    if (selectedGpu) {
        document.getElementById('gpu-name').innerText = selectedGpu.name;
        document.getElementById('gpu-price').innerText = `€${selectedGpu.price}`;
    } else {
        document.getElementById('gpu-name').innerText = 'Geen videokaart gekozen';
        document.getElementById('gpu-price').innerText = '—';
    }

    // Totaalprijs berekenen
    const totaal = (selectedCpu?.price || 0) + (selectedMobo?.price || 0) + (selectedGpu?.price || 0);
    document.getElementById('total-price').innerText = `€${totaal}`;

    // Systeemstatus en compatibiliteit
    const statusBox = document.getElementById('status-box');
    if (selectedCpu && selectedMobo && selectedCpu.socket !== selectedMobo.socket) {
        statusBox.innerText = '❌ Systeemfout: Processor en moederbord matchen niet!';
        statusBox.className = 'px-4 py-3 rounded-lg font-bold text-sm shadow-inner bg-rose-950/50 text-rose-400 border border-rose-800';
    } else {
        statusBox.innerText = '✅ Systeemstatus: Alle onderdelen passen in elkaar!';
        statusBox.className = 'px-4 py-3 rounded-lg font-bold text-sm shadow-inner bg-emerald-950/50 text-emerald-400 border border-emerald-800';
    }
}

// Start het laden zodra de pagina opstart
window.onload = loadData;
