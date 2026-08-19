import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExercises } from '../api/exerciseApi';
import { createWorkout, getLastPerformance } from '../api/workoutApi';

export default function CreateWorkout() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  // Track selected exercises along with a 'lastPerformance' state field
  const [selectedExercises, setSelectedExercises] = useState([
    { 
      id: '', 
      name: '', 
      sets: [{ setNumber: 1, setType: 'WORKING', reps: 10, weight: 0 }],
      lastPerformance: [] 
    },
  ]);

  useEffect(() => {
    getAllExercises()
      .then(async (res) => {
        const data = res.data || [];
        setExercises(data);
        if (data.length > 0) {
          const firstExId = data[0].exerciseId || data[0].id;
          // Fetch last performance for the initial default exercise
          let lastPerf = [];
          try {
            const perfRes = await getLastPerformance(firstExId);
            lastPerf = perfRes.data || [];
          } catch (e) {
            console.error('Could not fetch past performance', e);
          }

          setSelectedExercises([
            { 
              id: firstExId, 
              name: data[0].name, 
              sets: [{ setNumber: 1, setType: 'WORKING', reps: 10, weight: 0 }],
              lastPerformance: lastPerf
            },
          ]);
        }
      })
      .catch((err) => console.error('Failed to load exercises:', err));
  }, []);

  const handleAddExercise = () => {
    if (exercises.length === 0) return;
    const defaultEx = exercises[0];
    const defaultId = defaultEx.exerciseId || defaultEx.id;

    setSelectedExercises([
      ...selectedExercises,
      { 
        id: defaultId, 
        name: defaultEx.name, 
        sets: [{ setNumber: 1, setType: 'WORKING', reps: 10, weight: 0 }],
        lastPerformance: [] 
      },
    ]);
    
    // Fetch last performance for this newly added default exercise
    getLastPerformance(defaultId)
      .then((res) => {
        setSelectedExercises((prev) => {
          const list = [...prev];
          list[list.length - 1].lastPerformance = res.data || [];
          return list;
        });
      })
      .catch(() => {});
  };

  const handleRemoveExercise = (index) => {
    const list = [...selectedExercises];
    list.splice(index, 1);
    setSelectedExercises(list);
  };

  const handleExerciseChange = async (index, value) => {
    const numVal = parseInt(value, 10);
    const exObj = exercises.find((e) => (e.exerciseId === numVal || e.id === numVal));
    
    const list = [...selectedExercises];
    list[index].id = numVal;
    list[index].name = exObj?.name || '';
    setSelectedExercises(list);

    // Fetch and update last performance when exercise dropdown changes
    try {
      const res = await getLastPerformance(numVal);
      const updatedList = [...selectedExercises];
      updatedList[index].lastPerformance = res.data || [];
      setSelectedExercises(updatedList);
    } catch (err) {
      console.error('Failed to fetch past performance for exercise', err);
    }
  };

  const handleAddSet = (exerciseIndex) => {
    const list = [...selectedExercises];
    const currentSets = list[exerciseIndex].sets;
    currentSets.push({ setNumber: currentSets.length + 1, setType: 'WORKING', reps: 10, weight: 0 });
    setSelectedExercises(list);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const list = [...selectedExercises];
    list[exerciseIndex].sets.splice(setIndex, 1);
    list[exerciseIndex].sets.forEach((s, idx) => {
      s.setNumber = idx + 1;
    });
    setSelectedExercises(list);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const list = [...selectedExercises];
    list[exerciseIndex].sets[setIndex][field] = 
      field === 'reps' ? parseInt(value, 10) || 0 : 
      field === 'weight' ? parseFloat(value) || 0 : value;
    setSelectedExercises(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        description,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime.length === 5 ? `${scheduledTime}:00` : scheduledTime,
        workout_Exercises_Request: selectedExercises.map((item) => ({
          id: parseInt(item.id, 10),
          name: item.name,
          sets: item.sets.map((set, idx) => ({
            setNumber: idx + 1,
            setType: set.setType || 'WORKING',
            reps: parseInt(set.reps, 10),
            weight: parseFloat(set.weight),
          })),
        })),
      };

      await createWorkout(payload);
      alert('Workout scheduled successfully!');
      navigate('/workouts');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <h1 className="text-2xl font-bold text-white mb-6">Schedule New Workout</h1>
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Workout Title</label>
          <input
            type="text"
            required
            placeholder="e.g., Push Day Heavy"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea
            placeholder="Notes or focus points..."
            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
            <input
              type="date"
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Time</label>
            <input
              type="time"
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-slate-200">Included Exercises & Sets</h3>
            <button
              type="button"
              onClick={handleAddExercise}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-blue-400 px-3 py-1.5 rounded transition"
            >
              + Add Exercise
            </button>
          </div>

          {selectedExercises.map((exerciseItem, exerciseIndex) => (
            <div key={exerciseIndex} className="bg-slate-900 border border-slate-700 p-4 rounded-lg mb-4 space-y-3">
              <div className="flex gap-2 items-center">
                <select
                  className="bg-slate-700 border border-slate-600 rounded p-2 text-sm text-white flex-1"
                  value={exerciseItem.id}
                  onChange={(e) => handleExerciseChange(exerciseIndex, e.target.value)}
                >
                  {exercises.map((ex) => (
                    <option key={ex.exerciseId || ex.id} value={ex.exerciseId || ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>

                {selectedExercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(exerciseIndex)}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-slate-800 rounded border border-slate-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Display Last Time Performance Hint Box */}
              {exerciseItem.lastPerformance && exerciseItem.lastPerformance.length > 0 ? (
                <div className="bg-blue-950/40 border border-blue-900/50 rounded p-2 text-xs text-blue-300">
                  <span className="font-semibold">💡 Last Time: </span>
                  {exerciseItem.lastPerformance.map((lp, lIdx) => (
                    <span key={lIdx} className="font-mono mr-2">
                      [Set {lp.setNumber}: {lp.reps} reps @ {lp.weight}kg]
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 italic">
                  No previous completed records found for this exercise.
                </div>
              )}

              {/* Set rows container */}
              <div className="space-y-2 pl-2 border-l-2 border-blue-500/40 pt-1">
                <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase">
                  <span>Current Sets</span>
                  <button
                    type="button"
                    onClick={() => handleAddSet(exerciseIndex)}
                    className="text-blue-400 hover:underline"
                  >
                    + Add Set
                  </button>
                </div>

                {exerciseItem.sets.map((setItem, setIndex) => (
                  <div key={setIndex} className="flex flex-wrap sm:flex-nowrap gap-2 items-center bg-slate-800/60 p-2 rounded border border-slate-700/50">
                    <span className="text-xs text-slate-400 font-mono w-14">Set {setIndex + 1}</span>
                    
                    <select
                      className="bg-slate-700 border border-slate-600 rounded p-1.5 text-xs text-white"
                      value={setItem.setType}
                      onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'setType', e.target.value)}
                    >
                      <option value="WORKING">Working</option>
                      <option value="WARMUP">Warmup</option>
                      <option value="DROPSET">Dropset</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Reps"
                      className="w-20 bg-slate-700 border border-slate-600 rounded p-1.5 text-xs text-white"
                      value={setItem.reps}
                      onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                    />
                    
                    <input
                      type="number"
                      placeholder="Kg"
                      className="w-20 bg-slate-700 border border-slate-600 rounded p-1.5 text-xs text-white"
                      value={setItem.weight}
                      onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                    />

                    {exerciseItem.sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                        className="text-red-400 hover:text-red-300 text-xs px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? 'Creating...' : 'Schedule Workout'}
        </button>
      </form>
    </div>
  );
}