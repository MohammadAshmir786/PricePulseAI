import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

class PricePredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.model_path = 'trained_models'
        
        os.makedirs(self.model_path, exist_ok=True)
        self.load_model()
    
    def predict_optimal_price(self, product_id, base_price, features, historical_data):
        """
        Predict optimal price for a product using ML
        
        Args:
            product_id: Product identifier
            base_price: Original base price
            features: Product features {category, stock, demand, competition}
            historical_data: Historical pricing and sales data
        
        Returns:
            Dictionary with predicted price and confidence
        """
        # Extract features for prediction
        feature_vector = self._create_feature_vector(base_price, features)
        
        if self.is_trained and len(feature_vector) > 0:
            try:
                # Use trained model
                scaled_features = self.scaler.transform([feature_vector])
                predicted_price = self.model.predict(scaled_features)[0]
            except Exception as e:
                # Fallback to rule-based
                predicted_price = self._rule_based_pricing(base_price, features)
        else:
            # Use rule-based pricing if model not trained
            predicted_price = self._rule_based_pricing(base_price, features)
        
        # Calculate discount percentage
        discount = ((base_price - predicted_price) / base_price) * 100 if base_price > 0 else 0
        
        # Ensure price is within reasonable bounds
        predicted_price = max(base_price * 0.5, min(predicted_price, base_price * 1.2))
        
        return {
            'product_id': product_id,
            'base_price': base_price,
            'predicted_price': round(predicted_price, 2),
            'discount_percentage': round(discount, 2),
            'confidence': 0.85 if self.is_trained else 0.65,
            'strategy': 'ml_model' if self.is_trained else 'rule_based'
        }
    
    def train(self, training_data):
        """
        Train price prediction model
        
        Args:
            training_data: List of {basePrice, features, actualPrice, sales}
        
        Returns:
            Training metrics
        """
        if not training_data or len(training_data) < 10:
            return {'error': 'Insufficient training data (min 10 samples required)'}
        
        # Prepare training data
        X = []
        y = []
        
        for data in training_data:
            feature_vector = self._create_feature_vector(
                data['basePrice'],
                data.get('features', {})
            )
            X.append(feature_vector)
            y.append(data['actualPrice'])
        
        X = np.array(X)
        y = np.array(y)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
        # Calculate training score
        train_score = self.model.score(X_scaled, y)
        
        # Save model
        self.save_model()
        
        return {
            'num_samples': len(training_data),
            'train_score': round(train_score, 4),
            'model_type': 'RandomForestRegressor'
        }
    
    def save_model(self):
        """Save trained model to disk"""
        if self.is_trained:
            model_file = os.path.join(self.model_path, 'price_predictor.pkl')
            scaler_file = os.path.join(self.model_path, 'price_scaler.pkl')
            joblib.dump(self.model, model_file)
            joblib.dump(self.scaler, scaler_file)
    
    def load_model(self):
        """Load trained model from disk"""
        model_file = os.path.join(self.model_path, 'price_predictor.pkl')
        scaler_file = os.path.join(self.model_path, 'price_scaler.pkl')
        
        if os.path.exists(model_file) and os.path.exists(scaler_file):
            self.model = joblib.load(model_file)
            self.scaler = joblib.load(scaler_file)
            self.is_trained = True
    
    def _create_feature_vector(self, base_price, features):
        """Create feature vector for prediction"""
        vector = []
        
        # Base price (normalized)
        vector.append(base_price / 10000)
        
        # Stock level
        stock = features.get('stock', 50)
        vector.append(stock / 100)
        
        # Demand indicator
        demand = features.get('demand', 50)
        vector.append(demand / 100)
        
        # Category encoding
        category = features.get('category', 'Unknown')
        category_score = hash(category) % 100
        vector.append(category_score / 100)
        
        # Competition level
        competition = features.get('competition', 5)
        vector.append(competition / 10)
        
        # Seasonality (day of week, time of year)
        from datetime import datetime
        now = datetime.now()
        vector.append(now.weekday() / 7)  # Day of week
        vector.append(now.month / 12)  # Month
        
        return vector
    
    def _rule_based_pricing(self, base_price, features):
        """
        Rule-based pricing algorithm (fallback when ML model not available)
        
        Pricing rules:
        - Low stock: increase price (scarcity premium)
        - High demand: increase price
        - High competition: decrease price
        - Off-season: decrease price
        """
        price = base_price
        
        # Stock-based adjustment
        stock = features.get('stock', 50)
        if stock < 10:
            price *= 1.1  # 10% increase for low stock
        elif stock > 100:
            price *= 0.95  # 5% decrease for high stock
        
        # Demand-based adjustment
        demand = features.get('demand', 50)
        if demand > 80:
            price *= 1.05  # 5% increase for high demand
        elif demand < 20:
            price *= 0.9  # 10% decrease for low demand
        
        # Competition-based adjustment
        competition = features.get('competition', 5)
        if competition > 10:
            price *= 0.93  # 7% decrease for high competition
        elif competition < 3:
            price *= 1.03  # 3% increase for low competition
        
        # Category-based adjustment
        category = features.get('category', '').lower()
        premium_categories = ['electronics', 'wearables']
        budget_categories = ['accessories', 'cables']
        
        if category in premium_categories:
            price *= 1.02
        elif category in budget_categories:
            price *= 0.98
        
        return price
