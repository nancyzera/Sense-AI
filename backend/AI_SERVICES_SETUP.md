# 🤖 FREE AI Services Setup Guide

## 🎯 **Complete FREE AI Integration**

Your Sense AI backend now supports multiple **100% FREE** AI services! Here's how to set them up:

## 🚀 **Quick Start (5 Minutes)**

### **Step 1: Get FREE API Keys**

#### **1. Groq (Recommended - Fastest & Most Generous)**
- **Free Tier**: 14,400 requests/day
- **Sign up**: https://console.groq.com/
- **Get API Key**: Go to API Keys section
- **Add to .env**: `GROQ_API_KEY=your_key_here`

#### **2. Google Cloud Speech & TTS (Best Quality)**
- **Free Tier**: 60 minutes speech + 1M characters TTS/month
- **Sign up**: https://console.cloud.google.com/
- **Enable APIs**: Speech-to-Text & Text-to-Speech
- **Get API Key**: Go to Credentials → Create API Key
- **Add to .env**: 
  ```
  GOOGLE_CLOUD_API_KEY=your_key_here
  GOOGLE_CLOUD_PROJECT_ID=your_project_id
  ```

#### **3. Hugging Face (Backup Chat)**
- **Free Tier**: 1,000 requests/month
- **Sign up**: https://huggingface.co/
- **Get Token**: https://huggingface.co/settings/tokens
- **Add to .env**: `HUGGINGFACE_API_KEY=your_token_here`

#### **4. Azure Speech (Alternative)**
- **Free Tier**: 5 hours/month
- **Sign up**: https://azure.microsoft.com/en-us/free/
- **Create Speech Resource**: Azure Portal → Speech Services
- **Add to .env**:
  ```
  AZURE_SPEECH_KEY=your_key_here
  AZURE_SPEECH_REGION=eastus
  ```

### **Step 2: Update Your .env File**

Add these lines to your `.env` file:

```env
# ========================================
# FREE AI SERVICES CONFIGURATION
# ========================================

# Groq API (FREE - 14,400 requests/day)
GROQ_API_KEY=your_groq_api_key_here

# Hugging Face API (FREE - 1,000 requests/month)
HUGGINGFACE_API_KEY=your_huggingface_token_here

# Google Cloud Speech & TTS (FREE tiers)
GOOGLE_CLOUD_API_KEY=your_google_api_key_here
GOOGLE_CLOUD_PROJECT_ID=your_google_project_id_here

# Azure Speech Services (FREE - 5 hours/month)
AZURE_SPEECH_KEY=your_azure_key_here
AZURE_SPEECH_REGION=eastus
```

### **Step 3: Test Your Setup**

```bash
# Start your server
npm run dev

# Test AI services
curl http://localhost:5000/api/ai/status
```

## 📊 **Free Tier Limits Summary**

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Groq** | 14,400 requests/day | Chat/Conversation |
| **Google Speech** | 60 minutes/month | Voice-to-Text |
| **Google TTS** | 1M characters/month | Text-to-Speech |
| **Hugging Face** | 1,000 requests/month | Chat Backup |
| **Azure Speech** | 5 hours/month | Speech Services |

## 🎯 **Service Priority (Automatic Fallback)**

### **Chat Services**
1. **Groq** (if API key available) - Fastest
2. **Hugging Face** (if API key available) - Good quality
3. **Local Fallback** (always available) - Basic responses

### **Speech-to-Text**
1. **Google Cloud** (if API key available) - Best accuracy
2. **Azure Speech** (if API key available) - Good alternative
3. **Local Fallback** (always available) - Basic processing

### **Text-to-Speech**
1. **Google Cloud** (if API key available) - Best quality
2. **Azure Speech** (if API key available) - Good alternative
3. **Local Fallback** (always available) - Basic audio

## 🔧 **No API Keys? No Problem!**

Even without any API keys, your system will work with:
- ✅ **Local fallback chat responses**
- ✅ **Basic speech processing**
- ✅ **Simple text-to-speech simulation**
- ✅ **Full user management**
- ✅ **Subscription system**

## 🚀 **Next Steps**

1. **Get at least one API key** (Groq recommended)
2. **Test the services** using the status endpoint
3. **Build your AI endpoints** (coming next!)
4. **Deploy and enjoy** your free AI assistant!

## 🆘 **Need Help?**

- **Groq Issues**: Check https://console.groq.com/docs
- **Google Cloud Issues**: Check https://cloud.google.com/docs
- **Hugging Face Issues**: Check https://huggingface.co/docs
- **Azure Issues**: Check https://docs.microsoft.com/azure

## 💡 **Pro Tips**

1. **Start with Groq** - It's the easiest to set up and most generous
2. **Add Google Cloud** - For the best speech quality
3. **Use Hugging Face** - As a backup for chat
4. **Monitor usage** - Stay within free tier limits
5. **Test regularly** - Ensure services are working

---

**🎉 Congratulations!** You now have a complete FREE AI services setup that can handle thousands of requests per day without any cost!
