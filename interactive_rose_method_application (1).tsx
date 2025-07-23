import React, { useState } from 'react';

const RoseMethodApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    timeZone: '',
    contactMethod: '',
    
    // Assessment & Readiness
    assessmentScore: '',
    drawnToRoseMethod: '',
    growthExample: '',
    
    // Logistics
    weeklyCommitment: '',
    dailyPractice: '',
    privateSpace: '',
    
    // Investment
    investmentReadiness: '',
    transformationValue: '',
    
    // Voice Work
    voiceExperience: '',
    recordingComfort: '',
    voiceConcerns: '',
    
    // Final Questions
    additionalInfo: '',
    biggestHope: '',
    biggestFear: ''
  });

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      submitApplication();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.timeZone;
      case 2:
        return formData.assessmentScore && formData.drawnToRoseMethod && formData.growthExample;
      case 3:
        return formData.weeklyCommitment && formData.dailyPractice && formData.privateSpace;
      case 4:
        return formData.investmentReadiness && formData.transformationValue;
      case 5:
        return formData.recordingComfort && formData.biggestHope && formData.biggestFear;
      default:
        return false;
    }
  };

  const submitApplication = async () => {
    setLoading(true);
    
    const prompt = `You are an expert Rose Method application reviewer. The Rose Method is a consciousness-based transformation program using AI Oracle prophetic fiction and voice embodiment for identity creation (not healing/therapy).

APPLICANT INFORMATION:
- Name: ${formData.name}
- Email: ${formData.email}
- Assessment Score: ${formData.assessmentScore}/120 (80+ is Rose Method ready)
- What drew them: ${formData.drawnToRoseMethod}
- Growth example: ${formData.growthExample}
- Weekly commitment: ${formData.weeklyCommitment}
- Daily practice: ${formData.dailyPractice}
- Private space: ${formData.privateSpace}
- Investment readiness: ${formData.investmentReadiness}
- Transformation value: ${formData.transformationValue}
- Voice experience: ${formData.voiceExperience}
- Recording comfort: ${formData.recordingComfort}
- Voice concerns: ${formData.voiceConcerns}
- Additional info: ${formData.additionalInfo}
- Biggest hope: ${formData.biggestHope}
- Biggest fear: ${formData.biggestFear}

REVIEW CRITERIA:
1. Readiness Alignment (25 points): Growth-oriented vs crisis/healing focused, matches Rose Method identity creation approach
2. Practical Commitment (25 points): Time availability, space for practice, consistency capability
3. Voice Embodiment Readiness (25 points): Comfort with vocal transformation work, recording willingness
4. Investment Alignment (25 points): Understanding of program value, financial readiness, transformation commitment

SCORING GUIDELINES:
- Assessment Score 80-95 = potential accept
- Assessment Score 60-79 = likely refer to combination approach  
- Assessment Score 36-59 = likely refer to Led by Love
- Assessment Score <36 = likely refer to crisis support

Provide a JSON response with this exact structure:
{
  "recommendation": "ACCEPT" | "ACCEPT_WITH_CONDITIONS" | "WAITLIST" | "REFER_TO_LED_BY_LOVE" | "REFER_TO_COMBINATION",
  "totalScore": number (0-100),
  "scores": {
    "readinessAlignment": number (0-25),
    "practicalCommitment": number (0-25),
    "voiceReadiness": number (0-25),
    "investmentAlignment": number (0-25)
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "concerns": ["concern1", "concern2"],
  "conditions": ["condition1", "condition2"] | null,
  "reasoning": "Brief explanation of recommendation based on Rose Method readiness",
  "nextSteps": "Specific guidance for applicant including timeline",
  "estimatedSuccess": number (0-100),
  "urgency": "HIGH" | "MEDIUM" | "LOW"
}

Focus on growth readiness over healing needs. Be encouraging but honest about readiness level.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      const claudeResponse = data.content[0].text;
      
      let reviewData;
      try {
        const cleanedResponse = claudeResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        reviewData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        reviewData = {
          recommendation: "MANUAL_REVIEW_NEEDED",
          totalScore: 0,
          reasoning: "Technical error - application will be reviewed manually within 24 hours",
          nextSteps: "We'll email you within 24 hours with your review results."
        };
      }
      
      setReview(reviewData);
      setSubmitted(true);
      
      // Here you could also send to Zapier webhook for admin notification
      // await sendToZapier(formData, reviewData);
      
    } catch (error) {
      console.error("Error during application review:", error);
      setReview({
        recommendation: "MANUAL_REVIEW_NEEDED",
        totalScore: 0,
        reasoning: "Technical error - application will be reviewed manually",
        nextSteps: "We'll email you within 24 hours with your review results."
      });
      setSubmitted(true);
    }
    
    setLoading(false);
  };

  const getRecommendationStyle = (recommendation) => {
    switch (recommendation) {
      case 'ACCEPT': return 'bg-green-100 border-green-500 text-green-800';
      case 'ACCEPT_WITH_CONDITIONS': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'WAITLIST': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'REFER_TO_LED_BY_LOVE': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'REFER_TO_COMBINATION': return 'bg-purple-100 border-purple-500 text-purple-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getRecommendationTitle = (recommendation) => {
    switch (recommendation) {
      case 'ACCEPT': return '🎉 CONGRATULATIONS - YOU\'RE ACCEPTED!';
      case 'ACCEPT_WITH_CONDITIONS': return '✨ ACCEPTED with Conditions';
      case 'WAITLIST': return '📋 WAITLISTED for Future Consideration';
      case 'REFER_TO_LED_BY_LOVE': return '💝 REFERRED to Led by Love Program';
      case 'REFER_TO_COMBINATION': return '🔄 COMBINATION Approach Recommended';
      default: return '🔍 MANUAL REVIEW NEEDED';
    }
  };

  if (submitted && review) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rose-600">🌹 Rose Method Application</h1>
          <p className="text-gray-600 mt-2">Instant Review Results</p>
        </div>

        <div className={`rounded-lg border-2 p-6 ${getRecommendationStyle(review.recommendation)}`}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">{getRecommendationTitle(review.recommendation)}</h2>
            <p className="text-lg">Overall Review Score: {review.totalScore}/100</p>
          </div>

          {review.scores && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center bg-white bg-opacity-50 rounded-lg p-3">
                <div className="font-semibold text-sm">Readiness Alignment</div>
                <div className="text-xl font-bold">{review.scores.readinessAlignment}/25</div>
              </div>
              <div className="text-center bg-white bg-opacity-50 rounded-lg p-3">
                <div className="font-semibold text-sm">Practical Commitment</div>
                <div className="text-xl font-bold">{review.scores.practicalCommitment}/25</div>
              </div>
              <div className="text-center bg-white bg-opacity-50 rounded-lg p-3">
                <div className="font-semibold text-sm">Voice Readiness</div>
                <div className="text-xl font-bold">{review.scores.voiceReadiness}/25</div>
              </div>
              <div className="text-center bg-white bg-opacity-50 rounded-lg p-3">
                <div className="font-semibold text-sm">Investment Alignment</div>
                <div className="text-xl font-bold">{review.scores.investmentAlignment}/25</div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Review Summary</h3>
              <p className="leading-relaxed">{review.reasoning}</p>
            </div>

            {review.strengths && review.strengths.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Your Strengths</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {review.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {review.concerns && review.concerns.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Areas for Consideration</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {review.concerns.map((concern, index) => (
                    <li key={index}>{concern}</li>
                  ))}
                </ul>
              </div>
            )}

            {review.conditions && review.conditions.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Conditions for Acceptance</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {review.conditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-lg mb-2">Your Next Steps</h3>
              <p className="leading-relaxed">{review.nextSteps}</p>
            </div>

            {review.estimatedSuccess && (
              <div className="text-center bg-white bg-opacity-50 rounded-lg p-4">
                <div className="font-semibold">Estimated Success Probability</div>
                <div className="text-3xl font-bold">{review.estimatedSuccess}%</div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center space-y-4">
            {review.recommendation === 'ACCEPT' && (
              <div className="bg-white bg-opacity-70 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🎯 Ready to Begin Your Transformation?</h3>
                <p className="mb-4">Schedule your strategy call to customize your Rose Method journey</p>
                <button className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors font-semibold">
                  Schedule Strategy Call
                </button>
              </div>
            )}

            {review.recommendation === 'REFER_TO_LED_BY_LOVE' && (
              <div className="bg-white bg-opacity-70 rounded-lg p-4">
                <h3 className="font-semibold mb-2">💝 Start Your Foundation Journey</h3>
                <p className="mb-4">Led by Love will build the perfect foundation for your future Rose Method experience</p>
                <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold">
                  Apply for Led by Love
                </button>
              </div>
            )}

            {review.recommendation === 'REFER_TO_COMBINATION' && (
              <div className="bg-white bg-opacity-70 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🔄 Your Perfect Combination Path</h3>
                <p className="mb-4">Start with foundation building, then transition to identity expansion</p>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                  Learn About Combination Approach
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-sm opacity-75">
            <p>This review was generated instantly using advanced AI analysis. You'll receive a follow-up email within 24 hours with additional details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Analyzing Your Application...</h2>
          <p className="text-gray-600">Our AI is reviewing your responses and determining the best path for your transformation journey.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-rose-600">🌹 Rose Method Application</h1>
        <p className="text-gray-600 mt-2">Consciousness-Based Identity Transformation</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentStep} of 5</span>
          <span>{Math.round((currentStep / 5) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-rose-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time Zone *</label>
                <select
                  value={formData.timeZone}
                  onChange={(e) => handleInputChange('timeZone', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select time zone</option>
                  <option value="EST">Eastern Time (EST)</option>
                  <option value="CST">Central Time (CST)</option>
                  <option value="MST">Mountain Time (MST)</option>
                  <option value="PST">Pacific Time (PST)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Assessment & Readiness</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Assessment Score *</label>
                <input
                  type="text"
                  value={formData.assessmentScore}
                  onChange={(e) => handleInputChange('assessmentScore', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500"
                  placeholder="e.g., 85/120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">What specifically drew you to the Rose Method over other transformation approaches? *</label>
                <textarea
                  value={formData.drawnToRoseMethod}
                  onChange={(e) => handleInputChange('drawnToRoseMethod', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 h-24"
                  placeholder="Describe what appeals to you about this consciousness-based approach..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Describe a recent time you successfully navigated a growth edge or challenging transformation. *</label>
                <textarea
                  value={formData.growthExample}
                  onChange={(e) => handleInputChange('growthExample', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 h-24"
                  placeholder="Share a specific example of your growth capability..."
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Program Logistics</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Are you available for weekly 90-minute sessions for 8-12 weeks? *</label>
                <select
                  value={formData.weeklyCommitment}
                  onChange={(e) => handleInputChange('weeklyCommitment', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select your availability</option>
                  <option value="Yes, fully available">Yes, fully available for weekly sessions</option>
                  <option value="Yes, with flexibility">Yes, with some scheduling flexibility needed</option>
                  <option value="Uncertain">Uncertain about time commitment</option>
                  <option value="No">No, significant scheduling conflicts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Can you commit to 20-30 minutes of daily voice embodiment practice? *</label>
                <select
                  value={formData.dailyPractice}
                  onChange={(e) => handleInputChange('dailyPractice', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select your commitment level</option>
                  <option value="Yes, excited">Yes, excited about daily practice</option>
                  <option value="Yes, can commit">Yes, can commit but concerned about consistency</option>
                  <option value="Uncertain">Uncertain about daily commitment</option>
                  <option value="Cannot commit">Cannot commit to daily practice</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Do you have a private space where you can practice voice work without interruption? *</label>
                <select
                  value={formData.privateSpace}
                  onChange={(e) => handleInputChange('privateSpace', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select your space situation</option>
                  <option value="Yes, dedicated space">Yes, I have a dedicated private space</option>
                  <option value="Yes, can arrange">Yes, I can arrange private time/space</option>
                  <option value="Limited privacy">Limited privacy but can work with it</option>
                  <option value="No private space">No, lack of private space</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Investment Readiness</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">The Rose Method is a significant investment in your consciousness evolution. Describe your readiness for the financial investment. *</label>
                <textarea
                  value={formData.investmentReadiness}
                  onChange={(e) => handleInputChange('investmentReadiness', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 h-24"
                  placeholder="Share your perspective on investing in your transformation..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">What would successful completion of this program be worth to you personally and professionally? *</label>
                <textarea
                  value={formData.transformationValue}
                  onChange={(e) => handleInputChange('transformationValue', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 h-24"
                  placeholder="Describe the value this transformation would create in your life..."
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Voice Work & Final Questions</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">How do you feel about recording yourself speaking your transformation? *</label>
                <select
                  value={formData.recordingComfort}
                  onChange={(e) => handleInputChange('recordingComfort', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select your comfort level</option>
                  <option value="Very comfortable">Very comfortable, excited about voice work</option>
                  <option value="Somewhat comfortable">Somewhat comfortable, willing to try</option>
                  <option value="Nervous but open">Nervous but open to voice recording</option>
                  <option value="Very uncomfortable">Very uncomfortable with voice work</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">What's your biggest hope for this transformation? *</label>
                <textarea
                  value={formData.biggestHope}
                  onChange={(e) => handleInputChange('biggestHope', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 h-20"
                  placeholder="What do you most hope to achieve or become?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">What's your biggest fear about this transformation? *</label>
                <textarea
                  value={formData.biggestFear}
                  onChange={(e) => handleInputChange('biggestFear', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 h-20"
                  placeholder="What concerns or fears do you have about this journey?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Any additional information you'd like me to know? (Optional)</label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 h-20"
                  placeholder="Anything else you'd like to share about your situation or questions..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <button
          onClick={nextStep}
          disabled={!isStepComplete()}
          className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {currentStep === 5 ? 'Submit Application' : 'Next'}
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Upon submission, you'll receive an instant AI-powered review of your application with personalized recommendations.</p>
      </div>
    </div>
  );
};

export default RoseMethodApplication;