import { useState, useEffect } from 'react';
import Map from './Map';
import Dashboard from './Dashboard';
import axios from 'axios';

export default function App() {
  const [zones, setZones] = useState([]);
  const [selected, setSelected] = useState(null);
  const [report, setReport] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/zones')
      .then(res => setZones(res.data))
      .catch(() => console.log('Backend not running'));
  }, []);

  const submitReport = async () => {
    if (!selected || !report) return;
    try {
      const res = await axios.post('http://localhost:8000/report', {
        zone_id: selected.name === 'Western Ghats' ? 'western_ghats' :
         selected.name === 'Central India Forests' ? 'central_india' :
         'northeast',
        report_text: report
      });
      setStatus(res.data.message);
    } catch (err) {
      setStatus('Error submitting report. Try again.');
    }
  };

  return (
    <div style={{fontFamily:'sans-serif',maxWidth:'1200px',margin:'0 auto'}}>
      <div style={{background:'#14532d',color:'white',padding:'20px'}}>
        <h1>Aranyani</h1>
        <p>Predictive Ecosystem Collapse Warning System</p>
        <p style={{fontSize:'12px',opacity:0.8}}>From Rigveda 10.146 — the unseen guardian of forests</p>
      </div>
      <Map zones={zones} onZoneClick={setSelected}/>
      <Dashboard zone={selected}/>
      <div style={{padding:'20px',background:'#f0fdf4',margin:'20px'}}>
        <h3>Submit IKS Community Report</h3>
        <p style={{color:'#666'}}>Report ecological changes using traditional knowledge indicators</p>
        <textarea
          value={report}
          onChange={e => setReport(e.target.value)}
          placeholder='Example: Unusual animal movement near river. Birds leaving early. Stream dried up last month...'
          style={{width:'100%',height:'100px',padding:'10px'}}
        />
        <br/>
        <button
          onClick={submitReport}
          style={{background:'#16a34a',color:'white',padding:'10px 20px',border:'none',borderRadius:'6px',cursor:'pointer',marginTop:'10px'}}
        >
          Submit Report
        </button>
        {status && <p style={{color:'green'}}>{status}</p>}
      </div>
    </div>
  );
}
