let partsData = {};
let selectedParts = { cpu: null, mobo: null, gpu: null, ram: null, pcase: null, psu: null };

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
            select.innerHTML = '<option value="">Choose...</option>';
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

    let totaal = 0, wattage = 0;
    Object.values(selectedParts).forEach(p => {
        if (p) {
            totaal += p.price;
            if (p.wattage) wattage += p.wattage;
        }
    });
    
    document.getElementById('total-price').innerText = `€${totaal}.00`;
    document.getElementById('wattage-metric').innerText = totaal > 0 ? `${wattage + 40}W` : '0W';

    const statusBox = document.getElementById('status-box');
    if (selectedParts.cpu && selectedParts.mobo && selectedParts.cpu.socket !== selectedParts.mobo.socket) {
        statusBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>Systeemfout: Sockets matchen niet!</span>`;
        statusBox.className = 'status-banner-error flex items-center space-x-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded w-full sm:w-auto';
    } else {
        statusBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Systeemstatus: Compatibel</span>`;
        statusBox.className = 'status-banner-ok flex items-center space-x-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded w-full sm:w-auto';
    }
}

window.onload = loadData;
