import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

export interface UseVoiceSearchResult {
  isListening: boolean;
  isSupported: boolean;
  startListening: (onResult: (text: string) => void) => void;
  stopListening: () => void;
  errorMessage: string | null;
}

export function useVoiceSearch(): UseVoiceSearchResult {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();
  const recognitionRef = useRef<any>(null);

  const isSupported = typeof window !== 'undefined' && Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback((onResult: (text: string) => void) => {
    setErrorMessage(null);

    if (!isSupported) {
      setErrorMessage('Speech recognition is not supported in this browser. Please type your search query.');
      showToast('Voice search not supported in this browser. You can type query directly.', 'warning');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // English (India) with fallback

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak a topic, year, or title (e.g., "Constitution", "Mahad")', 'info');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onResult(transcript);
          showToast(`Heard: "${transcript}"`, 'success');
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser.');
          showToast('Microphone permission denied. Please allow mic access or type your search.', 'warning');
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech detected. Please try again.');
          showToast('No speech detected. Please try again.', 'info');
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}`);
          showToast('Voice search error. You can type query directly.', 'warning');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setErrorMessage(err.message || 'Failed to start speech recognition');
      showToast('Could not start microphone. Please type your query.', 'warning');
    }
  }, [isSupported, showToast]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    errorMessage,
  };
}
