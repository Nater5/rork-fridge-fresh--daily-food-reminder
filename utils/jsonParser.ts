/**
 * Robust JSON parser for AI responses that may contain extra text or malformed JSON
 */
export function parseAIResponse(response: string): any {
  try {
    // First, try to parse the response as-is
    return JSON.parse(response.trim());
  } catch (error) {
    // If that fails, try to clean the response
    let cleanedResponse = response.trim();
    
    // Remove markdown code blocks
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Find the first { and last } to extract just the JSON object
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd = cleanedResponse.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
    }
    
    // Try to find and extract JSON array if object extraction failed
    if (jsonStart === -1) {
      const arrayStart = cleanedResponse.indexOf('[');
      const arrayEnd = cleanedResponse.lastIndexOf(']');
      
      if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
        cleanedResponse = cleanedResponse.substring(arrayStart, arrayEnd + 1);
      }
    }
    
    // Remove any trailing text after the JSON
    // Look for common patterns that indicate end of JSON
    const patterns = [
      /}\s*[^}\s].*$/,  // Text after closing brace
      /]\s*[^]\s].*$/,  // Text after closing bracket
    ];
    
    for (const pattern of patterns) {
      const match = cleanedResponse.match(pattern);
      if (match) {
        cleanedResponse = cleanedResponse.substring(0, match.index! + 1);
        break;
      }
    }
    
    // Final attempt to parse
    try {
      return JSON.parse(cleanedResponse);
    } catch (finalError) {
      console.error('Failed to parse JSON after cleaning:', finalError);
      console.error('Original response:', response.substring(0, 500));
      console.error('Cleaned response:', cleanedResponse.substring(0, 500));
      throw new Error(`JSON parsing failed: ${finalError}`);
    }
  }
}