from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Import AI modules
from models.recommender import RecommenderModel
from models.price_predictor import PricePredictor
from models.sentiment_analyzer import SentimentAnalyzer
from utils.data_processor import DataProcessor

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize models
recommender = RecommenderModel()
price_predictor = PricePredictor()
sentiment_analyzer = SentimentAnalyzer()
data_processor = DataProcessor()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'PricePulse AI Service',
        'version': '1.0.0'
    })

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """
    Get product recommendations for a user
    Body: {
        "userId": "user_id",
        "productIds": ["prod1", "prod2", ...],
        "userHistory": [{"productId": "...", "rating": 5}, ...],
        "limit": 10
    }
    """
    try:
        data = request.json
        user_id = data.get('userId')
        product_ids = data.get('productIds', [])
        user_history = data.get('userHistory', [])
        limit = data.get('limit', 10)
        
        recommendations = recommender.get_recommendations(
            user_id=user_id,
            product_ids=product_ids,
            user_history=user_history,
            limit=limit
        )
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/similar-products', methods=['POST'])
def get_similar_products():
    """
    Get similar products based on product features
    Body: {
        "productId": "prod_id",
        "productFeatures": {"category": "...", "tags": [...], "price": 100},
        "allProducts": [{...}, {...}],
        "limit": 5
    }
    """
    try:
        data = request.json
        product_id = data.get('productId')
        product_features = data.get('productFeatures', {})
        all_products = data.get('allProducts', [])
        limit = data.get('limit', 5)
        
        similar = recommender.get_similar_products(
            product_id=product_id,
            product_features=product_features,
            all_products=all_products,
            limit=limit
        )
        
        return jsonify({
            'success': True,
            'similar_products': similar
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/predict-price', methods=['POST'])
def predict_price():
    """
    Predict optimal price for a product
    Body: {
        "productId": "prod_id",
        "basePrice": 100,
        "features": {"category": "...", "stock": 10, "demand": 50},
        "historicalData": [{"date": "...", "price": 100, "sales": 10}, ...]
    }
    """
    try:
        data = request.json
        product_id = data.get('productId')
        base_price = data.get('basePrice')
        features = data.get('features', {})
        historical_data = data.get('historicalData', [])
        
        prediction = price_predictor.predict_optimal_price(
            product_id=product_id,
            base_price=base_price,
            features=features,
            historical_data=historical_data
        )
        
        return jsonify({
            'success': True,
            'prediction': prediction
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    """
    Analyze sentiment of reviews
    Body: {
        "reviews": [{"text": "Great product!", "rating": 5}, ...]
    }
    """
    try:
        data = request.json
        reviews = data.get('reviews', [])
        
        analysis = sentiment_analyzer.analyze_reviews(reviews)
        
        return jsonify({
            'success': True,
            'sentiment': analysis
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/train-recommendations', methods=['POST'])
def train_recommendations(): 
    """
    Train recommendation model with new data
    Body: {
        "interactions": [{"userId": "...", "productId": "...", "rating": 5}, ...]
    }
    """
    try:
        data = request.json
        interactions = data.get('interactions', [])
        
        result = recommender.train(interactions)
        
        return jsonify({
            'success': True,
            'message': 'Model trained successfully',
            'metrics': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('AI_SERVICE_PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
