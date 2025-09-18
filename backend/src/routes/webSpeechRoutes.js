import express from 'express';
import webSpeechService from '../services/ai/webSpeechService.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/speech/info
 * @desc    Get Web Speech API service information
 * @access  Public
 */
router.get('/info', (req, res) => {
  try {
    const serviceInfo = webSpeechService.getServiceInfo();
    
    res.json({
      success: true,
      message: 'Web Speech API information retrieved successfully',
      data: serviceInfo
    });
  } catch (error) {
    console.error('Web Speech info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Web Speech API information',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/speech/browser-support
 * @desc    Get browser compatibility information
 * @access  Public
 */
router.get('/browser-support', (req, res) => {
  try {
    const browserSupport = webSpeechService.getBrowserSupport();
    
    res.json({
      success: true,
      message: 'Browser support information retrieved successfully',
      data: browserSupport
    });
  } catch (error) {
    console.error('Browser support error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get browser support information',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/speech/script/recognition
 * @desc    Get speech recognition JavaScript implementation
 * @access  Public
 */
router.get('/script/recognition', (req, res) => {
  try {
    const options = {
      continuous: req.query.continuous === 'true',
      interimResults: req.query.interimResults !== 'false',
      language: req.query.language || 'en-US',
      maxAlternatives: parseInt(req.query.maxAlternatives) || 1
    };

    const script = webSpeechService.generateSpeechRecognitionScript(options);
    
    res.setHeader('Content-Type', 'application/javascript');
    res.send(script);
  } catch (error) {
    console.error('Speech recognition script error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate speech recognition script',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/speech/script/synthesis
 * @desc    Get text-to-speech JavaScript implementation
 * @access  Public
 */
router.get('/script/synthesis', (req, res) => {
  try {
    const options = {
      voice: req.query.voice || null,
      rate: parseFloat(req.query.rate) || 1.0,
      pitch: parseFloat(req.query.pitch) || 1.0,
      volume: parseFloat(req.query.volume) || 1.0,
      language: req.query.language || 'en-US'
    };

    const script = webSpeechService.generateSpeechSynthesisScript(options);
    
    res.setHeader('Content-Type', 'application/javascript');
    res.send(script);
  } catch (error) {
    console.error('Speech synthesis script error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate speech synthesis script',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/speech/script/complete
 * @desc    Get complete Web Speech API JavaScript implementation
 * @access  Public
 */
router.get('/script/complete', (req, res) => {
  try {
    const options = {
      speechRecognition: {
        continuous: req.query.continuous === 'true',
        interimResults: req.query.interimResults !== 'false',
        language: req.query.language || 'en-US',
        maxAlternatives: parseInt(req.query.maxAlternatives) || 1
      },
      speechSynthesis: {
        voice: req.query.voice || null,
        rate: parseFloat(req.query.rate) || 1.0,
        pitch: parseFloat(req.query.pitch) || 1.0,
        volume: parseFloat(req.query.volume) || 1.0,
        language: req.query.language || 'en-US'
      }
    };

    const script = webSpeechService.generateCompleteScript(options);
    
    res.setHeader('Content-Type', 'application/javascript');
    res.send(script);
  } catch (error) {
    console.error('Complete script error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate complete Web Speech API script',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/speech/demo
 * @desc    Get HTML demo page for testing Web Speech API
 * @access  Public
 */
router.get('/demo', (req, res) => {
  try {
    const htmlDemo = webSpeechService.generateHTMLExample();
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlDemo);
  } catch (error) {
    console.error('Demo page error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate demo page',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/speech/voices
 * @desc    Get available voices for text-to-speech
 * @access  Public
 */
router.get('/voices', (req, res) => {
  try {
    const language = req.query.language || 'en-US';
    const voices = webSpeechService.getAvailableVoices(language);
    
    res.json({
      success: true,
      message: 'Available voices retrieved successfully',
      data: {
        language,
        voices,
        totalVoices: voices.length
      }
    });
  } catch (error) {
    console.error('Voices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available voices',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/speech/languages
 * @desc    Get supported languages
 * @access  Public
 */
router.get('/languages', (req, res) => {
  try {
    const languages = webSpeechService.supportedLanguages;
    
    res.json({
      success: true,
      message: 'Supported languages retrieved successfully',
      data: {
        languages,
        totalLanguages: languages.length
      }
    });
  } catch (error) {
    console.error('Languages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get supported languages',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/speech/usage-track
 * @desc    Track speech API usage for authenticated users
 * @access  Private
 */
router.post('/usage-track', authenticateToken, async (req, res) => {
  try {
    const { feature, duration, characters } = req.body;
    const user = req.user;

    // Validate request
    if (!feature || !['speechRecognition', 'speechSynthesis'].includes(feature)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feature. Must be "speechRecognition" or "speechSynthesis"'
      });
    }

    // Check usage limits
    const usageType = feature === 'speechRecognition' ? 'voice' : 'text';
    const usageAmount = feature === 'speechRecognition' ? (duration || 1) : (characters || 1);

    if (!user.checkUsageLimit(usageType)) {
      return res.status(429).json({
        success: false,
        message: `Usage limit exceeded for ${feature}. Please upgrade your plan.`,
        data: {
          currentUsage: user.usageMetrics,
          limit: user.subscriptionTier === 'free' ? 'free' : 'premium'
        }
      });
    }

    // Update usage
    await user.updateUsage(usageType, usageAmount);

    res.json({
      success: true,
      message: `${feature} usage tracked successfully`,
      data: {
        feature,
        usageAmount,
        remainingUsage: {
          voiceMinutes: user.subscriptionTier === 'free' ? 
            Math.max(0, 10 - user.usageMetrics.voiceMinutesUsed) : Infinity,
          textCharacters: user.subscriptionTier === 'free' ? 
            Math.max(0, 1000 - user.usageMetrics.textCharactersUsed) : Infinity,
          apiCalls: user.subscriptionTier === 'free' ? 
            Math.max(0, 50 - user.usageMetrics.apiCallsUsed) : Infinity
        }
      }
    });
  } catch (error) {
    console.error('Usage tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track speech API usage',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/speech/usage
 * @desc    Get current usage statistics for authenticated user
 * @access  Private
 */
router.get('/usage', authenticateToken, (req, res) => {
  try {
    const user = req.user;
    const limits = {
      free: {
        voiceMinutes: 10,
        textCharacters: 1000,
        apiCalls: 50
      },
      premium: {
        voiceMinutes: Infinity,
        textCharacters: Infinity,
        apiCalls: Infinity
      }
    };

    const userLimits = limits[user.subscriptionTier];
    const currentUsage = user.usageMetrics;

    res.json({
      success: true,
      message: 'Usage statistics retrieved successfully',
      data: {
        subscriptionTier: user.subscriptionTier,
        currentUsage: {
          voiceMinutesUsed: currentUsage.voiceMinutesUsed,
          textCharactersUsed: currentUsage.textCharactersUsed,
          apiCallsUsed: currentUsage.apiCallsUsed
        },
        limits: userLimits,
        remainingUsage: {
          voiceMinutes: userLimits.voiceMinutes === Infinity ? 
            Infinity : Math.max(0, userLimits.voiceMinutes - currentUsage.voiceMinutesUsed),
          textCharacters: userLimits.textCharacters === Infinity ? 
            Infinity : Math.max(0, userLimits.textCharacters - currentUsage.textCharactersUsed),
          apiCalls: userLimits.apiCalls === Infinity ? 
            Infinity : Math.max(0, userLimits.apiCalls - currentUsage.apiCallsUsed)
        },
        lastResetDate: currentUsage.lastResetDate
      }
    });
  } catch (error) {
    console.error('Usage statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get usage statistics',
      error: error.message
    });
  }
});

export default router;
