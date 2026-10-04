let partsData = {};
let selectedParts = { cpu: null, mobo: null, gpu: null, ram: null, pcase: null, psu: null };

async function loadData() {
    try {
        const response = await fetch('data.json');
        partsData = await response.json();
        setupDropdowns();
    } catch (error) {
        console.error("Fout bij laden van data.json:", error);
    }
}

function setupDropdowns() {
    const list = [
        { selectId: 'cpu-select', dataKey: 'cpus' },
        { selectId: 'mobo-select', dataKey: 'motherboards' },
        { selectId: 'gpu-select', dataKey: 'gpus' },
        { selectId: 'ram-select', dataKey: 'ram' },
        { selectId: 'case-select', dataKey: 'cases' },
        { selectId: 'psu-select', dataKey: 'psus' }
    ];

    list.forEach(item => {
        const select = document.getElementById(item.selectId);
        if (select && partsData[item.dataKey]) {
            select.innerHTML = '<option value="">Maak een keuze...</option>';
            partsData[item.dataKey].forEach(part => {
                select.innerHTML += `<option value="${part.id}">${part.name} (€${part.price})</option>`;
            });
        }
    });
}

function updateSystem() {
    selectedParts.cpu = partsData.cpus.find(c => c.id === document.getElementById('cpu-select').value) || null;
    selectedParts.mobo = partsData.motherboards.find(m => m.id === document.getElementById('mobo-select').value) || null;
    selectedParts.gpu = partsData.gpus.find(g => g.id === document.getElementById('gpu-select').value) || null;
    selectedParts.ram = partsData.ram.find(r => r.id === document.getElementById('ram-select').value) || null;
    selectedParts.pcase = partsData.cases.find(c => c.id === document.getElementById('case-select').value) || null;
    selectedParts.psu = partsData.psus.find(p => p.id === document.getElementById('psu-select').value) || null;

    const mappings = [
        { idName: 'cpu-name', idPrice: 'cpu-price', val: selectedParts.cpu, fallback: 'Geen processor gekozen', suffix: (p) => `(${p.socket})` },
        { idName: 'mobo-name', idPrice: 'mobo-price', val: selectedParts.mobo, fallback: 'Geen moederbord gekozen', suffix: (p) => `(${p.socket})` },
        { idName: 'gpu-name', idPrice: 'gpu-price', val: selectedParts.gpu, fallback: 'Geen videokaart gekozen' },
        { idName: 'ram-name', idPrice: 'ram-price', val: selectedParts.ram, fallback: 'Geen geheugen gekozen' },
        { idName: 'case-name', idPrice: 'case-price', val: selectedParts.pcase, fallback: 'Geen behuizing gekozen' },
        { idName: 'psu-name', idPrice: 'psu-price', val: selectedParts.psu, fallback: 'Geen voeding gekozen' }
    ];

    mappings.forEach(m => {
        if (m.val) {
            document.getElementById(m.idName).innerText = m.suffix ? `${m.val.name} ${m.suffix(m.val)}` : m.val.name;
            document.getElementById(m.idPrice).innerText = `€${m.val.price}`;
        } else {
            document.getElementById(m.idName).innerText = m.fallback;
            document.getElementById(m.idPrice).innerText = '—';
        }
    });

    // Prijscalculatie & Wattage
    let totaal = 0, wattage = 0;
    Object.values(selectedParts).forEach(p => {
        if (p) {
            totaal += p.price;
            if (p.wattage) wattage += p.wattage;
        }
    });
    document.getElementById('total-price').innerText = `€${totaal}.00`;
    document.getElementById('wattage-metric').innerText = totaal > 0 ? `${wattage + 40} Watt` : '0 Watt';

    // FPS / Performance Metric
    const fpsMetric = document.getElementById('fps-metric');
    if (selectedParts.gpu) {
        fpsMetric.innerText = selectedParts.gpu.id === 'gpu2' ? '1440p Ultra / 4K' : '1080p Ultra High';
    } else {
        fpsMetric.innerText = 'Selecteer hardware';
    }

    // Status & Compatibiliteit check
    const statusBox = document.getElementById('status-box');
    const statusBadge = document.getElementById('status-badge');

    if (selectedParts.cpu && selectedParts.mobo && selectedParts.cpu.socket !== selectedParts.mobo.socket) {
        statusBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-base"></i> <span>Systeemfout: De ${selectedParts.cpu.name} vereist socket ${selectedParts.cpu.socket}, maar de ${selectedParts.mobo.name} is ${selectedParts.mobo.socket}!</span>`;
        statusBox.className = 'p-4 mb-8 rounded-xl font-medium text-sm shadow-xl flex items-center space-x-3 bg-rose-950/40 text-rose-400 border border-rose-800/60';
        statusBadge.innerText = 'CONFLICT';
        statusBadge.className = 'px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-400 border border-rose-500/20';
    } else if (totaal > 0) {
        statusBox.innerHTML = `<i class="fa-solid fa-circle-check text-base"></i> <span>Systeemstatus: Alle componenten zijn compatibel. Bouw veilig voort!</span>`;
        statusBox.className = 'p-4 mb-8 rounded-xl font-medium text-sm shadow-xl flex items-center space-x-3 bg-emerald-950/30 text-emerald-400 border border-emerald-800/40';
        statusBadge.innerText = 'COMPATIBEL';
        statusBadge.className = 'px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    } else {
        statusBox.innerHTML = `<i class="fa-solid fa-circle-info text-base"></i> <span>Selecteer onderdelen om de realtime compatibiliteitscontrole te starten.</span>`;
        statusBox.className = 'p-4 mb-8 rounded-xl font-medium text-sm shadow-xl flex items-center space-x-3 bg-blue-950/20 text-blue-400 border border-blue-800/40';
        statusBadge.innerText = 'STANDBY';
        statusBadge.className = 'px-2.5 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
}

window.onload = loadData;
