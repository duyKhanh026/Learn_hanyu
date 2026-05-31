import { useRef } from 'react';

export default function ImportExport({ onImport, onExport }) {
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error('JSON phải là mảng các từ vựng');
        onImport(data);
        alert(`Đã import ${data.length} từ vựng!`);
      } catch (err) {
        alert(`Lỗi import: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleExport() {
    const data = onExport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `words-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="import-export">
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}>
        Import JSON
      </button>
      <input ref={fileRef} type="file" accept=".json" hidden onChange={handleFile} />
      <button type="button" className="btn btn-secondary btn-sm" onClick={handleExport}>
        Export JSON
      </button>
    </div>
  );
}
