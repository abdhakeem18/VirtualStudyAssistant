# Quiz PDF Export API Documentation

## Endpoint: Export Quiz as PDF

**POST** `/api/v1/quiz/export-pdf`

### Description
Generates a PDF document containing quiz questions, with an option to include or exclude answers.

### Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Request Body
```json
{
  "docId": "string",
  "includeAnswers": boolean
}
```

#### Parameters:
- `docId` (string, required): The document/quiz ID to export
- `includeAnswers` (boolean, required): 
  - `true`: Include both questions and answers in the PDF
  - `false`: Include only questions (for students to practice)

### Response

#### Success Response (200 OK)
Returns a PDF file as base64 encoded string for mobile, or blob for web.

**For Mobile (React Native):**
```json
{
  "success": true,
  "data": "base64EncodedPDFString...",
  "filename": "quiz_123_with_answers.pdf"
}
```

**For Web:**
- Content-Type: `application/pdf`
- Response: PDF Blob

#### Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "message": "Missing required parameters",
  "code": 400
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "code": 401
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Quiz not found",
  "code": 404
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Failed to generate PDF",
  "code": 500
}
```

### Example Implementation (Node.js/Express)

```javascript
const PDFDocument = require('pdfkit');
const { getQuizById } = require('../services/quizService');

exports.exportQuizPDF = async (req, res) => {
  try {
    const { docId, includeAnswers } = req.body;
    const userId = req.user.id; // from auth middleware

    // Validate input
    if (!docId || includeAnswers === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters',
        code: 400
      });
    }

    // Fetch quiz data
    const quiz = await getQuizById(docId, userId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
        code: 404
      });
    }

    // Create PDF
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      const base64PDF = pdfBuffer.toString('base64');
      
      res.json({
        success: true,
        data: base64PDF,
        filename: `quiz_${docId}_${includeAnswers ? 'with_answers' : 'questions_only'}.pdf`
      });
    });

    // Add content to PDF
    doc.fontSize(20).text(quiz.title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Total Questions: ${quiz.questions.length}`);
    doc.moveDown();

    quiz.questions.forEach((question, index) => {
      doc.fontSize(14).text(`Question ${index + 1}:`, { underline: true });
      doc.fontSize(12).text(question.question);
      doc.moveDown(0.5);

      question.options.forEach((option, optIndex) => {
        const isCorrect = includeAnswers && option.position === question.correct;
        const prefix = String.fromCharCode(65 + optIndex); // A, B, C, D
        
        doc.text(`${prefix}. ${option.text}${isCorrect ? ' ✓ (Correct)' : ''}`, {
          color: isCorrect ? 'green' : 'black'
        });
      });

      if (includeAnswers && question.explanation) {
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('blue').text(`Explanation: ${question.explanation}`);
      }

      doc.moveDown();
    });

    doc.end();

  } catch (error) {
    console.error('PDF Export Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      code: 500
    });
  }
};
```

### Frontend Usage Example

```javascript
import QuizPDFExport from './components/QA/QuizPDFExport';

function QAScreen() {
  const [showPDFExport, setShowPDFExport] = useState(false);
  const docId = "your-quiz-id";

  return (
    <View>
      <TouchableOpacity onPress={() => setShowPDFExport(true)}>
        <Text>Export PDF</Text>
      </TouchableOpacity>

      <QuizPDFExport 
        docId={docId}
        visible={showPDFExport}
        onClose={() => setShowPDFExport(false)}
      />
    </View>
  );
}
```

### Notes
- The PDF includes proper formatting with question numbers, options (A, B, C, D), and optional answers
- When `includeAnswers` is true, correct answers are marked with a green checkmark
- The filename automatically includes whether answers are included
- PDF is compatible with both mobile and web platforms
- Supports sharing on mobile devices and direct download on web
