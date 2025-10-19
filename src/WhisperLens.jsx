import React, { useState, useRef } from 'react';
import { Upload, Mic, StopCircle, Copy, Download, Sparkles, Globe } from 'lucide-react';

export default function WhisperLens() {
  const [mode, setMode] = useState('upload'); // 'upload' or 'record'
  const [audioFile, setAudioFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setFileName(file.name);
      setRecordedAudio(null);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        setAudioFile(audioBlob);
        setFileName('recorded-audio.wav');
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
    }
  };

  const processAudio = async () => {
    if (!audioFile) {
      alert('Please upload or record audio');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API processing with demo data
      const mockResults = {
        fullTranscript: `[00:00] Good morning everyone, thank you for joining this meeting. Today we're going to discuss the quarterly results and our upcoming strategy for the next financial year.

[00:15] First, let me present the key metrics. Revenue increased by 23% compared to last quarter, which is excellent performance. Our customer retention rate improved to 94%, and we've successfully expanded into three new markets.

[00:45] Moving forward, we need to focus on product optimization and customer experience enhancement. The team in Mumbai has done outstanding work, and the African operations are showing promising growth indicators.

[01:20] I'd like to highlight that despite global economic challenges, our resilience in Asia-Pacific region has been remarkable. We're planning to invest heavily in infrastructure and talent development.

[02:00] Finally, let's discuss the implementation timeline. We'll roll out phase one by Q3 and complete the full deployment by year-end. Any questions?`,

        summary: `Meeting Summary:
        
• Revenue grew 23% YoY with strong quarterly performance
• Customer retention rate improved to 94%
• Successfully expanded into three new markets
• Key focus areas: product optimization and customer experience
• Regional highlights: Outstanding performance in Mumbai team, promising growth in African operations, remarkable resilience in Asia-Pacific
• Implementation plan: Phase one rollout by Q3, full deployment by year-end
• Investment priorities: Infrastructure and talent development`,

        speakers: [
          { name: 'Speaker 1 (Detected accent: Indian English)', percentage: 55 },
          { name: 'Speaker 2 (Detected accent: Standard English)', percentage: 45 }
        ],

        highlights: [
          'Revenue: +23% growth',
          'Customer Retention: 94%',
          'Market Expansion: 3 new markets',
          'Q3 Phase 1 Launch Target'
        ],

        accentInfo: 'WhisperLens detected multiple accent variations in this recording. The transcription has been normalized for global readability while maintaining accuracy. Confidence: 97%'
      };

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResults(mockResults);
    } catch (error) {
      alert('Error processing audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadResults = () => {
    if (!results) return;
    const content = `WHISPERLENS TRANSCRIPTION REPORT
Generated: ${new Date().toLocaleString()}
File: ${fileName}

========================================
FULL TRANSCRIPT
========================================
${results.fullTranscript}

========================================
CLEAN SUMMARY
========================================
${results.summary}

========================================
SPEAKERS DETECTED
========================================
${results.speakers.map(s => `${s.name}: ${s.percentage}%`).join('\n')}

========================================
KEY HIGHLIGHTS
========================================
${results.highlights.map(h => `• ${h}`).join('\n')}

========================================
ACCENT ANALYSIS
========================================
${results.accentInfo}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WhisperLens-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="w-10 h-10 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              WhisperLens
            </h1>
          </div>
          <p className="text-purple-200 text-lg">Accent-Friendly Global Voice Transcription</p>
          <p className="text-slate-400 mt-2">Recognizes Indian, African, European, and Asian accents with perfect clarity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="bg-slate-800 rounded-xl p-6 border border-purple-500 border-opacity-30">
              <h2 className="text-xl font-semibold text-white mb-4">Choose Input Method</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition border-2 border-slate-600" style={{ borderColor: mode === 'upload' ? '#a855f7' : '' }}>
                  <input type="radio" value="upload" checked={mode === 'upload'} onChange={(e) => setMode(e.target.value)} className="w-4 h-4" />
                  <Upload className="w-5 h-5 text-purple-400 mx-3" />
                  <span className="text-white font-medium">Upload Audio File</span>
                </label>

                <label className="flex items-center p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition border-2 border-slate-600" style={{ borderColor: mode === 'record' ? '#a855f7' : '' }}>
                  <input type="radio" value="record" checked={mode === 'record'} onChange={(e) => setMode(e.target.value)} className="w-4 h-4" />
                  <Mic className="w-5 h-5 text-pink-400 mx-3" />
                  <span className="text-white font-medium">Record Live Audio</span>
                </label>
              </div>
            </div>

            {/* Upload Section */}
            {mode === 'upload' && (
              <div className="bg-slate-800 rounded-xl p-8 border-2 border-dashed border-purple-500 border-opacity-50 hover:border-opacity-100 transition">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Upload Audio File</h3>
                  <p className="text-slate-400 text-sm mb-4">MP3, WAV, M4A, WEBM (Max 500MB)</p>
                  <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" id="audioInput" />
                  <label htmlFor="audioInput" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg cursor-pointer transition font-medium">
                    Select File
                  </label>
                  {fileName && <p className="text-purple-300 mt-3 text-sm">✓ {fileName}</p>}
                </div>
              </div>
            )}

            {/* Record Section */}
            {mode === 'record' && (
              <div className="bg-slate-800 rounded-xl p-8 border border-pink-500 border-opacity-30">
                <div className="text-center">
                  {!isRecording ? (
                    <>
                      <Mic className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                      <h3 className="text-white font-semibold mb-2">Record Audio</h3>
                      <p className="text-slate-400 text-sm mb-4">Click below to start recording from your microphone</p>
                      <button onClick={startRecording} className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg transition font-semibold">
                        Start Recording
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="animate-pulse mb-4">
                        <Mic className="w-12 h-12 text-red-500 mx-auto" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Recording in progress...</h3>
                      <p className="text-slate-400 text-sm mb-4">Speak clearly with your natural accent</p>
                      <button onClick={stopRecording} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition font-semibold flex items-center gap-2 mx-auto">
                        <StopCircle className="w-5 h-5" />
                        Stop Recording
                      </button>
                    </>
                  )}
                  {recordedAudio && <p className="text-purple-300 mt-3 text-sm">✓ Audio recorded</p>}
                </div>
              </div>
            )}

            {/* Process Button */}
            <button
              onClick={processAudio}
              disabled={!audioFile || isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {isProcessing ? 'Processing...' : 'Transcribe & Summarize'}
            </button>

            {/* Accent Info */}
            <div className="bg-slate-800 rounded-xl p-4 border border-blue-500 border-opacity-30">
              <p className="text-blue-300 text-sm">
                <strong>🌍 Accent Detection:</strong> WhisperLens automatically recognizes and normalizes Indian, African, European, and Asian accents for perfect clarity.
              </p>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            {results ? (
              <>
                {/* Summary */}
                <div className="bg-slate-800 rounded-xl p-6 border border-purple-500 border-opacity-30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">📋 Clean Summary</h3>
                    <button onClick={() => copyToClipboard(results.summary, 'summary')} className="p-2 hover:bg-slate-700 rounded transition">
                      <Copy className="w-5 h-5 text-purple-400" />
                    </button>
                  </div>
                  <p className="text-slate-300 whitespace-pre-line text-sm">{results.summary}</p>
                  {copiedSection === 'summary' && <p className="text-green-400 text-xs mt-2">✓ Copied!</p>}
                </div>

                {/* Highlights */}
                <div className="bg-slate-800 rounded-xl p-6 border border-pink-500 border-opacity-30">
                  <h3 className="text-lg font-semibold text-white mb-4">⭐ Key Highlights</h3>
                  <div className="space-y-2">
                    {results.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 text-slate-300">
                        <span className="text-pink-400 font-bold">•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Speakers */}
                <div className="bg-slate-800 rounded-xl p-6 border border-green-500 border-opacity-30">
                  <h3 className="text-lg font-semibold text-white mb-4">🎤 Speakers Detected</h3>
                  <div className="space-y-3">
                    {results.speakers.map((s, i) => (
                      <div key={i}>
                        <p className="text-slate-300 text-sm font-medium mb-1">{s.name}</p>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${s.percentage}%` }} />
                        </div>
                        <p className="text-slate-400 text-xs mt-1">{s.percentage}% of audio</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accent Info */}
                <div className="bg-slate-800 rounded-xl p-6 border border-blue-500 border-opacity-30">
                  <h3 className="text-lg font-semibold text-white mb-2">🌐 Accent Analysis</h3>
                  <p className="text-blue-300 text-sm">{results.accentInfo}</p>
                </div>

                {/* Full Transcript */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">📄 Full Transcript</h3>
                    <button onClick={() => copyToClipboard(results.fullTranscript, 'transcript')} className="p-2 hover:bg-slate-700 rounded transition">
                      <Copy className="w-5 h-5 text-purple-400" />
                    </button>
                  </div>
                  <p className="text-slate-400 text-xs whitespace-pre-line max-h-48 overflow-y-auto">{results.fullTranscript}</p>
                  {copiedSection === 'transcript' && <p className="text-green-400 text-xs mt-2">✓ Copied!</p>}
                </div>

                {/* Download */}
                <button onClick={downloadResults} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Full Report
                </button>
              </>
            ) : (
              <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 flex items-center justify-center h-full">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Upload or record audio to get transcription and summary</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
