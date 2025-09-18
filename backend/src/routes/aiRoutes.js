import express from 'express';
import { aiServicesManager } from '../services/ai/index.js';

const router = express.Router();

/**
 * @route   GET /api/ai/status
 * @desc    Get AI services status and configuration
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const status = aiServicesManager.getStatus();
    const recommendations = aiServicesManager.getSetupRecommendations();
    
    res.json({
      success: true,
      message: 'AI services status retrieved successfully',
      data: {
        status,
        recommendations,
        setupGuide: 'See AI_SERVICES_SETUP.md for detailed setup instructions'
      }
    });
  } catch (error) {
    console.error('AI status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI services status',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/ai/test
 * @desc    Test all AI services
 * @access  Public
 */
router.post('/test', async (req, res) => {
  try {
    const results = await aiServicesManager.testServices();
    
    res.json({
      success: true,
      message: 'AI services test completed',
      data: {
        results,
        summary: {
          chatWorking: results.chat.success,
          speechToTextWorking: results.speechToText.success,
          textToSpeechWorking: results.textToSpeech.success
        }
      }
    });
  } catch (error) {
    console.error('AI test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test AI services',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/ai/recommendations
 * @desc    Get setup recommendations for AI services
 * @access  Public
 */
router.get('/recommendations', (req, res) => {
  try {
    const recommendations = aiServicesManager.getSetupRecommendations();
    const configuredServices = aiServicesManager.getConfiguredServices();
    
    res.json({
      success: true,
      message: 'AI setup recommendations retrieved successfully',
      data: {
        recommendations,
        configuredServices,
        nextSteps: [
          '1. Get API keys from recommended services',
          '2. Add API keys to your .env file',
          '3. Restart your server',
          '4. Test services using /api/ai/test endpoint'
        ]
      }
    });
  } catch (error) {
    console.error('AI recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI recommendations',
      error: error.message
    });
  }
});

export default router;
