# Stutter Detection API - Usage Guide

## Endpoint
```
POST https://mio2mio22-stuttermodelapi.hf.space/analyze?mode=<mode>
```

## Modes
- `segments` - 3-second chunks (default)
- `seconds` - Per-second analysis
- `percentage` - Overall percentage only

---

## Python

```python
import requests

# Upload audio file
with open('audio.mp3', 'rb') as f:
    response = requests.post(
        'https://mio2mio22-stuttermodelapi.hf.space/analyze?mode=percentage',
        files={'audio': f}
    )

result = response.json()
print(f"Stutter: {result['stutter_percentage']}%")
```

### All Modes

```python
# Mode 1: Segments
response = requests.post(url + '?mode=segments', files={'audio': f})
# Returns: {"success": true, "duration": 12.5, "segments": [...]}

# Mode 2: Seconds
response = requests.post(url + '?mode=seconds', files={'audio': f})
# Returns: {"success": true, "duration": 12, "seconds": [...]}

# Mode 3: Percentage
response = requests.post(url + '?mode=percentage', files={'audio': f})
# Returns: {"success": true, "duration": 12, "stutter_percentage": 25.5}
```

---

## JavaScript

```javascript
const formData = new FormData();
formData.append('audio', audioFile);

const response = await fetch(
  'https://mio2mio22-stuttermodelapi.hf.space/analyze?mode=percentage',
  { method: 'POST', body: formData }
);

const result = await response.json();
console.log(`Stutter: ${result.stutter_percentage}%`);
```

### All Modes

```javascript
// Mode 1: Segments
const res1 = await fetch(url + '?mode=segments', { method: 'POST', body: formData });
// Returns: {"success": true, "duration": 12.5, "segments": [...]}

// Mode 2: Seconds
const res2 = await fetch(url + '?mode=seconds', { method: 'POST', body: formData });
// Returns: {"success": true, "duration": 12, "seconds": [...]}

// Mode 3: Percentage
const res3 = await fetch(url + '?mode=percentage', { method: 'POST', body: formData });
// Returns: {"success": true, "duration": 12, "stutter_percentage": 25.5}
```

---

## Response Examples

**Segments:**
```json
{
  "segments": [
    {"segment": 0, "start_time": 0.0, "end_time": 3.0, "label": "stutter", "confidence": 0.82}
  ]
}
```

**Seconds:**
```json
{
  "seconds": [
    {"second": 0, "label": "no_stutter", "confidence": 0.85},
    {"second": 1, "label": "stutter", "confidence": 0.72}
  ]
}
```

**Percentage:**
```json
{
  "stutter_percentage": 25.5
}
```

## Notes
- Max file size: 50MB
- Supported formats: MP3, WAV, FLAC, OGG, M4A, WebM
