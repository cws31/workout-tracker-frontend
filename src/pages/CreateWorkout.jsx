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
    <div className="max-w-2xl mx-auto pb-16">
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-6 tracking-wide">
        Schedule New Workout
      </h1>

      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-6 space-y-5 shadow-xl">
        {/* Title Input */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
            Workout Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Push Day Heavy"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            rows={2}
            placeholder="Notes or focus points..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">Date</label>
            <input
              type="date"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">Time</label>
            <input
              type="time"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
        </div>

        {/* Exercises Section */}
        <div className="pt-4 border-t border-slate-700/80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">
              Exercises & Sets
            </h3>
            <button
              type="button"
              onClick={handleAddExercise}
              className="text-xs bg-slate-700/80 hover:bg-slate-700 active:scale-95 text-blue-400 font-medium px-3.5 py-2 rounded-xl border border-slate-600 transition-all"
            >
              + Add Exercise
            </button>
          </div>

          <div className="space-y-4">
            {selectedExercises.map((exerciseItem, exerciseIndex) => (
              <div 
                key={exerciseIndex} 
                className="bg-slate-900/80 border border-slate-700/80 p-3.5 sm:p-4 rounded-xl space-y-3 shadow-inner"
              >
                {/* Exercise Selection Dropdown & Remove Button */}
                <div className="flex gap-2 items-center">
                  <select
                    className="bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white flex-1 focus:outline-none focus:border-blue-500 transition"
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
                      className="text-red-400 hover:text-white text-xs px-3 py-2.5 bg-slate-800 hover:bg-red-600/80 rounded-xl border border-slate-700 transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Last Time Performance Banner */}
                {exerciseItem.lastPerformance && exerciseItem.lastPerformance.length > 0 ? (
                  <div className="bg-blue-950/40 border border-blue-900/60 rounded-xl p-2.5 text-[11px] sm:text-xs text-blue-300">
                    <span className="font-semibold">💡 Last Time: </span>
                    <span className="inline-flex flex-wrap gap-1.5 mt-0.5">
                      {exerciseItem.lastPerformance.map((lp, lIdx) => (
                        <span key={lIdx} className="font-mono bg-blue-900/40 px-1.5 py-0.5 rounded border border-blue-800/40">
                          S{lp.setNumber}: {lp.reps}r @ {lp.weight}kg
                        </span>
                      ))}
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 italic px-1">
                    No past performance recorded for this exercise.
                  </div>
                )}

                {/* Sets Builder Container */}
                <div className="space-y-2.5 pt-2 pl-2 sm:pl-3 border-l-2 border-blue-500/40">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <span>Sets</span>
                    <button
                      type="button"
                      onClick={() => handleAddSet(exerciseIndex)}
                      className="text-blue-400 hover:underline text-[11px]"
                    >
                      + Add Set
                    </button>
                  </div>

                  {exerciseItem.sets.map((setItem, setIndex) => (
                    <div 
                      key={setIndex} 
                      className="grid grid-cols-2 sm:flex sm:items-center gap-2 bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/60"
                    >
                      <span className="col-span-2 sm:col-span-none text-xs text-slate-400 font-mono font-medium sm:w-16">
                        Set {setIndex + 1}
                      </span>
                      
                      <select
                        className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white sm:w-32 focus:outline-none focus:border-blue-500 transition"
                        value={setItem.setType}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'setType', e.target.value)}
                      >
                        <option value="WORKING">Working</option>
                        <option value="WARMUP">Warmup</option>
                        <option value="DROPSET">Dropset</option>
                      </select>

                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="number"
                          placeholder="Reps"
                          className="w-full sm:w-20 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white text-center focus:outline-none focus:border-blue-500 transition"
                          value={setItem.reps}
                          onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                        />
                        <span className="text-[10px] text-slate-500 uppercase sm:hidden">reps</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="number"
                          placeholder="Kg"
                          className="w-full sm:w-20 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white text-center focus:outline-none focus:border-blue-500 transition"
                          value={setItem.weight}
                          onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                        />
                        <span className="text-[10px] text-slate-500 uppercase sm:hidden">kg</span>
                      </div>

                      {exerciseItem.sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                          className="col-span-2 sm:col-span-none text-red-400 hover:text-red-300 text-xs py-1 sm:px-2 text-center bg-red-950/40 sm:bg-transparent rounded border border-red-900/40 sm:border-0"
                        >
                          ✕ Delete Set
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-600/20 mt-4"
        >
          {loading ? 'Scheduling...' : 'Schedule Workout'}
        </button>
      </form>
    </div>
  );
}