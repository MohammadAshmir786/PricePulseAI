# Python AI Service for PricePulse AI

This service provides AI-powered features for the PricePulse AI e-commerce platform using TensorFlow, Keras, and scikit-learn.

## Features

- **Product Recommendations**: Collaborative filtering and content-based recommendations
- **Price Prediction**: ML-based optimal price prediction using Random Forest
- **Sentiment Analysis**: Analyze customer reviews for sentiment and insights
- **Similar Products**: Find similar products based on features

## Setup

### Prerequisites

- Python 3.9+
- pip

### Installation

1. Create virtual environment:

```bash
python -m venv venv
```

2. Activate virtual environment:

- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create `.env` file:

```bash
copy .env.example .env
```

5. Start the service:

```bash
python app.py
```

The service will run on `http://localhost:5000`

## API Endpoints

### Health Check

```
GET /health
```

### Get Recommendations

```
POST /api/recommendations
Body: {
  "userId": "user_id",
  "productIds": ["prod1", "prod2"],
  "userHistory": [{"productId": "...", "rating": 5}],
  "limit": 10
}
```

### Get Similar Products

```
POST /api/similar-products
Body: {
  "productId": "prod_id",
  "productFeatures": {...},
  "allProducts": [...],
  "limit": 5
}
```

### Predict Price

```
POST /api/predict-price
Body: {
  "productId": "prod_id",
  "basePrice": 100,
  "features": {...},
  "historicalData": [...]
}
```

### Analyze Sentiment

```
POST /api/analyze-sentiment
Body: {
  "reviews": [{"text": "Great!", "rating": 5}]
}
```

### Train Model

```
POST /api/train-recommendations
Body: {
  "interactions": [{"userId": "...", "productId": "...", "rating": 5}]
}
```

## Model Architecture

### Recommender System

- Collaborative Filtering using user-item matrix
- Content-based filtering using product features
- Cosine similarity for product matching

### Price Predictor

- Random Forest Regressor with 100 estimators
- Features: base price, stock, demand, category, competition, seasonality
- Rule-based fallback for cold start

### Sentiment Analyzer

- Keyword-based sentiment classification
- Theme extraction from reviews
- Insight generation for product improvements

## Integration with Node.js Backend

The Node.js backend calls this Python service via HTTP requests. See `server/services/aiService.js` for integration code.

## Development

To add new AI features:

1. Create new model in `models/`
2. Add endpoint in `app.py`
3. Update Node.js integration service

## Production Deployment

For production:

1. Set `FLASK_ENV=production` in `.env`
2. Use Gunicorn: `gunicorn -w 4 -b 0.0.0.0:5000 app:app`
3. Enable model caching and optimization
4. Deploy behind reverse proxy (nginx)

## Future Enhancements

- [ ] Deep Learning models with TensorFlow/Keras
- [ ] BERT-based sentiment analysis
- [ ] Image recognition for product categorization
- [ ] Demand forecasting with LSTM
- [ ] Customer segmentation with clustering
- [ ] A/B testing framework
