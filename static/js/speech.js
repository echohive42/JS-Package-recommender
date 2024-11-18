let recognition;
let recordingTimeout;
const PAUSE_THRESHOLD = 1000; // 1 second pause threshold
let fullTranscript = ''; // Keep track of all spoken text
let isRecording = false; // Track recording state

function initializeSpeechRecognition() {
    try {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        setupRecognitionHandlers();
        console.log("Speech recognition initialized successfully");
    } catch (error) {
        console.error("Error initializing speech recognition:", error);
        showError("Speech recognition not supported in this browser");
    }
}

function setupRecognitionHandlers() {
    recognition.onstart = () => {
        isRecording = true;
        document.getElementById('recordingStatus').classList.remove('hidden');
        document.getElementById('startRecording').classList.add('btn-error');
        document.getElementById('startRecording').textContent = 'Stop Recording';
        document.getElementById('transcription').classList.remove('hidden');
    };

    recognition.onend = () => {
        if (!isRecording) {
            // Normal stop requested by user
            document.getElementById('recordingStatus').classList.add('hidden');
            document.getElementById('startRecording').classList.remove('btn-error');
            fullTranscript = '';
            document.getElementById('transcription').innerHTML = '';
        } else {
            // Unexpected end - restart
            console.log("Recognition ended unexpectedly - restarting");
            try {
                recognition.start();
            } catch (error) {
                console.error("Error restarting recognition:", error);
                isRecording = false;
            }
        }
    };

    recognition.onresult = (event) => {
        clearTimeout(recordingTimeout);
        
        // Get the latest transcript
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update full transcript with any new final transcripts
        if (finalTranscript) {
            fullTranscript += finalTranscript;
        }
        
        // Display both full and interim transcripts
        const displayText = fullTranscript + '<span class="opacity-50">' + interimTranscript + '</span>';
        document.getElementById('transcription').innerHTML = displayText;
        
        // Set timeout to process after pause
        if (finalTranscript || interimTranscript) {
            recordingTimeout = setTimeout(() => {
                processCurrentTranscript();
            }, PAUSE_THRESHOLD);
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        showError(`Speech recognition error: ${event.error}`);
        isRecording = false;
    };
}

async function processCurrentTranscript() {
    if (!fullTranscript.trim()) return;
    
    try {
        showLoading();
        console.log("Processing transcript:", fullTranscript.trim());
        
        const response = await fetch('/process-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: fullTranscript.trim() })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log("Received response:", data);
        
        // Check if data has the expected structure
        if (data && data.recommendations && data.recommendations.libraries) {
            displayRecommendations(data.recommendations);
        } else {
            throw new Error('Invalid response structure from server');
        }
    } catch (error) {
        console.error("Error processing speech:", error);
        showError("Error processing your request: " + error.message);
    } finally {
        hideLoading();
    }
}

document.getElementById('startRecording').addEventListener('click', function() {
    if (!isRecording) {
        try {
            recognition.start();
        } catch (error) {
            console.error("Error starting recognition:", error);
            showError("Error starting speech recognition");
        }
    } else {
        try {
            isRecording = false;
            recognition.stop();
            this.textContent = 'Start Recording';
        } catch (error) {
            console.error("Error stopping recognition:", error);
            showError("Error stopping speech recognition");
        }
    }
});

initializeSpeechRecognition(); 