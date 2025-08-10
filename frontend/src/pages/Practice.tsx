import { useState } from 'react';
import PracticeMode from '../components/PracticeMode';

const Practice = () => {
  const [domains, setDomains] = useState<string[]>([]);
  const [num, setNum] = useState(10);
  const [started, setStarted] = useState(false);

  return (
    <div>
      {!started ? (
        <div>
          <select multiple onChange={(e) => setDomains(Array.from(e.target.selectedOptions, o => o.value))}>
            {/* Fetch domains from API */}
            <option>Math</option><option>Science</option>
          </select>
          <input type="number" value={num} onChange={(e) => setNum(parseInt(e.target.value))} />
          <button onClick={() => setStarted(true)}>Start</button>
        </div>
      ) : (
        <PracticeMode selectedDomains={domains} numQuestions={num} />
      )}
    </div>
  );
};

export default Practice;
