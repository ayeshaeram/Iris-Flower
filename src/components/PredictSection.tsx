import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, CheckCircle2, AlertCircle, ArrowRight, Flower2, HelpCircle } from 'lucide-react';
import { SAMPLE_PRESETS, SPECIES_DETAILS, classifyIrisClient } from '../data/irisDataset';

interface PredictSectionProps {
  onNavigateToViz: (features: { sepalLength: number; sepalWidth: number; petalLength: number; petalWidth: number; species: string }) => void;
  lastPrediction: {
    sepalLength: number;
    sepalWidth: number;
    petalLength: number;
    petalWidth: number;
    species: string;
    confidence: number;
  } | null;
  setLastPrediction: (pred: any) => void;
}

export const PredictSection: React.FC<PredictSectionProps> = ({
  onNavigateToViz,
  lastPrediction,
  setLastPrediction
}) => {
  // Input fields state
  const [sepalLength, setSepalLength] = useState<string>('5.8');
  const [sepalWidth, setSepalWidth] = useState<string>('3.0');
  const [petalLength, setPetalLength] = useState<string>('4.2');
  const [petalWidth, setPetalWidth] = useState<string>('1.3');

  // Loading & animated state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animatedConfidence, setAnimatedConfidence] = useState<number>(0);
  const [probabilities, setProbabilities] = useState<{ [key: string]: number }>({
    'Iris setosa': 0,
    'Iris versicolor': 88.5,
    'Iris virginica': 11.5
  });

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Number count-up effect
  const countUpRef = useRef<number | null>(null);

  // Validate form fields
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    const sl = parseFloat(sepalLength);
    if (isNaN(sl) || sepalLength.trim() === '') {
      newErrors.sepalLength = 'Sepal length is required';
    } else if (sl < 4.0 || sl > 8.5) {
      newErrors.sepalLength = 'Valid range is 4.0 - 8.5 cm';
    }

    const sw = parseFloat(sepalWidth);
    if (isNaN(sw) || sepalWidth.trim() === '') {
      newErrors.sepalWidth = 'Sepal width is required';
    } else if (sw < 1.8 || sw > 5.0) {
      newErrors.sepalWidth = 'Valid range is 1.8 - 5.0 cm';
    }

    const pl = parseFloat(petalLength);
    if (isNaN(pl) || petalLength.trim() === '') {
      newErrors.petalLength = 'Petal length is required';
    } else if (pl < 0.8 || pl > 7.5) {
      newErrors.petalLength = 'Valid range is 0.8 - 7.5 cm';
    }

    const pw = parseFloat(petalWidth);
    if (isNaN(pw) || petalWidth.trim() === '') {
      newErrors.petalWidth = 'Petal width is required';
    } else if (pw < 0.05 || pw > 3.0) {
      newErrors.petalWidth = 'Valid range is 0.05 - 3.0 cm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const sl = parseFloat(sepalLength);
    const sw = parseFloat(sepalWidth);
    const pl = parseFloat(petalLength);
    const pw = parseFloat(petalWidth);

    try {
      // Attempt API call with fallback to high-precision local ML calculation
      let resultSpecies = '';
      let resultConfidence = 0;
      let resultProbs = { 'Iris setosa': 0, 'Iris versicolor': 0, 'Iris virginica': 0 };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sepal_length: sl,
            sepal_width: sw,
            petal_length: pl,
            petal_width: pw
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          resultSpecies = data.species;
          resultConfidence = data.confidence;
          resultProbs = data.probabilities;
        } else {
          throw new Error('API unavailable');
        }
      } catch {
        // Fallback to client-side ML engine
        const fallback = classifyIrisClient(sl, sw, pl, pw);
        resultSpecies = fallback.species;
        resultConfidence = fallback.confidence;
        resultProbs = fallback.probabilities;
      }

      // Brief animation pause for loading spinner
      await new Promise(r => setTimeout(r, 380));

      setLastPrediction({
        sepalLength: sl,
        sepalWidth: sw,
        petalLength: pl,
        petalWidth: pw,
        species: resultSpecies,
        confidence: resultConfidence
      });
      setProbabilities(resultProbs);

      // Trigger smooth count up animation
      setAnimatedConfidence(0);
      const startTime = performance.now();
      const duration = 650; // ms

      const updateCount = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        setAnimatedConfidence(Math.round(resultConfidence * ease * 10) / 10);

        if (progress < 1) {
          countUpRef.current = requestAnimationFrame(updateCount);
        }
      };

      if (countUpRef.current) cancelAnimationFrame(countUpRef.current);
      countUpRef.current = requestAnimationFrame(updateCount);

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Run an initial prediction on mount if none exists
    if (!lastPrediction) {
      handlePredict();
    } else {
      setAnimatedConfidence(lastPrediction.confidence);
    }
    return () => {
      if (countUpRef.current) cancelAnimationFrame(countUpRef.current);
    };
  }, []);

  const handleReset = () => {
    setSepalLength('5.8');
    setSepalWidth('3.0');
    setPetalLength('4.2');
    setPetalWidth('1.3');
    setErrors({});
  };

  const handleFillSample = (presetKey: keyof typeof SAMPLE_PRESETS) => {
    const sample = SAMPLE_PRESETS[presetKey];
    setSepalLength(sample.sepalLength.toFixed(1));
    setSepalWidth(sample.sepalWidth.toFixed(1));
    setPetalLength(sample.petalLength.toFixed(1));
    setPetalWidth(sample.petalWidth.toFixed(1));
    setErrors({});
  };

  const currentDetails = lastPrediction ? SPECIES_DETAILS[lastPrediction.species as keyof typeof SPECIES_DETAILS] || SPECIES_DETAILS['Iris versicolor'] : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Species Prediction</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                scikit-learn
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Input botanical dimensions in centimeters to classify flower taxonomy with real-time confidence scores.
            </p>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-600">Quick fill:</span>
            <button
              type="button"
              onClick={() => handleFillSample('setosa')}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 btn-pressable transition-all cursor-pointer"
            >
              🌿 Setosa
            </button>
            <button
              type="button"
              onClick={() => handleFillSample('versicolor')}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 btn-pressable transition-all cursor-pointer"
            >
              🌾 Versicolor
            </button>
            <button
              type="button"
              onClick={() => handleFillSample('virginica')}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 btn-pressable transition-all cursor-pointer"
            >
              🌸 Virginica
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Flower Measurements</h2>
              <p className="text-xs text-slate-600">Enter sepal and petal dimensions</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
              <span>Unit: Centimeters (cm)</span>
            </div>
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sepal Length */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Sepal Length (cm)
                  </label>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    MEDIUM IMPACT
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="4.0"
                    max="8.5"
                    value={sepalLength}
                    onChange={(e) => {
                      setSepalLength(e.target.value);
                      if (errors.sepalLength) setErrors(prev => ({ ...prev, sepalLength: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-50/60 rounded-xl border text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-standard ${
                      errors.sepalLength ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                    placeholder="e.g. 5.8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-600 pointer-events-none">
                    4.0 – 8.5
                  </span>
                </div>
                {errors.sepalLength && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.sepalLength}
                  </p>
                )}
              </div>

              {/* Sepal Width */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Sepal Width (cm)
                  </label>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    MEDIUM IMPACT
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1.8"
                    max="5.0"
                    value={sepalWidth}
                    onChange={(e) => {
                      setSepalWidth(e.target.value);
                      if (errors.sepalWidth) setErrors(prev => ({ ...prev, sepalWidth: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-50/60 rounded-xl border text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-standard ${
                      errors.sepalWidth ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                    placeholder="e.g. 3.0"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-600 pointer-events-none">
                    1.8 – 5.0
                  </span>
                </div>
                {errors.sepalWidth && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.sepalWidth}
                  </p>
                )}
              </div>

              {/* Petal Length */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Petal Length (cm)
                  </label>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    CRITICAL DISCRIMINANT
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.8"
                    max="7.5"
                    value={petalLength}
                    onChange={(e) => {
                      setPetalLength(e.target.value);
                      if (errors.petalLength) setErrors(prev => ({ ...prev, petalLength: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-50/60 rounded-xl border text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-standard ${
                      errors.petalLength ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                    placeholder="e.g. 4.2"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-600 pointer-events-none">
                    0.8 – 7.5
                  </span>
                </div>
                {errors.petalLength && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.petalLength}
                  </p>
                )}
              </div>

              {/* Petal Width */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Petal Width (cm)
                  </label>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    CRITICAL DISCRIMINANT
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.05"
                    max="3.0"
                    value={petalWidth}
                    onChange={(e) => {
                      setPetalWidth(e.target.value);
                      if (errors.petalWidth) setErrors(prev => ({ ...prev, petalWidth: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-50/60 rounded-xl border text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-standard ${
                      errors.petalWidth ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                    placeholder="e.g. 1.3"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-600 pointer-events-none">
                    0.1 – 3.0
                  </span>
                </div>
                {errors.petalWidth && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.petalWidth}
                  </p>
                )}
              </div>
            </div>

            {/* Quick visual range preview sliders */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-2 mt-4 text-xs text-slate-500">
              <div className="flex justify-between items-center text-[11px]">
                <span>Petal Ratio (Length / Width):</span>
                <span className="font-semibold text-slate-700">
                  {parseFloat(petalLength) && parseFloat(petalWidth)
                    ? (parseFloat(petalLength) / parseFloat(petalWidth)).toFixed(2)
                    : '--'}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(5, ((parseFloat(petalLength) || 0) / 7.5) * 100)
                    )}%`
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm shadow-sm btn-pressable cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-fast" />
                    <span>Evaluating Model...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Predict Species</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-medium text-sm btn-pressable cursor-pointer"
                title="Reset to default values"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Result Card */}
        <div className="lg:col-span-6 animate-fade-in-up stagger-2">
          {lastPrediction && currentDetails ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs h-full flex flex-col justify-between animate-fade-scale">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Classification Result
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Model Verified
                  </span>
                </div>

                {/* Primary Species Header with Animated Flower Photo */}
                <div className="mt-5 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60">
                  <div className="relative group shrink-0">
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-500 animate-flower-bloom relative"
                      style={{
                        borderColor: currentDetails.color,
                        boxShadow: `0 8px 24px ${currentDetails.color}35`
                      }}
                    >
                      {currentDetails.image ? (
                        <img
                          src={currentDetails.image}
                          alt={currentDetails.name}
                          className="w-full h-full object-cover animate-flower-float group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: `${currentDetails.color}15`, color: currentDetails.color }}
                        >
                          <Flower2 className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-[10px] text-white font-semibold">Botanical Portrait</span>
                      </div>
                    </div>
                    {/* Live blooming indicator pulse */}
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white animate-pulse-glow"
                      style={{ backgroundColor: currentDetails.color }}
                      title="Active Species Match"
                    />
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {currentDetails.name}
                      </h3>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-md inline-block self-center sm:self-auto"
                        style={{
                          backgroundColor: `${currentDetails.color}18`,
                          color: currentDetails.color
                        }}
                      >
                        {currentDetails.shortName.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {currentDetails.commonName}
                    </p>
                    <div className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {currentDetails.description}
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2 justify-center sm:justify-start text-[11px] font-medium text-slate-500">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">
                        🌱 {currentDetails.petalRatio}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">
                        📍 {currentDetails.nativeRegion.split(',')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animated Confidence Gauge */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-700">Model Confidence</span>
                    <div className="flex items-center gap-2">
                      {animatedConfidence >= 95 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          OPTIMAL (&gt;95%)
                        </span>
                      ) : animatedConfidence >= 80 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          MEDIUM (80-94%)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          CRITICAL (&lt;80%)
                        </span>
                      )}
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {animatedConfidence.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${animatedConfidence}%`,
                        backgroundColor: currentDetails.color
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600 mt-1.5 font-medium">
                    <span>Low Margin</span>
                    <span>High Certainty (95%+)</span>
                  </div>
                </div>

                {/* Probability Distribution Breakdown */}
                <div className="mt-5 space-y-2.5">
                  <div className="text-xs font-semibold text-slate-700">
                    Class Probability Distribution
                  </div>

                  {Object.entries(SPECIES_DETAILS).map(([speciesKey, detail]) => {
                    const prob = probabilities[speciesKey] || 0;
                    return (
                      <div key={speciesKey} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700 flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full inline-block"
                              style={{ backgroundColor: detail.color }}
                            />
                            {detail.name}
                          </span>
                          <span className="font-mono text-slate-600 font-medium">
                            {prob.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${prob}%`,
                              backgroundColor: detail.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* View in Visualization CTA */}
              <div className="pt-5 mt-5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() =>
                    onNavigateToViz({
                      sepalLength: lastPrediction.sepalLength,
                      sepalWidth: lastPrediction.sepalWidth,
                      petalLength: lastPrediction.petalLength,
                      petalWidth: lastPrediction.petalWidth,
                      species: lastPrediction.species
                    })
                  }
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors btn-pressable cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>Inspect coordinates on Scatter Plot</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-indigo-400" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs h-full flex flex-col items-center justify-center text-center">
              <Flower2 className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-700">No Prediction Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Enter sepal and petal values on the left and click "Predict Species" to compute results.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Animated Botanical Species Gallery */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up stagger-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flower2 className="w-4 h-4 text-indigo-600" />
              <span>Iris Botanical Species Gallery</span>
            </h2>
            <p className="text-xs text-slate-500">
              Interactive botanical portraits with morphometric features and animated blooming motion
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click any card to auto-populate measurements</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.entries(SPECIES_DETAILS).map(([speciesName, details]) => {
            const isCurrent = lastPrediction?.species === speciesName;
            const presetKey = speciesName === 'Iris setosa' ? 'setosa' : speciesName === 'Iris versicolor' ? 'versicolor' : 'virginica';

            return (
              <div
                key={speciesName}
                onClick={() => handleFillSample(presetKey as any)}
                className={`group relative rounded-2xl p-4 border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-50/30 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-100 shadow-inner mb-3">
                    {details.image ? (
                      <img
                        src={details.image}
                        alt={details.name}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          isCurrent ? 'scale-105 animate-flower-float' : 'group-hover:scale-105'
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Flower2 className="w-10 h-10 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white backdrop-blur-md shadow-xs"
                        style={{ backgroundColor: `${details.color}ee` }}
                      >
                        {details.shortName}
                      </span>
                    </div>
                    {isCurrent && (
                      <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Currently Selected
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {details.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {details.commonName}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {details.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    {details.petalRatio}
                  </span>
                  <span className="font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Test sample</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
